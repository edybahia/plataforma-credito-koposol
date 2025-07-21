
import React, { useState } from 'react';
import IntegratorLayout from '@/components/IntegratorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, User, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import MaskedInput from '@/components/MaskedInput';

const SubmitProposal = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data state - simplified for demo
  const [personalData, setPersonalData] = useState({
    fullName: '',
    cpf: '',
    dateOfBirth: '',
    rg: '',
    issuingAgency: '',
    maritalStatus: '',
    nationality: 'Brasileira',
    birthCity: '',
    birthState: '',
    mothersName: ''
  });

  const [contactData, setContactData] = useState({
    mainPhone: '',
    altPhone: '',
    email: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    residenceType: '',
    residenceTimeYears: '',
    residenceTimeMonths: ''
  });

  const [professionalData, setProfessionalData] = useState({
    profession: '',
    monthlyIncome: '',
    employmentType: '',
    otherIncomeSource: '',
    otherIncomeValue: ''
  });

  const [loanData, setLoanData] = useState({
    requestedValue: '',
    loanPurpose: '',
    desiredInstallments: '',
    bank: '',
    agency: '',
    accountNumber: '',
    accountType: ''
  });

  const steps = [
    { number: 1, title: 'Dados Pessoais', icon: <User className="h-5 w-5" /> },
    { number: 2, title: 'Contato e Endereço', icon: <MapPin className="h-5 w-5" /> },
    { number: 3, title: 'Dados Profissionais', icon: <Briefcase className="h-5 w-5" /> },
    { number: 4, title: 'Dados do Empréstimo', icon: <DollarSign className="h-5 w-5" /> }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Proposta enviada com sucesso!');
      navigate('/integrator/kanban');
    }, 2000);
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais do Solicitante</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={personalData.fullName}
                  onChange={(e) => setPersonalData({...personalData, fullName: e.target.value})}
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <MaskedInput
                  id="cpf"
                  type="cpf"
                  value={personalData.cpf}
                  onChange={(value) => setPersonalData({...personalData, cpf: value})}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalData.dateOfBirth}
                  onChange={(e) => setPersonalData({...personalData, dateOfBirth: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg">RG *</Label>
                <Input
                  id="rg"
                  value={personalData.rg}
                  onChange={(e) => setPersonalData({...personalData, rg: e.target.value})}
                  placeholder="12.345.678-9"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuingAgency">Órgão Emissor *</Label>
                <Input
                  id="issuingAgency"
                  value={personalData.issuingAgency}
                  onChange={(e) => setPersonalData({...personalData, issuingAgency: e.target.value})}
                  placeholder="SSP/SP"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Estado Civil *</Label>
                <Select onValueChange={(value) => setPersonalData({...personalData, maritalStatus: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidade *</Label>
                <Input
                  id="nationality"
                  value={personalData.nationality}
                  onChange={(e) => setPersonalData({...personalData, nationality: e.target.value})}
                  placeholder="Brasileira"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthCity">Cidade de Nascimento *</Label>
                <Input
                  id="birthCity"
                  value={personalData.birthCity}
                  onChange={(e) => setPersonalData({...personalData, birthCity: e.target.value})}
                  placeholder="Cidade onde nasceu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Estado de Nascimento *</Label>
                <Select onValueChange={(value) => setPersonalData({...personalData, birthState: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                    <SelectItem value="mg">Minas Gerais</SelectItem>
                    <SelectItem value="ba">Bahia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mothersName">Nome Completo da Mãe *</Label>
                <Input
                  id="mothersName"
                  value={personalData.mothersName}
                  onChange={(e) => setPersonalData({...personalData, mothersName: e.target.value})}
                  placeholder="Nome completo da mãe"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados de Contato e Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mainPhone">Telefone Principal *</Label>
                <MaskedInput
                  id="mainPhone"
                  type="phone"
                  value={contactData.mainPhone}
                  onChange={(value) => setContactData({...contactData, mainPhone: value})}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altPhone">Telefone Alternativo</Label>
                <MaskedInput
                  id="altPhone"
                  type="phone"
                  value={contactData.altPhone}
                  onChange={(value) => setContactData({...contactData, altPhone: value})}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({...contactData, email: e.target.value})}
                  placeholder="cliente@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <MaskedInput
                  id="cep"
                  type="cep"
                  value={contactData.cep}
                  onChange={(value) => setContactData({...contactData, cep: value})}
                  placeholder="00000-000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Rua/Avenida *</Label>
                <Input
                  id="street"
                  value={contactData.street}
                  onChange={(e) => setContactData({...contactData, street: e.target.value})}
                  placeholder="Nome da rua"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={contactData.number}
                  onChange={(e) => setContactData({...contactData, number: e.target.value})}
                  placeholder="123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={contactData.complement}
                  onChange={(e) => setContactData({...contactData, complement: e.target.value})}
                  placeholder="Apto, sala, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={contactData.neighborhood}
                  onChange={(e) => setContactData({...contactData, neighborhood: e.target.value})}
                  placeholder="Nome do bairro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Cidade *</Label>
                <Select onValueChange={(value) => setContactData({...contactData, city: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sao-paulo">São Paulo</SelectItem>
                    <SelectItem value="rio-janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="brasilia">Brasília</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado *</Label>
                <Select onValueChange={(value) => setContactData({...contactData, state: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                    <SelectItem value="df">Distrito Federal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Moradia *</Label>
                <Select onValueChange={(value) => setContactData({...contactData, residenceType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="propria">Própria</SelectItem>
                    <SelectItem value="alugada">Alugada</SelectItem>
                    <SelectItem value="financiada">Financiada</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="residenceTimeYears">Tempo de Moradia (Anos) *</Label>
                <Input
                  id="residenceTimeYears"
                  type="number"
                  value={contactData.residenceTimeYears}
                  onChange={(e) => setContactData({...contactData, residenceTimeYears: e.target.value})}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="residenceTimeMonths">Tempo de Moradia (Meses) *</Label>
                <Input
                  id="residenceTimeMonths"
                  type="number"
                  value={contactData.residenceTimeMonths}
                  onChange={(e) => setContactData({...contactData, residenceTimeMonths: e.target.value})}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Profissionais e Financeiros</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profession">Profissão *</Label>
                <Input
                  id="profession"
                  value={professionalData.profession}
                  onChange={(e) => setProfessionalData({...professionalData, profession: e.target.value})}
                  placeholder="Sua profissão"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Renda Mensal *</Label>
                <Input
                  id="monthlyIncome"
                  value={professionalData.monthlyIncome}
                  onChange={(e) => setProfessionalData({...professionalData, monthlyIncome: e.target.value})}
                  placeholder="R$ 0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Vínculo Empregatício *</Label>
                <Select onValueChange={(value) => setProfessionalData({...professionalData, employmentType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clt">CLT</SelectItem>
                    <SelectItem value="autonomo">Autônomo</SelectItem>
                    <SelectItem value="empresario">Empresário</SelectItem>
                    <SelectItem value="aposentado">Aposentado</SelectItem>
                    <SelectItem value="pensionista">Pensionista</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherIncomeValue">Outras Fontes de Renda (Valor)</Label>
                <Input
                  id="otherIncomeValue"
                  value={professionalData.otherIncomeValue}
                  onChange={(e) => setProfessionalData({...professionalData, otherIncomeValue: e.target.value})}
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="otherIncomeSource">Outras Fontes de Renda (Descrição)</Label>
                <Input
                  id="otherIncomeSource"
                  value={professionalData.otherIncomeSource}
                  onChange={(e) => setProfessionalData({...professionalData, otherIncomeSource: e.target.value})}
                  placeholder="Descreva outras fontes de renda"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-800">Documentos para Análise</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload label="Comprovante de Renda" />
                <FileUpload label="Comprovante de Residência" />
                <FileUpload label="Documento de Identidade (RG ou CNH)" />
                <FileUpload label="Extrato Bancário (últimos 90 dias)" />
              </div>
              <FileUpload label="Declaração de Imposto de Renda" required={false} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Empréstimo e Bancários</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestedValue">Valor Solicitado *</Label>
                <Input
                  id="requestedValue"
                  value={loanData.requestedValue}
                  onChange={(e) => setLoanData({...loanData, requestedValue: e.target.value})}
                  placeholder="R$ 0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Finalidade do Empréstimo *</Label>
                <Select onValueChange={(value) => setLoanData({...loanData, loanPurpose: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a finalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quitacao">Quitação de Dívidas</SelectItem>
                    <SelectItem value="reforma">Reforma</SelectItem>
                    <SelectItem value="investimento">Investimento</SelectItem>
                    <SelectItem value="capital">Capital de Giro</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Número de Parcelas Desejadas *</Label>
                <Select onValueChange={(value) => setLoanData({...loanData, desiredInstallments: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12x</SelectItem>
                    <SelectItem value="24">24x</SelectItem>
                    <SelectItem value="36">36x</SelectItem>
                    <SelectItem value="48">48x</SelectItem>
                    <SelectItem value="60">60x</SelectItem>
                    <SelectItem value="72">72x</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Banco para Crédito *</Label>
                <Select onValueChange={(value) => setLoanData({...loanData, bank: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bb">Banco do Brasil</SelectItem>
                    <SelectItem value="bradesco">Bradesco</SelectItem>
                    <SelectItem value="itau">Itaú</SelectItem>
                    <SelectItem value="santander">Santander</SelectItem>
                    <SelectItem value="caixa">Caixa Econômica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agency">Agência *</Label>
                <Input
                  id="agency"
                  value={loanData.agency}
                  onChange={(e) => setLoanData({...loanData, agency: e.target.value})}
                  placeholder="0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Número da Conta *</Label>
                <Input
                  id="accountNumber"
                  value={loanData.accountNumber}
                  onChange={(e) => setLoanData({...loanData, accountNumber: e.target.value})}
                  placeholder="00000-0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Conta *</Label>
                <Select onValueChange={(value) => setLoanData({...loanData, accountType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrente">Corrente</SelectItem>
                    <SelectItem value="poupanca">Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <IntegratorLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submeter Nova Proposta</h1>
          <p className="text-gray-600 mt-2">Preencha os dados do cliente para solicitar um empréstimo</p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator />

        {/* Form Card */}
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
                  onClick={handleNext}
                  className="koposol-gradient text-white hover:opacity-90 flex items-center"
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="koposol-gradient text-white hover:opacity-90"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Proposta'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </IntegratorLayout>
  );
};

export default SubmitProposal;
