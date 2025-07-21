import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// 1. Definir o schema de validação com Zod
const formSchema = z.object({
  nome_cliente: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  valor_proposta: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
});

export type ProposalFormValues = z.infer<typeof formSchema>;

interface ProposalFormProps {
  onSubmit: (values: ProposalFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<ProposalFormValues>;
}

// 2. Criar o componente do formulário
const ProposalForm = ({ onSubmit, isSubmitting, defaultValues }: ProposalFormProps) => {
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      nome_cliente: '',
      valor_proposta: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="valor_proposta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Proposta (R$)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 50000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Proposta'}
        </Button>
      </form>
    </Form>
  );
};

export default ProposalForm;
