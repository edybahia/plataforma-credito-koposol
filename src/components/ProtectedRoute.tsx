import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ProtectedRoute = () => {
  const { user, profile, integrator, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Verificando autorização...</div>;
  }

  if (!user) {
    toast.error('Você precisa estar logado para acessar esta página.');
    return <Navigate to="/login" replace />;
  }

  // Admin always has access
  if (profile?.tipo_usuario === 'admin') {
    return <Outlet />;
  }

  // Integrator must be 'aprovado'
  if (profile?.tipo_usuario === 'integrador') {
    if (integrator?.status === 'aprovado') {
      return <Outlet />;
    } else {
      // Handle pending or rejected integrators
      const message = integrator?.status === 'pendente'
        ? 'Seu cadastro está pendente de aprovação.'
        : 'Seu acesso foi negado. Entre em contato com o suporte.';
      toast.warning(message, { duration: 6000 });
      // It's important to sign out to prevent login loops
      supabase.auth.signOut();
      return <Navigate to="/login" replace />;
    }
  }

  // Fallback for any other case (e.g., profile not loaded yet, or unexpected role)
  toast.error('Acesso não autorizado.');
  supabase.auth.signOut();
  return <Navigate to="/login" replace />;
};


export default ProtectedRoute;