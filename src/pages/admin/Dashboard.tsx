
import React, { useState, useEffect } from 'react';

import { LayoutDashboard, Users, FileText, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendentesCadastro: 0,
    pendentesAprovacao: 0,
    aprovados: 0,
  });
  const [recentesPendentesCadastro, setRecentesPendentesCadastro] = useState([]);
  const [recentesPendentesAprovacao, setRecentesPendentesAprovacao] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Busca as contagens por status
        const { data: counts, error: countError } = await supabase.rpc('count_integradores_by_status');
        if (countError) throw countError;

        // Cast para o tipo esperado, já que o SDK não pode inferir o retorno da RPC customizada
        const typedCounts = counts as { status: string; count: number }[];
        
        const statusCounts = typedCounts.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {});

        setStats({
          pendentesCadastro: statusCounts['pendente_cadastro'] || 0,
          pendentesAprovacao: statusCounts['pendente_aprovacao'] || 0,
          aprovados: statusCounts['aprovado'] || 0,
        });

        // Busca os 5 mais recentes pendentes de cadastro
        const { data: pendentesCadastroData, error: pendentesCadastroError } = await supabase
          .from('integradores')
          .select('id, email, created_at, status')
          .eq('status', 'pendente_cadastro')
          .order('created_at', { ascending: false })
          .limit(5);
        if (pendentesCadastroError) throw pendentesCadastroError;
        setRecentesPendentesCadastro(pendentesCadastroData || []);

        // Busca os 5 mais recentes pendentes de aprovação
        const { data: pendentesAprovacaoData, error: pendentesAprovacaoError } = await supabase
          .from('integradores')
          .select('id, nome_empresa, email, created_at, status')
          .eq('status', 'pendente_aprovacao')
          .order('created_at', { ascending: false })
          .limit(5);
        if (pendentesAprovacaoError) throw pendentesAprovacaoError;
        setRecentesPendentesAprovacao(pendentesAprovacaoData || []);

      } catch (error) {
        console.error('Erro ao buscar dados para o dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Integradores Aprovados',
      value: stats.aprovados.toString(),
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: 'Total de parceiros ativos na plataforma'
    },
    {
      title: 'Aguardando Aprovação',
      value: stats.pendentesAprovacao.toString(),
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      description: 'Perfis completos pendentes de análise'
    },
    {
      title: 'Aguardando Cadastro',
      value: stats.pendentesCadastro.toString(),
      icon: <Users className="h-6 w-6 text-blue-600" />,
      description: 'Contas criadas que não completaram o perfil'
    },
    {
      title: 'Propostas Recebidas (Exemplo)',
      value: '156',
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      description: 'Este mês'
    }
  ];

  const recentProposals = [
    { client: 'João Silva', integrator: 'Solar Tech Brasil', value: 'R$ 45.000', status: 'Em Análise' },
    { client: 'Maria Santos', integrator: 'Eco Energia Sustentável', value: 'R$ 78.000', status: 'Aprovada' },
    { client: 'Pedro Costa', integrator: 'Norte Solar Energia', value: 'R$ 32.000', status: 'Documentos Solicitados' },
    { client: 'Ana Oliveira', integrator: 'Sul Fotovoltaica', value: 'R$ 125.000', status: 'Aprovada' },
  ];

  return (
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          </div>
          <p className="text-gray-600 mt-2">Visão geral do sistema Koposol Partner</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Integrators - Pending Approval */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Aguardando Aprovação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">Carregando...</div>
                ) : recentesPendentesAprovacao.length > 0 ? (
                  recentesPendentesAprovacao.map((integrator) => (
                    <div key={integrator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{integrator.nome_empresa}</p>
                        <p className="text-sm text-gray-600">{integrator.email}</p>
                      </div>
                      <span className='text-xs text-gray-500'>
                        {new Date(integrator.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">Nenhum integrador aguardando aprovação.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* New Accounts - Pending Profile Completion */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Novos Cadastros (Aguardando Perfil)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">Carregando...</div>
                ) : recentesPendentesCadastro.length > 0 ? (
                  recentesPendentesCadastro.map((integrator) => (
                    <div key={integrator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{integrator.email}</p>
                      </div>
                      <span className='text-xs text-gray-500'>
                        {new Date(integrator.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">Nenhuma nova conta aguardando cadastro.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Proposals */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Propostas Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProposals.map((proposal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{proposal.client}</p>
                      <p className="text-sm text-gray-600">{proposal.integrator}</p>
                      <p className="text-sm font-semibold text-purple-600">{proposal.value}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      proposal.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'Em Análise' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="border-0 shadow-md mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Performance do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de performance será implementado</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default AdminDashboard;
