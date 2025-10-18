"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import {
  CalendarDays,
  Loader2,
  SendHorizontal,
  BadgeCheck,
  Bot,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = {
  usuario_id: number;
  cliente_id: number;
  servico_id: number;
  colaborador_id: number;
  data_hora: string;
  procedimento: string;
  valor: number;
  hora_marcada?: string;
};

export default function AgendaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([]);
  const [colaboradores, setColaboradores] = useState<
    { id: number; nome: string }[]
  >([]);

  const form = useForm<FormValues>({
    defaultValues: {
      usuario_id: 1,
      cliente_id: 0,
      servico_id: 0,
      colaborador_id: 0,
      data_hora: new Date().toISOString().slice(0, 16),
      procedimento: "",
      valor: 0,
      hora_marcada: "",
    },
  });

  const fetchData = useCallback(async () => {
  try {
    const clientesRes = await fetch("/api/clientes");
    const clientesData = await clientesRes.json();
    setClientes(Array.isArray(clientesData) ? clientesData : []);

    const servicosRes = await fetch("/api/servicos");
    const servicosData = await servicosRes.json();
    setServicos(Array.isArray(servicosData) ? servicosData : []);

    // Aqui trocamos para o endpoint da equipe
    const colabRes = await fetch("/api/equipe");
    const colabData = await colabRes.json();
    setColaboradores(Array.isArray(colabData) ? colabData : []);
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    setClientes([]);
    setServicos([]);
    setColaboradores([]);
  }
}, []);

  // Busca os dados ao montar o componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Função que trata o submit do formulário
  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setApiResult(null);

    try {
      const response = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: Number(values.usuario_id),
          cliente_id: Number(values.cliente_id),
          servico_id: Number(values.servico_id),
          colaborador_id: Number(values.colaborador_id),
          data_hora: new Date(values.data_hora).toISOString(),
          procedimento: values.procedimento || null,
          valor: Number(values.valor),
          hora_marcada: values.hora_marcada,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro da API: ${errorText}`);
      }

      const resultData = await response.json();
      setApiResult(`✅ Agendamento criado com ID ${resultData.id}.`);
      form.reset();

      // Atualiza as listas após agendamento para refletir dados recentes
      await fetchData();
    } catch (error: any) {
      console.error("Erro ao agendar:", error);
      setApiResult(`❌ Falha ao processar o agendamento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Função para renderizar selects reutilizáveis com dados dinâmicos
  const renderSelect = (
    field: any,
    data: { id: number; nome: string }[] | null | undefined,
    placeholder: string
  ) => {
    const arr = Array.isArray(data) ? data : [];
    return (
      <Select
        onValueChange={(val) => field.onChange(Number(val))}
        value={field.value ? field.value.toString() : ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {arr.length > 0 ? (
            arr.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.nome}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              Sem opções disponíveis
            </div>
          )}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
      <div className="xl:col-span-2">
        <Card className="shadow-lg border border-border bg-background rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-primary" />
              Novo Agendamento
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Preencha todos os campos para agendar um serviço com um
              colaborador.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <FormField
                  control={form.control}
                  name="cliente_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {renderSelect(field, clientes, "Cliente")}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="servico_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {renderSelect(field, servicos, "Serviço")}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colaborador_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {renderSelect(field, colaboradores, "Colaborador")}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="procedimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Procedimento detalhado"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Valor (R$)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* botão ocupa 2 colunas */}
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Agendando...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="h-4 w-4" />
                        Confirmar Agendamento
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-1">
        <Card className="sticky top-24 border border-muted shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary text-lg">
              <BadgeCheck className="w-5 h-5" />
              Status do Agendamento
            </CardTitle>
            <CardDescription>
              Atualize a página para ver novos agendamentos ou use o formulário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiResult ? (
              <div
                className={`${
                  apiResult.startsWith("✅")
                    ? "text-green-600"
                    : "text-red-600"
                } font-semibold`}
              >
                {apiResult}
              </div>
            ) : (
              <div className="text-muted-foreground">
                Nenhum agendamento realizado ainda.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
