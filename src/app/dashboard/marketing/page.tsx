"use client";

import { useState } from "react";
import { Bot, Megaphone, Loader2, Send, Sparkles } from "lucide-react";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    // Simula processamento
    setTimeout(() => {
      const staticResult = {
        campaignTitle: "Campanha de Beleza Primavera 2025",
        targetAudience: "Mulheres de 25-40 anos, interessadas em estética e bem-estar.",
        suggestedPromotions: [
          "Desconto de 20% no microagulhamento",
          "Pacote facial + massagem relaxante",
          "Brinde especial para clientes recorrentes"
        ],
        personalizedMessages: [
          "Olá! Aproveite nossas promoções de primavera e cuide ainda mais de você!"
        ],
        callToAction: "Agende seu horário agora mesmo!"
      };
      setResult(staticResult);
      setIsLoading(false);
      setClientBase("");
      setBusinessGoals("");
    }, 1000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-6 w-6" />
              Marketing Automatizado
            </CardTitle>
            <CardDescription>
              Descreva sua base de clientes e seus objetivos. O resultado será
              exibido de forma estática.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block font-medium text-sm">Descrição da sua Clientela</label>
                <Textarea
                  placeholder="Ex: Mulheres de 25-40 anos, moram na região central, gostam de procedimentos de pele e relaxamento..."
                  className="min-h-[120px]"
                  value={clientBase}
                  onChange={(e) => setClientBase(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-sm">Objetivos da Campanha</label>
                <Input
                  placeholder="Ex: Promover o novo serviço de microagulhamento, trazer de volta clientes sumidas..."
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
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Campanha Sugerida
            </CardTitle>
            <CardDescription>
              A campanha gerada será exibida aqui.
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
                  <h3 className="font-bold text-lg text-accent-foreground mb-1">{result.campaignTitle}</h3>
                  <p className="text-muted-foreground">{result.targetAudience}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Promoções Sugeridas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedPromotions.map((promo: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-200 rounded-md text-sm">{promo}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Mensagem Personalizada:</h4>
                  <p className="italic text-muted-foreground border-l-4 border-accent pl-3 py-1">"{result.personalizedMessages[0]}"</p>
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
