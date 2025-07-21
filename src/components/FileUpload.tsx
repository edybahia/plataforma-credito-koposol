
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  label: string;
  required?: boolean;
  onFileSelect?: (file: File) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  required = true, 
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande! Tamanho máximo: 5MB');
      return;
    }

    // Verificar tipo do arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado! Use PDF, JPG ou PNG');
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
    toast.success('Arquivo selecionado com sucesso!');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : selectedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-6 w-6 text-green-500" />
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <p className="text-sm text-green-700 font-medium">{selectedFile.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-green-600">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">
              {dragActive 
                ? 'Solte o arquivo aqui...' 
                : 'Clique para enviar ou arraste o arquivo aqui'
              }
            </p>
            <p className="text-xs text-gray-400">PDF, JPG ou PNG até 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
