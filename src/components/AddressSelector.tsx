
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddressSelectorProps {
  onAddressChange: (address: { state: string; city: string; neighborhood: string }) => void;
  selectedAddress: { state: string; city: string; neighborhood: string };
}

// Interfaces para os dados do Supabase
interface Estado {
  id: number;
  codigo: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
  estado_id: number;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onAddressChange, selectedAddress }) => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState({
    estados: false,
    cidades: false
  });

  // Buscar estados do Supabase
  useEffect(() => {
    const fetchEstados = async () => {
      setLoading(prev => ({ ...prev, estados: true }));
      try {
        const { data, error } = await supabase
          .from('estados')
          .select('*')
          .order('nome', { ascending: true });

        if (error) {
          throw error;
        }

        setEstados(data || []);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        toast.error('Erro ao carregar estados. Tente novamente mais tarde.');
      } finally {
        setLoading(prev => ({ ...prev, estados: false }));
      }
    };

    fetchEstados();
  }, []);

  // Buscar cidades quando o estado for selecionado
  useEffect(() => {
    if (!selectedAddress.state) {
      setCidades([]);
      return;
    }

    const fetchCidades = async () => {
      setLoading(prev => ({ ...prev, cidades: true }));
      try {
        const estadoSelecionado = estados.find(estado => estado.codigo === selectedAddress.state);
        if (!estadoSelecionado) return;

        const { data, error } = await supabase
          .from('cidades')
          .select('*')
          .eq('estado_id', estadoSelecionado.id)
          .order('nome', { ascending: true });

        if (error) {
          throw error;
        }

        setCidades(data || []);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        toast.error('Erro ao carregar cidades. Tente novamente mais tarde.');
      } finally {
        setLoading(prev => ({ ...prev, cidades: false }));
      }
    };

    fetchCidades();
  }, [selectedAddress.state, estados]);



  const handleStateChange = (state: string) => {
    const newAddress = { state, city: '', neighborhood: '' };
    onAddressChange(newAddress);
  };

  const handleCityChange = (city: string) => {
    const newAddress = { ...selectedAddress, city, neighborhood: '' };
    onAddressChange(newAddress);
  };

  const handleNeighborhoodChange = (neighborhood: string) => {
    const newAddress = { ...selectedAddress, neighborhood };
    onAddressChange(newAddress);
  };

  return (
    <div className="space-y-4">
      {/* Estado e Cidade lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estado *</Label>
          <Select onValueChange={handleStateChange} value={selectedAddress.state} disabled={loading.estados}>
            <SelectTrigger>
              <SelectValue placeholder={loading.estados ? "Carregando estados..." : "Selecione o estado"} />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.id} value={estado.codigo}>
                  {estado.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cidade *</Label>
          <Select 
            onValueChange={handleCityChange} 
            value={selectedAddress.city}
            disabled={!selectedAddress.state || loading.cidades}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                loading.cidades ? "Carregando cidades..." :
                selectedAddress.state ? "Selecione a cidade" : "Primeiro selecione o estado"
              } />
            </SelectTrigger>
            <SelectContent>
              {cidades.map((cidade) => (
                <SelectItem key={cidade.id} value={cidade.nome}>
                  {cidade.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bairro em linha separada - campo livre */}
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro *</Label>
        <input
          id="neighborhood"
          type="text"
          value={selectedAddress.neighborhood}
          onChange={(e) => handleNeighborhoodChange(e.target.value)}
          placeholder={selectedAddress.city ? "Digite o nome do bairro" : "Primeiro selecione a cidade"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedAddress.city}
          required
        />
      </div>
    </div>
  );
};

export default AddressSelector;
