import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { KoposolLogo } from '@/components/KoposolLogo';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        toast.error(error.message || 'Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.');
        setStatus('error');
      } else {
        setStatus('success');
        toast.success('E-mail de recuperação enviado com sucesso!');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
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
              Esqueceu sua senha?
            </h1>
            <p className="text-gray-600 mt-2">
              Não se preocupe, enviaremos instruções para recuperá-la.
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Recuperar senha</CardTitle>
            <CardDescription className="text-center">
              Informe seu e-mail para receber o link de recuperação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' ? (
              <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
                <CheckCircle className="h-5 w-5" />
                <AlertTitle>E-mail enviado!</AlertTitle>
                <AlertDescription>
                  Enviamos um link de recuperação para <strong>{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </AlertDescription>
              </Alert>
            ) : status === 'error' ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Erro ao Enviar</AlertTitle>
                <AlertDescription>
                  Não foi possível enviar o e-mail. Verifique se o endereço está correto e tente novamente.
                </AlertDescription>
              </Alert>
            ) : null}

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
                    disabled={status === 'success' || isLoading}
                  />
                </div>
              </div>

              {status !== 'success' && (
                <Button 
                  type="submit" 
                  className="w-full koposol-gradient text-white hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>
              )}

              {status === 'success' && (
                <div className="space-y-4">
                  <Button 
                    type="button" 
                    className="w-full koposol-gradient text-white hover:opacity-90"
                    onClick={() => {
                      setEmail('');
                      setStatus('idle');
                    }}
                  >
                    Tentar com outro e-mail
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Voltar ao Login
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;