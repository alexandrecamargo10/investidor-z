
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, trend, icon, className }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-financialGreen-600';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <Card className={`hover-scale ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-financialBlue-50 rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
