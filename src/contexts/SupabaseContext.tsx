import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'] | null;

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile;
  signUp: (email: string, password: string) => Promise<{ error: unknown; requiresConfirmation?: boolean; session?: Session | null }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<{ error: unknown }>;
  createUserProfile: (profile: Omit<Database['public']['Tables']['users']['Insert'], 'id'>) => Promise<{ error: unknown }>;
  updateUserProfile: (profile: Partial<Database['public']['Tables']['users']['Update']>) => Promise<{ error: unknown }>;
  refreshUserProfile: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      // Debug: report session shape presence (do not log tokens)
      try {
        type SessionLike = Session & { refresh_token?: string; expires_at?: number };
        const sLike = session as SessionLike | null;
        console.debug('[Auth] checkSession -> hasSession:', !!session, 'hasRefresh:', !!sLike?.refresh_token, 'expires_at:', sLike?.expires_at);
      } catch (logErr) {
        console.debug('[Auth] checkSession -> debug log failed', logErr);
      }
      // If a session exists but the refresh token is missing/invalid, clear it to avoid refresh failures
      if (session) {
        // If a refresh_token is missing, don't immediately clear the session.
        // Some Supabase flows (email confirmation / magic link) may return a temporary
        // session without a refresh_token but with a valid access token. Allow
        // immediate actions (like completing the profile) while warning the dev.
        type SessionWithRefresh = Session & { refresh_token?: string; expires_at?: number };
        const s = session as SessionWithRefresh;
        if (!s.refresh_token) {
          const now = Math.floor(Date.now() / 1000);
          const expiresAt = s.expires_at ?? 0;
          if (expiresAt && expiresAt <= now) {
            console.warn('Session found without refresh_token but access token is expired. Clearing session.');
            try {
              await supabase.auth.signOut();
            } catch (e) {
              console.warn('Error signing out invalid session:', e);
            }
            setSession(null);
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            return;
          }

          console.warn('Session found without refresh_token. Keeping session temporarily to allow immediate actions (e.g. complete profile).');
        }
      }
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only set up auth listener if Supabase is properly configured
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          type SessionLike = Session & { refresh_token?: string; expires_at?: number };
          const sLike = session as SessionLike | null;
          console.debug('[Auth] onAuthStateChange', _event, 'hasSession:', !!session, 'hasRefresh:', !!sLike?.refresh_token, 'expires_at:', sLike?.expires_at);
        } catch (logErr) {
          console.debug('[Auth] onAuthStateChange -> debug log failed', logErr);
        }
        // If session exists but lacks a refresh_token, keep it temporarily if the
        // access token is still valid. This lets users confirm their email and
        // complete profile without being forcefully signed out.
        if (session) {
          type SessionWithRefresh = Session & { refresh_token?: string; expires_at?: number };
          const s = session as SessionWithRefresh;
          if (!s.refresh_token) {
            const now = Math.floor(Date.now() / 1000);
            const expiresAt = s.expires_at ?? 0;
            if (expiresAt && expiresAt <= now) {
              console.warn('Received expired session without refresh_token via onAuthStateChange; clearing.');
              try {
                await supabase.auth.signOut();
              } catch (e) {
                console.warn('Error signing out expired session:', e);
              }
              setSession(null);
              setUser(null);
              setUserProfile(null);
              return;
            }

            console.warn('Received session without refresh_token via onAuthStateChange; keeping temporarily to allow profile completion.');
          }
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      }
    );

      // Initial session check
      checkSession();

      return () => {
        subscription.unsubscribe();
      };
    }, [checkSession]);

  const fetchUserProfile = async (userId: string) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - cannot fetch user profile');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured. Please check your environment variables.') };
    }

    try {
      const res = await supabase.auth.signUp({ email, password });
      // Debug: report signUp result session presence
      try {
        console.debug('[Auth] signUp -> session returned:', !!res.data?.session, 'error:', !!res.error);
      } catch (logErr) {
        console.debug('[Auth] signUp -> debug log failed', logErr);
      }

      // If there was an error returned by Supabase Auth, log detailed info
      if (res.error) {
        try {
          console.error('[Auth] signUp error details:', res.error, 'res.data:', res.data);
        } catch (logErr) {
          console.error('[Auth] signUp error logging failed', logErr);
        }
      }
      // If res.data.session is null, Supabase requires email confirmation
      // Additionally, if a session exists but lacks a refresh_token, treat it as requiring confirmation
      const sessionReturned = res.data?.session ?? null;
      let requiresConfirmation = !sessionReturned;
      if (sessionReturned) {
        type SessionWithRefresh = Session & { refresh_token?: string };
        const s = sessionReturned as SessionWithRefresh;
        if (!s.refresh_token) {
          requiresConfirmation = true;
          // Clear the partial session to avoid future refresh attempts
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.warn('Error signing out partial session after signUp:', e);
          }
        }
      }

      return { error: res.error, requiresConfirmation, session: sessionReturned };
    } catch (error) {
      // Log unexpected exceptions during signUp for diagnostics
      try {
        console.error('[Auth] signUp unexpected exception:', error);
      } catch (logErr) {
        console.error('[Auth] signUp exception logging failed', logErr);
      }
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured. Please check your environment variables.') };
    }

    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      // Debug: report signIn result session presence
      try {
        console.debug('[Auth] signIn -> session returned:', !!res.data?.session, 'error:', !!res.error);
      } catch (logErr) {
        console.debug('[Auth] signIn -> debug log failed', logErr);
      }
      // If a session is returned, ensure it contains a refresh_token; otherwise clear it and return an error
      const sessionReturned = res.data?.session ?? null;
      if (sessionReturned) {
        type SessionWithRefresh = Session & { refresh_token?: string };
        const s = sessionReturned as SessionWithRefresh;
        if (!s.refresh_token) {
          // clear partial session and return a helpful error
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.warn('Error signing out partial session after signIn:', e);
          }
          return { error: new Error('Session invalide: token de rafraîchissement manquant. Veuillez confirmer votre email ou réessayer.') };
        }
      }

      return { error: res.error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured. Please check your environment variables.') };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const createUserProfile = async (profile: Omit<Database['public']['Tables']['users']['Insert'], 'id'>) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured. Please check your environment variables.') };
    }

    try {
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      // double-check session refresh token before making DB calls
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { error: new Error('Session invalide. Veuillez vous reconnecter ou confirmer votre adresse email.') };
      }
      // If refresh_token is missing, allow the DB write if the access token is still valid.
      type SessionWithRefresh = Session & { refresh_token?: string; expires_at?: number };
      const s = session as SessionWithRefresh;
      if (!s.refresh_token) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = s.expires_at ?? 0;
        if (expiresAt && expiresAt <= now) {
          return { error: new Error('Session expirée. Veuillez vous reconnecter.') };
        }
        console.warn('Proceeding with DB write despite missing refresh_token; access token valid until', expiresAt);
      }

      const { error } = await supabase.from('users').insert({
        ...profile,
        id: user.id,
      });

      if (!error) {
        await fetchUserProfile(user.id);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateUserProfile = async (profile: Partial<Database['public']['Tables']['users']['Update']>) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured. Please check your environment variables.') };
    }

    try {
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      // double-check session refresh token before making DB calls
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { error: new Error('Session invalide. Veuillez vous reconnecter ou confirmer votre adresse email.') };
      }
      // Allow updates if access token still valid even without refresh_token
      type SessionWithRefresh2 = Session & { refresh_token?: string; expires_at?: number };
      const s2 = session as SessionWithRefresh2;
      if (!s2.refresh_token) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = s2.expires_at ?? 0;
        if (expiresAt && expiresAt <= now) {
          return { error: new Error('Session expirée. Veuillez vous reconnecter.') };
        }
        console.warn('Proceeding with profile update despite missing refresh_token; access token valid until', expiresAt);
      }

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          ...profile
        }, {
          onConflict: 'id'
        });

      if (!error) {
        await fetchUserProfile(user.id);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const refreshUserProfile = async () => {
    if (user && isSupabaseConfigured) {
      await fetchUserProfile(user.id);
    }
  };

  const value = {
    session,
    user,
    userProfile,
    signUp,
    signIn,
    signOut,
    createUserProfile,
    updateUserProfile,
    refreshUserProfile,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};