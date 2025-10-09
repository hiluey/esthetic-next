"use client";

import { useState, useEffect } from "react";

export interface CurrentUser {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  nome_negocio?: string | null;
  cor_app?: string | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/usuario");
        if (!res.ok) throw new Error("Não autenticado");
        const data: CurrentUser = await res.json();
        setUser(data);
      } catch (error) {
        setUser(null);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading };
}
