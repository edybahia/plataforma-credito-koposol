import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KoposolLogo } from '@/components/KoposolLogo';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Credenciais de demonstração para facilitar testes
      if (email === 'admin@koposol.com' && password === 'admin123') {
        // Usuário admin de demonstração
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', email);
        toast.success('Login realizado com sucesso!');
        navigate('/admin/dashboard');
        setIsLoading(false);
        return;
      }

      // Autenticação real com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro de login:', error);
        toast.error(error.message || 'Credenciais inválidas');
        setIsLoading(false);
        return;
      }

      // Após o login, verificar se é um integrador e qual o seu status
      const { data: integratorData, error: integratorError } = await supabase
        .from('profiles')
        .select('status')
        .eq('user_id', data.user.id)
        .single();

      // Se não houver erro e o usuário for encontrado na tabela de integradores
      if (integratorData && !integratorError) {
        // VERIFICAÇÃO DE STATUS DO INTEGRADOR
        if (integratorData.status === 'pendente') {
          toast.error('Seu cadastro está em análise. Você poderá acessar a plataforma após a aprovação.');
          await supabase.auth.signOut(); // Desconecta o usuário
          setIsLoading(false);
          return;
        }

        if (integratorData.status === 'rejeitado') {
            toast.error('Seu cadastro foi rejeitado. Entre em contato com o suporte.');
            await supabase.auth.signOut(); // Desconecta o usuário
            setIsLoading(false);
            return;
        }

        // Se chegou aqui, é um integrador aprovado
        localStorage.setItem('userRole', 'integrator');
        localStorage.setItem('userEmail', data.user.email || '');
        toast.success('Login realizado com sucesso!');
        navigate('/integrator/dashboard');
      } else {
        // Se não for encontrado na tabela de integradores, assume-se que é um admin
        // (Em um cenário real, uma verificação de role de admin seria mais segura)
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', data.user.email || '');
        toast.success('Login realizado com sucesso!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao início
          </Button>
          
          <KoposolLogo className="justify-center" size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Acesse sua conta
            </h1>
            <p className="text-gray-600 mt-2">
              Entre com suas credenciais para continuar
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Faça login em sua conta Koposol Partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full koposol-gradient text-white hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ainda não é parceiro?
                  </span>
                </div>
              </div>

              <Button 
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                Cadastrar como integrador
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Credenciais de demonstração:</p>
              <p><strong>Admin:</strong> admin@koposol.com / admin123</p>
              <p><strong>Integrador:</strong> qualquer email e senha</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
