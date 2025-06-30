
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DividendForm } from "@/components/DividendForm";
import { DividendsSummary } from "@/components/DividendsSummary";
import { DividendsList } from "@/components/DividendsList";

interface Asset {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
}

interface Dividend {
  id: string;
  type: 'dividend' | 'jcp';
  amount: number;
  shares_quantity: number;
  amount_per_share: number;
  payment_date: string;
  ex_dividend_date?: string;
  record_date?: string;
  notes?: string;
  assets: {
    ticker: string;
    name: string;
  };
}

export default function Dividends() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);

  useEffect(() => {
    if (user) {
      fetchAssets();
      fetchDividends();
    }
  }, [user]);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('id, ticker, name, quantity')
        .eq('user_id', user?.id)
        .gt('quantity', 0)
        .order('ticker');

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Erro ao buscar ativos:', error);
    }
  };

  const fetchDividends = async () => {
    try {
      const { data, error } = await supabase
        .from('dividends')
        .select(`
          *,
          assets (
            ticker,
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      // Cast the type property to ensure TypeScript compatibility
      const typedDividends = (data || []).map(dividend => ({
        ...dividend,
        type: dividend.type as 'dividend' | 'jcp'
      }));
      
      setDividends(typedDividends);
    } catch (error) {
      console.error('Erro ao buscar dividendos:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dividendos</h1>
          <p className="text-slate-600 mt-1">Gerencie seus dividendos e JCP recebidos</p>
        </div>
        <DividendForm assets={assets} onDividendAdded={fetchDividends} />
      </div>

      <DividendsSummary dividends={dividends} />
      <DividendsList dividends={dividends} />
    </div>
  );
}
