import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KoposolLogo } from '@/components/KoposolLogo';
import { ArrowLeft, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senhas
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      // Atualizar a senha usando Supabase
      const { error } = await supabase.auth.updateUser({ 
        password 
      });

      if (error) {
        console.error('Erro ao redefinir senha:', error);
        toast.error(error.message || 'Ocorreu um erro. Tente novamente.');
        setStatus('error');
      } else {
        setStatus('success');
        toast.success('Senha redefinida com sucesso!');
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar sua solicitação.');
      setStatus('error');
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
            onClick={() => navigate('/login')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
          
          <KoposolLogo className="justify-center" size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Redefinir senha
            </h1>
            <p className="text-gray-600 mt-2">
              Crie uma nova senha para sua conta
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Nova senha</CardTitle>
            <CardDescription className="text-center">
              Escolha uma senha forte e segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' ? (
              <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
                <CheckCircle className="h-5 w-5" />
                <AlertTitle>Senha redefinida!</AlertTitle>
                <AlertDescription>
                  Sua senha foi alterada com sucesso. Você será redirecionado para a página de login.
                </AlertDescription>
              </Alert>
            ) : status === 'error' ? (
              <Alert className="bg-red-50 border-red-200 text-red-800 mb-4">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Erro ao redefinir senha</AlertTitle>
                <AlertDescription>
                  Não foi possível redefinir sua senha. Tente novamente ou solicite um novo link de redefinição.
                </AlertDescription>
              </Alert>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-900"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-900"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full koposol-gradient text-white hover:opacity-90"
                disabled={isLoading || status === 'success'}
              >
                {isLoading ? 'Processando...' : 'Redefinir senha'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
