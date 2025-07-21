import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, FileText, Image, X } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  name: string;
  url: string | null;
  type: 'pdf' | 'image';
}

interface DocumentViewerProps {
  documents: Document[];
  integratorName: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents, integratorName }) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleDownload = async (document: Document) => {
    if (!document.url) {
      toast.error('Documento não disponível');
      return;
    }

    try {
      const response = await fetch(document.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${integratorName}_${document.name}`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      toast.success('Download iniciado');
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error('Erro ao fazer download do documento');
    }
  };

  const renderDocumentPreview = (document: Document) => {
    if (!document.url) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Documento não disponível</p>
          </div>
        </div>
      );
    }

    if (document.type === 'image') {
      return (
        <div className="flex items-center justify-center">
          <img
            src={document.url}
            alt={document.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
            onError={() => toast.error('Erro ao carregar imagem')}
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">{document.name}</p>
            <p className="text-gray-500 text-sm">Clique em "Abrir PDF" para visualizar</p>
            <Button
              className="mt-3"
              onClick={() => window.open(document.url, '_blank')}
            >
              Abrir PDF
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Documentos Anexados</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {document.type === 'image' ? (
                  <Image className="h-5 w-5 text-blue-500" />
                ) : (
                  <FileText className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium text-gray-900">{document.name}</span>
              </div>
              
              {document.url ? (
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                  Disponível
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 border-red-200 text-red-800">
                  Não enviado
                </Badge>
              )}
            </div>

            {document.url && (
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>{document.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDocument(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      {selectedDocument && renderDocumentPreview(selectedDocument)}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => selectedDocument && handleDownload(selectedDocument)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(document)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentViewer;