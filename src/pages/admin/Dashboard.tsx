
import React, { useState, useEffect } from 'react';

import { LayoutDashboard, Users, FileText, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [integradores, setIntegradores] = useState([]);
  const [totalIntegradores, setTotalIntegradores] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carregar dados dos integradores do Supabase
  useEffect(() => {
    const fetchIntegradores = async () => {
      try {
        console.log('Buscando integradores do Supabase...');
        
        // Buscar dados reais do Supabase
        const { data, error, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });
        
        if (error) {
          throw error;
        }
        
        console.log('Integradores encontrados:', data);
        
        // Ordenar por data de criação (mais recentes primeiro)
        const integradoresOrdenados = data?.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) || [];
        
        setIntegradores(integradoresOrdenados);
        setTotalIntegradores(count || 0);
        
      } catch (error) {
        console.error('Erro ao buscar integradores do Supabase:', error);
        toast.error('Erro ao carregar dados dos integradores');
        // Em caso de erro, manter o array vazio para não mostrar dados incorretos
        setIntegradores([]);
        setTotalIntegradores(0);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegradores();
  }, []);

  const stats = [
    {
      title: 'Integradores Cadastrados',
      value: totalIntegradores.toString(),
      change: '+12%',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      description: 'Total de parceiros ativos'
    },
    {
      title: 'Propostas Recebidas',
      value: '156',
      change: '+8%',
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      description: 'Este mês'
    },
    {
      title: 'Propostas Aprovadas',
      value: '89',
      change: '+15%',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: 'Taxa de aprovação: 57%'
    },
    {
      title: 'Aguardando Análise',
      value: '23',
      change: '-5%',
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      description: 'Pendentes de revisão'
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
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500">vs mês anterior</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Integrators */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Integradores Cadastrados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">Carregando...</div>
                ) : integradores.length > 0 ? (
                  integradores.map((integrator, index) => (
                    <div key={integrator.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{integrator.nome_empresa}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(integrator.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-500">{integrator.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integrator.status === 'aprovado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {integrator.status === 'pendente' ? 'Pendente' : 'Aprovado'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">Nenhum integrador encontrado</div>
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
