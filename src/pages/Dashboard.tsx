
import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, DollarSign, PieChart, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Asset {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  current_price: number;
  current_value: number;
  asset_categories?: {
    name: string;
    color: string;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user]);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          asset_categories (
            name,
            color
          )
        `)
        .eq('user_id', user?.id)
        .limit(4);

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Erro ao buscar ativos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas do dashboard
  const totalValue = assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
  const totalInvested = assets.reduce((sum, asset) => sum + (asset.quantity * asset.current_price), 0);
  const totalGain = totalValue - totalInvested;
  const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const categoryDistribution = assets.reduce((acc, asset) => {
    const categoryName = asset.asset_categories?.name || 'Outros';
    const categoryColor = asset.asset_categories?.color || '#6B7280';
    
    if (!acc[categoryName]) {
      acc[categoryName] = { value: 0, color: categoryColor };
    }
    acc[categoryName].value += asset.current_value || 0;
    return acc;
  }, {} as Record<string, { value: number; color: string }>);

  const categoryData = Object.entries(categoryDistribution).map(([name, data]) => ({
    category: name,
    value: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    amount: formatCurrency(data.value),
    color: data.color
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Visão geral da sua carteira de investimentos</p>
        </div>
        <Button 
          onClick={() => navigate('/add-asset')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ativo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Patrimônio Total"
          value={formatCurrency(totalValue)}
          change={`${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%`}
          trend={gainPercent >= 0 ? "up" : "down"}
          icon={<Wallet className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Ganho/Perda"
          value={formatCurrency(totalGain)}
          trend={totalGain >= 0 ? "up" : "down"}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Total Investido"
          value={formatCurrency(totalInvested)}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Ativos na Carteira"
          value={assets.length.toString()}
          icon={<PieChart className="h-6 w-6 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assets */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ativos Recentes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/portfolio')}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">
                Carregando ativos...
              </div>
            ) : assets.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">Você ainda não possui ativos cadastrados</p>
                <Button onClick={() => navigate('/add-asset')} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Ativo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-700">{asset.ticker}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{asset.ticker}</p>
                        <p className="text-sm text-slate-500">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{formatCurrency(asset.current_price)}</p>
                      <p className="text-sm text-slate-500">{asset.quantity} unidades</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nenhuma categoria encontrada
              </div>
            ) : (
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{category.category}</span>
                      <span className="text-sm text-slate-900">{category.value.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${category.value}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500">{category.amount}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/add-asset')}>
              <Plus className="h-6 w-6 mb-2" />
              Adicionar Ativo
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/portfolio')}>
              <Eye className="h-6 w-6 mb-2" />
              Ver Carteira
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/reports')}>
              <TrendingUp className="h-6 w-6 mb-2" />
              Relatórios
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/analytics')}>
              <PieChart className="h-6 w-6 mb-2" />
              Análises
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
