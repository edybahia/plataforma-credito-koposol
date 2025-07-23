
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  label: string;
  required?: boolean;
  onFileSelect?: (files: File[]) => void; // Alterado para retornar um array de arquivos
  accept?: string;
  multiple?: boolean; // Nova propriedade para múltiplos arquivos
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  required = true, 
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false // Padrão para um único arquivo
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Alterado para um array de arquivos
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFileSelect(files);
    }
  };

  const handleFileSelect = (files: File[]) => {
    let newFiles = multiple ? [...selectedFiles, ...files] : [...files];

    // Filtrar arquivos duplicados
    newFiles = newFiles.filter((file, index, self) =>
      index === self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    // Validar cada arquivo
    const validFiles = newFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Arquivo '${file.name}' é muito grande! Tamanho máximo: 5MB`);
        return false;
      }
      const allowedTypes = accept.split(',').map(t => t.trim());
      // Simple mime type check from extension. For robust check, use file.type
      const fileExtension = `.${file.name.split('.').pop()}`;
      if (!allowedTypes.includes(fileExtension) && !allowedTypes.includes(file.type)) {
         toast.error(`Tipo de arquivo '${file.name}' não suportado!`);
         return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFileSelect?.(validFiles);
      toast.success(`${validFiles.length} arquivo(s) selecionado(s) com sucesso!`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(Array.from(e.target.files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = selectedFiles.filter(file => file !== fileToRemove);
    setSelectedFiles(updatedFiles);
    onFileSelect?.(updatedFiles);
    // Reset input value to allow re-selecting the same file after removing
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : selectedFiles.length > 0
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
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {selectedFiles.length > 0 ? (
          <div className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-2 text-left">Arquivos Selecionados:</p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate" title={file.name}>{file.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                     <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {multiple && (
              <p className="text-xs text-gray-500 mt-2 text-center">Você pode adicionar mais arquivos.</p>
            )}
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
