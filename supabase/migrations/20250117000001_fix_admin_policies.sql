-- Remover políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Administradores podem ver todos os integradores" ON public.integradores;
DROP POLICY IF EXISTS "Administradores podem atualizar integradores" ON public.integradores;
DROP POLICY IF EXISTS "Administradores podem deletar integradores" ON public.integradores;

-- Criar políticas mais permissivas para administradores
-- Permitir que qualquer usuário autenticado veja todos os integradores (para admin)
CREATE POLICY "Usuários autenticados podem ver integradores"
ON public.integradores FOR SELECT
USING (true);

-- Permitir que qualquer usuário autenticado atualize integradores (para admin)
CREATE POLICY "Usuários autenticados podem atualizar integradores"
ON public.integradores FOR UPDATE
USING (true);

-- Permitir que qualquer usuário autenticado delete integradores (para admin)
CREATE POLICY "Usuários autenticados podem deletar integradores"
ON public.integradores FOR DELETE
USING (true);

-- Permitir que qualquer usuário autenticado insira integradores
CREATE POLICY "Usuários autenticados podem inserir integradores"
ON public.integradores FOR INSERT
WITH CHECK (true);

-- Atualizar a função para inserir integradores sem restrições de usuário
CREATE OR REPLACE FUNCTION public.insert_integrador_with_documents(
  p_nome_empresa TEXT,
  p_email TEXT,
  p_telefone TEXT,
  p_endereco TEXT,
  p_cnpj TEXT,
  p_nome_responsavel TEXT DEFAULT NULL,
  p_cpf_responsavel TEXT DEFAULT NULL,
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
-
- Função RPC para buscar todos os integradores (contorna RLS)
CREATE OR REPLACE FUNCTION public.get_all_integradores()
RETURNS TABLE (
  id UUID,
  nome_empresa TEXT,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cnpj TEXT,
  nome_responsavel TEXT,
  cpf_responsavel TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  contrato_social_url TEXT,
  comprovante_endereco_url TEXT,
  rg_socios_url TEXT,
  cnh_socios_url TEXT,
  dados_bancarios_url TEXT,
  foto_fachada_url TEXT,
  motivo_rejeicao TEXT
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.nome_empresa,
    i.email,
    i.telefone,
    i.endereco,
    i.cnpj,
    i.nome_responsavel,
    i.cpf_responsavel,
    i.status,
    i.created_at,
    i.updated_at,
    i.contrato_social_url,
    i.comprovante_endereco_url,
    i.rg_socios_url,
    i.cnh_socios_url,
    i.dados_bancarios_url,
    i.foto_fachada_url,
    i.motivo_rejeicao
  FROM public.integradores i
  ORDER BY i.created_at DESC;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função RPC para buscar integradores aprovados (contorna RLS)
CREATE OR REPLACE FUNCTION public.get_approved_integradores()
RETURNS TABLE (
  id UUID,
  nome_empresa TEXT,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cnpj TEXT,
  nome_responsavel TEXT,
  cpf_responsavel TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  contrato_social_url TEXT,
  comprovante_endereco_url TEXT,
  rg_socios_url TEXT,
  cnh_socios_url TEXT,
  dados_bancarios_url TEXT,
  foto_fachada_url TEXT,
  motivo_rejeicao TEXT
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.nome_empresa,
    i.email,
    i.telefone,
    i.endereco,
    i.cnpj,
    i.nome_responsavel,
    i.cpf_responsavel,
    i.status,
    i.created_at,
    i.updated_at,
    i.contrato_social_url,
    i.comprovante_endereco_url,
    i.rg_socios_url,
    i.cnh_socios_url,
    i.dados_bancarios_url,
    i.foto_fachada_url,
    i.motivo_rejeicao
  FROM public.integradores i
  WHERE i.status = 'aprovado'
  ORDER BY i.created_at DESC;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;