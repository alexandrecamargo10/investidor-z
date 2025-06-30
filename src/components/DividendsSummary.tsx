
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface Dividend {
  amount: number;
}

interface DividendsSummaryProps {
  dividends: Dividend[];
}

export function DividendsSummary({ dividends }: DividendsSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalDividends = dividends.reduce((sum, dividend) => sum + dividend.amount, 0);

  return (
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
  );
}
