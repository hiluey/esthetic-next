"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { ClipboardList, Info, Clock, DollarSign, Tag } from "lucide-react";

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
  nome: string;
  descricao: string;
  duracao: number; // em minutos
  valor: number;
  categoria: string;
};

const categorias = [
  "Cabelo",
  "Pele",
  "Unhas",
  "Massagem",
  "Maquiagem",
  "Outros",
];

export default function ServicoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      nome: "",
      descricao: "",
      duracao: 30,
      valor: 0,
      categoria: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setApiResult(null);

    try {
      // Monta o payload para a API, convertendo valor para string (Decimal)
      const payload = {
        nome: values.nome,
        descricao: values.descricao,
        preco: values.valor.toString(),
        duracao_minutos: values.duracao,
        categoria: values.categoria,
      };

      const response = await fetch("/api/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro da API: ${errorText}`);
      }

      const resultData = await response.json();
      setApiResult(`✅ Serviço criado com ID ${resultData.id}.`);
      form.reset();
    } catch (error: any) {
      console.error("Erro ao criar serviço:", error);
      setApiResult(`❌ Falha ao criar serviço: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Cadastro de Serviço
          </CardTitle>
          <CardDescription>
            Preencha os dados para cadastrar um novo serviço.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 relative"
            >
              {/* Nome */}
              <FormField
                control={form.control}
                name="nome"
                rules={{ required: "Nome do serviço é obrigatório." }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder="Nome do serviço"
                          autoComplete="off"
                          className="pl-10"
                        />
                        <Info className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descrição */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder="Descrição detalhada"
                          autoComplete="off"
                          className="pl-10"
                        />
                        <Info className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duração */}
              <FormField
                control={form.control}
                name="duracao"
                rules={{
                  min: { value: 1, message: "Duração mínima é 1 minuto." },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          step={1}
                          placeholder="Duração (minutos)"
                          className="pl-10"
                        />
                        <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Valor */}
              <FormField
                control={form.control}
                name="valor"
                rules={{
                  min: { value: 0, message: "Valor não pode ser negativo." },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          step={0.01}
                          min={0}
                          placeholder="Valor (R$)"
                          className="pl-10"
                        />
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoria"
                rules={{ required: "Categoria é obrigatória." }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue=""
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Tag className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                {!isLoading && "Cadastrar Serviço"}
              </Button>
            </form>
          </Form>

          {/* Resultado */}
          {apiResult && (
            <div
              className={`mt-6 p-4 rounded-md border ${
                apiResult.startsWith("✅")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {apiResult}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
