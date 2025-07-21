
import React, { useState, useEffect } from 'react';
import IntegratorLayout from '@/components/IntegratorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, MessageSquare, DollarSign, Calendar, User, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const IntegratorKanban = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const columns = [
    { 
      id: 'sent', 
      title: 'Enviada', 
      color: 'bg-blue-50 border-blue-200',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'in_analysis', 
      title: 'Em Análise', 
      color: 'bg-yellow-50 border-yellow-200',
      icon: <Clock className="h-4 w-4 text-yellow-600" />,
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    { 
      id: 'docs_requested', 
      title: 'Documentos Solicitados', 
      color: 'bg-orange-50 border-orange-200',
      icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    { 
      id: 'approved', 
      title: 'Aprovada', 
      color: 'bg-green-50 border-green-200',
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      badgeColor: 'bg-green-100 text-green-800'
    },
    { 
      id: 'rejected', 
      title: 'Rejeitada', 
      color: 'bg-red-50 border-red-200',
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      badgeColor: 'bg-red-100 text-red-800'
    }
  ];

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
        const { data: propostasData, error } = await supabase
          .from('propostas')
          .select('*, comentarios(*)')
          .eq('integrador_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        if (propostasData && propostasData.length > 0) {
          console.log('Propostas encontradas:', propostasData.length);
          
          // Mapear dados para o formato esperado pelo componente
          const propostasFormatadas = propostasData.map(proposta => ({
            id: proposta.id,
            clientName: proposta.nome_cliente || 'Cliente sem nome',
            value: proposta.valor_proposta || 0,
            status: mapStatusToKanban(proposta.status),
            createdAt: proposta.created_at,
            installments: proposta.prazo || 0,
            tags: [proposta.tipo_proposta || 'Residencial'],
            comments: Array.isArray(proposta.comentarios) ? proposta.comentarios.map((comentario: any) => ({
              author: comentario.autor || 'Sistema',
              message: comentario.mensagem || '',
              date: new Date(comentario.created_at).toLocaleString('pt-BR')
            })) : []
          }));
          
          setProposals(propostasFormatadas);
          toast.success(`${propostasFormatadas.length} propostas carregadas do banco de dados`);
        } else {
          console.log('Nenhuma proposta encontrada no banco de dados');
          setProposals([]);
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

  // Função para mapear status do banco para o formato do Kanban
  const mapStatusToKanban = (status: string): string => {
    switch (status) {
      case 'enviada': return 'sent';
      case 'em_analise': return 'in_analysis';
      case 'documentos_solicitados': return 'docs_requested';
      case 'aprovada': return 'approved';
      case 'rejeitada': return 'rejected';
      default: return 'sent';
    }
  };

  const getProposalsByStatus = (status: string) => {
    if (!proposals) return [];
    
    return proposals.filter(proposal => 
      proposal.status === status && 
      (proposal.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );
  };

  const addComment = async (proposalId: string) => {
    if (!newComment.trim()) return;
    
    try {
      // Adicionar comentário no Supabase
      const { error } = await supabase
        .from('comentarios')
        .insert([
          {
            proposta_id: proposalId,
            autor: 'Integrador',
            mensagem: newComment,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Comentário adicionado com sucesso!');
      setNewComment('');
      
      // Recarregar propostas para mostrar o novo comentário
      if (userId) {
        const { data: propostasData, error: fetchError } = await supabase
          .from('propostas')
          .select('*, comentarios(*)')
          .eq('integrador_id', userId)
          .order('created_at', { ascending: false });
          
        if (fetchError) throw fetchError;
        
        // Atualizar propostas com os novos dados
        if (propostasData) {
          // Mapear dados para o formato esperado pelo componente
          const propostasFormatadas = propostasData.map(proposta => ({
            id: proposta.id,
            clientName: proposta.nome_cliente || 'Cliente sem nome',
            value: proposta.valor_proposta || 0,
            status: mapStatusToKanban(proposta.status),
            createdAt: proposta.created_at,
            installments: proposta.prazo || 0,
            tags: [proposta.tipo_proposta || 'Residencial'],
            comments: Array.isArray(proposta.comentarios) ? proposta.comentarios.map((comentario: any) => ({
              author: comentario.autor || 'Sistema',
              message: comentario.mensagem || '',
              date: new Date(comentario.created_at).toLocaleString('pt-BR')
            })) : []
          }));
          
          setProposals(propostasFormatadas);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <IntegratorLayout>
      <div className="p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Propostas</h1>
          <p className="text-gray-600 mt-2">Acompanhe o status de todas as suas propostas</p>
        </div>

        {/* Search */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px]">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <Card className={`border-2 ${column.color} shadow-sm`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-center flex items-center justify-center gap-2">
                    {column.icon}
                    <span>{column.title}</span>
                    <Badge className={column.badgeColor}>
                      {getProposalsByStatus(column.id).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              <div className="space-y-3">
                {getProposalsByStatus(column.id).map((proposal) => (
                  <Card 
                    key={proposal.id} 
                    className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50 cursor-pointer group"
                  >
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        {/* Header do Card */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">
                              {proposal.clientName}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {proposal.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Valor em Destaque */}
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-gray-700">Valor</span>
                            </div>
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(proposal.value)}
                            </span>
                          </div>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>Criado em {proposal.createdAt}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-3 w-3" />
                            <span>{proposal.installments} parcelas</span>
                          </div>
                        </div>

                        {/* Footer do Card */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setSelectedProposal(proposal)}
                                className="hover:bg-primary hover:text-white transition-colors"
                              >
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalhes da Proposta - {proposal.clientName}</DialogTitle>
                              </DialogHeader>
                              
                              {selectedProposal && (
                                <div className="space-y-6">
                                  {/* Proposal Info */}
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><strong>Cliente:</strong> {selectedProposal.clientName}</div>
                                    <div><strong>Valor:</strong> {formatCurrency(selectedProposal.value)}</div>
                                    <div><strong>Parcelas:</strong> {selectedProposal.installments}x</div>
                                    <div><strong>Data:</strong> {selectedProposal.createdAt}</div>
                                  </div>

                                  {/* Tags */}
                                  <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">Etiquetas</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedProposal.tags.map((tag: string, index: number) => (
                                        <Badge key={index} variant="outline">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Comments */}
                                  <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">Comentários</h4>
                                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                                      {selectedProposal.comments.map((comment: any, index: number) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                          <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-sm">{comment.author}</span>
                                            <span className="text-xs text-gray-500">{comment.date}</span>
                                          </div>
                                          <p className="text-sm text-gray-700">{comment.message}</p>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Textarea
                                        placeholder="Adicionar comentário..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[80px]"
                                      />
                                      <Button onClick={() => addComment(selectedProposal.id)} size="sm">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Adicionar Comentário
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500 font-medium">{proposal.comments.length}</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </IntegratorLayout>
  );
};

export default IntegratorKanban;
