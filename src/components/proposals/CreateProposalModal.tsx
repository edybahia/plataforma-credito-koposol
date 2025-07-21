import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProposalForm, { ProposalFormValues } from './ProposalForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface CreateProposalModalProps {
  onProposalCreated: (newProposal: any) => void;
}

const CreateProposalModal = ({ onProposalCreated }: CreateProposalModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, profile } = useAuth();

  const handleSubmit = async (values: ProposalFormValues) => {
    if (!user) {
      toast.error('Você precisa estar logado para criar uma proposta.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('propostas')
        .insert([
          {
            ...values,
                        // Se for admin, o integrador_id é nulo. Se for integrador, associa ao seu ID.
            integrador_id: profile?.tipo_usuario === 'admin' ? null : user.id,
            status: 'Backlog', // Novas propostas começam no Backlog
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Proposta criada com sucesso!');
      onProposalCreated(data);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast.error('Falha ao criar a proposta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Proposta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Proposta</DialogTitle>
        </DialogHeader>
        <ProposalForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalModal;
