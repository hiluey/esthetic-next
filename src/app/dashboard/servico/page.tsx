"use client";

import { useEffect, useState } from "react";
import { PlusCircle, MoreHorizontal, DollarSign, Tag } from "lucide-react";
import { useForm } from "react-hook-form";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProdutoFormValues = {
  nome: string;
  categoria: string;
  preco_venda: number;
};

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco_venda: number;
  estoque?: number;
};

const categorias = ["Cabelo", "Pele", "Unhas", "Massagem", "Maquiagem", "Outros"];

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  const form = useForm<ProdutoFormValues>({
    defaultValues: {
      nome: "",
      categoria: "",
      preco_venda: 0,
    },
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/produtos");
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ProdutoFormValues) => {
    setApiResult(null);
    try {
      const payload = {
        nome: values.nome,
        categoria: values.categoria,
        preco_venda: values.preco_venda.toString(),
      };
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      const novo = await res.json();
      setProdutos([novo, ...produtos]);
      form.reset();
      setApiResult(`✅ Produto ${novo.nome} criado com sucesso!`);
      setOpen(false);
    } catch (error: any) {
      console.error("Erro ao cadastrar produto:", error);
      setApiResult(`❌ Falha ao criar produto: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Gerencie seus produtos e preços.</CardDescription>
          </div>

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

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="nome"
                    rules={{ required: "Nome é obrigatório." }}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Nome</Label>
                        <FormControl>
                          <Input placeholder="Nome do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Categoria */}
                  <FormField
                    control={form.control}
                    name="categoria"
                    rules={{ required: "Categoria é obrigatória." }}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Categoria</Label>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categorias.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preço de Venda */}
                  <FormField
                    control={form.control}
                    name="preco_venda"
                    rules={{
                      min: { value: 0, message: "Valor não pode ser negativo." },
                      required: "Preço de venda é obrigatório."
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Preço de Venda (R$)</Label>
                        <FormControl>
                          <Input
                            type="number"
                            step={0.01}
                            min={0}
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Cadastrar Produto
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {apiResult && (
          <p
            className={`text-sm mb-4 font-semibold ${
              apiResult.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {apiResult}
          </p>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço de Venda</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : produtos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>
                    {produto.preco_venda.toLocaleString("pt‑BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                      Ações
                    </Button>
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
