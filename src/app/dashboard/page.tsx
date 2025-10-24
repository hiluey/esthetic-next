"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  CalendarCheck,
  Users,
  Award,
  Quote,
  PlusCircle,
  ClipboardList,
  BarChart3,
  Briefcase,
  CalendarDays,
  Edit,
  Trash2,
  Search,
  LayoutDashboard,
  Sparkles,
  Calendar,
  DollarSign as Dollar,
  Megaphone,
  Box,
  Users2,
  User,
  Wrench,
  Check,
  X,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type AgendaItem = {
  id: number;
  procedimento: string | null;
  valor: number | null;
  data_hora: string;
};

type Stats = {
  faturamento: number;
  atendimentos: number;
  ticketMedio: number;
  metaMensal: number;
  progressoMeta: number;
};

type DashboardData = {
  stats: Stats;
  agendamentos: AgendaItem[];
};

const chartConfig = {
  revenue: {
    label: "Faturamento",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Opções de atalhos disponíveis
const allShortcuts = [
  { title: "Chat IA", href: "/dashboard/ia", icon: Sparkles },
  { title: "Agenda", href: "/dashboard/agenda", icon: Calendar },
  { title: "Financeiro", href: "/dashboard/financeiro", icon: Dollar },
  { title: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
  { title: "rodutos", href: "/dashboard/produtos", icon: Box },
  { title: "Equipe", href: "/dashboard/equipe", icon: Users2 },
  { title: "Clientes", href: "/dashboard/cliente", icon: User },
  { title: "Serviços", href: "/dashboard/servico", icon: Wrench },
];

export default function Dashboard() {
  const { data, error } = useSWR<DashboardData>("/api/dashboard", fetcher, {
    refreshInterval: 10000,
  });

  const { user } = useUser();
  const router = useRouter();

  // ==== NOVO: Estado dos atalhos ====
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>([]);
  const [isEditShortcuts, setIsEditShortcuts] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user_shortcuts");
    if (saved) {
      setSelectedShortcuts(JSON.parse(saved));
    } else {
      // padrão inicial
      setSelectedShortcuts(["Agenda", "Chat IA", "Financeiro", "Clientes"]);
    }
  }, []);

  const toggleShortcut = (title: string) => {
    setSelectedShortcuts((prev) => {
      if (prev.includes(title)) {
        return prev.filter((s) => s !== title);
      } else if (prev.length < 4) {
        return [...prev, title];
      } else {
        return prev; // limita a 4
      }
    });
  };

  const saveShortcuts = () => {
    localStorage.setItem("user_shortcuts", JSON.stringify(selectedShortcuts));
    setIsEditShortcuts(false);
  };

  const visibleShortcuts = allShortcuts.filter((s) =>
    selectedShortcuts.includes(s.title)
  );

  // ==== Resto dos estados ====
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchAgenda, setSearchAgenda] = useState("");
  const [searchTarefa, setSearchTarefa] = useState("");
  const [searchNegocio, setSearchNegocio] = useState("");

  const [tarefas, setTarefas] = useState([
    { id: 1, titulo: "Confirmar estoque", prazo: "Hoje" },
    { id: 2, titulo: "Postagem no Instagram", prazo: "Amanhã" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({ titulo: "", prazo: "" });

  const handleAddTarefa = () => {
    if (!novaTarefa.titulo.trim() || !novaTarefa.prazo.trim()) return;

    setTarefas((prev) => [
      ...prev,
      {
        id: Date.now(),
        titulo: novaTarefa.titulo,
        prazo: novaTarefa.prazo,
      },
    ]);

    setNovaTarefa({ titulo: "", prazo: "" });
    setIsModalOpen(false);
  };

  const negocios = [
    { id: 1, nome: "Estúdio Bella", categoria: "Beleza" },
    { id: 2, nome: "Clínica Reviva", categoria: "Estética" },
  ];

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Carregando dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Erro ao carregar dados do dashboard.
      </div>
    );

  if (!user) return null;

  const { stats, agendamentos } = data;

  const chartData = [
    { month: "Jan", revenue: 1860 },
    { month: "Fev", revenue: 3050 },
    { month: "Mar", revenue: 2370 },
    { month: "Abr", revenue: 730 },
    { month: "Mai", revenue: 2090 },
    { month: "Jun", revenue: 2140 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Boas-vindas */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Olá, {user.nome}!</h1>
        <p className="text-muted-foreground">Veja os detalhes do seu negócio.</p>
      </div>

      {/* Botões de Atalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Atalhos Rápidos</h2>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsEditShortcuts(true)}
        >
          <Edit3 className="h-4 w-4" /> Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleShortcuts.map((shortcut) => (
          <Button
            key={shortcut.title}
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push(shortcut.href)}
          >
            <shortcut.icon className="h-4 w-4" /> {shortcut.title}
          </Button>
        ))}
      </div>

      {/* Modal Editar Atalhos */}
      <Dialog open={isEditShortcuts} onOpenChange={setIsEditShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha até 4 atalhos</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {allShortcuts.map((item) => {
              const selected = selectedShortcuts.includes(item.title);
              const disabled =
                !selected && selectedShortcuts.length >= 4;

              return (
                <button
                  key={item.title}
                  onClick={() => !disabled && toggleShortcut(item.title)}
                  className={`border rounded-md p-3 flex items-center gap-2 text-sm transition-all ${
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                  {selected && <Check className="h-4 w-4 ml-auto" />}
                </button>
              );
            })}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditShortcuts(false)}>
              Cancelar
            </Button>
            <Button onClick={saveShortcuts}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Cards de informações rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.faturamento.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos (Mês)</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atendimentos}</div>
            <p className="text-xs text-muted-foreground">
              +18.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.ticketMedio.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-tr from-primary to-purple-400 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Meta Mensal
            </CardTitle>
            <Award className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.metaMensal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <Progress
                value={Math.min(stats.progressoMeta, 100)}
                className="h-2 bg-primary-foreground/20"
              />
              <span>{Math.round(stats.progressoMeta)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico + Agendamentos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral do Faturamento</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(v) => v.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Agendamentos */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Agendamentos
              </CardTitle>
              <CardDescription>
                Visualize os horários e gerencie suas consultas.
              </CardDescription>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
              <Button
                variant="default"
                className="flex items-center gap-1"
                onClick={() => router.push("/dashboard/agenda")}
              >
                <PlusCircle className="h-4 w-4" /> Novo
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="relative mb-3">
              <Input
                placeholder="Buscar por nome ou procedimento..."
                value={searchAgenda}
                onChange={(e) => setSearchAgenda(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="max-h-[300px] overflow-y-auto rounded-md border">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendamentos
                    .filter((a) =>
                      (a.procedimento ?? "")
                        .toLowerCase()
                        .includes(searchAgenda.toLowerCase())
                    )
                    .map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono">
                          {new Date(item.data_hora).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </TableCell>
                        <TableCell>{item.procedimento ?? "-"}</TableCell>
                        <TableCell className="text-right font-mono">
                          {(item.valor ?? 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}

                  {agendamentos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Nenhum agendamento encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle>Tarefas</CardTitle>
          </div>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" /> Nova
          </Button>
        </CardHeader>

        <CardContent>
          <div className="relative mb-3">
            <Input
              placeholder="Buscar tarefa..."
              value={searchTarefa}
              onChange={(e) => setSearchTarefa(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tarefas
                .filter((t) =>
                  t.titulo.toLowerCase().includes(searchTarefa.toLowerCase())
                )
                .map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/20">
                    <TableCell>{t.titulo}</TableCell>
                    <TableCell>{t.prazo}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          t.prazo === "Hoje"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {t.prazo === "Hoje" ? "Pendente" : "Planejada"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Nova Tarefa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input
                placeholder="Ex: Ligar para cliente"
                value={novaTarefa.titulo}
                onChange={(e) =>
                  setNovaTarefa((prev) => ({ ...prev, titulo: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prazo</label>
              <Input
                type="text"
                placeholder="Ex: Hoje, Amanhã, 25/10/2025..."
                value={novaTarefa.prazo}
                onChange={(e) =>
                  setNovaTarefa((prev) => ({ ...prev, prazo: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTarefa}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meu Negócio */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Meu Negócio</CardTitle>
              <CardDescription>Gerencie seus negócios cadastrados.</CardDescription>
            </div>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0 relative">
            <Input
              placeholder="Pesquisar negócio..."
              value={searchNegocio}
              onChange={(e) => setSearchNegocio(e.target.value)}
              className="pl-8 w-56"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Button
              variant="default"
              className="flex items-center gap-1"
              onClick={() => router.push("/dashboard/negocio/novo")}
            >
              <PlusCircle className="h-4 w-4" /> Novo
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {negocios
                  .filter((n) =>
                    n.nome.toLowerCase().includes(searchNegocio.toLowerCase())
                  )
                  .map((n) => (
                    <TableRow key={n.id} className="hover:bg-muted/20">
                      <TableCell>{n.nome}</TableCell>
                      <TableCell>{n.categoria}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                {negocios.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhum negócio encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quadro Motivacional */}
      <Card className="bg-accent/50 border-accent">
        <CardHeader className="flex flex-row items-start gap-4">
          <Quote className="h-6 w-6 text-muted-foreground mt-1" />
          <div>
            <CardTitle>Painel Motivacional</CardTitle>
            <CardDescription className="text-lg italic text-foreground/80 mt-2">
              "O sucesso é a soma de pequenos esforços repetidos dia após dia."
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-2">
              - Robert Collier
            </p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
