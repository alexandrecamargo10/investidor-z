
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Edit, Trash2, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Asset {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  average_price: number;
  current_price: number;
  current_value: number;
  total_invested: number;
  asset_categories?: {
    name: string;
    color: string;
  };
  asset_subcategories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function Portfolio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssets();
      fetchCategories();
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
          ),
          asset_subcategories (
            name
          )
        `)
        .eq('user_id', user?.id)
        .gt('quantity', 0);

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Erro ao buscar ativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || asset.asset_categories?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category?: { name: string; color: string }) => {
    if (!category) return "bg-slate-100 text-slate-800";
    return `bg-${category.color}-100 text-${category.color}-800`;
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

  const calculateGainLoss = (asset: Asset) => {
    const gain = asset.current_value - asset.total_invested;
    const gainPercent = asset.total_invested > 0 ? (gain / asset.total_invested) * 100 : 0;
    return { gain, gainPercent };
  };

  // Calculate portfolio statistics
  const totalValue = filteredAssets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
  const totalInvested = filteredAssets.reduce((sum, asset) => sum + (asset.total_invested || 0), 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  // Category distribution
  const categoryDistribution = filteredAssets.reduce((acc, asset) => {
    const categoryName = asset.asset_categories?.name || 'Outros';
    if (!acc[categoryName]) {
      acc[categoryName] = { value: 0, color: asset.asset_categories?.color || '#6B7280' };
    }
    acc[categoryName].value += asset.current_value || 0;
    return acc;
  }, {} as Record<string, { value: number; color: string }>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Minha Carteira</h1>
          <p className="text-slate-600 mt-1">Gerencie todos os seus investimentos</p>
        </div>
        <Button 
          onClick={() => navigate('/add-asset')} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-slate-400 mb-4">
              {assets.length === 0 ? (
                <>
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    Sua carteira está vazia
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Comece adicionando seu primeiro ativo para acompanhar seus investimentos
                  </p>
                  <Button onClick={() => navigate('/add-asset')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Ativo
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Nenhum ativo encontrado
                  </h3>
                  <p className="text-slate-500">
                    Tente ajustar os filtros de busca
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ativos na Carteira ({filteredAssets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Preço Médio</TableHead>
                    <TableHead className="text-right">Cotação Atual</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Rentabilidade</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => {
                    const { gain, gainPercent } = calculateGainLoss(asset);
                    return (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900">{asset.ticker}</div>
                            <div className="text-sm text-slate-500">{asset.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge className={getCategoryColor(asset.asset_categories)}>
                              {asset.asset_categories?.name || 'Outros'}
                            </Badge>
                            {asset.asset_subcategories && (
                              <div className="text-xs text-slate-500">{asset.asset_subcategories.name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {asset.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(asset.average_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(asset.current_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(asset.current_value)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end gap-1 ${
                            gain >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}>
                            {gain >= 0 ? 
                              <TrendingUp className="h-4 w-4" /> : 
                              <TrendingDown className="h-4 w-4" />
                            }
                            <div>
                              <div className="font-medium">{formatCurrency(gain)}</div>
                              <div className="text-sm">{formatPercent(gainPercent)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {filteredAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Total da Carteira</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Rentabilidade Total</h3>
                <p className={`text-3xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {formatCurrency(totalGain)}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {formatPercent(totalGainPercent)} no período
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
                  {Object.keys(categoryDistribution).length} categorias
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
