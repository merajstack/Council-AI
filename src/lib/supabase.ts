import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '101318699736-omfhvo9m3otktncnsnboeom18v301gl5.apps.googleusercontent.com';

// Initialize Supabase Client if credentials exist
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = 'council_ai_user_session';

/**
 * Generate a valid UUID if string is not already UUID format
 */
export function ensureUuid(id?: string): string {
  if (id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return id;
  }
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return '11111111-1111-4111-8111-111111111111';
}

/**
 * Get cached user session from LocalStorage
 */
export function getSavedUserSession(): GoogleUserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse local user session:', e);
  }
  return null;
}

/**
 * Save user profile into Supabase 'public.users' table
 */
export async function saveUserToSupabase(user: GoogleUserProfile) {
  if (!supabase) return;

  const userPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture || null,
    verified_email: true,
    last_login_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('users').upsert(userPayload, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase User Sync Warning]:', error.message);
    } else {
      console.log('[Supabase Sync] User successfully saved to public.users table.');
    }
  } catch (err) {
    console.warn('[Supabase User Sync Error]:', err);
  }
}

/**
 * Save conversation & chat messages into Supabase 'conversations' and 'chat_messages' tables
 */
export async function saveConversationToSupabase(chat: any, user?: GoogleUserProfile | null) {
  if (!supabase) return;

  // 1. Ensure user exists in users table (foreign key constraint)
  if (user) {
    await saveUserToSupabase(user);
  } else {
    // Upsert guest user to satisfy foreign key constraint user_id -> users(id)
    await saveUserToSupabase({
      id: 'guest_user',
      email: 'anonymous@council.ai',
      name: 'Guest User',
    });
  }

  const conversationUuid = ensureUuid(chat.uuid || chat.id);
  const userId = user ? user.id : 'guest_user';

  // 2. Insert / Upsert into 'public.conversations' table
  const conversationPayload = {
    id: conversationUuid,
    user_id: userId,
    title: chat.title || chat.prompt || 'Untitled Whiteboard',
    prompt: chat.prompt,
    category: chat.video?.category || 'General',
    aspect_ratio: '16:9',
    status: 'ready',
    total_duration_seconds: 30,
    multi_agent_data: chat.video?.multiAgentData || null,
    scenes: chat.video?.scenes || null,
    created_at: chat.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { error: convErr } = await supabase
      .from('conversations')
      .upsert(conversationPayload, { onConflict: 'id' });

    if (convErr) {
      console.warn('[Supabase Conversations Warning]:', convErr.message);
    } else {
      console.log('[Supabase Sync] Saved conversation to public.conversations.');
    }

    // 3. Insert messages into 'public.chat_messages' table
    const chatMessagesPayload = [
      {
        id: ensureUuid(),
        conversation_id: conversationUuid,
        user_id: userId,
        role: 'user',
        content: chat.prompt,
        agent_name: 'User Prompt',
        agent_insights: null,
        created_at: new Date().toISOString(),
      },
      {
        id: ensureUuid(),
        conversation_id: conversationUuid,
        user_id: userId,
        role: 'assistant',
        content: chat.video?.multiAgentData?.recommendedAction || 'Generated multi-agent whiteboard session.',
        agent_name: 'Council AI Engine',
        agent_insights: chat.video?.multiAgentData || null,
        created_at: new Date().toISOString(),
      },
    ];

    const { error: msgErr } = await supabase
      .from('chat_messages')
      .insert(chatMessagesPayload);

    if (msgErr) {
      console.warn('[Supabase Chat Messages Warning]:', msgErr.message);
    } else {
      console.log('[Supabase Sync] Saved messages to public.chat_messages.');
    }
  } catch (err) {
    console.warn('[Supabase Save Error]:', err);
  }
}

/**
 * Fetch saved conversations from Supabase 'public.conversations' table
 */
export async function fetchConversationsFromSupabase(user?: GoogleUserProfile | null) {
  if (!supabase) return [];

  const userId = user?.id || 'guest_user';

  try {
    let query = supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[Supabase Fetch Conversations Warning]:', error.message);
      return [];
    }

    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        uuid: item.id,
        title: item.title,
        prompt: item.prompt,
        createdAt: item.created_at || item.createdAt,
        status: item.status || 'ready',
        video: {
          id: item.id,
          title: item.title,
          category: item.category || 'General',
          multiAgentData: item.multi_agent_data || {
            contextSummary: 'Multi-agent analysis complete.',
            strategicRisks: [],
            proofPoints: [],
            recommendedAction: 'Review generated whiteboard scenes.',
          },
          scenes: item.scenes || [],
        },
      }));
    }
  } catch (err) {
    console.warn('[Supabase Fetch Conversations Error]:', err);
  }
  return [];
}

/**
 * Direct Google OAuth 2.0 Flow using Client ID
 */
export function signInWithGoogleDirect(
  onSuccess: (user: GoogleUserProfile) => void,
  onError?: (err: any) => void
) {
  if (!window.google?.accounts?.oauth2) {
    console.warn('Google Identity Services script not yet loaded.');
    alert('Google authentication service is initializing. Please try again in a moment.');
    return;
  }

  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error('[Google OAuth Error]:', tokenResponse.error);
          if (onError) onError(tokenResponse.error);
          return;
        }

        if (tokenResponse.access_token) {
          try {
            // Fetch Google User Profile info
            const res = await fetch(
              'https://www.googleapis.com/oauth2/v3/userinfo',
              {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              }
            );
            const data = await res.json();

            const userProfile: GoogleUserProfile = {
              id: data.sub || Date.now().toString(),
              email: data.email || 'user@google.com',
              name: data.name || data.given_name || 'Google User',
              picture: data.picture,
            };

            // Save session locally
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));

            // Sync user details into Supabase 'users' table
            saveUserToSupabase(userProfile);

            onSuccess(userProfile);
          } catch (fetchErr) {
            console.error('[Google UserInfo Fetch Error]:', fetchErr);
            if (onError) onError(fetchErr);
          }
        }
      },
    });

    client.requestAccessToken();
  } catch (err) {
    console.error('Error starting Google Token Client:', err);
    if (onError) onError(err);
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  localStorage.removeItem(STORAGE_KEY);
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
  }
}
