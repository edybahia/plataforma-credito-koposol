import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, CheckCircle, XCircle, Loader2, MoreVertical, Eye, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Integrator {
  id: string;
  nome_empresa: string;
  email: string;
  status: 'pendente_cadastro' | 'pendente_aprovacao' | 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
  cnpj?: string;
  telefone?: string;
  responsavel?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  contrato_social_url?: string;
  cartao_cnpj_url?: string;
}

const IntegratorsPage = () => {
    const [integrators, setIntegrators] = useState<Integrator[]>([]);
  const [stats, setStats] = useState({ weekly: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedIntegrator, setSelectedIntegrator] = useState<Integrator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIntegratorData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('integradores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao buscar dados dos integradores.');
      console.error(error);
      setIntegrators([]);
    } else if (data) {
      const typedData: Integrator[] = data as Integrator[];
      const now = new Date();
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const weeklyCount = typedData.filter(i => new Date(i.created_at) >= oneWeekAgo).length;
      const monthlyCount = typedData.filter(i => new Date(i.created_at) >= firstDayOfMonth).length;
      
      setStats({ weekly: weeklyCount, monthly: monthlyCount });
      setIntegrators(typedData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIntegratorData();
  }, [fetchIntegratorData]);

  const handleUpdateStatus = async (id: string, newStatus: 'aprovado' | 'rejeitado') => {
    console.log('Atualizando status:', { id, newStatus });

    try {
      setLoading(true);
      // Primeiro, verifica se o registro existe
      const { data: checkData, error: checkError } = await supabase
        .from('integradores')
        .select('id, status')
        .eq('id', id)
        .single();

      console.log('Registro atual:', checkData);

      if (checkError || !checkData) {
        throw new Error('Integrador não encontrado');
      }

      // Depois, faz a atualização
      const { data, error } = await supabase
        .from('integradores')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      console.log('Resultado da atualização:', { data, error });

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error(`Falha ao ${newStatus === 'aprovado' ? 'aprovar' : 'rejeitar'} o integrador.`);
        return;
      }

      // Atualiza a lista local
      setIntegrators(prevIntegrators =>
        prevIntegrators.map(integrator =>
          integrator.id === id
            ? { ...integrator, status: newStatus }
            : integrator
        )
      );

      toast.success(`Integrador ${newStatus === 'aprovado' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      await fetchIntegratorData(); // Atualiza os dados do servidor
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do integrador');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (integrator: Integrator) => {
    setSelectedIntegrator(integrator);
    setIsModalOpen(true);
  };

  const pendingCadastroIntegrators = integrators.filter(i => i.status === 'pendente_cadastro');
  const pendingAprovacaoIntegrators = integrators.filter(i => i.status === 'pendente_aprovacao' || i.status === 'pendente');
  const approvedIntegrators = integrators.filter(i => i.status === 'aprovado');
  const rejectedIntegrators = integrators.filter(i => i.status === 'rejeitado');

  const statCards = [
    { title: 'Pendente Cadastro', value: pendingCadastroIntegrators.length, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: 'Pendente Aprovação', value: pendingAprovacaoIntegrators.length, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: 'Aprovados', value: approvedIntegrators.length, icon: <CheckCircle className="h-4 w-4 text-muted-foreground" /> },
    { title: 'Rejeitados', value: rejectedIntegrators.length, icon: <XCircle className="h-4 w-4 text-muted-foreground" /> },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data</CardTitle>
                 <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Date().toLocaleDateString('pt-BR')}</div>
              </CardContent>
            </Card>
      </div>

      {selectedIntegrator && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Integrador</DialogTitle>
              <DialogDescription>
                Análise completa do cadastro de {selectedIntegrator.nome_empresa}.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="empresa" className="grid gap-4 py-4">
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value="empresa">Dados da Empresa</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>
              <TabsContent value="empresa">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                    <p>{selectedIntegrator.nome_empresa}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                    <p>{selectedIntegrator.cnpj || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{selectedIntegrator.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p>{selectedIntegrator.telefone || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                    <p>{selectedIntegrator.responsavel || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge>{selectedIntegrator.status}</Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="endereco">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
                   <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">CEP</p>
                    <p>{selectedIntegrator.cep || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Logradouro</p>
                    <p>{selectedIntegrator.logradouro || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Número</p>
                    <p>{selectedIntegrator.numero || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Complemento</p>
                    <p>{selectedIntegrator.complemento || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                    <p>{selectedIntegrator.bairro || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                    <p>{selectedIntegrator.cidade || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                    <p>{selectedIntegrator.estado || 'Não informado'}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documentos">
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="font-medium">Contrato Social</h4>
                    {selectedIntegrator.contrato_social_url ? (
                      <a href={selectedIntegrator.contrato_social_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Visualizar Contrato Social
                      </a>
                    ) : (<p className="text-sm text-muted-foreground">Não enviado.</p>)}
                  </div>
                  <div>
                    <h4 className="font-medium">Cartão CNPJ</h4>
                    {selectedIntegrator.cartao_cnpj_url ? (
                      <a href={selectedIntegrator.cartao_cnpj_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Visualizar Cartão CNPJ
                      </a>
                    ) : (<p className="text-sm text-muted-foreground">Não enviado.</p>)}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8" /> 
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Gerenciar Integradores</h1>
        </div>
      </div>
      
      {/* Status cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente Cadastro</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : pendingCadastroIntegrators.length}</div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente Aprovação</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : pendingAprovacaoIntegrators.length}</div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : approvedIntegrators.length}</div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : rejectedIntegrators.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendente_aprovacao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendente_cadastro">Pendente Cadastro</TabsTrigger>
          <TabsTrigger value="pendente_aprovacao">Pendente Aprovação</TabsTrigger>
          <TabsTrigger value="aprovado">Aprovados</TabsTrigger>
          <TabsTrigger value="rejeitado">Rejeitados</TabsTrigger>
        </TabsList>
        <TabsContent value="pendente_cadastro">
          {loading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : pendingCadastroIntegrators.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground"><p>Nenhum integrador com cadastro pendente.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {pendingCadastroIntegrators.map((integrator) => (
                <Card key={integrator.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{integrator.email}</p>
                      <p className="text-sm text-muted-foreground">Cadastro em: {new Date(integrator.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="pendente_aprovacao">
          {loading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : pendingAprovacaoIntegrators.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground"><p>Nenhum integrador aguardando aprovação.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {pendingAprovacaoIntegrators.map((integrator) => (
              <Card key={integrator.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{integrator.nome_empresa}</p>
                    <p className="text-sm text-muted-foreground">{integrator.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(integrator)}>
                      <Eye className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUpdateStatus(integrator.id, 'aprovado')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aprovar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(integrator.id, 'rejeitado')} className="text-red-600">
                          <XCircle className="mr-2 h-4 w-4" />
                          Rejeitar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </TabsContent>
        <TabsContent value="aprovado">
          {loading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : approvedIntegrators.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground"><p>Nenhum integrador aprovado encontrado.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {approvedIntegrators.map((integrator) => (
                <Card key={integrator.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{integrator.nome_empresa}</p>
                      <p className="text-sm text-muted-foreground">{integrator.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(integrator)}><Eye className="h-5 w-5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="rejeitado">
          {loading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : rejectedIntegrators.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground"><p>Nenhum integrador rejeitado encontrado.</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {rejectedIntegrators.map((integrator) => (
                <Card key={integrator.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{integrator.nome_empresa}</p>
                      <p className="text-sm text-muted-foreground">{integrator.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(integrator)}><Eye className="h-5 w-5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratorsPage;
