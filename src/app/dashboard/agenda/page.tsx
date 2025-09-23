"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Calendar, Loader2, Send, Sparkles, Bot } from "lucide-react";

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
  FormMessage,
} from "@/components/ui/form";

type FormValues = {
  command: string;
};

export default function AgendaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: { command: "" },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAiResult(null);

    // Simula processamento de "IA" com timeout
    setTimeout(() => {
      // Aqui você pode definir o resultado estático
      const result = `✅ Comando recebido: "${values.command}". Agendamento confirmado para amanhã às 15h.`;
      setAiResult(result);
      form.reset();
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Agenda Inteligente
            </CardTitle>
            <CardDescription>
              Use comandos de texto para agendar, reagendar ou cancelar
              horários. Tudo será processado de forma estática.
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
                  name="command"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: 'Agendar corte de cabelo para a Joana amanhã às 15h'."
                          className="min-h-[100px]"
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
                  Agendar
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
              Resultado
            </CardTitle>
            <CardDescription>
              A confirmação do seu comando aparecerá aqui.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[240px] flex items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {!isLoading && !aiResult && (
              <div className="text-center text-muted-foreground">
                <Bot className="h-10 w-10 mx-auto mb-2" />
                <p>Aguardando seu comando...</p>
              </div>
            )}
            {aiResult && (
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold text-base">Agendamento Confirmado!</h3>
                <p className="p-3 bg-accent/50 rounded-md border border-accent">
                  {aiResult}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
