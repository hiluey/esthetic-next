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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Membro = {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  status: string;
  ultima_atividade: string;
};

export default function TeamPage() {
  const [equipe, setEquipe] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    funcao: "Esteticista",
  });

  useEffect(() => {
    const fetchEquipe = async () => {
      try {
        const res = await fetch("/api/equipe");
        const data = await res.json();
        setEquipe(data);
      } catch (error) {
        console.error("Erro ao buscar equipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipe();
  }, []);

  const handleSubmit = async () => {
    if (!form.nome || !form.email) {
      toast.error("Preencha nome e e-mail!");
      return;
    }

    const res = await fetch("/api/equipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Membro adicionado com sucesso!");
      const novo = await res.json();
      setEquipe((prev) => [novo, ...prev]);
      setOpen(false);
      setForm({ nome: "", email: "", funcao: "Esteticista" });
    } else {
      const erro = await res.json();
      toast.error(erro.error || "Erro ao adicionar membro.");
    }
  };

  if (loading) return <div>Carregando equipe...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Equipe</CardTitle>
            <CardDescription>
              Gerencie sua equipe e veja as permissões de cada um.
            </CardDescription>
          </div>

          {/* Botão + Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Convidar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar Novo Membro</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para adicionar alguém à equipe.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    className="col-span-3"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    className="col-span-3"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="funcao" className="text-right">
                    Função
                  </Label>
                  <Select
                    value={form.funcao}
                    onValueChange={(value) => setForm({ ...form, funcao: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proprietária">Proprietária</SelectItem>
                      <SelectItem value="Esteticista">Esteticista</SelectItem>
                      <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipe.map((membro) => (
              <TableRow key={membro.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://picsum.photos/seed/${membro.id}/40/40`}
                        alt={membro.nome}
                      />
                      <AvatarFallback>
                        {membro.nome.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{membro.nome}</p>
                      <p className="text-xs text-muted-foreground">{membro.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      membro.funcao === "Proprietária" ? "default" : "secondary"
                    }
                  >
                    {membro.funcao}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        membro.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span>{membro.status === "active" ? "Ativo" : "Inativo"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(membro.ultima_atividade).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Editar Permissões</DropdownMenuItem>
                      <DropdownMenuItem>Ver Atividade</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remover da Equipe
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
