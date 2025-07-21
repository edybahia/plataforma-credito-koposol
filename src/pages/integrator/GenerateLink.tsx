
import React, { useState } from 'react';
import IntegratorLayout from '@/components/IntegratorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link2, Copy, Clock, CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

const GenerateLink = () => {
  const [generatedLink, setGeneratedLink] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expirationTime, setExpirationTime] = useState<string>('');

  const generateLink = () => {
    setIsGenerating(true);
    
    // Simulate link generation
    setTimeout(() => {
      const linkId = Math.random().toString(36).substring(2, 15);
      const link = `https://koposol.app/proposal/${linkId}`;
      setGeneratedLink(link);
      
      // Set expiration time (30 minutes from now)
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 30);
      setExpirationTime(expiration.toLocaleString('pt-BR'));
      
      setIsGenerating(false);
      toast.success('Link gerado com sucesso!');
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Link copiado para a área de transferência!');
  };

  const sendByEmail = () => {
    if (!clientEmail) {
      toast.error('Por favor, informe o e-mail do cliente');
      return;
    }
    
    // Simulate email sending
    toast.success('E-mail enviado com sucesso para o cliente!');
  };

  const recentLinks = [
    {
      clientName: 'João Silva',
      generatedAt: '2024-01-15 14:30',
      expiresAt: '2024-01-15 15:00',
      status: 'Enviado',
      filled: true
    },
    {
      clientName: 'Maria Santos',
      generatedAt: '2024-01-15 10:15',
      expiresAt: '2024-01-15 10:45',
      status: 'Expirado',
      filled: false
    },
    {
      clientName: 'Pedro Costa',
      generatedAt: '2024-01-14 16:20',
      expiresAt: '2024-01-14 16:50',
      status: 'Preenchido',
      filled: true
    }
  ];

  return (
    <IntegratorLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerar Link de Proposta</h1>
          <p className="text-gray-600 mt-2">
            Crie um link único para que seu cliente preencha a proposta diretamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generate Link Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link2 className="h-5 w-5 text-purple-600" />
                <span>Gerar Novo Link</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome do Cliente (Opcional)</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome para identificação"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">E-mail do Cliente (Opcional)</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>
              </div>

              <Button
                onClick={generateLink}
                disabled={isGenerating}
                className="w-full koposol-gradient text-white hover:opacity-90"
              >
                {isGenerating ? 'Gerando Link...' : 'Gerar Link'}
              </Button>

              {/* Generated Link */}
              {generatedLink && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Link gerado com sucesso!</span>
                  </div>

                  <div className="space-y-2">
                    <Label>Link da Proposta</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="bg-white"
                      />
                      <Button
                        variant="outline"
                        onClick={copyToClipboard}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Alert className="border-orange-200 bg-orange-50">
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-orange-800">
                      <strong>Atenção:</strong> Este link expira em 30 minutos ({expirationTime})
                    </AlertDescription>
                  </Alert>

                  {clientEmail && (
                    <Button
                      onClick={sendByEmail}
                      variant="outline"
                      className="w-full border-green-500 text-green-700 hover:bg-green-50"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar por E-mail para {clientEmail}
                    </Button>
                  )}
                </div>
              )}

              {/* Instructions */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• O link permite que o cliente preencha todos os dados necessários</li>
                  <li>• Após preenchimento, a proposta aparecerá automaticamente no seu kanban</li>
                  <li>• O link expira em 30 minutos por segurança</li>
                  <li>• Você pode enviar direto por e-mail ou copiar e enviar via WhatsApp</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Links */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Links Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLinks.map((link, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {link.clientName || 'Cliente não informado'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Gerado em: {link.generatedAt}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expira em: {link.expiresAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          link.status === 'Preenchido' ? 'bg-green-100 text-green-800' :
                          link.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {link.status}
                        </span>
                      </div>
                    </div>
                    
                    {link.filled && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                        ✅ Proposta preenchida pelo cliente
                      </div>
                    )}
                  </div>
                ))}

                {recentLinks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum link gerado ainda</p>
                    <p className="text-sm">Gere seu primeiro link para começar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="mt-8 shadow-xl border-0">
          <CardHeader>
            <CardTitle>Vantagens do Link de Proposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Economia de Tempo</h3>
                <p className="text-sm text-gray-600">
                  O cliente preenche diretamente, eliminando a necessidade de 
                  coletar dados manualmente
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dados Precisos</h3>
                <p className="text-sm text-gray-600">
                  Reduz erros de digitação e garante que o cliente 
                  forneça informações corretas
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Facilidade de Envio</h3>
                <p className="text-sm text-gray-600">
                  Compartilhe via WhatsApp, e-mail ou qualquer meio 
                  de comunicação de sua preferência
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </IntegratorLayout>
  );
};

export default GenerateLink;
