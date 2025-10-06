"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  CalendarCheck,
  Users,
  Award,
  Quote,
  Clock,
  Sparkles,
  Scissors,
  Droplet,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const chartData = [
  { month: "Jan", revenue: 1860 },
  { month: "Fev", revenue: 3050 },
  { month: "Mar", revenue: 2370 },
  { month: "Abr", revenue: 730 },
  { month: "Mai", revenue: 2090 },
  { month: "Jun", revenue: 2140 },
];

const chartConfig = {
  revenue: {
    label: "Faturamento",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type AgendaItem = {
  time: string;
  procedure: string;
  value: number;
  icon: "Sparkles" | "Clock" | "Scissors" | "Droplet";
};

export default function Dashboard() {
  const { data: stats } = useSWR("/api/dashboard", fetcher, { refreshInterval: 10000 });
  const { data: dailyAgenda } = useSWR<AgendaItem[]>("/api/agenda", fetcher, { refreshInterval: 10000 });

  const iconMap = {
    Sparkles: <Sparkles className="w-4 h-4 text-blue-500" />,
    Clock: <Clock className="w-4 h-4 text-green-500" />,
    Scissors: <Scissors className="w-4 h-4 text-purple-500" />,
    Droplet: <Droplet className="w-4 h-4 text-pink-500" />,
  };

  if (!stats || !dailyAgenda) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.faturamento ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos (Mês)</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.atendimentos ?? 0}</div>
            <p className="text-xs text-muted-foreground">+18.1% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.ticketMedio ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-xs text-muted-foreground">+5.2% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-tr from-primary to-purple-400 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Meta Mensal</CardTitle>
            <Award className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.metaMensal ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Progress value={Math.min(stats?.progressoMeta ?? 0, 100)} className="h-2 bg-primary-foreground/20" />
              <span>{Math.round(stats?.progressoMeta ?? 0)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico e agenda */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral do Faturamento</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Agenda do Dia</CardTitle>
            <CardDescription>Procedimentos agendados para hoje.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Procedimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyAgenda?.length > 0 ? (
                  dailyAgenda.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{item.time}</TableCell>
                      <TableCell className="flex items-center gap-2">{iconMap[item.icon]} {item.procedure}</TableCell>
                      <TableCell className="text-right font-mono">
                        {(item.value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Nenhum procedimento agendado para hoje.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Painel motivacional */}
      <Card className="bg-accent/50 border-accent">
        <CardHeader className="flex flex-row items-start gap-4">
          <Quote className="h-6 w-6 text-muted-foreground mt-1" />
          <div>
            <CardTitle>Painel Motivacional</CardTitle>
            <CardDescription className="text-lg italic text-foreground/80 mt-2">
              "O sucesso é a soma de pequenos esforços repetidos dia após dia."
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-2">- Robert Collier</p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
