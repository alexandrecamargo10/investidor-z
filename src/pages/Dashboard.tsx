
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, DollarSign, PieChart, Plus, Eye } from "lucide-react";

export default function Dashboard() {
  // Mock data - será substituído por dados reais posteriormente
  const portfolioData = {
    totalValue: "R$ 125.430,50",
    totalChange: "+R$ 8.230,20 (7,01%)",
    dividends: "R$ 2.340,80",
    dividendsChange: "+12,5%",
    monthlyYield: "1,85%",
    yearlyYield: "18,2%"
  };

  const recentAssets = [
    { ticker: "ITUB4", name: "Itaú Unibanco", quantity: 100, currentPrice: "R$ 32,45", change: "+2,1%", trend: "up" },
    { ticker: "VALE3", name: "Vale S.A.", quantity: 50, currentPrice: "R$ 68,90", change: "-1,2%", trend: "down" },
    { ticker: "PETR4", name: "Petrobras", quantity: 80, currentPrice: "R$ 28,75", change: "+3,4%", trend: "up" },
    { ticker: "HGLG11", name: "CSHG Logística", quantity: 200, currentPrice: "R$ 159,30", change: "+0,8%", trend: "up" },
  ];

  const categoryDistribution = [
    { category: "Ações", value: 65, amount: "R$ 81.530,00", color: "bg-financialBlue-500" },
    { category: "FIIs", value: 25, amount: "R$ 31.360,00", color: "bg-financialGreen-500" },
    { category: "Renda Fixa", value: 10, amount: "R$ 12.540,00", color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Visão geral da sua carteira de investimentos</p>
        </div>
        <Button className="bg-financialBlue-600 hover:bg-financialBlue-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ativo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Patrimônio Total"
          value={portfolioData.totalValue}
          change={portfolioData.totalChange}
          trend="up"
          icon={<Wallet className="h-6 w-6 text-financialBlue-600" />}
        />
        <StatCard
          title="Dividendos/Mês"
          value={portfolioData.dividends}
          change={portfolioData.dividendsChange}
          trend="up"
          icon={<DollarSign className="h-6 w-6 text-financialGreen-600" />}
        />
        <StatCard
          title="Rentabilidade Mensal"
          value={portfolioData.monthlyYield}
          trend="up"
          icon={<TrendingUp className="h-6 w-6 text-financialBlue-600" />}
        />
        <StatCard
          title="Rentabilidade Anual"
          value={portfolioData.yearlyYield}
          trend="up"
          icon={<PieChart className="h-6 w-6 text-financialGreen-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assets */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ativos Recentes</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-financialBlue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-financialBlue-700">{asset.ticker}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{asset.ticker}</p>
                      <p className="text-sm text-slate-500">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{asset.currentPrice}</p>
                    <p className={`text-sm ${asset.trend === 'up' ? 'text-financialGreen-600' : 'text-red-500'}`}>
                      {asset.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryDistribution.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">{category.category}</span>
                    <span className="text-sm text-slate-900">{category.value}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500">{category.amount}</p>
                </div>
              ))}
            </div>
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
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Adicionar Ativo
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Ver Relatório
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Dividendos
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <PieChart className="h-6 w-6 mb-2" />
              Análises
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
