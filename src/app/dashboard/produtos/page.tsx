"use client";

import { useEffect, useState } from "react";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Produto = {
  id: number;
  nome: string | null;
  estoque: number | null;
  validade: string | null;
  custo: number | null;
  preco_venda: number | null;
  criado_em: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Campos do novo produto
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    estoque: "",
    validade: "",
    custo: "",
    preco_venda: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produtos");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoProduto({ ...novoProduto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...novoProduto,
          estoque: Number(novoProduto.estoque),
          custo: Number(novoProduto.custo),
          preco_venda: Number(novoProduto.preco_venda),
        }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar produto");

      const novo = await res.json();
      setProducts([novo, ...products]);
      setOpen(false);
      setNovoProduto({
        nome: "",
        estoque: "",
        validade: "",
        custo: "",
        preco_venda: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar produto.");
    }
  };

  if (loading) return <div>Carregando produtos...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Gerencie seus produtos e controle de estoque.
            </CardDescription>
          </div>

          {/* 🧱 BOTÃO ADICIONAR COM MODAL */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Produto</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    name="nome"
                    value={novoProduto.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estoque</Label>
                  <Input
                    name="estoque"
                    type="number"
                    value={novoProduto.estoque}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Validade</Label>
                  <Input
                    name="validade"
                    type="date"
                    value={novoProduto.validade}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custo</Label>
                  <Input
                    name="custo"
                    type="number"
                    step="0.01"
                    value={novoProduto.custo}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço de Venda</Label>
                  <Input
                    name="preco_venda"
                    type="number"
                    step="0.01"
                    value={novoProduto.preco_venda}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Salvar Produto
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.nome ?? "—"}</TableCell>
                  <TableCell>
                    {product.preco_venda
                      ? product.preco_venda.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>{product.estoque ?? "—"}</TableCell>
                  <TableCell>
                    {product.validade
                      ? new Date(product.validade).toLocaleDateString("pt-BR")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {product.custo
                      ? product.custo.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
