-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  email TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Criar tabela de integradores
CREATE TABLE public.integradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome_empresa TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  cnpj TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela integradores
ALTER TABLE public.integradores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para integradores
CREATE POLICY "Integradores podem ver seus próprios dados"
ON public.integradores FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Integradores podem atualizar seus próprios dados"
ON public.integradores FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Integradores podem inserir seus próprios dados"
ON public.integradores FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Criar tabela de propostas
CREATE TABLE public.propostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integrador_id UUID REFERENCES public.integradores(id) ON DELETE CASCADE NOT NULL,
  simulacao_id UUID REFERENCES public.simulacoes(id) ON DELETE SET NULL,
  nome_cliente TEXT NOT NULL,
  email_cliente TEXT,
  telefone_cliente TEXT,
  endereco_instalacao TEXT,
  valor_proposta NUMERIC,
  status TEXT DEFAULT 'pendente',
  observacoes TEXT,
  data_validade DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela propostas
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para propostas
CREATE POLICY "Integradores podem ver suas próprias propostas"
ON public.propostas FOR SELECT
USING (integrador_id IN (SELECT id FROM public.integradores WHERE user_id = auth.uid()));

CREATE POLICY "Integradores podem criar propostas"
ON public.propostas FOR INSERT
WITH CHECK (integrador_id IN (SELECT id FROM public.integradores WHERE user_id = auth.uid()));

CREATE POLICY "Integradores podem atualizar suas próprias propostas"
ON public.propostas FOR UPDATE
USING (integrador_id IN (SELECT id FROM public.integradores WHERE user_id = auth.uid()));

CREATE POLICY "Integradores podem deletar suas próprias propostas"
ON public.propostas FOR DELETE
USING (integrador_id IN (SELECT id FROM public.integradores WHERE user_id = auth.uid()));

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers nas tabelas
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integradores_updated_at
  BEFORE UPDATE ON public.integradores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_propostas_updated_at
  BEFORE UPDATE ON public.propostas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Criar função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar a função quando novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();