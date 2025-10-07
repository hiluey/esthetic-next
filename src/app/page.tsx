"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Usuário ou senha incorretos");
        setLoading(false);
        return;
      }

      // Login bem-sucedido, redireciona para dashboard
      router.push("/dashboard/agenda");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full lg:h-screen lg:grid lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-6">
              <Icons.logo className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
                EsteticaAI
              </h1>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Digite seu e-mail e senha para entrar no seu painel.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <a href="/onboarding" className="underline font-semibold">
              Cadastre-se
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white max-w-lg">
          <h2 className="text-4xl font-serif font-bold">
            A revolução na gestão do seu negócio de beleza.
          </h2>
          <p className="text-lg mt-4 opacity-90">
            Otimize sua agenda, finanças e marketing com o poder da inteligência artificial. Tudo em um só lugar.
          </p>
        </div>
      </div>
    </div>
  );
}