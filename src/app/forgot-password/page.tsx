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

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
    <Card className="mx-auto max-w-sm">
      <CardHeader className="text-center">
         <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-serif font-bold text-foreground">EsteticaAI</h1>
          </Link>
        <CardTitle className="text-2xl">Esqueceu a senha?</CardTitle>
        <CardDescription>
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <Button type="submit" className="w-full">
            Enviar link de redefinição
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link href="/" className="underline">
            Voltar para o login
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
