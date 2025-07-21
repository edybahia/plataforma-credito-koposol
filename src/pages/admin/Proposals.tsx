import { useEffect, useMemo, useState } from 'react';
import CreateProposalModal from '@/components/proposals/CreateProposalModal';
import { KanbanSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Tipos e Interfaces
type Status = 'Backlog' | 'Em Andamento' | 'Revisão' | 'Concluído';

interface Proposal {
  id: string;
  nome_cliente: string;
  valor_proposta: number;
  status: Status;
  created_at: string;
}

interface Column {
  id: Status;
  title: string;
}

const columns: Column[] = [
  { id: 'Backlog', title: 'Backlog' },
  { id: 'Em Andamento', title: 'Em Andamento' },
  { id: 'Revisão', title: 'Revisão' },
  { id: 'Concluído', title: 'Concluído' },
];

// Componente do Cartão da Proposta
function ProposalCard({ proposal }: { proposal: Proposal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: proposal.id,
    data: { type: 'Proposal', proposal },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border rounded-lg shadow-sm mb-2 cursor-grab active:cursor-grabbing"
    >
      <p className="font-semibold text-lg">{proposal.nome_cliente}</p>
      <p className="text-sm text-gray-600">
        Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valor_proposta)}
      </p>
    </div>
  );
}

// Componente da Coluna do Kanban
function ColumnContainer({ column, proposals }: { column: Column; proposals: Proposal[] }) {
  const proposalsIds = useMemo(() => proposals.map((p) => p.id), [proposals]);

  const { setNodeRef } = useSortable({ id: column.id, data: { type: 'Column', column } });

  return (
    <div ref={setNodeRef} className="w-80 bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
      <h2 className="text-lg font-bold">{column.title}</h2>
      <div className="flex flex-col gap-2">
        <SortableContext items={proposalsIds}>
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

// Página Principal
const ProposalsPage = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const proposalsByColumn = useMemo(() => {
    const grouped: Record<Status, Proposal[]> = { 'Backlog': [], 'Em Andamento': [], 'Revisão': [], 'Concluído': [] };
    proposals.forEach((p) => grouped[p.status].push(p));
    return grouped;
  }, [proposals]);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('propostas').select('*').order('created_at', { ascending: false });
      if (error) {
        toast.error('Falha ao buscar as propostas.');
      } else {
        setProposals(data as Proposal[]);
      }
      setLoading(false);
    };
    fetchProposals();
  }, []);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));

  const handleProposalCreated = (newProposal: Proposal) => {
    setProposals((prev) => [newProposal, ...prev]);
  };

    const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAProposal = active.data.current?.type === 'Proposal';
    if (!isActiveAProposal) return;

    // Determina a nova coluna de status
    const overIsColumn = over.data.current?.type === 'Column';
    const overIsProposal = over.data.current?.type === 'Proposal';

    if (!overIsColumn && !overIsProposal) return;

    const activeProposal = proposals.find((p) => p.id === activeId);
    if (!activeProposal) return;

    const newStatus: Status = overIsColumn
      ? (overId as Status)
      : proposals.find((p) => p.id === overId)?.status || activeProposal.status;

    if (activeProposal.status === newStatus) return;

    // Atualização Otimista da UI
    const originalProposals = [...proposals];
    setProposals((prev) =>
      prev.map((p) => (p.id === activeId ? { ...p, status: newStatus } : p))
    );

    // Atualiza o banco de dados
    const { error } = await supabase
      .from('propostas')
      .update({ status: newStatus })
      .eq('id', activeId);

    if (error) {
      toast.error('Falha ao atualizar o status da proposta.');
      // Reverte a UI em caso de erro
      setProposals(originalProposals);
    } else {
      toast.success('Proposta movida com sucesso!');
    }
  };

  if (loading) return <div className="text-center p-10">Carregando propostas...</div>;

  return (
    <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
            <KanbanSquare className="h-8 w-8" />
                    <div className="flex-1">
          <h1 className="text-3xl font-bold">Kanban de Propostas</h1>
        </div>
        <CreateProposalModal onProposalCreated={handleProposalCreated} />
        </div>
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto">
                {columns.map((col) => (
                    <ColumnContainer key={col.id} column={col} proposals={proposalsByColumn[col.id]} />
                ))}
            </div>
        </DndContext>
    </div>
  );
};

export default ProposalsPage;
