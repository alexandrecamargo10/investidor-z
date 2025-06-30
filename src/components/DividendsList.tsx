
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Trash2, Edit } from "lucide-react";

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

interface DividendsListProps {
  dividends: Dividend[];
}

export function DividendsList({ dividends }: DividendsListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
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
  );
}
