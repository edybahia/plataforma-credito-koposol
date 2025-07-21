import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KanbanSquare, Loader2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Proposal {
  id: string;
  nome_cliente: string;
  descricao?: string;
  valor_proposta?: number;
  status: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
}

interface Column {
  id: string;
  title: string;
  proposals: Proposal[];
}

const initialColumns: { [key: string]: Column } = {
  'Nova Proposta': { id: 'Nova Proposta', title: 'Novas Propostas', proposals: [] },
  'Em Análise': { id: 'Em Análise', title: 'Em Análise', proposals: [] },
  'Pendente': { id: 'Pendente', title: 'Pendentes', proposals: [] },
  'Aprovada': { id: 'Aprovada', title: 'Aprovadas', proposals: [] },
  'Rejeitada': { id: 'Rejeitada', title: 'Rejeitadas', proposals: [] },
};

const priorityColors = {
  'Baixa': 'bg-blue-100 text-blue-800',
  'Média': 'bg-yellow-100 text-yellow-800',
  'Alta': 'bg-red-100 text-red-800',
};

const KanbanCard = ({ proposal, index }: { proposal: Proposal; index: number }) => (
  <Draggable draggableId={proposal.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`mb-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
      >
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-sm text-gray-800 break-words">{proposal.nome_cliente}</p>
            <Badge className={`${priorityColors[proposal.prioridade]} text-xs`}>{proposal.prioridade}</Badge>
          </div>
          {proposal.descricao && <p className="text-xs text-gray-600 mb-2">{proposal.descricao}</p>}
          {proposal.valor_proposta && <p className="text-sm font-bold text-gray-800">R$ {proposal.valor_proposta.toLocaleString('pt-BR')}</p>}
        </CardContent>
      </div>
    )}
  </Draggable>
);

const KanbanColumn = ({ column }: { column: Column }) => (
  <Droppable droppableId={column.id}>
    {(provided, snapshot) => (
      <div className="bg-gray-100/80 rounded-lg p-3 w-72 md:w-80 flex-shrink-0 flex flex-col">
        <h3 className="font-bold text-base text-gray-700 mb-4 px-1">{column.title} ({column.proposals.length})</h3>
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-grow min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-gray-200/50' : ''}`}
        >
          {column.proposals.map((proposal, index) => (
            <KanbanCard key={proposal.id} proposal={proposal} index={index} />
          ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
);

const KanbanPage = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('propostas').select('*');

      if (error) {
        toast.error('Falha ao buscar as propostas.');
      } else if (data) {
        const newColumns = JSON.parse(JSON.stringify(initialColumns));
        data.forEach((proposal: any) => {
          if (newColumns[proposal.status]) {
            newColumns[proposal.status].proposals.push(proposal);
          }
        });
        setColumns(newColumns);
      }
      setLoading(false);
    };

    fetchProposals();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const endColumn = columns[destination.droppableId];
    const movedProposal = startColumn.proposals.find(p => p.id === draggableId);

    if (!movedProposal) return;

    // Optimistic UI Update
    const newStartProposals = Array.from(startColumn.proposals);
    newStartProposals.splice(source.index, 1);

    const newEndProposals = Array.from(endColumn.proposals);
    newEndProposals.splice(destination.index, 0, movedProposal);

    const newColumnsState = {
      ...columns,
      [source.droppableId]: { ...startColumn, proposals: newStartProposals },
      [destination.droppableId]: { ...endColumn, proposals: newEndProposals },
    };
    setColumns(newColumnsState);

    // Update Supabase
    const { error } = await supabase
      .from('propostas')
      .update({ status: destination.droppableId })
      .eq('id', draggableId);

    if (error) {
      toast.error('Falha ao atualizar o status da proposta.');
      // Revert UI on error
      setColumns(columns);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <KanbanSquare className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Kanban de Propostas</h1>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center flex-grow">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto flex-grow pb-4">
            {Object.values(columns).map(column => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default KanbanPage;
