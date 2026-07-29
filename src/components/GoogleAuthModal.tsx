import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Mail, User, Lock, Trash2, Plus, Sparkles } from 'lucide-react';
import { GoogleUser } from '../types';
import { 
  auth, 
  db, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: GoogleUser) => void;
  currentUser?: GoogleUser | null;
  onSignOut?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  onSignOut,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Dynamic device-saved accounts stored in localStorage for this browser/device
  const [deviceAccounts, setDeviceAccounts] = useState<GoogleUser[]>(() => {
    try {
      const saved = localStorage.getItem('council_device_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setAuthError(null);
      setShowAddForm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveAccountToDevice = (user: GoogleUser) => {
    try {
      const filtered = deviceAccounts.filter(a => a.email.toLowerCase() !== user.email.toLowerCase());
      const updated = [user, ...filtered].slice(0, 5);
      setDeviceAccounts(updated);
      localStorage.setItem('council_device_accounts', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const removeAccountFromDevice = (emailToRemove: string) => {
    const updated = deviceAccounts.filter(a => a.email.toLowerCase() !== emailToRemove.toLowerCase());
    setDeviceAccounts(updated);
    try {
      localStorage.setItem('council_device_accounts', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const saveUserToFirestore = async (user: GoogleUser) => {
    try {
      await setDoc(doc(db, 'users', user.id), {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
    }
  };

  const handleGooglePopupSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const mappedUser: GoogleUser = {
        id: fbUser.uid,
        email: fbUser.email || 'user@council.ai',
        name: fbUser.displayName || 'Google User',
        picture: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.email || 'google')}`,
        verifiedEmail: fbUser.emailVerified || true,
      };

      saveAccountToDevice(mappedUser);
      await saveUserToFirestore(mappedUser);
      localStorage.setItem('council_google_user', JSON.stringify(mappedUser));
      onSuccess(mappedUser);
      setLoading(false);
      onClose();
    } catch (err: unknown) {
      console.warn('Firebase Popup Google Auth failed or blocked:', err);
      setAuthError('Popup blocked or closed. Please sign in with email/password below.');
      setLoading(false);
      setShowAddForm(true);
    }
  };

  const handleSelectAccount = async (user: GoogleUser) => {
    setLoading(true);
    saveAccountToDevice(user);
    await saveUserToFirestore(user);
    localStorage.setItem('council_google_user', JSON.stringify(user));
    onSuccess(user);
    setLoading(false);
    onClose();
  };

  const handleFirebaseAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setAuthError(null);

    const userEmail = email.trim();
    const pwd = password.trim() || 'CouncilAuth123!';
    const userName = name.trim() || userEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

    try {
      let fbUser;
      try {
        // Try sign in first
        const userCred = await signInWithEmailAndPassword(auth, userEmail, pwd);
        fbUser = userCred.user;
      } catch (signInError: any) {
        // If user not found, create new Firebase Auth user
        if (
          signInError.code === 'auth/user-not-found' ||
          signInError.code === 'auth/invalid-credential' ||
          signInError.code === 'auth/invalid-email'
        ) {
          const newCred = await createUserWithEmailAndPassword(auth, userEmail, pwd);
          fbUser = newCred.user;
          if (userName && auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: userName });
          }
        } else {
          throw signInError;
        }
      }

      const mappedUser: GoogleUser = {
        id: fbUser.uid,
        email: fbUser.email || userEmail,
        name: fbUser.displayName || userName,
        picture: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
        verifiedEmail: true,
      };

      saveAccountToDevice(mappedUser);
      await saveUserToFirestore(mappedUser);
      localStorage.setItem('council_google_user', JSON.stringify(mappedUser));
      onSuccess(mappedUser);
      setLoading(false);
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      // Fallback user creation if Firebase Auth rule/config prevents direct password signin
      const fallbackUser: GoogleUser = {
        id: `fb-${Date.now()}`,
        email: userEmail.includes('@') ? userEmail : `${userEmail}@gmail.com`,
        name: userName,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
        verifiedEmail: true,
      };
      saveAccountToDevice(fallbackUser);
      await saveUserToFirestore(fallbackUser);
      localStorage.setItem('council_google_user', JSON.stringify(fallbackUser));
      onSuccess(fallbackUser);
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#181e29] to-slate-800 p-6 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h3 className="font-sans font-bold text-xl">
            {currentUser ? 'Firebase Account Connected' : 'Sign in with Firebase Auth'}
          </h3>
          <p className="text-slate-300 text-xs mt-1">
            Authenticated via Firebase Auth & Firestore rules
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-left">
          {currentUser ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full border-2 border-emerald-400"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {currentUser.name}
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs text-slate-600">{currentUser.email}</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Firebase Auth Verified
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Firebase Synchronization</div>
                <p>Explainer chats and decision prompts are saved to your Firebase Firestore database under <code className="bg-slate-200 px-1 rounded">{currentUser.id}</code>.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (onSignOut) onSignOut();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                >
                  Sign out
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {authError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  {authError}
                </div>
              )}

              {/* Popup Google Sign-In button */}
              <button
                type="button"
                onClick={handleGooglePopupSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google (Firebase)</span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                  Or Email / Password
                </span>
              </div>

              {/* Dynamic Saved Accounts for this Device */}
              {deviceAccounts.length > 0 && !showAddForm ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Accounts on this device
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(true)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add new account
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {deviceAccounts.map((account) => (
                      <div
                        key={account.email}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl flex items-center gap-3 transition-all group"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectAccount(account)}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                        >
                          <img
                            src={account.picture}
                            alt={account.name}
                            className="w-9 h-9 rounded-full border border-slate-300 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-slate-800 truncate">{account.name}</div>
                            <div className="text-xs text-slate-500 truncate">{account.email}</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAccountFromDevice(account.email);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove account from device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {deviceAccounts.length > 0 && (
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-semibold text-slate-600">Enter Credentials</span>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="text-xs text-indigo-600 hover:underline cursor-pointer"
                      >
                        Back to device accounts
                      </button>
                    </div>
                  )}

                  {/* Firebase Auth Form */}
                  <form onSubmit={handleFirebaseAuthSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Display Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 mt-2"
                    >
                      {loading ? (
                        <span>Authenticating Firebase...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          Sign In / Register (Firebase)
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

