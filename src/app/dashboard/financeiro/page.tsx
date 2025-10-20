'use client';
import { useState, useEffect, useMemo } from "react";
import { StatsCard } from "@/components/financeiro/StatsCard";
import { TransactionCard } from "@/components/financeiro/TransactionCard";
import { AddTransactionDialog } from "@/components/financeiro/AddTransactionDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";

interface Transaction {
  id: number;
  tipo: "receita" | "despesa" | "retirada";
  descricao: string;
  valor: number;
  metodo: string;
  data: string;
  cliente?: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const metaMensal = 15000;

  // Busca transações do banco ao carregar a página
  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then((data: Transaction[]) => setTransactions(data))
      .catch(console.error);
  }, []);

  const totalReceitas = useMemo(
    () => transactions
      .filter((t) => t.tipo === "receita")
      .reduce((sum, t) => sum + t.valor, 0),
    [transactions]
  );

  const totalDespesas = useMemo(
    () => transactions
      .filter((t) => t.tipo === "despesa")
      .reduce((sum, t) => sum + t.valor, 0),
    [transactions]
  );

  const totalRetiradas = useMemo(
    () => transactions
      .filter((t) => t.tipo === "retirada")
      .reduce((sum, t) => sum + t.valor, 0),
    [transactions]
  );

  const saldoAtual = useMemo(
    () => totalReceitas - totalDespesas - totalRetiradas,
    [totalReceitas, totalDespesas, totalRetiradas]
  );

  const progressoMeta = useMemo(
    () => Math.min((totalReceitas / metaMensal) * 100, 100).toFixed(0),
    [totalReceitas, metaMensal]
  );

  const handleNewTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction)
      });
      const newTransaction = await res.json();
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-violet-50/20">
  <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-12">

    {/* Header */}
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 to-purple-500 text-transparent bg-clip-text">
          Financeiro
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe de forma simples e elegante o desempenho do seu negócio.
        </p>
      </div>
      <AddTransactionDialog onAdd={handleNewTransaction} />
    </header>

    {/* Stats */}
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        label="Saldo Atual"
        value={`R$ ${saldoAtual.toFixed(2)}`}
        icon={Wallet}
        iconColor="text-violet-700"
        iconBg="bg-violet-100/70"
      />
      <StatsCard
        label="Receitas"
        value={`R$ ${totalReceitas.toFixed(2)}`}
        icon={TrendingUp}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-100/60"
      />
      <StatsCard
        label="Despesas"
        value={`R$ ${totalDespesas.toFixed(2)}`}
        icon={TrendingDown}
        iconColor="text-rose-600"
        iconBg="bg-rose-100/60"
      />
      <StatsCard
        label="Meta Mensal"
        value={`${progressoMeta}%`}
        icon={Target}
        iconColor="text-purple-700"
        iconBg="bg-purple-100/60"
      />
    </section>

    {/* Meta Progress */}
    <section className="bg-card rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-500 p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Progresso da Meta</p>
          <p className="text-2xl font-semibold text-foreground">
            R$ {totalReceitas.toFixed(2)} / R$ {metaMensal.toFixed(2)}
          </p>
        </div>
        <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 text-transparent bg-clip-text">
          {progressoMeta}%
        </p>
      </div>
      <div className="w-full bg-secondary/40 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-violet-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressoMeta}%` }}
        />
      </div>
    </section>

    {/* Transactions */}
    <section className="bg-card rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden">
      <div className="p-6 border-b border-border/40 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Transações</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {transactions.length} {transactions.length === 1 ? "registro" : "registros"}
          </p>
        </div>
      </div>

      <ScrollArea className="h-[480px]">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-100 to-purple-50 flex items-center justify-center mb-4 shadow-inner">
              <Wallet className="w-7 h-7 text-violet-600" />
            </div>
            <p className="text-lg font-medium">Nenhuma transação</p>
            <p className="text-sm text-muted-foreground">
              Clique em{" "}
              <span className="text-violet-600 font-medium">“Nova Transação”</span> para começar.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40 p-3">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </section>

  </div>
</div>



  );
};

export default Index;
