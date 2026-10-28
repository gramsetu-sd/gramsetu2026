import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  role: UserRole;
  user: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  isSupabaseLive: boolean;
  setRole: (role: UserRole) => void;
  loginDemo: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('gramsetu_role') as UserRole) || 'coordinator';
  });

  const [user, setUser] = useState<{ id: string; email: string; fullName: string } | null>(() => {
    return {
      id: 'demo-user-1',
      email: `${role}@gramsetu.org`,
      fullName: role === 'administrator' ? 'Shri R. K. Mohapatra (Admin)' : role === 'coordinator' ? 'Priyadarshini Sahu (Block Coordinator)' : 'Citizen Observer (Viewer)',
    };
  });

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const uRole = (session.user.user_metadata?.role as UserRole) || 'coordinator';
          setRoleState(uRole);
          setUser({
            id: session.user.id,
            email: session.user.email || 'user@gramsetu.org',
            fullName: session.user.user_metadata?.full_name || 'Authenticated Officer',
          });
        }
      });
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('gramsetu_role', newRole);
    setUser({
      id: `demo-${newRole}-id`,
      email: `${newRole}@gramsetu.org`,
      fullName:
        newRole === 'administrator'
          ? 'Shri R. K. Mohapatra (District Planning Admin)'
          : newRole === 'coordinator'
          ? 'Priyadarshini Sahu (Rengali Block Coordinator)'
          : 'A. N. Dash (District Planning Officer)',
    });
  };

  const loginDemo = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setRole('viewer');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isSupabaseLive: isSupabaseConfigured,
        setRole,
        loginDemo,
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
