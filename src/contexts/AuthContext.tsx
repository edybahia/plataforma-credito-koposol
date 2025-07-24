import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Integrator } from '@/types';

interface AuthContextType {
  user: User | null;
  integrator: Integrator | null;
  loading: boolean;
  checkUserAndProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [integrator, setIntegrator] = useState<Integrator | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserAndProfile = async () => {
    console.log('[AuthContext] Checking user session and profile...');
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser && currentUser.email !== 'edeilsonbrito@gmail.com') {
      const { data: integratorData, error } = await supabase
        .from('integradores')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error) console.error('[AuthContext] Error fetching profile:', error.message);
      setIntegrator(integratorData ?? null);
    } else {
      setIntegrator(null);
    }
    setLoading(false);
    console.log('[AuthContext] Check finished.');
  };

  useEffect(() => {
    // Executa a verificação inicial uma vez quando o componente monta.
    checkUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[AuthContext] Auth event: ${event}`);
      // O estado do usuário já é atualizado pela chamada `checkUserAndProfile`.
      // Nós reagimos a mudanças para re-verificar, exceto no carregamento inicial que já foi feito.
      if (event !== 'INITIAL_SESSION') {
        checkUserAndProfile();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = { user, integrator, loading, checkUserAndProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
