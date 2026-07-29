import React, { useEffect, useState } from 'react';
import { CouncilLogo } from './CouncilLogo';
import { Sparkles, LogOut } from 'lucide-react';
import {
  signInWithGoogleDirect,
  signOutUser,
  getSavedUserSession,
  GoogleUserProfile,
} from '../lib/supabase';

interface NavbarProps {
  onOpenStudio: () => void;
  onNavigateSection: (sectionId: string) => void;
  user?: GoogleUserProfile | null;
  onUserChange?: (user: GoogleUserProfile | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStudio,
  onNavigateSection,
  user: propUser,
  onUserChange,
}) => {
  const [user, setUser] = useState<GoogleUserProfile | null>(
    propUser !== undefined ? propUser : getSavedUserSession()
  );
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (propUser !== undefined) {
      setUser(propUser);
    } else {
      setUser(getSavedUserSession());
    }
  }, [propUser]);

  const handleSignIn = () => {
    signInWithGoogleDirect(
      (newUser) => {
        setUser(newUser);
        if (onUserChange) onUserChange(newUser);
      },
      (err) => {
        console.error('Google login failed:', err);
      }
    );
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setShowDropdown(false);
    if (onUserChange) onUserChange(null);
  };

  const userAvatar = user?.picture;
  const userName = user?.name || user?.email || 'User';

  return (
    <header className="sticky top-0 z-40 bg-[#fcfcfd]/90 backdrop-blur-md border-b border-slate-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="cursor-pointer text-left focus:outline-none"
        >
          <CouncilLogo size="md" />
        </button>

        {/* Center/Right Nav Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium text-slate-700">
            <button
              onClick={() => onNavigateSection('how-it-works')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => onNavigateSection('demo')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Demo
            </button>
            <button
              onClick={() => onNavigateSection('features')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Multi-Agent Engine
            </button>
          </nav>

          {/* Action Button */}
          <button
            onClick={onOpenStudio}
            className="btn-beige px-4 sm:px-5 py-2 rounded-full font-sans text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm hover:shadow"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            Open the studio
          </button>

          {/* Google Auth Profile / Sign-in */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                title={userName}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-medium text-slate-800 truncate">{userName}</p>
                    {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
