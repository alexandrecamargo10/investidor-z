
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, Calendar, Trash2, Edit } from "lucide-react";

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
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    assetId: '',
    type: 'dividend' as 'dividend' | 'jcp',
    amount: '',
    shares_quantity: '',
    payment_date: '',
    ex_dividend_date: '',
    record_date: '',
    notes: ''
  });

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
      setDividends(data || []);
    } catch (error) {
      console.error('Erro ao buscar dividendos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const amount = parseFloat(formData.amount);
      const shares_quantity = parseFloat(formData.shares_quantity);
      const amount_per_share = amount / shares_quantity;

      const { error } = await supabase
        .from('dividends')
        .insert({
          user_id: user.id,
          asset_id: formData.assetId,
          type: formData.type,
          amount: amount,
          shares_quantity: shares_quantity,
          amount_per_share: amount_per_share,
          payment_date: formData.payment_date,
          ex_dividend_date: formData.ex_dividend_date || null,
          record_date: formData.record_date || null,
          notes: formData.notes || null
        });

      if (error) throw error;

      toast({
        title: "Dividendo cadastrado!",
        description: `${formData.type === 'dividend' ? 'Dividendo' : 'JCP'} de R$ ${amount.toFixed(2)} foi registrado.`,
      });

      setFormData({
        assetId: '',
        type: 'dividend',
        amount: '',
        shares_quantity: '',
        payment_date: '',
        ex_dividend_date: '',
        record_date: '',
        notes: ''
      });
      setDialogOpen(false);
      fetchDividends();
    } catch (error) {
      console.error('Erro ao cadastrar dividendo:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalDividends = dividends.reduce((sum, dividend) => sum + dividend.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dividendos</h1>
          <p className="text-slate-600 mt-1">Gerencie seus dividendos e JCP recebidos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Dividendo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Dividendo/JCP</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset">Ativo</Label>
                  <Select value={formData.assetId} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, assetId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ativo" />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.ticker} - {asset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: 'dividend' | 'jcp') => 
                    setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dividend">Dividendo</SelectItem>
                      <SelectItem value="jcp">JCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor Total (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shares_quantity">Quantidade de Ações</Label>
                  <Input
                    id="shares_quantity"
                    type="number"
                    step="0.00000001"
                    value={formData.shares_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, shares_quantity: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">Data de Pagamento</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ex_dividend_date">Data Ex-Dividendo</Label>
                  <Input
                    id="ex_dividend_date"
                    type="date"
                    value={formData.ex_dividend_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, ex_dividend_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="record_date">Data de Registro</Label>
                  <Input
                    id="record_date"
                    type="date"
                    value={formData.record_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, record_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações opcionais..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total de Dividendos Recebidos</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDividends)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dividends Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Dividendos ({dividends.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {dividends.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                Nenhum dividendo cadastrado
              </h3>
              <p className="text-slate-500 mb-6">
                Comece registrando seus primeiros dividendos recebidos
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Valor por Ação</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dividends.map((dividend) => (
                    <TableRow key={dividend.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{dividend.assets.ticker}</div>
                          <div className="text-sm text-slate-500">{dividend.assets.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dividend.type === 'dividend' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {dividend.type === 'dividend' ? 'Dividendo' : 'JCP'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(dividend.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(dividend.amount_per_share)}
                      </TableCell>
                      <TableCell className="text-right">
                        {dividend.shares_quantity}
                      </TableCell>
                      <TableCell>
                        {formatDate(dividend.payment_date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
