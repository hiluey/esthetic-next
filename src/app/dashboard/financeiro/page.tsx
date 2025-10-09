"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipos
type Meta = {
  descricao: string;
  valor_meta: number;
  periodo: "mensal" | "semanal" | "anual";
};

type Pagamento = {
  descricao: string;
  valor: number;
  metodo: "pix" | "cartao" | "dinheiro" | "boleto" | "outro";
  data: string;
  id?: number;
};

export default function FinanceiroPage() {
  const usuarioId = 1; // Substituir depois pelo id do usuário logado

  // Estados
  const [meta, setMeta] = useState<Meta | null>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  // Inputs Meta
  const [metaDescricao, setMetaDescricao] = useState("");
  const [metaValor, setMetaValor] = useState<number | "">("");
  const [metaPeriodo, setMetaPeriodo] = useState<Meta["periodo"]>("mensal");

  // Inputs Pagamento
  const [pagDescricao, setPagDescricao] = useState("");
  const [pagValor, setPagValor] = useState<number | "">("");
  const [pagMetodo, setPagMetodo] = useState<Pagamento["metodo"]>("pix");
  const [pagData, setPagData] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Resumo financeiro
  const totalPagamentos = useMemo(
    () => pagamentos.reduce((sum, p) => sum + p.valor, 0),
    [pagamentos]
  );

  const lucroEstimado = useMemo(
    () => (meta ? meta.valor_meta - totalPagamentos : 0),
    [meta, totalPagamentos]
  );

  // =========================
  // Salvar Meta no Banco
  // =========================
  const salvarMeta = async () => {
    if (!metaDescricao || !metaValor) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/financeiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          descricao: metaDescricao,
          valor_meta: Number(metaValor),
          periodo: metaPeriodo,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMeta({
          descricao: metaDescricao,
          valor_meta: Number(metaValor),
          periodo: metaPeriodo,
        });
        setMetaDescricao("");
        setMetaValor("");
      } else {
        alert("Erro ao salvar meta: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar meta");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // Adicionar Pagamento
  // =========================
  const adicionarPagamento = async () => {
    if (!pagDescricao || !pagValor || !pagData) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/financeiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          descricao: pagDescricao,
          valor: Number(pagValor),
          metodo_pagamento: pagMetodo,
          data_pagamento: pagData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPagamentos((prev) => [
          ...prev,
          { descricao: pagDescricao, valor: Number(pagValor), metodo: pagMetodo, data: pagData },
        ]);
        setPagDescricao("");
        setPagValor("");
        setPagData("");
      } else {
        alert("Erro ao salvar pagamento: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lado esquerdo: Cadastro */}
      <div className="lg:col-span-1 space-y-6">
        {/* Meta */}
        <Card>
          <CardHeader>
            <CardTitle>Definir Meta Financeira</CardTitle>
            <CardDescription>Cadastre sua meta uma única vez.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {meta ? (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-semibold">{meta.descricao}</p>
                <p>Valor: R${meta.valor_meta.toFixed(2)}</p>
                <p>Período: {meta.periodo}</p>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Descrição da meta"
                  value={metaDescricao}
                  onChange={(e) => setMetaDescricao(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Valor da meta"
                  value={metaValor}
                  onChange={(e) =>
                    setMetaValor(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
                <Select
                  value={metaPeriodo}
                  onValueChange={(v) => setMetaPeriodo(v as Meta["periodo"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={salvarMeta}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Salvando..." : "Salvar Meta"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Registrar Pagamento</CardTitle>
            <CardDescription>
              Adicione cada gasto ou pagamento realizado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Descrição do pagamento"
              value={pagDescricao}
              onChange={(e) => setPagDescricao(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={pagValor}
              onChange={(e) =>
                setPagValor(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
            <Select
              value={pagMetodo}
              onValueChange={(v) => setPagMetodo(v as Pagamento["metodo"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">Pix</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={pagData}
              onChange={(e) => setPagData(e.target.value)}
            />
            <Button
              onClick={adicionarPagamento}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Salvando..." : "Adicionar Pagamento"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resumo */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Atualizado em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg border">
              <p className="text-sm text-gray-500">Meta</p>
              <p className="text-xl font-bold text-green-700">
                {meta ? `R$${meta.valor_meta.toFixed(2)}` : "R$0,00"}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border">
              <p className="text-sm text-gray-500">Total de Pagamentos</p>
              <p className="text-xl font-bold text-red-700">
                R${totalPagamentos.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border">
              <p className="text-sm text-gray-500">Lucro Estimado</p>
              <p className="text-xl font-bold text-blue-700">
                R${lucroEstimado.toFixed(2)}
              </p>
            </div>
          </CardContent>

          {/* Lista de Pagamentos */}
          <CardContent className="mt-4 overflow-x-auto max-h-64">
            <h3 className="font-semibold mb-2">Pagamentos / Gastos</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3">Descrição</th>
                  <th className="py-2 px-3">Valor</th>
                  <th className="py-2 px-3">Método</th>
                  <th className="py-2 px-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-gray-500 italic"
                    >
                      Nenhum pagamento registrado
                    </td>
                  </tr>
                ) : (
                  pagamentos.map((p, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{p.descricao}</td>
                      <td className="py-2 px-3">R${p.valor.toFixed(2)}</td>
                      <td className="py-2 px-3">{p.metodo}</td>
                      <td className="py-2 px-3">{p.data}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
