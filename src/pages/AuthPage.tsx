import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KoposolLogo } from '@/components/KoposolLogo';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user, loading, checkUserAndProfile } = useAuth();

  useEffect(() => {
    // Se não estiver carregando e um usuário já existir, redirecione.
    // Isso impede que um usuário logado veja a página de login/cadastro.
    if (!loading && user) {
      if (user.email === 'edeilsonbrito@gmail.com') {
        navigate('/admin/dashboard');
      } else {
        navigate('/integrator/dashboard');
      }
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      toast.error(error.message || 'Credenciais inválidas.');
      setIsLoading(false);
      return;
    }

    toast.success('Login bem-sucedido! Redirecionando...');

    // Apenas redireciona. O ProtectedRoute fará o resto.
    // O e-mail do admin será verificado no ProtectedRoute.
    // Os integradores serão direcionados com base no status pelo ProtectedRoute.
    if (loginEmail === 'edeilsonbrito@gmail.com') {
      navigate('/admin/dashboard');
    } else {
      navigate('/integrator/dashboard');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
    });

    if (authError) {
      toast.error(authError.message || 'Erro ao criar conta.');
      setIsLoading(false);
      return;
    }

    // Se o usuário foi criado, INSIRA o perfil mínimo ANTES de fazer qualquer outra coisa.
    // Isso é crucial para a condição de corrida com o AuthContext.
    if (authData.user) {
      const { error: profileError } = await supabase.from('integradores').insert({
        user_id: authData.user.id,
        email: authData.user.email,
        // Usamos um status específico para indicar que o cadastro PRECISA ser completado.
        status: 'pendente_cadastro',
        nome_empresa: signUpEmail, // Um valor padrão para não ser nulo
      });

      if (profileError) {
        toast.error(`Erro crítico ao criar perfil: ${profileError.message}. Por favor, contate o suporte.`);
        // Aqui, poderíamos até deletar o usuário criado para evitar inconsistência.
        setIsLoading(false);
        return;
      }

      // Sucesso! Agora, o onAuthStateChange vai pegar o usuário logado e o perfil recém-criado.
      // O ProtectedRoute fará o resto.
      toast.success('Conta criada com sucesso! Redirecionando para você completar seu perfil...');
      // Força a revalidação do usuário e perfil no contexto APÓS a inserção.
      // Isso resolve a condição de corrida de uma vez por todas.
      if (authData.user) {
        await checkUserAndProfile(authData.user);
      }
    }

    setIsLoading(false); // Re-adicionado para garantir que o botão seja liberado.
  };

  const containerClass = `bg-white rounded-2xl shadow-2xl flex w-full max-w-4xl transition-all duration-700 ease-in-out ${isSignUp ? 'flex-row' : 'flex-row-reverse'}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className={containerClass}>
        {/* Form Panel */}
        <div className="w-1/2 p-12">
          <div className="text-center mb-8">
            <KoposolLogo className="justify-center" size="md" />
            <h2 className="text-2xl font-bold text-purple-800 mt-4">
              {isSignUp ? 'Crie sua Conta' : 'Acesse sua Conta'}
            </h2>
          </div>

          {isSignUp ? (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="signup-email" type="email" placeholder="E-mail" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} required className="pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="signup-password" type="password" placeholder="Senha" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} required className="pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="confirm-password" type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pl-10" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                {isLoading ? 'Criando...' : 'CRIAR CONTA'}
              </Button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="login-email" type="email" placeholder="E-mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="pl-10" />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="login-password" type="password" placeholder="Senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="pl-10" />
                </div>
                <a href="/forgot-password" className="text-sm text-purple-600 hover:underline">Esqueceu sua senha?</a>
                <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                    {isLoading ? 'Entrando...' : 'ENTRAR'}
                </Button>
            </form>
          )}
        </div>

        {/* Overlay Panel */}
        <div className="w-1/2 p-12 flex flex-col items-center justify-center text-center text-white bg-purple-600 rounded-2xl">
          <h2 className="text-3xl font-bold mb-2">{isSignUp ? 'Bem-vindo de Volta!' : 'Olá, Integrador!'}</h2>
          <div className="border-2 w-10 border-white inline-block mb-4"></div>
          <p className="mb-6">
            {isSignUp ? 'Já possui uma conta? Faça login para acessar a plataforma.' : 'Ainda não é nosso parceiro? Cadastre-se e junte-se ao nosso time.'}
          </p>
          <Button onClick={() => setIsSignUp(!isSignUp)} className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-600 text-white font-bold py-2 px-8 rounded-lg">
            {isSignUp ? 'ENTRAR' : 'CRIAR CONTA'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
