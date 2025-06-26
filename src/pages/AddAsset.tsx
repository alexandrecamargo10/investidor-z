
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

interface StockData {
  ticker: string;
  name: string;
  currentPrice: number;
  currency: string;
}

export default function AddAsset() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchingStock, setSearchingStock] = useState(false);

  const [formData, setFormData] = useState({
    ticker: '',
    name: '',
    categoryId: '',
    subcategoryId: '',
    quantity: '',
    price: '',
    type: 'buy' as 'buy' | 'sell'
  });

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter(sub => sub.category_id === formData.categoryId);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId, subcategories]);

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

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_subcategories')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
    }
  };

  const searchStock = async () => {
    if (!formData.ticker.trim()) return;

    setSearchingStock(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
        body: { ticker: formData.ticker.toUpperCase() }
      });

      if (error) throw error;

      if (data) {
        setFormData(prev => ({
          ...prev,
          name: data.name,
          price: data.currentPrice.toString()
        }));
        
        toast({
          title: "Ativo encontrado!",
          description: `${data.name} - R$ ${data.currentPrice.toFixed(2)}`,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do ativo:', error);
      toast({
        title: "Erro ao buscar ativo",
        description: "Não foi possível obter dados do ativo. Preencha manualmente.",
        variant: "destructive"
      });
    } finally {
      setSearchingStock(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // First, check if asset already exists
      const { data: existingAsset } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .eq('ticker', formData.ticker.toUpperCase())
        .single();

      const quantity = parseFloat(formData.quantity);
      const price = parseFloat(formData.price);
      const totalAmount = quantity * price;

      if (existingAsset) {
        // Update existing asset
        const newQuantity = formData.type === 'buy' 
          ? existingAsset.quantity + quantity
          : existingAsset.quantity - quantity;

        const newTotalInvested = formData.type === 'buy'
          ? existingAsset.total_invested + totalAmount
          : existingAsset.total_invested - totalAmount;

        const newAveragePrice = newQuantity > 0 ? newTotalInvested / newQuantity : 0;

        const { error: updateError } = await supabase
          .from('assets')
          .update({
            quantity: newQuantity,
            average_price: newAveragePrice,
            current_price: price,
            total_invested: newTotalInvested,
            current_value: newQuantity * price,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAsset.id);

        if (updateError) throw updateError;
      } else {
        // Create new asset
        const { error: insertAssetError } = await supabase
          .from('assets')
          .insert({
            user_id: user.id,
            ticker: formData.ticker.toUpperCase(),
            name: formData.name,
            category_id: formData.categoryId || null,
            subcategory_id: formData.subcategoryId || null,
            quantity: formData.type === 'buy' ? quantity : -quantity,
            average_price: price,
            current_price: price,
            total_invested: formData.type === 'buy' ? totalAmount : -totalAmount,
            current_value: quantity * price
          });

        if (insertAssetError) throw insertAssetError;
      }

      // Add transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          asset_id: existingAsset?.id || null, // We'd need to get the new asset ID for new assets
          type: formData.type,
          quantity: quantity,
          price: price,
          total_amount: totalAmount,
          transaction_date: new Date().toISOString().split('T')[0]
        });

      if (transactionError) console.error('Transaction error:', transactionError);

      toast({
        title: "Ativo adicionado com sucesso!",
        description: `${formData.ticker} foi ${formData.type === 'buy' ? 'comprado' : 'vendido'}.`,
      });

      navigate('/portfolio');
    } catch (error) {
      console.error('Erro ao adicionar ativo:', error);
      toast({
        title: "Erro ao adicionar ativo",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Adicionar Ativo</h1>
        <p className="text-slate-600 mt-1">Registre uma nova compra ou venda de ativo</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Operação</Label>
                <Select value={formData.type} onValueChange={(value: 'buy' | 'sell') => 
                  setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Compra</SelectItem>
                    <SelectItem value="sell">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker</Label>
                <div className="flex gap-2">
                  <Input
                    id="ticker"
                    value={formData.ticker}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      ticker: e.target.value.toUpperCase() 
                    }))}
                    placeholder="Ex: ITUB4, VALE3"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={searchStock}
                    disabled={searchingStock || !formData.ticker.trim()}
                  >
                    {searchingStock ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Ativo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo do ativo"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.categoryId} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, categoryId: value, subcategoryId: '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategoria</Label>
                <Select 
                  value={formData.subcategoryId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoryId: value }))}
                  disabled={!formData.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.00000001"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço por Unidade (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {formData.quantity && formData.price && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Total da Operação:</p>
                <p className="text-2xl font-bold text-slate-900">
                  R$ {(parseFloat(formData.quantity) * parseFloat(formData.price)).toFixed(2)}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/portfolio')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Ativo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
