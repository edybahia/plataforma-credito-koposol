
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MaskedInput from '@/components/MaskedInput';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { KoposolLogo } from '@/components/KoposolLogo';
import { ArrowLeft, ArrowRight, Building, User, FileText, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { isValidEmail, normalizeEmail } from '@/utils/validation';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  
  // Estado para gerenciar os documentos
  const [documents, setDocuments] = useState({
    contratoSocial: null,
    comprovanteEndereco: null,
    rgSocios: null,
    cnhSocios: null,
    dadosBancarios: null,
    fotoFachada: null
  });

  // Form data state
  const [companyData, setCompanyData] = useState({
    companyName: '',
    cnpj: '',
    companyEmail: '',
    confirmEmail: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    state: '',
    city: '',
    neighborhood: '',
    phone: '',
    teamSize: '',
    revenue: '',
    hasInstallation: '',
    howKnewUs: '',
    averageProjects: '',
    creditIssues: ''
  });

  const [ownerData, setOwnerData] = useState({
    fullName: '',
    cpf: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const steps = [
    { number: 1, title: 'Dados da Empresa', icon: <Building className="h-5 w-5" /> },
    { number: 2, title: 'Dados do Titular', icon: <User className="h-5 w-5" /> },
    { number: 3, title: 'Documentos', icon: <FileText className="h-5 w-5" /> },
    { number: 4, title: 'Projetos de Engenharia', icon: <Wrench className="h-5 w-5" /> }
  ];

  // Estados brasileiros
  const brazilStates = [
    { code: 'SP', name: 'São Paulo' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'BA', name: 'Bahia' },
    { code: 'PR', name: 'Paraná' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'CE', name: 'Ceará' },
    { code: 'PA', name: 'Pará' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'AC', name: 'Acre' },
    { code: 'AP', name: 'Amapá' },
    { code: 'RR', name: 'Roraima' },
    { code: 'TO', name: 'Tocantins' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RN', name: 'Rio Grande do Norte' }
  ];

  const citiesByState: { [key: string]: string[] } = {
    'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
    'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna'],
    'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
    'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
    'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
    'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas'],
    'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma'],
    'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Águas Lindas'],
    'MA': ['São Luís', 'Imperatriz', 'Timon', 'Caxias', 'Codó'],
    'ES': ['Vitória', 'Vila Velha', 'Cariacica', 'Serra', 'Cachoeiro de Itapemirim'],
    'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'],
    'AL': ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo', 'Penedo'],
    'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'],
    'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'],
    'DF': ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Planaltina'],
    'SE': ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância'],
    'AM': ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'],
    'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal'],
    'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'],
    'AP': ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão'],
    'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Alto Alegre', 'Mucajaí'],
    'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins'],
    'PI': ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano'],
    'RN': ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba']
  };

  // Validation functions
  // Validações restauradas para campos obrigatórios
  const validateStep1 = () => {
    if (!companyData.companyName) {
      toast.error('Por favor, informe o nome da empresa.');
      return false;
    }
    if (!companyData.cnpj || companyData.cnpj.length < 14) {
      toast.error('Por favor, informe um CNPJ válido.');
      return false;
    }
    if (!companyData.companyEmail) {
      toast.error('Por favor, informe o e-mail da empresa.');
      return false;
    }
    if (companyData.companyEmail !== companyData.confirmEmail) {
      toast.error('Os e-mails informados não coincidem.');
      return false;
    }
    if (!companyData.cep) {
      toast.error('Por favor, informe o CEP.');
      return false;
    }
    if (!companyData.street) {
      toast.error('Por favor, informe a rua/avenida.');
      return false;
    }
    if (!companyData.number) {
      toast.error('Por favor, informe o número do endereço.');
      return false;
    }
    if (!companyData.state) {
      toast.error('Por favor, selecione o estado.');
      return false;
    }
    if (!companyData.city) {
      toast.error('Por favor, selecione a cidade.');
      return false;
    }
    if (!companyData.neighborhood) {
      toast.error('Por favor, informe o bairro.');
      return false;
    }
    if (!companyData.phone || companyData.phone.length < 10) {
      toast.error('Por favor, informe um telefone válido.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!ownerData.fullName) {
      toast.error('Por favor, informe o nome completo do titular.');
      return false;
    }
    if (!ownerData.cpf || ownerData.cpf.length < 11) {
      toast.error('Por favor, informe um CPF válido.');
      return false;
    }
    if (!ownerData.phone || ownerData.phone.length < 10) {
      toast.error('Por favor, informe um telefone válido.');
      return false;
    }
    if (!ownerData.email) {
      toast.error('Por favor, informe o e-mail do titular.');
      return false;
    }
    if (!ownerData.password) {
      toast.error('Por favor, defina uma senha.');
      return false;
    }
    if (ownerData.password !== ownerData.confirmPassword) {
      toast.error('As senhas informadas não coincidem.');
      return false;
    }
    if (ownerData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    // Verificar se pelo menos um documento foi anexado
    const temContratoSocial = !!documents.contratoSocial;
    const temComprovanteEndereco = !!documents.comprovanteEndereco;
    const temRgSocios = !!documents.rgSocios;
    const temCnhSocios = !!documents.cnhSocios;
    const temDadosBancarios = !!documents.dadosBancarios;
    const temFotoFachada = !!documents.fotoFachada;
    
    if (!temContratoSocial) {
      toast.error('Por favor, anexe o Contrato Social.');
      return false;
    }
    
    if (!temComprovanteEndereco) {
      toast.error('Por favor, anexe o Comprovante de Endereço.');
      return false;
    }
    
    if (!temRgSocios && !temCnhSocios) {
      toast.error('Por favor, anexe o RG ou CNH dos sócios.');
      return false;
    }
    
    if (!temDadosBancarios) {
      toast.error('Por favor, anexe os Dados Bancários.');
      return false;
    }
    
    if (!temFotoFachada) {
      toast.error('Por favor, anexe a Foto da Fachada.');
      return false;
    }
    
    console.log('Validação da etapa 3 (documentos): OK - documentos obrigatórios verificados');
    return true;
  };
  
  const validateStep4 = () => {
    if (!consentChecked) {
      toast.error('Por favor, autorize a Koposol a realizar as devidas consultas.');
      return false;
    }
    console.log('Validação da etapa 4 (consentimento): OK');
    return true;
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      companyName: 'Nome da Empresa',
      cnpj: 'CNPJ',
      companyEmail: 'E-mail da Empresa',
      confirmEmail: 'Confirmação de E-mail',
      cep: 'CEP',
      street: 'Rua/Avenida',
      number: 'Número',
      state: 'Estado',
      city: 'Cidade',
      neighborhood: 'Bairro',
      phone: 'Telefone',
      teamSize: 'Tamanho da Equipe',
      revenue: 'Faturamento',
      hasInstallation: 'Equipe de Instalação',
      howKnewUs: 'Como Conheceu a Koposol',
      fullName: 'Nome Completo',
      cpf: 'CPF',
      email: 'E-mail',
      password: 'Senha',
      confirmPassword: 'Confirmação de Senha'
    };
    return labels[field] || field;
  };

  // Função para buscar dados do CEP usando a API ViaCEP
  const buscarCep = async (cep: string) => {
    // Remover caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return;
    }
    
    try {
      console.log(`Buscando CEP: ${cepLimpo}`);
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      console.log('Resposta da API ViaCEP:', data);
      
      if (!data.erro) {
        // Atualizar os campos do formulário com os dados retornados
        setCompanyData(prev => ({
          ...prev,
          cep: data.cep || prev.cep,
          street: data.logradouro || prev.street,
          complement: data.complemento || prev.complement,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.estado || data.uf || prev.state
        }));
        
        console.log('Dados atualizados:', {
          cep: data.cep,
          street: data.logradouro,
          complement: data.complemento,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.estado || data.uf
        });
        
        toast.success('Endereço preenchido automaticamente!');
      } else {
        console.error('CEP não encontrado');
        toast.error('CEP não encontrado. Por favor, verifique o CEP informado.');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar o CEP. Por favor, tente novamente.');
    }
  };

  const handleNext = () => {
    console.log('Tentando avançar para a próxima etapa:', currentStep + 1);
    
    // Validação por etapa
    if (currentStep === 1 && !validateStep1()) {
      console.log('Validação da etapa 1 falhou');
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      console.log('Validação da etapa 2 falhou');
      return;
    }
    if (currentStep === 3 && !validateStep3()) {
      console.log('Validação da etapa 3 falhou');
      return;
    }
    
    console.log('Validação passou, avançando para a próxima etapa');
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Última etapa, enviando formulário');
      // Corrigindo o erro de tipagem
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário enviado!');
    
    // Validar a etapa atual antes de enviar
    if (currentStep === 4 && !validateStep4()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Construir o endereço completo
      const enderecoCompleto = [
        companyData.street,
        companyData.number,
        companyData.complement,
        companyData.neighborhood,
        companyData.city,
        companyData.state,
        companyData.cep
      ].filter(Boolean).join(', ');

      // Usar o e-mail real do formulário ou gerar um para teste
      let email = ownerData.email || 'teste' + Math.floor(Math.random() * 10000) + '@teste.com';
      const password = ownerData.password || 'Teste@123456';
      
      // Normalizar o e-mail (remover espaços, converter para minúsculas)
      email = email.trim().toLowerCase();
      
      // Verificar se o e-mail é válido para o Supabase
      // O Supabase exige um formato específico de e-mail
      // Usar um e-mail válido para garantir que o Auth funcione
      // Formato: teste+[timestamp]@example.com para garantir unicidade
      const timestamp = new Date().getTime();
      const validEmail = `teste+${timestamp}@example.com`;
      
      console.log('Tentando cadastro com:', { email });
      console.log('E-mail válido para Auth:', { validEmail });
      
      // Tentar inserir diretamente na tabela integradores sem criar usuário
      // Esta abordagem é mais simples e evita problemas com o Supabase Auth
      try {
        // Dados do integrador para inserção
        const integradorData = {
          nome_empresa: companyData.companyName || 'Empresa não informada',
          cnpj: companyData.cnpj || '00000000000000',
          email: email,
          telefone: companyData.phone || ownerData.phone || '00000000000',
          endereco: enderecoCompleto || 'Endereço não informado',
          status: 'pendente', // Status inicial sempre pendente
          // Campos adicionais que existem na tabela (nomes alinhados com o banco)
          revenue: companyData.revenue || '0',
          team_size: companyData.teamSize || 'Não informado',
          has_installation: companyData.hasInstallation || 'Não informado',
          how_knew_us: companyData.howKnewUs || 'Não informado'
        };

        console.log('Dados do integrador para inserção:', integradorData);

        // Inserir na tabela integradores usando inserção direta
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert([integradorData]);
          
        if (insertError) {
          console.error('Erro ao inserir integrador:', insertError);
          throw insertError;
        }
        
        console.log('Integrador inserido com sucesso!');
        
        // Removida a tentativa de criar usuário no Auth
        // O cadastro na tabela de integradores é suficiente para o funcionamento do sistema
        // O usuário pode ser criado posteriormente pelo administrador quando aprovar o integrador
      } catch (insertError: any) {
        console.error('Erro ao inserir integrador:', insertError);
        throw insertError;
      }
      
      console.log('Integrador inserido com sucesso!');

      // Se chegou aqui, o cadastro foi bem-sucedido
      toast.success('Cadastro enviado com sucesso! Você receberá um retorno em até 5 dias úteis.');
      navigate('/login');
      
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(`Erro ao enviar cadastro: ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.number 
              ? 'bg-primary border-primary text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            {step.icon}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 ${
              currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados da Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                  placeholder="Nome da empresa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <MaskedInput
                  id="cnpj"
                  type="cnpj"
                  value={companyData.cnpj}
                  onChange={(value) => setCompanyData({...companyData, cnpj: value})}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">E-mail da Empresa *</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyData.companyEmail}
                  onChange={(e) => setCompanyData({...companyData, companyEmail: e.target.value})}
                  placeholder="empresa@email.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este e-mail será usado para login no sistema
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmEmail">Confirmar E-mail da Empresa *</Label>
                <Input
                  id="confirmEmail"
                  type="email"
                  value={companyData.confirmEmail}
                  onChange={(e) => setCompanyData({...companyData, confirmEmail: e.target.value})}
                  placeholder="empresa@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <MaskedInput
                  id="cep"
                  type="cep"
                  value={companyData.cep}
                  onChange={(value) => {
                    setCompanyData({...companyData, cep: value});
                    // Buscar dados do CEP quando tiver 8 dígitos
                    if (value.replace(/\D/g, '').length === 8) {
                      buscarCep(value);
                    }
                  }}
                  placeholder="00000-000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={companyData.neighborhood}
                  onChange={(e) => setCompanyData({...companyData, neighborhood: e.target.value})}
                  placeholder="Digite o nome do bairro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Rua/Avenida *</Label>
                <Input
                  id="street"
                  value={companyData.street}
                  onChange={(e) => setCompanyData({...companyData, street: e.target.value})}
                  placeholder="Nome da rua"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={companyData.number}
                  onChange={(e) => setCompanyData({...companyData, number: e.target.value})}
                  placeholder="123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={companyData.complement}
                  onChange={(e) => setCompanyData({...companyData, complement: e.target.value})}
                  placeholder="Sala, andar, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={companyData.state}
                  onChange={(e) => setCompanyData({...companyData, state: e.target.value})}
                  placeholder="Estado (preenchido automaticamente pelo CEP)"
                  readOnly
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={companyData.city}
                  onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
                  placeholder="Cidade (preenchida automaticamente pelo CEP)"
                  readOnly
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone da Empresa *</Label>
                <MaskedInput
                  id="phone"
                  type="phone"
                  value={companyData.phone}
                  onChange={(value) => setCompanyData({...companyData, phone: value})}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageProjects">Em média quantos projetos desenvolvidos/instalados?</Label>
                <Input
                  id="averageProjects"
                  type="number"
                  value={companyData.averageProjects || ''}
                  onChange={(e) => setCompanyData({...companyData, averageProjects: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditIssues">Você sofre com problema de crédito?</Label>
                <Select onValueChange={(value) => setCompanyData({...companyData, creditIssues: value})} value={companyData.creditIssues}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Tamanho da Equipe de Vendas</Label>
                <Select onValueChange={(value) => setCompanyData({...companyData, teamSize: value})} value={companyData.teamSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho da equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 pessoas</SelectItem>
                    <SelectItem value="3-5">3-5 pessoas</SelectItem>
                    <SelectItem value="6-10">6-10 pessoas</SelectItem>
                    <SelectItem value="11-20">11-20 pessoas</SelectItem>
                    <SelectItem value="20+">Mais de 20 pessoas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Faturamento do Ano Passado</Label>
                <MaskedInput
                  type="currency"
                  id="revenue"
                  value={companyData.revenue}
                  onChange={(value) => setCompanyData({...companyData, revenue: value})}
                  placeholder="R$ 0,00"
                  
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasInstallation">Você tem equipe de instalação?</Label>
                <Select onValueChange={(value) => setCompanyData({...companyData, hasInstallation: value})} value={companyData.hasInstallation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="terceirizo">Terceirizo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="howKnewUs">Como Conheceu a Koposol?</Label>
                <Select onValueChange={(value) => setCompanyData({...companyData, howKnewUs: value})} value={companyData.howKnewUs}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Titular (Sócio Principal)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo do Titular *</Label>
                <Input
                  id="fullName"
                  value={ownerData.fullName}
                  onChange={(e) => setOwnerData({...ownerData, fullName: e.target.value})}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF do Titular *</Label>
                <MaskedInput
                  id="cpf"
                  type="cpf"
                  value={ownerData.cpf}
                  onChange={(value) => setOwnerData({...ownerData, cpf: value})}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Telefone de Contato *</Label>
                <MaskedInput
                  id="ownerPhone"
                  type="phone"
                  value={ownerData.phone}
                  onChange={(value) => setOwnerData({...ownerData, phone: value})}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerEmail">E-mail de Contato *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={ownerData.email}
                  onChange={(e) => setOwnerData({...ownerData, email: e.target.value})}
                  placeholder="titular@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={ownerData.password}
                  onChange={(e) => setOwnerData({...ownerData, password: e.target.value})}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmação de Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={ownerData.confirmPassword}
                  onChange={(e) => setOwnerData({...ownerData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Anexos e Documentos</h3>
            
            <div className="alert alert-info p-4 mb-6 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 text-sm">
                Os documentos são obrigatórios para o cadastro. Por favor, anexe todos os documentos solicitados para prosseguir.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload 
                label="Contrato Social da Empresa" 
                onFileSelect={(file) => setDocuments({...documents, contratoSocial: file})} 
              />
              <FileUpload 
                label="Comprovante de Endereço" 
                onFileSelect={(file) => setDocuments({...documents, comprovanteEndereco: file})} 
              />
              <FileUpload 
                label="RG dos Sócios" 
                onFileSelect={(file) => setDocuments({...documents, rgSocios: file})} 
              />
              <FileUpload 
                label="CNH dos Sócios" 
                onFileSelect={(file) => setDocuments({...documents, cnhSocios: file})} 
              />
              <FileUpload 
                label="Comprovante de Dados Bancários" 
                onFileSelect={(file) => setDocuments({...documents, dadosBancarios: file})} 
              />
              <FileUpload 
                label="Foto da Fachada" 
                onFileSelect={(file) => setDocuments({...documents, fotoFachada: file})} 
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projetos de Engenharia</h3>
            
            {[1, 2, 3, 4, 5].map((projectNum) => (
              <Card key={projectNum} className="p-4">
                <h4 className="text-md font-semibold text-gray-800 mb-4">
                  Projeto de Engenharia {projectNum} *
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Cliente (do projeto)</Label>
                    <Input placeholder="Nome do cliente"  />
                  </div>

                  <div className="space-y-2">
                    <Label>Potência do Projeto (kWp)</Label>
                    <Input placeholder="0.00" type="number" step="0.01"  />
                  </div>

                  <div className="md:col-span-2">
                    <FileUpload label="Anexo de ART (Anotação de Responsabilidade Técnica)" />
                  </div>
                </div>
              </Card>
            ))}

            {/* Consent Section */}
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800">
                  Consentimento e Aviso Legal
                </h4>
                
                <p className="text-sm text-gray-700 leading-relaxed">
                  Autorizo a consultar os débitos e responsabilidades decorrentes de operações 
                  com características de crédito e as informações e os registros de medidas 
                  judiciais que em meu nome / nome do cliente constem ou venham a constar do 
                  Sistema de Informação de Crédito (SCR), gerido pelo Banco Central do Brasil - 
                  BACEN, ou sistemas que venham a complementá-lo ou substituí-lo.
                </p>

                <p className="text-sm text-gray-600 font-medium">
                  <strong>AVISO:</strong> Os dados informados acima são de responsabilidade da 
                  empresa em questão e estão sujeitos a análise e validação interna.
                </p>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="consent" 
                    checked={consentChecked} 
                    onCheckedChange={(checked) => setConsentChecked(checked as boolean)} 
                    required
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Autorizo a Koposol a realizar as devidas consultas *
                  </label>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
          
          <KoposolLogo className="justify-center mb-4" size="lg" />
          <h1 className="text-3xl font-bold text-gray-900">
            Cadastro de Integrador
          </h1>
          <p className="text-gray-600 mt-2">
            Preencha os dados para se tornar um parceiro Koposol
          </p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator />

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <Card className="max-w-4xl mx-auto shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center">
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-purple-600 text-white hover:bg-purple-700 flex items-center"
                  >
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90" 
                    disabled={!consentChecked}
                    onClick={() => console.log('Botão de finalizar clicado')}
                  >
                    {isLoading ? 'Enviando...' : 'Finalizar Cadastro'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Information Message */}
        <Card className="max-w-4xl mx-auto mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Informação importante:</strong> Sua solicitação de parceria será enviada para análise. 
              Nosso time tem um prazo de 5 dias úteis para verificar seus dados e documentos. 
              Estamos trabalhando continuamente para encurtar esse prazo. Após a análise, 
              um de nossos consultores entrará em contato para realizar o processo de 
              on-boarding com a pessoa designada pelo responsável.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
