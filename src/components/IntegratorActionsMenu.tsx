import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MoreVertical, Edit, Trash2, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Integrator {
  id: string;
  nome_empresa: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  nome_responsavel?: string;
  cpf_responsavel?: string;
  status: string;
}

interface IntegratorActionsMenuProps {
  integrator: Integrator;
  onUpdate: (updatedIntegrator: Integrator) => void;
  onDelete: (integratorId: string) => void;
}

const IntegratorActionsMenu: React.FC<IntegratorActionsMenuProps> = ({
  integrator,
  onUpdate,
  onDelete,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nome_empresa: integrator.nome_empresa,
    email: integrator.email,
    telefone: integrator.telefone,
    endereco: integrator.endereco,
    cnpj: integrator.cnpj,
    nome_responsavel: integrator.nome_responsavel || '',
    cpf_responsavel: integrator.cpf_responsavel || '',
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          nome_empresa: editForm.nome_empresa,
          email: editForm.email,
          telefone: editForm.telefone,
          endereco: editForm.endereco,
          cnpj: editForm.cnpj,
          nome_responsavel: editForm.nome_responsavel,
          cpf_responsavel: editForm.cpf_responsavel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', integrator.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar integrador:', error);
        toast.error('Erro ao atualizar integrador');
        return;
      }

      const updatedIntegrator = { ...integrator, ...editForm };
      onUpdate(updatedIntegrator);
      setIsEditDialogOpen(false);
      toast.success('Integrador atualizado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar integrador');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', integrator.id);

      if (error) {
        console.error('Erro ao deletar integrador:', error);
        toast.error('Erro ao deletar integrador');
        return;
      }

      onDelete(integrator.id);
      setIsDeleteDialogOpen(false);
      toast.success('Integrador removido com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao deletar integrador');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Contato - ${integrator.nome_empresa}`);
    const body = encodeURIComponent(`Olá ${integrator.nome_empresa},\n\nEscrevo para...`);
    window.open(`mailto:${integrator.email}?subject=${subject}&body=${body}`);
  };

  const handleCall = () => {
    window.open(`tel:${integrator.telefone}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar dados
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Enviar e-mail
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCall}>
            <Phone className="h-4 w-4 mr-2" />
            Ligar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Integrador</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_empresa">Nome da Empresa *</Label>
                <Input
                  id="nome_empresa"
                  value={editForm.nome_empresa}
                  onChange={(e) => setEditForm({ ...editForm, nome_empresa: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={editForm.cnpj}
                  onChange={(e) => setEditForm({ ...editForm, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="email@empresa.com"
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={editForm.telefone}
                  onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <Label htmlFor="nome_responsavel">Nome do Responsável</Label>
                <Input
                  id="nome_responsavel"
                  value={editForm.nome_responsavel}
                  onChange={(e) => setEditForm({ ...editForm, nome_responsavel: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              
              <div>
                <Label htmlFor="cpf_responsavel">CPF do Responsável</Label>
                <Input
                  id="cpf_responsavel"
                  value={editForm.cpf_responsavel}
                  onChange={(e) => setEditForm({ ...editForm, cpf_responsavel: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="endereco">Endereço Completo *</Label>
              <Textarea
                id="endereco"
                value={editForm.endereco}
                onChange={(e) => setEditForm({ ...editForm, endereco: e.target.value })}
                placeholder="Rua, número, bairro, cidade - UF, CEP"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              disabled={loading || !editForm.nome_empresa || !editForm.email}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Tem certeza que deseja remover o integrador <strong>{integrator.nome_empresa}</strong>?
            </p>
            <p className="text-sm text-red-600">
              Esta ação não pode ser desfeita. Todas as propostas associadas a este integrador também serão removidas.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Removendo...' : 'Confirmar Remoção'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegratorActionsMenu;