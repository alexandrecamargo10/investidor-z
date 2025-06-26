
-- Criar tabela de subcategorias
CREATE TABLE public.asset_subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.asset_categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar tabela de ativos favoritos/watchlist
CREATE TABLE public.watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  name TEXT NOT NULL,
  current_price DECIMAL(18,2) DEFAULT 0,
  change_24h DECIMAL(18,2) DEFAULT 0,
  change_percent_24h DECIMAL(8,4) DEFAULT 0,
  market_cap DECIMAL(20,2),
  volume_24h DECIMAL(20,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, ticker)
);

-- Criar tabela de dividendos
CREATE TABLE public.dividends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('dividend', 'jcp')) NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  shares_quantity DECIMAL(18,8) NOT NULL,
  amount_per_share DECIMAL(18,4) NOT NULL,
  payment_date DATE NOT NULL,
  ex_dividend_date DATE,
  record_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Inserir subcategorias padrão
INSERT INTO public.asset_subcategories (name, category_id) 
SELECT 'Bancos', id FROM public.asset_categories WHERE name = 'Ações'
UNION ALL
SELECT 'Tecnologia', id FROM public.asset_categories WHERE name = 'Ações'
UNION ALL
SELECT 'Energia', id FROM public.asset_categories WHERE name = 'Ações'
UNION ALL
SELECT 'Mineração', id FROM public.asset_categories WHERE name = 'Ações'
UNION ALL
SELECT 'Varejo', id FROM public.asset_categories WHERE name = 'Ações'
UNION ALL
SELECT 'Telecomunicações', id FROM public.asset_categories WHERE name = 'Ações'
UNION ALL
SELECT 'Tijolo', id FROM public.asset_categories WHERE name = 'FIIs'
UNION ALL
SELECT 'Papel', id FROM public.asset_categories WHERE name = 'FIIs'
UNION ALL
SELECT 'Logística', id FROM public.asset_categories WHERE name = 'FIIs'
UNION ALL
SELECT 'Shoppings', id FROM public.asset_categories WHERE name = 'FIIs'
UNION ALL
SELECT 'Hospitalar', id FROM public.asset_categories WHERE name = 'FIIs'
UNION ALL
SELECT 'Selic', id FROM public.asset_categories WHERE name = 'Tesouro Direto'
UNION ALL
SELECT 'IPCA+', id FROM public.asset_categories WHERE name = 'Tesouro Direto'
UNION ALL
SELECT 'Prefixado', id FROM public.asset_categories WHERE name = 'Tesouro Direto'
UNION ALL
SELECT 'Bitcoin', id FROM public.asset_categories WHERE name = 'Criptomoedas'
UNION ALL
SELECT 'Ethereum', id FROM public.asset_categories WHERE name = 'Criptomoedas'
UNION ALL
SELECT 'Altcoins', id FROM public.asset_categories WHERE name = 'Criptomoedas'
UNION ALL
SELECT 'CDB', id FROM public.asset_categories WHERE name = 'Renda Fixa'
UNION ALL
SELECT 'LCI/LCA', id FROM public.asset_categories WHERE name = 'Renda Fixa'
UNION ALL
SELECT 'Debêntures', id FROM public.asset_categories WHERE name = 'Renda Fixa';

-- Adicionar coluna subcategory_id na tabela assets
ALTER TABLE public.assets ADD COLUMN subcategory_id UUID REFERENCES public.asset_subcategories(id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.asset_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dividends ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para asset_subcategories (todos autenticados podem ler)
CREATE POLICY "Anyone can view asset subcategories" ON public.asset_subcategories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can insert asset subcategories" ON public.asset_subcategories
  FOR INSERT TO authenticated WITH CHECK (true);

-- Políticas RLS para watchlist
CREATE POLICY "Users can view own watchlist" ON public.watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist" ON public.watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist" ON public.watchlist
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist" ON public.watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para dividends
CREATE POLICY "Users can view own dividends" ON public.dividends
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dividends" ON public.dividends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dividends" ON public.dividends
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dividends" ON public.dividends
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar preços dos ativos (será chamada pelas Edge Functions)
CREATE OR REPLACE FUNCTION public.update_asset_prices()
RETURNS void AS $$
BEGIN
  -- Esta função será preenchida pelas Edge Functions
  -- que buscarão dados das APIs externas
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
