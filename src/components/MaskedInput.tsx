import React from 'react';
import { Input } from '@/components/ui/input';
import { formatCPF, formatCNPJ, formatPhone, formatCEP, formatCurrency } from '@/utils/masks';

interface MaskedInputProps {
  type: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'currency';
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  id,
  className
}) => {
  const formatValue = (inputValue: string): string => {
    switch (type) {
      case 'cpf':
        return formatCPF(inputValue);
      case 'cnpj':
        return formatCNPJ(inputValue);
      case 'phone':
        return formatPhone(inputValue);
      case 'cep':
        return formatCEP(inputValue);
      case 'currency':
        return formatCurrency(inputValue);
      default:
        return inputValue;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatValue(e.target.value);
    onChange(formatted);
  };

  const getMaxLength = (): number => {
    switch (type) {
      case 'cpf':
        return 14; // 000.000.000-00
      case 'cnpj':
        return 18; // 00.000.000/0000-00
      case 'phone':
        return 15; // (00) 00000-0000
      case 'cep':
        return 9; // 00000-000
      case 'currency':
        return 20; // Valor máximo razoável para moeda
      default:
        return undefined;
    }
  };

  return (
    <Input
      id={id}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      maxLength={getMaxLength()}
      className={className}
    />
  );
};

export default MaskedInput;
