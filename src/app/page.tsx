"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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

      router.push("/dashboard/agenda");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* LADO ESQUERDO - FORMULÁRIO */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 md:px-16">
        <div className="w-full max-w-md">
          {/* LOGO */}
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


          {/* TÍTULO */}
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Acesse sua conta
          </h2>
          <p className="text-center text-gray-500 mt-1 mb-8">
            Digite seu e-mail abaixo para entrar no seu painel.
          </p>

          {/* ERRO */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded mb-3 text-center text-sm">
              {error}
            </div>
          )}

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <Link
                  href="#"
                  className="text-sm text-[#7E3AF2] hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7E3AF2] hover:bg-[#6B2EE8] text-white font-medium py-2.5 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* CADASTRO */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Não tem uma conta?{" "}
            <Link
              href="/onboarding"
              className="text-[#7E3AF2] font-medium hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      {/* LADO DIREITO - IMAGEM */}
      <div className="hidden lg:flex w-1/2 h-screen relative">
        <Image
          src="/image.png"
          alt="Estetify app"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* 🔹 CONTEÚDO CENTRALIZADO */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-8">
          <h2 className="text-4xl font-bold leading-tight max-w-lg">
            A revolução na gestão do seu negócio de beleza.
          </h2>

          <p className="text-lg mt-4 opacity-90 max-w-md">
            Otimize sua agenda, finanças e marketing com o poder da inteligência
            artificial. Tudo em um só lugar. Baixe agora!
          </p>

          <div className="flex gap-4 mt-8">
            {/* BOTÃO GOOGLE PLAY */}
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                width={160}
                height={50}
                className="object-contain"
              />
            </a>

            {/* BOTÃO APP STORE */}
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                width={145}
                height={50}
                className="object-contain"
              />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}