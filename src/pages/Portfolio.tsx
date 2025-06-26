
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";

export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data
  const assets = [
    {
      id: 1,
      ticker: "ITUB4",
      name: "Itaú Unibanco",
      category: "Ação",
      subcategory: "Bancos",
      quantity: 100,
      avgPrice: 30.20,
      currentPrice: 32.45,
      totalValue: 3245.00,
      change: 7.45,
      changePercent: 2.30,
      trend: "up"
    },
    {
      id: 2,
      ticker: "VALE3",
      name: "Vale S.A.",
      category: "Ação", 
      subcategory: "Mineração",
      quantity: 50,
      avgPrice: 70.00,
      currentPrice: 68.90,
      totalValue: 3445.00,
      change: -55.00,
      changePercent: -1.57,
      trend: "down"
    },
    {
      id: 3,
      ticker: "HGLG11",
      name: "CSHG Logística",
      category: "FII",
      subcategory: "Logística",
      quantity: 200,
      avgPrice: 155.00,
      currentPrice: 159.30,
      totalValue: 31860.00,
      change: 860.00,
      changePercent: 2.77,
      trend: "up"
    },
    {
      id: 4,
      ticker: "TESOURO SELIC",
      name: "Tesouro Selic 2029",
      category: "Renda Fixa",
      subcategory: "Tesouro Direto",
      quantity: 1,
      avgPrice: 12540.00,
      currentPrice: 12640.30,
      totalValue: 12640.30,
      change: 100.30,
      changePercent: 0.80,
      trend: "up"
    }
  ];

  const filteredAssets = assets.filter(asset =>
    asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Ação":
        return "bg-financialBlue-100 text-financialBlue-800";
      case "FII":
        return "bg-financialGreen-100 text-financialGreen-800";
      case "Renda Fixa":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Minha Carteira</h1>
          <p className="text-slate-600 mt-1">Gerencie todos os seus investimentos</p>
        </div>
        <Button className="bg-financialBlue-600 hover:bg-financialBlue-700">
          Adicionar Ativo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por ticker ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ativos na Carteira ({filteredAssets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Ativo</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Categoria</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Quantidade</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Preço Médio</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Cotação Atual</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Valor Total</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Rentabilidade</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{asset.ticker}</div>
                        <div className="text-sm text-slate-500">{asset.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <Badge className={getCategoryColor(asset.category)}>
                          {asset.category}
                        </Badge>
                        <div className="text-xs text-slate-500">{asset.subcategory}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {asset.quantity}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {formatCurrency(asset.avgPrice)}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {formatCurrency(asset.currentPrice)}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {formatCurrency(asset.totalValue)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${
                        asset.trend === 'up' ? 'text-financialGreen-600' : 'text-red-500'
                      }`}>
                        {asset.trend === 'up' ? 
                          <TrendingUp className="h-4 w-4" /> : 
                          <TrendingDown className="h-4 w-4" />
                        }
                        <div>
                          <div className="font-medium">{formatCurrency(asset.change)}</div>
                          <div className="text-sm">{formatPercent(asset.changePercent)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Total da Carteira</h3>
              <p className="text-3xl font-bold text-financialBlue-600">
                {formatCurrency(filteredAssets.reduce((sum, asset) => sum + asset.totalValue, 0))}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Rentabilidade Total</h3>
              <p className="text-3xl font-bold text-financialGreen-600">
                {formatCurrency(filteredAssets.reduce((sum, asset) => sum + asset.change, 0))}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {formatPercent(8.5)} no período
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ativos na Carteira</h3>
              <p className="text-3xl font-bold text-slate-700">{filteredAssets.length}</p>
              <p className="text-sm text-slate-500 mt-1">
                {new Set(filteredAssets.map(asset => asset.category)).size} categorias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
