import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AwaitingApproval = () => {
  const { integrator } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  let title = 'Aguardando Aprovação';
  let message = 'Seu cadastro está em análise pela nossa equipe. Você será notificado por e-mail assim que for aprovado.';

  if (integrator?.status === 'pendente_documentacao') {
    title = 'Documentação Pendente';
    message = 'Seu cadastro inicial foi recebido, mas ainda falta completar o envio dos documentos. Por favor, complete seu perfil.';
  } else if (integrator?.status === 'rejeitado') {
    title = 'Cadastro Rejeitado';
    message = 'Infelizmente, seu cadastro não foi aprovado no momento. Por favor, entre em contato com o suporte para mais detalhes.';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default AwaitingApproval;
