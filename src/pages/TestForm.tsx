import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KoposolLogo } from '@/components/KoposolLogo';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TestForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados simplificados
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Gerar email aleatório se não for fornecido
      const email = formData.email || `teste${Math.floor(Math.random() * 10000)}@teste.com`;
      const senha = formData.senha || 'Teste@123456';
      const nome = formData.nome || 'Empresa Teste';
      
      console.log('Tentando cadastro com:', { email, senha, nome });
      
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: {
            nome_completo: nome,
            tipo_usuario: 'integrador'
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        toast.error(`Erro ao criar usuário: ${authError.message}`);
        setIsLoading(false);
        return;
      }

      console.log('Usuário criado com sucesso:', authData);

      // 2. Inserir diretamente na tabela integradores
      // Usamos apenas os campos que sabemos que existem na tabela
      const integradorData = {
        nome_empresa: nome,
        cnpj: '00000000000000',
        email: email,
        telefone: '00000000000',
        endereco: 'Endereço de teste',
        status: 'pendente',
        user_id: authData.user?.id
      };

      console.log('Dados do integrador para inserção direta:', integradorData);

      // Inserção direta na tabela
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([integradorData]);
        
      if (insertError) {
        console.error('Erro ao inserir integrador:', insertError);
        toast.error(`Erro ao inserir integrador: ${insertError.message}`);
        setIsLoading(false);
        return;
      }
      
      console.log('Integrador inserido com sucesso!');
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
      
    } catch (error: any) {
      console.error('Erro geral:', error);
      toast.error(`Erro ao processar cadastro: ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <KoposolLogo className="h-12" />
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Formulário de Teste</CardTitle>
            <p className="text-center text-sm text-gray-500">
              Formulário simplificado para testar integração com Supabase
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome (opcional)</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome da empresa ou pessoa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail (opcional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                />
                <p className="text-xs text-gray-500">
                  Se não preenchido, será gerado um e-mail aleatório
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha (opcional)</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500">
                  Se não preenchida, será usada uma senha padrão
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Testar Cadastro'}
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/login')} 
                  className="text-sm"
                >
                  Voltar para Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestForm;
