-- Adicionar campos para documentos na tabela integradores
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS contrato_social_url TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS comprovante_endereco_url TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS rg_socios_url TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS cnh_socios_url TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS dados_bancarios_url TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS foto_fachada_url TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS nome_responsavel TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS cpf_responsavel TEXT;
ALTER TABLE public.integradores ADD COLUMN IF NOT EXISTS motivo_rejeicao TEXT;

-- Criar bucket para armazenar documentos dos integradores
INSERT INTO storage.buckets (id, name, public) 
VALUES ('integrador-documents', 'integrador-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de documentos
CREATE POLICY "Integradores podem fazer upload de documentos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'integrador-documents' AND auth.role() = 'authenticated');

-- Política para permitir visualização de documentos
CREATE POLICY "Documentos são públicos para visualização"
ON storage.objects FOR SELECT
USING (bucket_id = 'integrador-documents');

-- Política para permitir atualização de documentos
CREATE POLICY "Integradores podem atualizar seus documentos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'integrador-documents' AND auth.role() = 'authenticated');

-- Política para permitir exclusão de documentos
CREATE POLICY "Integradores podem deletar seus documentos"
ON storage.objects FOR DELETE
USING (bucket_id = 'integrador-documents' AND auth.role() = 'authenticated');

-- Função para inserir integrador com documentos
CREATE OR REPLACE FUNCTION public.insert_integrador_with_documents(
  p_nome_empresa TEXT,
  p_email TEXT,
  p_telefone TEXT,
  p_endereco TEXT,
  p_cnpj TEXT,
  p_nome_responsavel TEXT,
  p_cpf_responsavel TEXT,
  p_contrato_social_url TEXT DEFAULT NULL,
  p_comprovante_endereco_url TEXT DEFAULT NULL,
  p_rg_socios_url TEXT DEFAULT NULL,
  p_cnh_socios_url TEXT DEFAULT NULL,
  p_dados_bancarios_url TEXT DEFAULT NULL,
  p_foto_fachada_url TEXT DEFAULT NULL
)
RETURNS UUID AS $
DECLARE
  integrador_id UUID;
BEGIN
  INSERT INTO public.integradores (
    nome_empresa,
    email,
    telefone,
    endereco,
    cnpj,
    nome_responsavel,
    cpf_responsavel,
    contrato_social_url,
    comprovante_endereco_url,
    rg_socios_url,
    cnh_socios_url,
    dados_bancarios_url,
    foto_fachada_url,
    status
  ) VALUES (
    p_nome_empresa,
    p_email,
    p_telefone,
    p_endereco,
    p_cnpj,
    p_nome_responsavel,
    p_cpf_responsavel,
    p_contrato_social_url,
    p_comprovante_endereco_url,
    p_rg_socios_url,
    p_cnh_socios_url,
    p_dados_bancarios_url,
    p_foto_fachada_url,
    'pendente'
  ) RETURNING id INTO integrador_id;
  
  RETURN integrador_id;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para permitir que administradores vejam todos os integradores
CREATE POLICY "Administradores podem ver todos os integradores"
ON public.integradores FOR SELECT
USING (true);

-- Política para permitir que administradores atualizem integradores
CREATE POLICY "Administradores podem atualizar integradores"
ON public.integradores FOR UPDATE
USING (true);

-- Política para permitir que administradores deletem integradores
CREATE POLICY "Administradores podem deletar integradores"
ON public.integradores FOR DELETE
USING (true);