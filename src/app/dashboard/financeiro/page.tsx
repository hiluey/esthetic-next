"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Bot, DollarSign, Loader2, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormValues = {
  financialData: string;
  salonGoals: string;
};

export default function FinanceiroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      financialData: "",
      salonGoals: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    // Simula processamento estático
    setTimeout(() => {
      const staticResult = `
✅ Resumo da análise:
- Receita atual: R$3000/mês
- Custo fixo: R$1300/mês
- Lucro líquido: R$1700/mês

💡 Sugestões para aumentar faturamento:
1. Fidelizar clientes oferecendo pacotes mensais.
2. Aumentar ticket médio com serviços extras.
3. Investir em marketing digital para atrair novos clientes.
      `;
      setResult(staticResult);
      setIsLoading(false);
      form.reset();
    }, 1000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Consultora Financeira
            </CardTitle>
            <CardDescription>
              Descreva sua situação financeira e seus objetivos. O resultado
              será exibido de forma estática.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="financialData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dados Financeiros</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Faturamento mensal de R$3000, custo com produtos R$500, aluguel R$800..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salonGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suas Metas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Quero faturar R$5000/mês, comprar um novo equipamento..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Analisar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Análise e Sugestões
            </CardTitle>
            <CardDescription>
              O resultado da análise será exibido aqui.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[360px] flex items-center justify-center">
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            {!isLoading && !result && (
              <div className="text-center text-muted-foreground">
                <Bot className="h-10 w-10 mx-auto mb-2" />
                <p>Aguardando seus dados...</p>
              </div>
            )}
            {result && (
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
