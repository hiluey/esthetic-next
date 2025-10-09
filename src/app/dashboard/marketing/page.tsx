"use client";

import { useState, useEffect } from "react";
import { Bot, Megaphone, Loader2, Send, Sparkles, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function MarketingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [clientBase, setClientBase] = useState("");
  const [businessGoals, setBusinessGoals] = useState("");
  const [historico, setHistorico] = useState<any[]>([]);
  const [isLoadingHistorico, setIsLoadingHistorico] = useState(false);

  // 🔄 Buscar campanhas ao carregar
  async function carregarHistorico() {
    try {
      setIsLoadingHistorico(true);
      const res = await fetch("/api/mensagens_marketing");
      const data = await res.json();
      setHistorico(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoadingHistorico(false);
    }
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/mensagens_marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: 1, // futuramente substituir pelo ID real do usuário logado
          tipo: "promocao",
          texto: `${clientBase}\n\nObjetivo: ${businessGoals}`,
          data_envio: new Date(),
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar mensagem");

      const novaMensagem = await response.json();

      // Exibe o resultado recém-criado
      setResult({
        campaignTitle: "Nova Campanha Criada",
        targetAudience: clientBase,
        suggestedPromotions: ["Promoção personalizada"],
        personalizedMessages: [novaMensagem.texto],
        callToAction: "Mensagem salva no banco com sucesso!",
      });

      // Recarrega o histórico
      carregarHistorico();

      // Limpa campos
      setClientBase("");
      setBusinessGoals("");
    } catch (error) {
      console.error(error);
      setResult({
        campaignTitle: "Erro ao gerar campanha",
        targetAudience: "",
        suggestedPromotions: [],
        personalizedMessages: ["Não foi possível salvar no banco."],
        callToAction: "Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 🧠 Coluna principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Formulário de criação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-6 w-6" />
              Marketing Automatizado
            </CardTitle>
            <CardDescription>
              Descreva sua base de clientes e seus objetivos. A campanha será salva no banco.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block font-medium text-sm">Descrição da sua Clientela</label>
                <Textarea
                  placeholder="Ex: Mulheres de 25-40 anos, moram na região central..."
                  className="min-h-[120px]"
                  value={clientBase}
                  onChange={(e) => setClientBase(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-sm">Objetivos da Campanha</label>
                <Input
                  placeholder="Ex: Promover novo serviço, recuperar clientes antigas..."
                  value={businessGoals}
                  onChange={(e) => setBusinessGoals(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Gerar Campanha
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Histórico de campanhas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Histórico de Campanhas
            </CardTitle>
            <CardDescription>
              Visualize as campanhas salvas recentemente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingHistorico ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : historico.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma campanha cadastrada ainda.</p>
            ) : (
              <div className="space-y-4">
                {historico.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-accent/30 transition"
                  >
                    <p className="text-xs text-muted-foreground">
                      <strong>Tipo:</strong> {msg.tipo} •{" "}
                      <strong>Status:</strong> {msg.status}
                    </p>
                    <p className="text-sm mt-2 whitespace-pre-wrap">{msg.texto}</p>
                    {msg.data_envio && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Enviado em: {new Date(msg.data_envio).toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 🎨 Lado direito - resultado da última campanha */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Campanha Sugerida
            </CardTitle>
            <CardDescription>
              A última campanha gerada será exibida aqui.
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
              <div className="space-y-4 text-sm w-full">
                <div className="p-4 bg-accent/50 rounded-lg border border-accent">
                  <h3 className="font-bold text-lg text-accent-foreground mb-1">
                    {result.campaignTitle}
                  </h3>
                  <p className="text-muted-foreground">{result.targetAudience}</p>
                </div>
                {result.suggestedPromotions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Promoções Sugeridas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestedPromotions.map((promo: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-200 rounded-md text-sm"
                        >
                          {promo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-2">Mensagem Personalizada:</h4>
                  <p className="italic text-muted-foreground border-l-4 border-accent pl-3 py-1">
                    "{result.personalizedMessages[0]}"
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Call to Action:</h4>
                  <p className="font-bold text-primary">{result.callToAction}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
