
import React, { useState, useEffect } from 'react';
import IntegratorLayout from '@/components/IntegratorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const IntegratorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: 'Propostas Enviadas',
      value: '0',
      change: '0 este mês',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      description: 'Total de propostas submetidas'
    },
    {
      title: 'Propostas Aprovadas',
      value: '0',
      change: '0 este mês',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: 'Taxa de aprovação: 0%'
    },
    {
      title: 'Em Análise',
      value: '0',
      change: '0% do total',
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      description: 'Aguardando retorno'
    },
    {
      title: 'Volume Total',
      value: 'R$ 0',
      change: '0% vs mês anterior',
      icon: <DollarSign className="h-6 w-6 text-purple-600" />,
      description: 'Valor total das propostas'
    }
  ]);
  const [recentProposals, setRecentProposals] = useState([]);
  const [userId, setUserId] = useState(null);

  // Buscar dados do usuário atual
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          console.log('Usuário autenticado:', user.id);
        } else {
          console.log('Nenhum usuário autenticado');
          toast.error('Você precisa estar autenticado para acessar esta página');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  // Buscar propostas quando o userId estiver disponível
  useEffect(() => {
    if (!userId) return;

    const fetchProposals = async () => {
      try {
        console.log('Buscando propostas do Supabase...');
        
        // Buscar propostas do integrador atual
        const { data: propostas, error } = await supabase
          .from('propostas')
          .select('*')
          .eq('integrador_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        if (propostas && propostas.length > 0) {
          console.log('Propostas encontradas:', propostas.length);
          
          // Calcular estatísticas
          const total = propostas.length;
          const aprovadas = propostas.filter(p => p.status === 'aprovada').length;
          const emAnalise = propostas.filter(p => p.status === 'em_analise').length;
          const taxaAprovacao = total > 0 ? Math.round((aprovadas / total) * 100) : 0;
          
          // Calcular volume total (soma dos valores)
          const volumeTotal = propostas.reduce((acc, curr) => acc + (curr.valor_proposta || 0), 0);
          const volumeFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(volumeTotal);
          
          // Propostas do mês atual
          const dataAtual = new Date();
          const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
          const propostasMes = propostas.filter(p => new Date(p.created_at) >= primeiroDiaMes).length;
          
          // Atualizar estatísticas
          setStats([
            {
              title: 'Propostas Enviadas',
              value: total.toString(),
              change: `+${propostasMes} este mês`,
              icon: <FileText className="h-6 w-6 text-blue-600" />,
              description: 'Total de propostas submetidas'
            },
            {
              title: 'Propostas Aprovadas',
              value: aprovadas.toString(),
              change: `${taxaAprovacao}% de aprovação`,
              icon: <CheckCircle className="h-6 w-6 text-green-600" />,
              description: `Taxa de aprovação: ${taxaAprovacao}%`
            },
            {
              title: 'Em Análise',
              value: emAnalise.toString(),
              change: `${Math.round((emAnalise / total) * 100)}% do total`,
              icon: <Clock className="h-6 w-6 text-orange-600" />,
              description: 'Aguardando retorno'
            },
            {
              title: 'Volume Total',
              value: volumeFormatado,
              change: 'Valor acumulado',
              icon: <DollarSign className="h-6 w-6 text-purple-600" />,
              description: 'Valor total das propostas'
            }
          ]);
          
          // Preparar propostas recentes para exibição
          const recentProposalsData = propostas.slice(0, 5).map(p => ({
            client: p.nome_cliente || 'Cliente',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor_proposta || 0),
            status: p.status === 'aprovada' ? 'Aprovada' : 
                   p.status === 'em_analise' ? 'Em Análise' : 
                   p.status === 'documentos_solicitados' ? 'Documentos Solicitados' : 
                   p.status === 'rejeitada' ? 'Rejeitada' : 'Pendente',
            date: new Date(p.created_at).toLocaleDateString('pt-BR')
          }));
          
          setRecentProposals(recentProposalsData);
          toast.success(`${propostas.length} propostas carregadas do banco de dados`);
        } else {
          console.log('Nenhuma proposta encontrada no banco de dados');
          setRecentProposals([]);
          toast.info('Você ainda não possui propostas cadastradas');
        }
      } catch (error) {
        console.error('Erro ao buscar propostas do Supabase:', error);
        toast.error('Erro ao carregar dados das propostas');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [userId]);

  const tips = [
    {
      title: 'Agilize suas aprovações',
      description: 'Certifique-se de que todos os documentos estão completos antes de enviar a proposta.'
    },
    {
      title: 'Use o link de proposta',
      description: 'Permita que seus clientes preencham diretamente os dados através do link gerado.'
    },
    {
      title: 'Acompanhe o status',
      description: 'Monitore regularmente o kanban para ver o progresso de suas propostas.'
    }
  ];

  return (
    <IntegratorLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Integrador</h1>
          <p className="text-gray-600 mt-2">Acompanhe o desempenho das suas propostas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-green-600 font-medium">
                  {stat.change}
                </div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Proposals */}
          <div className="lg:col-span-2">
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
                        <p className="text-sm text-gray-600">{proposal.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600">{proposal.value}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proposal.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                          proposal.status === 'Em Análise' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips and Insights */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Dicas de Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-1">{tip.title}</h4>
                      <p className="text-sm text-purple-700">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>Próximos Passos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">Verificar propostas pendentes de documentos</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">Acompanhar propostas em análise</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">Preparar novos leads para submissão</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </IntegratorLayout>
  );
};

export default IntegratorDashboard;
