import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: number;
  tipo: "receita" | "despesa" | "retirada";
  descricao: string;
  valor: number;
  metodo: string;
  data: string;
  cliente?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const getIcon = () => {
    switch (transaction.tipo) {
      case "receita":
        return <ArrowUpRight className="w-4 h-4" />;
      case "despesa":
        return <ArrowDownRight className="w-4 h-4" />;
      case "retirada":
        return <Minus className="w-4 h-4" />;
    }
  };

  const getColors = () => {
    switch (transaction.tipo) {
      case "receita":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/20",
          icon: "text-emerald-600 dark:text-emerald-400",
          text: "text-emerald-700 dark:text-emerald-300",
          badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        };
      case "despesa":
        return {
          bg: "bg-red-50 dark:bg-red-950/20",
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-700 dark:text-red-300",
          badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        };
      case "retirada":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/20",
          icon: "text-purple-600 dark:text-purple-400",
          text: "text-purple-700 dark:text-purple-300",
          badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        };
    }
  };

  const colors = getColors();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
          <div className={colors.icon}>{getIcon()}</div>
        </div>
        <div>
          <p className="font-medium text-sm mb-0.5">{transaction.descricao}</p>
          <div className="flex items-center gap-2">
            {transaction.cliente && (
              <span className="text-xs text-muted-foreground">{transaction.cliente}</span>
            )}
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatDate(transaction.data)}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-bold mb-1 ${colors.text}`}>
          {transaction.tipo === "receita" ? "+" : "-"}R$ {transaction.valor.toFixed(2)}
        </p>
        <Badge className={`text-xs ${colors.badge} border-0`}>
          {transaction.metodo}
        </Badge>
      </div>
    </div>
  );
}