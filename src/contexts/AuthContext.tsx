import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
interface Integrator {
  id: string;
  user_id: string;
  nome_empresa: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  // Add other fields as necessary
}

interface Profile {
  id: string;
  tipo_usuario: 'admin' | 'integrador';
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  integrator: Integrator | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [integrator, setIntegrator] = useState<Integrator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile to get user type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          const typedProfile = profileData as unknown as Profile;
          setProfile(typedProfile);

          // If user is an integrator, fetch integrator status
          if (typedProfile.tipo_usuario === 'integrador') {
            const { data: integratorData, error: integratorError } = await supabase
              .from('integradores')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (integratorError) {
              console.error('Error fetching integrator data:', integratorError);
            } else {
              setIntegrator(integratorData as Integrator);
            }
          }
        }
      }
      setLoading(false);
    };

    getSessionData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Re-fetch profile and integrator data on auth state change if needed
      if (_event === 'SIGNED_IN' || _event === 'USER_UPDATED') {
        getSessionData();
      }
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
        setIntegrator(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    integrator,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
