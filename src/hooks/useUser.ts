"use client";

import { useEffect, useState } from "react";

export type User = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  nome_negocio: string | null;
  cor_app: string | null;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me", {
          credentials: "include", // <- garante que o cookie seja enviado
        });

        if (!res.ok) throw new Error("Erro ao buscar usuário");

        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading };
}
