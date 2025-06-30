
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface Asset {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
}

interface DividendFormProps {
  assets: Asset[];
  onDividendAdded: () => void;
}

export function DividendForm({ assets, onDividendAdded }: DividendFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
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
      onDividendAdded();
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

  return (
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
  );
}
