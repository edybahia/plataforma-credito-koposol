import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const { user, checkUserAndProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Acesso negado. Por favor, faça login.');
      navigate('/auth');
    }
  }, [user, navigate]);

  const [documents, setDocuments] = useState<Record<string, File | null>>({
    contratoSocial: null,
    comprovanteEndereco: null,
    rgSocios: null,
    cnhSocios: null,
    dadosBancarios: null,
    fotoFachada: null
  });

  const [projectsData, setProjectsData] = useState([
    { nomeCliente: '', potenciaKwp: '', artFile: null as File | null, memorialFile: null as File | null, outrosFile: null as File | null },
    { nomeCliente: '', potenciaKwp: '', artFile: null as File | null, memorialFile: null as File | null, outrosFile: null as File | null },
    { nomeCliente: '', potenciaKwp: '', artFile: null as File | null, memorialFile: null as File | null, outrosFile: null as File | null },
  ]);

  const handleProjectDataChange = (index: number, field: string, value: any) => {
    const updatedProjects = [...projectsData];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjectsData(updatedProjects);
  };

  const [companyData, setCompanyData] = useState({
    companyName: '',
    cnpj: '',
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
    email: user?.email || '',
  });

  const steps = [
    { number: 1, title: 'Dados da Empresa', icon: <Building className="h-5 w-5" /> },
    { number: 2, title: 'Dados do Titular', icon: <User className="h-5 w-5" /> },
    { number: 3, title: 'Documentos', icon: <FileText className="h-5 w-5" /> },
    { number: 4, title: 'Projetos de Engenharia', icon: <Wrench className="h-5 w-5" /> }
  ];

  const brazilStates = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ];

  const citiesByState: { [key: string]: string[] } = {
    'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis'],
    // Adicionar outras cidades conforme necessário
  };

  const validateStep1 = () => {
    const { companyName, cnpj, cep, street, number, neighborhood, phone, teamSize, revenue, hasInstallation, howKnewUs, averageProjects, creditIssues } = companyData;
    if (!companyName || !cnpj || !cep || !street || !number || !neighborhood || !phone || !teamSize || !revenue || !hasInstallation || !howKnewUs || !averageProjects || !creditIssues) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const requiredFields = ['fullName', 'cpf', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!ownerData[field as keyof typeof ownerData]) {
        toast.error(`Por favor, preencha o campo: ${getFieldLabel(field)}`);
        return false;
      }
    }
    if (ownerData.cpf.replace(/\D/g, '').length !== 11) {
        toast.error('CPF inválido.');
        return false;
    }
    if (!isValidEmail(ownerData.email)) {
        toast.error('O e-mail do titular é inválido.');
        return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!documents.contratoSocial) { toast.error('Anexe o Contrato Social.'); return false; }
    if (!documents.comprovanteEndereco) { toast.error('Anexe o Comprovante de Endereço.'); return false; }
    if (!documents.rgSocios && !documents.cnhSocios) { toast.error('Anexe o RG ou CNH dos sócios.'); return false; }
    if (!documents.dadosBancarios) { toast.error('Anexe os Dados Bancários.'); return false; }
    if (!documents.fotoFachada) { toast.error('Anexe a Foto da Fachada.'); return false; }
    return true;
  };

  const validateStep4 = () => {
    if (!consentChecked) {
      toast.error('Por favor, autorize a Koposol a realizar as devidas consultas.');
      return false;
    }
    return true;
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      companyName: 'Nome da Empresa', cnpj: 'CNPJ', 
      cep: 'CEP', street: 'Rua/Avenida',
      number: 'Número', neighborhood: 'Bairro',
      phone: 'Telefone', teamSize: 'Tamanho da Equipe', revenue: 'Faturamento',
      hasInstallation: 'Equipe de Instalação', howKnewUs: 'Como Conheceu a Koposol',
      fullName: 'Nome Completo', cpf: 'CPF', email: 'E-mail',
      contratoSocial: 'Contrato Social', comprovanteEndereco: 'Comprovante de Endereço',
      rgSocios: 'RG dos Sócios', cnhSocios: 'CNH dos Sócios',
      dadosBancarios: 'Dados Bancários', fotoFachada: 'Foto da Fachada'
    };
    return labels[field] || field;
  };

  const buscarCep = async (cepValue: string) => {
    const cep = cepValue.replace(/\D/g, '');
    if (cep.length !== 8) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado.');
        return;
      }

      setCompanyData(prevData => ({
        ...prevData,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        complement: data.complemento
      }));

      toast.success('Endereço preenchido automaticamente!');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Ocorreu um erro ao buscar o CEP. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File | null, path: string): Promise<string | null> => {
    if (!file) return null;
    const { data, error } = await supabase.storage
      .from('documentos-integradores')
      .upload(path, file);
    if (error) {
      console.error('Erro no upload:', error.message);
      throw new Error(`Falha no upload do arquivo: ${file.name}`);
    }
    const { data: { publicUrl } } = supabase.storage
      .from('documentos-integradores')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;
    setIsLoading(true);

    try {
      if (!user) throw new Error('Usuário não autenticado.');

      const documentUrls: Record<string, string> = {};
      for (const key in documents) {
        const file = documents[key as keyof typeof documents];
        if (file) {
          const path = `${user.id}/${key}_${Date.now()}`;
          const url = await uploadFile(file, path);
          if (url) documentUrls[key] = url;
        }
      }

      const updateData = {
        nome_empresa: companyData.companyName,
        cnpj: companyData.cnpj,
        cep: companyData.cep,
        street: companyData.street,
        number: companyData.number,
        complement: companyData.complement,
        state: companyData.state,
        city: companyData.city,
        neighborhood: companyData.neighborhood,
        telefone: companyData.phone,
        owner_name: ownerData.fullName,
        owner_cpf: ownerData.cpf,
        owner_phone: ownerData.phone,
        owner_email: ownerData.email,
        contrato_social_url: documentUrls.contratoSocial,
        comprovante_endereco_url: documentUrls.comprovanteEndereco,
        rg_socios_url: documentUrls.rgSocios,
        cnh_socios_url: documentUrls.cnhSocios,
        dados_bancarios_url: documentUrls.dadosBancarios,
        foto_fachada_url: documentUrls.fotoFachada,
        status: 'pendente_documentacao',
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('integradores')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const projectsToInsert = projectsData
        .filter(p => p.nomeCliente && p.potenciaKwp)
        .map(async (p) => {
          const artUrl = p.artFile ? await uploadFile(p.artFile, `${user.id}/projects/${p.nomeCliente}_art_${Date.now()}`) : null;
          const memorialUrl = p.memorialFile ? await uploadFile(p.memorialFile, `${user.id}/projects/${p.nomeCliente}_memorial_${Date.now()}`) : null;
          const outrosUrl = p.outrosFile ? await uploadFile(p.outrosFile, `${user.id}/projects/${p.nomeCliente}_outros_${Date.now()}`) : null;
          return {
            integrador_id: user.id,
            nome_cliente: p.nomeCliente,
            potencia_kwp: parseFloat(p.potenciaKwp) || 0,
            art_url: artUrl,
            orcamento_conexao_url: memorialUrl, // Mapeando memorial para orçamento de conexão
            outros_documentos_url: outrosUrl,
          };
        });

      const resolvedProjects = await Promise.all(projectsToInsert);
      if (resolvedProjects.length > 0) {
                const { error: projectsError } = await supabase.from('projetos_integrador').insert(resolvedProjects);
        if (projectsError) {
          toast.info('Dados principais salvos, mas houve um erro ao salvar os projetos.');
        }
      }

      // Após salvar, força a re-verificação do perfil para atualizar o contexto
      await checkUserAndProfile();

      toast.success('Cadastro enviado com sucesso! Você será redirecionado em breve.');

      // O redirecionamento será tratado pelo ProtectedRoute agora que o contexto foi atualizado
    } catch (error) {
      toast.error(`Erro ao finalizar cadastro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <KoposolLogo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Complete seu Cadastro de Parceiro</h2>
          <p className="mt-2 text-sm text-gray-600">Preencha os campos abaixo para finalizar seu cadastro.</p>
        </div>

        <div className="mb-8 px-4 sm:px-0">
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>
                <div className="absolute top-1/2 left-0 h-0.5 bg-primary" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
                <div className="relative flex justify-between">
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.number ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {step.icon}
                            </div>
                            <p className={`mt-2 text-xs text-center ${currentStep >= step.number ? 'text-primary font-semibold' : 'text-gray-500'}`}>{step.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><Label htmlFor="companyName">Razão Social</Label><Input id="companyName" value={companyData.companyName} onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })} /></div>
                  <div><Label htmlFor="cnpj">CNPJ</Label><MaskedInput mask="99.999.999/9999-99" id="cnpj" value={companyData.cnpj} onChange={(value) => setCompanyData({ ...companyData, cnpj: value })} /></div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <MaskedInput 
                      type="cep"
                      id="cep" 
                      value={companyData.cep} 
                      onChange={(value) => setCompanyData({ ...companyData, cep: value })}
                      onBlur={(e) => buscarCep(e.target.value)}
                    />
                  </div>
                  <div><Label htmlFor="street">Logradouro</Label><Input id="street" value={companyData.street} onChange={(e) => setCompanyData({ ...companyData, street: e.target.value })} disabled /></div>
                  <div><Label htmlFor="number">Número</Label><Input id="number" value={companyData.number} onChange={(e) => setCompanyData({ ...companyData, number: e.target.value })} /></div>
                  <div><Label htmlFor="complement">Complemento</Label><Input id="complement" value={companyData.complement} onChange={(e) => setCompanyData({ ...companyData, complement: e.target.value })} /></div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" value={companyData.state} onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })} disabled />
                  </div>
                  <div><Label htmlFor="city">Cidade</Label><Input id="city" value={companyData.city} onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })} disabled /></div>
                  <div><Label htmlFor="neighborhood">Bairro</Label><Input id="neighborhood" value={companyData.neighborhood} onChange={(e) => setCompanyData({ ...companyData, neighborhood: e.target.value })} disabled /></div>
                  <div><Label htmlFor="phone">Telefone</Label><MaskedInput type="phone" id="phone" value={companyData.phone} onChange={(value) => setCompanyData({ ...companyData, phone: value })} /></div>
                  
                  {/* Campos de Seleção Restaurados */}
                  <div><Label>Tamanho da equipe</Label><Select value={companyData.teamSize} onValueChange={(value) => setCompanyData({ ...companyData, teamSize: value })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="1-5">1-5</SelectItem><SelectItem value="6-10">6-10</SelectItem><SelectItem value="11-20">11-20</SelectItem><SelectItem value="21-50">21-50</SelectItem><SelectItem value="50+">50+</SelectItem></SelectContent></Select></div>
                  <div><Label>Faturamento mensal</Label><Select value={companyData.revenue} onValueChange={(value) => setCompanyData({ ...companyData, revenue: value })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="Até 50 mil">Até 50 mil</SelectItem><SelectItem value="De 50 mil a 100 mil">De 50 mil a 100 mil</SelectItem><SelectItem value="De 100 mil a 300 mil">De 100 mil a 300 mil</SelectItem><SelectItem value="De 300 mil a 1 milhão">De 300 mil a 1 milhão</SelectItem><SelectItem value="Acima de 1 milhão">Acima de 1 milhão</SelectItem></SelectContent></Select></div>
                  <div><Label>Possui equipe de instalação própria?</Label><Select value={companyData.hasInstallation} onValueChange={(value) => setCompanyData({ ...companyData, hasInstallation: value })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="sim">Sim</SelectItem><SelectItem value="nao">Não</SelectItem></SelectContent></Select></div>
                  <div><Label>Como nos conheceu?</Label><Select value={companyData.howKnewUs} onValueChange={(value) => setCompanyData({ ...companyData, howKnewUs: value })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="indicação">Indicação</SelectItem><SelectItem value="google">Google</SelectItem><SelectItem value="instagram">Instagram</SelectItem><SelectItem value="facebook">Facebook</SelectItem><SelectItem value="linkedin">LinkedIn</SelectItem><SelectItem value="evento">Evento</SelectItem><SelectItem value="outros">Outros</SelectItem></SelectContent></Select></div>
                  <div><Label>Média de projetos/mês</Label><Select value={companyData.averageProjects} onValueChange={(value) => setCompanyData({ ...companyData, averageProjects: value })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="1-5">1-5</SelectItem><SelectItem value="6-10">6-10</SelectItem><SelectItem value="11-20">11-20</SelectItem><SelectItem value="21-50">21-50</SelectItem><SelectItem value="50+">50+</SelectItem></SelectContent></Select></div>
                  <div><Label>Já teve ou tem algum problema de crédito?</Label><Select value={companyData.creditIssues} onValueChange={(value) => setCompanyData({ ...companyData, creditIssues: value })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="sim">Sim</SelectItem><SelectItem value="nao">Não</SelectItem></SelectContent></Select></div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><Label htmlFor="fullName">Nome Completo do Titular</Label><Input id="fullName" value={ownerData.fullName} onChange={(e) => setOwnerData({...ownerData, fullName: e.target.value})} /></div>
                  <div><Label htmlFor="cpf">CPF do Titular</Label><MaskedInput type="cpf" id="cpf" value={ownerData.cpf} onChange={(value) => setOwnerData({...ownerData, cpf: value})} /></div>
                  <div><Label htmlFor="ownerPhone">Telefone do Titular</Label><MaskedInput type="phone" id="ownerPhone" value={ownerData.phone} onChange={(value) => setOwnerData({...ownerData, phone: value})} /></div>
                  <div className="md:col-span-2"><Label htmlFor="ownerEmail">E-mail do Titular (Login)</Label><Input type="email" id="ownerEmail" value={ownerData.email} disabled /></div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(documents).map(key => (
                        <div key={key}><Label>{getFieldLabel(key)}</Label><FileUpload label="" onFileSelect={(files) => setDocuments(prev => ({ ...prev, [key]: files[0] || null }))} /></div>
                    ))}
                </div>
              )}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Projetos de Engenharia (Opcional)</h3>
                  {projectsData.map((project, index) => (
                    <div key={index} className="border p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2">Projeto {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Nome do Cliente</Label><Input value={project.nomeCliente} onChange={(e) => handleProjectDataChange(index, 'nomeCliente', e.target.value)} /></div>
                        <div><Label>Potência (kWp)</Label><Input type="number" value={project.potenciaKwp} onChange={(e) => handleProjectDataChange(index, 'potenciaKwp', e.target.value)} /></div>
                        <div><Label>ART</Label><FileUpload label="" onFileSelect={(files) => handleProjectDataChange(index, 'artFile', files[0] || null)} /></div>
                        <div><Label>Memorial Descritivo</Label><FileUpload label="" onFileSelect={(files) => handleProjectDataChange(index, 'memorialFile', files[0] || null)} /></div>
                        <div className="md:col-span-2"><Label>Outros Documentos</Label><FileUpload label="" onFileSelect={(files) => handleProjectDataChange(index, 'outrosFile', files[0] || null)} /></div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 flex items-center space-x-2">
                    <Checkbox id="consent" checked={consentChecked} onCheckedChange={(checked) => setConsentChecked(checked as boolean)} />
                    <Label htmlFor="consent" className="text-sm">Autorizo a Koposol a realizar as devidas consultas nos órgãos de proteção ao crédito.</Label>
                  </div>
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1}> <ArrowLeft className="mr-2 h-4 w-4" /> Anterior</Button>
                {currentStep < steps.length ? (
                  <Button type="button" onClick={handleNext}>Próximo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!consentChecked || isLoading}>
                    {isLoading ? 'Enviando...' : 'Finalizar Cadastro'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

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
