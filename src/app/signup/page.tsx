import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className="">
                  <Image
                    src="/logo.png"
                    alt="Estetify Logo"
                    width={200}
                    height={200}
                    className="object-contain"
                    priority
                  />
                </div>

              </div>
            </div>
          </Link>
          <CardTitle className="text-2xl">Crie sua conta</CardTitle>
          <CardDescription>
            Insira suas informações para começar a usar o app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Nome Completo</Label>
              <Input id="full-name" placeholder="Seu Nome" required />
            </div>
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
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href="/onboarding">Criar Conta e Configurar</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/" className="underline">
              Fazer Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
