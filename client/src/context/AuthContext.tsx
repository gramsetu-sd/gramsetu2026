import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Session } from '@supabase/supabase-js';

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  village?: string;
  isDemo?: boolean;
}

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  village?: string;
  role?: UserRole;
}

interface AuthContextType {
  role: UserRole;
  user: UserData | null;
  isAuthenticated: boolean;
  isSupabaseLive: boolean;
  loading: boolean;
  setRole: (role: UserRole) => void;
  loginDemo: (role: UserRole, customName?: string, customVillage?: string) => void;
  signInWithPassword: (emailOrPhone: string, password: string) => Promise<{ error: string | null }>;
  signUp: (params: SignUpParams) => Promise<{ error: string | null; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('gramsetu_role') as UserRole) || 'coordinator';
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [user, setUser] = useState<UserData | null>(() => {
    // Check if custom demo user is saved
    const savedCustomUser = localStorage.getItem('gramsetu_custom_user');
    if (savedCustomUser) {
      try {
        return JSON.parse(savedCustomUser);
      } catch {
        // fallback to default
      }
    }
    const savedRole = (localStorage.getItem('gramsetu_role') as UserRole) || 'coordinator';
    return {
      id: `demo-${savedRole}-1`,
      email: `${savedRole}@gramsetu.org`,
      fullName:
        savedRole === 'administrator'
          ? 'Shri R. K. Mohapatra (Admin)'
          : savedRole === 'coordinator'
          ? 'Priyadarshini Sahu (Block Coordinator)'
          : 'Citizen Observer (Viewer)',
      role: savedRole,
      village: 'Bamaloi',
      isDemo: true,
    };
  });

  // Helper to sync user from Supabase session
  const syncSessionUser = useCallback((session: Session) => {
    const meta = session.user.user_metadata || {};
    let uRole: UserRole = 'coordinator';
    if (meta.role === 'administrator' || meta.role === 'admin' || meta.role === 'owner') {
      uRole = 'administrator';
    } else if (meta.role === 'viewer') {
      uRole = 'viewer';
    }

    setRoleState(uRole);
    localStorage.setItem('gramsetu_role', uRole);
    if (session.access_token) {
      localStorage.setItem('gramsetu_token', session.access_token);
    }

    const userData: UserData = {
      id: session.user.id,
      email: session.user.email || '',
      fullName: meta.full_name || meta.fullName || session.user.email?.split('@')[0] || 'Authenticated Villager',
      role: uRole,
      phone: meta.phone || session.user.phone || '',
      village: meta.village || 'Bamaloi',
      isDemo: false,
    };

    setUser(userData);
    localStorage.setItem('gramsetu_custom_user', JSON.stringify(userData));
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    let isMounted = true;

    if (isSupabaseConfigured && supabase) {
      // 1. Initial session check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session?.user) {
          syncSessionUser(session);
        }
        setLoading(false);
      }).catch((err) => {
        console.warn('Supabase getSession failed, continuing in demo mode:', err);
        if (isMounted) setLoading(false);
      });

      // 2. Real-time auth changes (Sign In, Sign Out, Token Refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          syncSessionUser(session);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('gramsetu_token');
          localStorage.removeItem('gramsetu_custom_user');
          setRoleState('viewer');
          setUser(null);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, [syncSessionUser]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('gramsetu_role', newRole);
    const updatedUser: UserData = {
      id: `demo-${newRole}-id`,
      email: `${newRole}@gramsetu.org`,
      fullName:
        newRole === 'administrator'
          ? 'Shri R. K. Mohapatra (District Planning Admin)'
          : newRole === 'coordinator'
          ? 'Priyadarshini Sahu (Rengali Block Coordinator)'
          : 'A. N. Dash (District Planning Officer)',
      role: newRole,
      village: 'Bamaloi',
      isDemo: true,
    };
    setUser(updatedUser);
    localStorage.setItem('gramsetu_custom_user', JSON.stringify(updatedUser));
  };

  const loginDemo = (selectedRole: UserRole, customName?: string, customVillage?: string) => {
    setRoleState(selectedRole);
    localStorage.setItem('gramsetu_role', selectedRole);
    const demoUser: UserData = {
      id: `demo-${selectedRole}-${Date.now()}`,
      email: `${selectedRole}@gramsetu.org`,
      fullName:
        customName ||
        (selectedRole === 'administrator'
          ? 'Ramesh Patel (Asset Owner & Admin)'
          : selectedRole === 'coordinator'
          ? 'Suresh Bhoi (Farmer & Renter)'
          : 'Citizen Observer (Viewer)'),
      role: selectedRole,
      village: customVillage || 'Bamaloi',
      isDemo: true,
    };
    setUser(demoUser);
    localStorage.setItem('gramsetu_custom_user', JSON.stringify(demoUser));
  };

  const signInWithPassword = async (emailOrPhone: string, password: string): Promise<{ error: string | null }> => {
    const cleanInput = emailOrPhone.trim();
    // Normalize phone numbers to email format if phone entered
    const email = cleanInput.includes('@')
      ? cleanInput
      : `${cleanInput.replace(/\D/g, '')}@gramsetu.in`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        if (data.session) {
          syncSessionUser(data.session);
        }
        return { error: null };
      } catch (err) {
        return { error: (err as Error).message || 'Failed to sign in' };
      }
    } else {
      // Local fallback mode when Supabase is not configured
      const demoRole: UserRole = email.includes('admin') || email.includes('owner') ? 'administrator' : 'coordinator';
      loginDemo(demoRole, email.split('@')[0]);
      return { error: null };
    }
  };

  const signUp = async (params: SignUpParams): Promise<{ error: string | null; message?: string }> => {
    const cleanEmail = params.email.trim();
    const email = cleanEmail.includes('@')
      ? cleanEmail
      : `${cleanEmail.replace(/\D/g, '')}@gramsetu.in`;

    const mappedRole: UserRole = params.role || 'coordinator';

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: params.password,
          options: {
            data: {
              full_name: params.fullName,
              phone: params.phone || '',
              village: params.village || 'Bamaloi',
              role: mappedRole,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (data.session) {
          syncSessionUser(data.session);
          return { error: null, message: 'Account created and signed in successfully!' };
        } else if (data.user && !data.session) {
          // Email confirmation is required by Supabase project settings
          return {
            error: null,
            message:
              'Registration successful! Please check your email to confirm your account (or disable "Confirm email" in Supabase Auth Settings).',
          };
        }
        return { error: null };
      } catch (err) {
        return { error: (err as Error).message || 'Registration failed' };
      }
    } else {
      // Local fallback mode
      loginDemo(mappedRole, params.fullName, params.village);
      return { error: null, message: 'Registered locally in demonstration mode!' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error signing out from Supabase:', err);
      }
    }
    localStorage.removeItem('gramsetu_token');
    localStorage.removeItem('gramsetu_custom_user');
    setRoleState('viewer');
    localStorage.setItem('gramsetu_role', 'viewer');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAuthenticated: Boolean(user),
        isSupabaseLive: isSupabaseConfigured,
        loading,
        setRole,
        loginDemo,
        signInWithPassword,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
