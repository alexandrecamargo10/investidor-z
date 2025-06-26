
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddAsset() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ticker: "",
    name: "",
    category: "",
    subcategory: "",
    operationType: "buy",
    quantity: "",
    price: "",
    date: "",
    fees: ""
  });

  const categories = {
    "Ação": ["Bancos", "Tecnologia", "Energia", "Mineração", "Varejo", "Telecomunicações"],
    "FII": ["Tijolo", "Papel", "Logística", "Shoppings", "Hospitalar"],
    "Renda Fixa": ["Tesouro Direto", "CDB", "LCI/LCA", "Debêntures"],
    "Criptomoeda": ["Bitcoin", "Ethereum", "Altcoins"]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === 'category' && { subcategory: '' })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.ticker || !formData.category || !formData.quantity || !formData.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    console.log("Form submitted:", formData);
    
    toast({
      title: "Ativo adicionado com sucesso!",
      description: `${formData.operationType === 'buy' ? 'Compra' : 'Venda'} de ${formData.quantity} ${formData.ticker} registrada.`,
    });

    // Reset form
    setFormData({
      ticker: "",
      name: "",
      category: "",
      subcategory: "",
      operationType: "buy",
      quantity: "",
      price: "",
      date: "",
      fees: ""
    });
  };

  const searchAsset = () => {
    // Simulate asset search
    if (formData.ticker) {
      // Mock data for demonstration
      const mockAssets: Record<string, any> = {
        "ITUB4": { name: "Itaú Unibanco", category: "Ação", subcategory: "Bancos" },
        "VALE3": { name: "Vale S.A.", category: "Ação", subcategory: "Mineração" },
        "HGLG11": { name: "CSHG Logística", category: "FII", subcategory: "Logística" }
      };

      const asset = mockAssets[formData.ticker.toUpperCase()];
      if (asset) {
        setFormData(prev => ({
          ...prev,
          name: asset.name,
          category: asset.category,
          subcategory: asset.subcategory
        }));
        toast({
          title: "Ativo encontrado!",
          description: `${asset.name} foi identificado automaticamente.`,
        });
      } else {
        toast({
          title: "Ativo não encontrado",
          description: "Você pode preencher as informações manualmente.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Adicionar Ativo</h1>
        <p className="text-slate-600 mt-1">Registre uma nova operação de compra ou venda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações da Operação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Asset Search */}
              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker / Código do Ativo *</Label>
                <div className="flex gap-2">
                  <Input
                    id="ticker"
                    placeholder="Ex: ITUB4, VALE3, HGLG11"
                    value={formData.ticker}
                    onChange={(e) => handleInputChange('ticker', e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={searchAsset}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Asset Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Ativo</Label>
                <Input
                  id="name"
                  placeholder="Nome será preenchido automaticamente"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categories).map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subcategoria</Label>
                  <Select 
                    value={formData.subcategory} 
                    onValueChange={(value) => handleInputChange('subcategory', value)}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a subcategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category && categories[formData.category as keyof typeof categories]?.map(subcategory => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Operation Type */}
              <div className="space-y-2">
                <Label>Tipo de Operação *</Label>
                <Select value={formData.operationType} onValueChange={(value) => handleInputChange('operationType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Compra</SelectItem>
                    <SelectItem value="sell">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Ex: 100"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço Unitário (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 32.45"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
              </div>

              {/* Date and Fees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data da Operação</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fees">Taxas e Custos (R$)</Label>
                  <Input
                    id="fees"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 15.50"
                    value={formData.fees}
                    onChange={(e) => handleInputChange('fees', e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-financialBlue-600 hover:bg-financialBlue-700">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Operação
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Operação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">Detalhes</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Ativo:</span>
                  <span className="font-medium">{formData.ticker || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Operação:</span>
                  <span className="font-medium">
                    {formData.operationType === 'buy' ? 'Compra' : 'Venda'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Quantidade:</span>
                  <span className="font-medium">{formData.quantity || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Preço Unit.:</span>
                  <span className="font-medium">
                    {formData.price ? `R$ ${formData.price}` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {formData.quantity && formData.price && (
              <div className="p-4 bg-financialBlue-50 rounded-lg border border-financialBlue-200">
                <h4 className="font-medium text-financialBlue-900 mb-2">Valor Total</h4>
                <p className="text-2xl font-bold text-financialBlue-600">
                  R$ {(parseFloat(formData.quantity) * parseFloat(formData.price)).toFixed(2)}
                </p>
                {formData.fees && (
                  <p className="text-sm text-slate-600 mt-1">
                    + R$ {formData.fees} (taxas)
                  </p>
                )}
              </div>
            )}

            <div className="text-xs text-slate-500 leading-relaxed">
              <strong>Dica:</strong> Use o botão de busca para preencher automaticamente as informações do ativo.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
