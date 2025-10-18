"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Agendamento = {
  id: number;
  servico: string;
  valor: number;
  pago: boolean;
  data_hora: string;
  procedimento: string;
};

type Cliente = {
  id: number;
  nome: string;
  telefone?: string;
  email?: string;
  agendamentos: Agendamento[];
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setApiResult(null);

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());

      const novoCliente = await res.json();
      setClientes([novoCliente, ...clientes]);
      setForm({ nome: "", telefone: "", email: "" });
      setOpen(false);
      setApiResult(`✅ Cliente ${novoCliente.nome} cadastrado com sucesso!`);
    } catch (error: any) {
      setApiResult(`❌ Erro ao cadastrar cliente: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Gerencie seus clientes e visitas.</CardDescription>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Cliente</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar Cliente"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {apiResult && (
          <p
            className={`text-sm mb-4 font-semibold ${
              apiResult.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {apiResult}
          </p>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Visitas</TableHead>
              <TableHead>Pagou</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => {
                const visitas = cliente.agendamentos.length;
                const pagou = cliente.agendamentos.filter((a) => a.pago).length;

                return (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.telefone || "—"}</TableCell>
                    <TableCell>{cliente.email || "—"}</TableCell>
                    <TableCell className="text-center">{visitas}</TableCell>
                    <TableCell className="text-center">{pagou}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setClienteSelecionado(cliente)}
                      >
                        Ver Histórico
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Dialog de histórico */}
        {clienteSelecionado && (
          <Dialog open={!!clienteSelecionado} onOpenChange={() => setClienteSelecionado(null)}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Histórico de {clienteSelecionado.nome}</DialogTitle>
              </DialogHeader>

              {clienteSelecionado.agendamentos.length === 0 ? (
                <p className="text-muted-foreground">
                  Este cliente ainda não possui agendamentos.
                </p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {clienteSelecionado.agendamentos.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="border border-border rounded-lg p-4 flex flex-col gap-2"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{agendamento.servico}</span>
                        <span
                          className={`flex items-center gap-1 text-sm ${
                            agendamento.pago ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {agendamento.pago ? (
                            <>
                              <CheckCircle className="w-4 h-4" /> Pago
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" /> Não pago
                            </>
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Data:{" "}
                        {new Date(agendamento.data_hora).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm">
                        Valor:{" "}
                        {agendamento.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Procedimento: {agendamento.procedimento}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
