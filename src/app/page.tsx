import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="w-full lg:h-screen lg:grid lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Icons.logo className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
                EsteticaAI
              </h1>
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight">
              Acesse sua conta
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Digite seu e-mail abaixo para entrar no seu painel.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Entrar</Link>
            </Button>


          </div>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/onboarding" className="underline font-semibold">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative h-full">

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white max-w-lg">
          <h2 className="text-4xl font-serif font-bold">A revolução na gestão do seu negócio de beleza.</h2>
          <p className="text-lg mt-4 opacity-90">Otimize sua agenda, finanças e marketing com o poder da inteligência artificial. Tudo em um só lugar.</p>
        </div>
      </div>
    </div>
  );
}
