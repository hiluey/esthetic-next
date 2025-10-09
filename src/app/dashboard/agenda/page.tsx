"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { Calendar, Loader2, Send, Sparkles, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  hora_marcada: string;
};


export default function AgendaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([]);
  const [colaboradores, setColaboradores] = useState<{ id: number; nome: string }[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      usuario_id: 1,
      cliente_id: 0,
      servico_id: 0,
      colaborador_id: 0,
      data_hora: new Date().toISOString().slice(0, 16),
      procedimento: ""
    },

  });

  useEffect(() => {
    async function fetchData() {
      try {
        const clientesRes = await fetch("/api/clientes");
        const clientesData = await clientesRes.json();
        setClientes(clientesData || []);

        const servicosRes = await fetch("/api/servicos");
        const servicosData = await servicosRes.json();
        setServicos(servicosData || []);

        const colabRes = await fetch("/api/usuarios");
        const colabData = await colabRes.json();
        setColaboradores(colabData || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }
    fetchData();
  }, []);

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
          procedimento: values.procedimento || null, // string ou null
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
    } catch (error: any) {
      console.error("Erro ao agendar:", error);
      setApiResult(`❌ Falha ao processar o agendamento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const renderSelect = (
    field: any,
    data: { id: number; nome: string }[],
    placeholder: string
  ) => (
    <Select
      onValueChange={(val) => field.onChange(Number(val))}
      value={field.value ? field.value.toString() : ""}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {data.length > 0 && (
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.nome}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Agenda Inteligente
            </CardTitle>
            <CardDescription>Preencha os dados para agendar o serviço.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Cliente */}
                <FormField
                  control={form.control}
                  name="cliente_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>{renderSelect(field, clientes, "Selecione o cliente")}</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Serviço */}
                <FormField
                  control={form.control}
                  name="servico_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>{renderSelect(field, servicos, "Selecione o serviço")}</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Colaborador */}
                <FormField
                  control={form.control}
                  name="colaborador_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>{renderSelect(field, colaboradores, "Selecione o colaborador")}</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Procedimento  */}

                <FormField
                  control={form.control}
                  name="procedimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Descreva o procedimento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* Valor */}
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Valor do procedimento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data e hora */}
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



                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Agendar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Card de resultado */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Resultado
            </CardTitle>
            <CardDescription>A confirmação do seu agendamento aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[240px] flex items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {!isLoading && !apiResult && (
              <div className="text-center text-muted-foreground">
                <Bot className="h-10 w-10 mx-auto mb-2" />
                <p>Aguardando seu agendamento...</p>
              </div>
            )}
            {apiResult && (
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold text-base">Agendamento Confirmado!</h3>
                <p className="p-3 bg-accent/50 rounded-md border border-accent">{apiResult}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
