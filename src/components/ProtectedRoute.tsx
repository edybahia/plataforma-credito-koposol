import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ProtectedRoute = () => {
  const { user, integrator, loading } = useAuth();

  console.log('[ProtectedRoute] Rendering with state:', { 
    loading, 
    user: user?.email,
    integrator: integrator ? { id: integrator.id, cnpj: integrator.cnpj, status: integrator.status } : null
  });

  if (loading) {
    console.log('[ProtectedRoute] Decision: Loading...');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] Decision: No user. Redirecting to /auth.');
    return <Navigate to="/auth" replace />;
  }

  // Lógica para o Admin (movida para cima para acesso rápido)
  if (user.email === 'edeilsonbrito@gmail.com') {
    console.log('[ProtectedRoute] Decision: Admin access. Rendering Outlet.');
    return <Outlet />;
  }

  // Lógica para o Integrador

  // 1. Define a função que verifica se o perfil está completo.
  const isProfileComplete = (profile: Integrator | null): profile is Integrator => {
    if (!profile) return false;
    // Adicione todos os campos que são obrigatórios no formulário de cadastro.
    return !!(profile.cnpj && profile.razao_social && profile.cep && profile.logradouro && profile.cidade && profile.estado);
  };

  // 2. Se o perfil está incompleto, redireciona para a página de cadastro.
  if (!isProfileComplete(integrator)) {
    console.log('[ProtectedRoute] Decision: Integrator profile is incomplete. Redirecting to /complete-profile.');
    return <Navigate to="/complete-profile" replace />;
  }

  // 3. Se o perfil está completo, verifica o status para os próximos passos.
  switch (integrator.status) {
    case 'aprovado':
      console.log('[ProtectedRoute] Decision: Integrator approved. Rendering Outlet.');
      return <Outlet />; // Acesso permitido
    case 'pendente_aprovacao':
    case 'pendente_cadastro':
      console.log(`[ProtectedRoute] Decision: Integrator status is '${integrator.status}'. Redirecting to /awaiting-approval.`);
      return <Navigate to="/awaiting-approval" replace />;
    case 'rejeitado':
      console.log(`[ProtectedRoute] Decision: Integrator status is 'rejeitado'. Redirecting to /auth.`);
      toast.error("Seu cadastro foi rejeitado. Entre em contato com o suporte.");
      return <Navigate to="/auth" replace />;
    default:
      console.log(`[ProtectedRoute] Decision: Unknown integrator status '${integrator.status}'. Redirecting to /auth.`);
      toast.error("Ocorreu um erro com seu cadastro. Entre em contato com o suporte.");
      return <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;