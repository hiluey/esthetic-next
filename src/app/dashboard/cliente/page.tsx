"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  UserPlus,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ClienteFormValues = {
  nome: string;
  telefone?: string;
  email?: string;
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  // React Hook Form para lidar com formulário
  const form = useForm<ClienteFormValues>({
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
    },
  });

  // Ao carregar, busca clientes na API
  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: ClienteFormValues) {
    setIsLoading(true);
    setApiResult(null);
    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const newCliente = await response.json();
      setApiResult(`✅ Cliente ${newCliente.nome} cadastrado com sucesso!`);
      form.reset();
      fetchClientes();
    } catch (error: any) {
      setApiResult(`❌ Falha ao cadastrar cliente: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Formulário para novo cliente */}
      <Card className="shadow-lg border border-border bg-background rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Novo Cliente
          </CardTitle>
          <CardDescription>
            Preencha o formulário para cadastrar um novo cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <FormField
                control={form.control}
                name="nome"
                rules={{ required: "Nome é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Telefone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Cadastrar Cliente
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {apiResult && (
            <p
              className={`mt-4 text-center text-sm font-semibold ${
                apiResult.startsWith("✅")
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {apiResult}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <Card className="shadow-lg border border-border bg-background rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Clientes Cadastrados
          </CardTitle>
          <CardDescription>
            Veja os clientes, histórico e status dos pagamentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : clientes.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum cliente cadastrado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-muted rounded-md">
                <thead>
                  <tr className="bg-muted text-muted-foreground">
                    <th className="border border-muted p-2 text-left">Nome</th>
                    <th className="border border-muted p-2 text-left">Telefone</th>
                    <th className="border border-muted p-2 text-left">Email</th>
                    <th className="border border-muted p-2 text-center">Visitas</th>
                    <th className="border border-muted p-2 text-center">Pagou</th>
                    <th className="border border-muted p-2 text-left">
                      Últimos Procedimentos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => {
                    const visitas = cliente.agendamentos.length;
                    const pagou = cliente.agendamentos.filter((a) => a.pago).length;
                    const ultimosProcedimentos = cliente.agendamentos
                      .slice(-3)
                      .map((a) => (
                        <div key={a.id} className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {a.servico} ({new Date(a.data_hora).toLocaleDateString()})
                          </span>
                          <span
                            title={a.pago ? "Pago" : "Não pago"}
                            className={`ml-2 ${
                              a.pago ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {a.pago ? (
                              <CheckCircle className="inline w-4 h-4" />
                            ) : (
                              <XCircle className="inline w-4 h-4" />
                            )}
                          </span>
                        </div>
                      ));

                    return (
                      <tr key={cliente.id} className="hover:bg-muted/30">
                        <td className="border border-muted p-2">{cliente.nome}</td>
                        <td className="border border-muted p-2">{cliente.telefone || "-"}</td>
                        <td className="border border-muted p-2">{cliente.email || "-"}</td>
                        <td className="border border-muted p-2 text-center">{visitas}</td>
                        <td className="border border-muted p-2 text-center">{pagou}</td>
                        <td className="border border-muted p-2 max-w-xs">
                          {ultimosProcedimentos.length > 0 ? (
                            ultimosProcedimentos
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Sem registros
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
