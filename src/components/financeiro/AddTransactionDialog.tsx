'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Agendamento {
  id: number;
  procedimento: string | null;
  valor: number | null;
  data_hora: string;
  clientes?: { nome: string | null };
  servicos?: { nome: string | null };
}

interface AddTransactionDialogProps {
  onAdd: (transaction: any) => void;
}

export function AddTransactionDialog({ onAdd }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"receita" | "despesa" | "retirada">("receita");
  const [agendamentoId, setAgendamentoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState("pix");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  // 🔹 Buscar agendamentos reais
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const res = await fetch("/api/agenda");
        if (!res.ok) throw new Error("Erro ao buscar agendamentos");
        const data = await res.json();

        // Mapeia para os campos usados no front
        const mapped: Agendamento[] = data.map((a: any) => ({
          id: a.id,
          procedimento: a.procedimento || a.servicos?.nome || "Serviço não informado",
          valor: a.valor ?? 0,
          data_hora: a.data_hora,
          clientes: a.clientes,
          servicos: a.servicos,
        }));

        setAgendamentos(mapped);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os agendamentos.",
          variant: "destructive",
        });
      }
    };

    fetchAgendamentos();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo === "receita" && !agendamentoId) {
      toast({
        title: "Erro",
        description: "Selecione um agendamento",
        variant: "destructive",
      });
      return;
    }

    if (!descricao || !valor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const agendamento = agendamentos.find((a) => a.id === Number(agendamentoId));

    const transaction = {
      tipo,
      agendamentoId: tipo === "receita" ? Number(agendamentoId) : null,
      cliente: agendamento?.clientes?.nome || "Sem cliente",
      descricao,
      valor: Number(valor),
      metodo,
      data: tipo === "receita"
        ? agendamento?.data_hora || new Date().toISOString()
        : data,
    };

    onAdd(transaction);
    setOpen(false);

    // Resetar campos
    setDescricao("");
    setValor("");
    setAgendamentoId("");

    toast({
      title: "Sucesso!",
      description: "Transação registrada",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
          <DialogDescription>
            Registre receitas, despesas ou retiradas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">💰 Receita</SelectItem>
                <SelectItem value="despesa">📉 Despesa</SelectItem>
                <SelectItem value="retirada">🏦 Retirada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agendamento (somente se for receita) */}
          {tipo === "receita" && (
            <div className="space-y-2">
              <Label>Agendamento *</Label>
              <Select
                value={agendamentoId}
                onValueChange={(v) => {
                  setAgendamentoId(v);
                  const a = agendamentos.find((ag) => ag.id === Number(v));
                  if (a) {
                    setDescricao(a.procedimento || "");
                    setValor(a.valor?.toString() || "");
                    setData(new Date(a.data_hora).toISOString().split("T")[0]);
                  }
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {agendamentos.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{a.clientes?.nome || "Sem cliente"}</span>
                        <span className="text-xs text-muted-foreground">
                          {a.procedimento} • R$ {a.valor} •{" "}
                          {new Date(a.data_hora).toLocaleDateString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Descrição manual (para despesa e retirada) */}
          {tipo !== "receita" && (
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                placeholder="Ex: Aluguel, Produtos..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="rounded-xl"
              />
            </div>
          )}

          {/* Valor e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Método */}
          <div className="space-y-2">
            <Label>Método</Label>
            <Select value={metodo} onValueChange={setMetodo}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">Pix</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
                <SelectItem value="debito">Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão */}
          <Button type="submit" className="w-full rounded-xl" size="lg">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
