"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CalendarDays, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, DollarSign, Menu } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type Evento = {
  id: number;
  title: string;
  start: string;
  end: string;
  colaborador: string;
  valor: number | null;
  status_pagamento: "pagou" | "nao_pagou" | "nao_compareceu";
  procedimento?: string;
};

type FormValues = {
  usuario_id: number;
  cliente_id: number;
  servico_id: number;
  colaborador_id: number;
  data_hora: string;
  procedimento: string;
  valor: number;
  hora_marcada?: string;
  status_pagamento: "pagou" | "nao_pagou" | "nao_compareceu";
};

const statusConfig = {
  pagou: {
    label: "Pago",
    color: "hsl(var(--event-paid))",
    bgColor: "hsl(var(--event-paid) / 0.15)",
    borderColor: "hsl(var(--event-paid))",
  },
  nao_pagou: {
    label: "Pendente",
    color: "hsl(var(--event-pending))",
    bgColor: "hsl(var(--event-pending) / 0.15)",
    borderColor: "hsl(var(--event-pending))",
  },
  nao_compareceu: {
    label: "Não Compareceu",
    color: "hsl(var(--event-missed))",
    bgColor: "hsl(var(--event-missed) / 0.15)",
    borderColor: "hsl(var(--event-missed))",
  },
};

export default function AgendaPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [selectedColaborador, setSelectedColaborador] = useState("todos");
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([]);
  const [colaboradores, setColaboradores] = useState<{ id: number; nome: string }[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("day");
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());

  const form = useForm<FormValues>({
    defaultValues: {
      usuario_id: 1,
      cliente_id: 0,
      servico_id: 0,
      colaborador_id: 0,
      data_hora: new Date().toISOString().slice(0, 16),
      procedimento: "",
      valor: 0,
      hora_marcada: "",
      status_pagamento: "nao_pagou",
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const clientesRes = await fetch("/api/clientes");
      const clientesData = await clientesRes.json();
      setClientes(Array.isArray(clientesData) ? clientesData : []);

      const servicosRes = await fetch("/api/servicos");
      const servicosData = await servicosRes.json();
      setServicos(Array.isArray(servicosData) ? servicosData : []);

      // Aqui trocamos para o endpoint da equipe
      const colabRes = await fetch("/api/equipe");
      const colabData = await colabRes.json();
      setColaboradores(Array.isArray(colabData) ? colabData : []);

      const agendaRes = await fetch("/api/agenda");
      const agendaData = await agendaRes.json();
      setEventos(Array.isArray(agendaData) ? agendaData : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setClientes([]);
      setServicos([]);
      setColaboradores([]);
      setEventos([]);
    }
  }, []);

  // Busca os dados ao montar o componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Função que trata o submit do formulário
  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setApiResult(null);

    try {
      const response = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: Number(values.usuario_id),
          cliente_id: Number(values.cliente_id),
          servico_id: Number(values.servico_id),
          colaborador_id: Number(values.colaborador_id),
          data_hora: new Date(values.data_hora).toISOString(),
          procedimento: values.procedimento || null,
          valor: Number(values.valor),
          hora_marcada: values.hora_marcada,
          status_pagamento: values.status_pagamento,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro da API: ${errorText}`);
      }

      const resultData = await response.json();
      setApiResult(`✅ Agendamento criado com ID ${resultData.id}.`);
      form.reset();

      // Atualiza as listas após agendamento para refletir dados recentes
      await fetchData();
      setIsNewEventDialogOpen(false);
    } catch (error: any) {
      console.error("Erro ao agendar:", error);
      setApiResult(`❌ Falha ao processar o agendamento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredEventos = useMemo(() => {
    return eventos.filter((ev) => {
      const matchColab =
        selectedColaborador === "todos" || ev.colaborador === selectedColaborador;
      return matchColab;
    });
  }, [eventos, selectedColaborador]);

  const eventPropGetter = (event: Evento) => {
    const config = statusConfig[event.status_pagamento];
    return {
      style: {
        backgroundColor: config.bgColor,
        borderLeft: `4px solid ${config.borderColor}`,
        color: config.color,
        borderRadius: "4px",
        fontSize: "0.75rem",
        padding: "4px 6px",
        fontWeight: "500",
        cursor: "pointer",
      },
    };
  };

  // Função para renderizar selects reutilizáveis com dados dinâmicos
  const renderSelect = (
    field: any,
    data: { id: number; nome: string }[] | null | undefined,
    placeholder: string
  ) => {
    const arr = Array.isArray(data) ? data : [];
    return (
      <Select
        onValueChange={(val) => field.onChange(Number(val))}
        value={field.value ? field.value.toString() : ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {arr.length > 0 ? (
            arr.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.nome}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              Sem opções disponíveis
            </div>
          )}
        </SelectContent>
      </Select>
    );
  };

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "TODAY") {
      setCurrentDate(new Date());
      setMiniCalendarDate(new Date());
    } else if (action === "PREV") {
      if (view === "day") {
        setCurrentDate(subDays(currentDate, 1));
      } else if (view === "week") {
        setCurrentDate(subWeeks(currentDate, 1));
      } else {
        setCurrentDate(subMonths(currentDate, 1));
      }
    } else {
      if (view === "day") {
        setCurrentDate(addDays(currentDate, 1));
      } else if (view === "week") {
        setCurrentDate(addWeeks(currentDate, 1));
      } else {
        setCurrentDate(addMonths(currentDate, 1));
      }
    }
  };

  const getViewLabel = () => {
    if (view === "day") {
      return format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = addDays(start, 6);
      return `${format(start, "d", { locale: ptBR })} - ${format(end, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
    } else {
      return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r bg-card overflow-hidden flex flex-col`}>
        <div className="p-4 border-b">
          <Button
            onClick={() => setIsNewEventDialogOpen(true)}
            className="w-full justify-start gap-2 h-12 shadow-md hover:shadow-lg transition-shadow"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Criar
          </Button>
        </div>

        {/* Mini Calendar */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">
              {format(miniCalendarDate, "MMMM yyyy", { locale: ptBR })}
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setMiniCalendarDate(subMonths(miniCalendarDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setMiniCalendarDate(addMonths(miniCalendarDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
              <div key={i} className="text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const firstDay = startOfWeek(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), 1));
              const date = addDays(firstDay, i);
              const isCurrentMonth = date.getMonth() === miniCalendarDate.getMonth();
              const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              const isSelected = format(date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");

              return (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentDate(date);
                    setView("day");
                  }}
                  className={`
                    aspect-square text-xs rounded-full flex items-center justify-center transition-colors
                    ${!isCurrentMonth ? "text-muted-foreground/40" : ""}
                    ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                    ${isSelected && !isToday ? "bg-primary/20 font-semibold" : ""}
                    ${isCurrentMonth && !isToday && !isSelected ? "hover:bg-accent" : ""}
                  `}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 flex-1 overflow-auto">
          <h3 className="text-sm font-semibold mb-3">Filtros</h3>
          <Select value={selectedColaborador} onValueChange={setSelectedColaborador}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Colaborador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {colaboradores.map((c) => (
                <SelectItem key={c.id} value={c.nome}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Legend */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Legenda</h3>
            <div className="space-y-2">
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="border-b bg-card px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <CalendarDays className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold hidden sm:block">Agenda</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleNavigate("TODAY")} size="sm">
                Hoje
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigate("PREV")}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigate("NEXT")}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[200px] hidden md:block">
                {getViewLabel()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={view} onValueChange={(v) => setView(v as View)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Dia</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Calendar Content */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="h-full p-4">
            <Calendar
              localizer={localizer}
              events={filteredEventos.map((ev, index) => {
                const start = new Date(ev.start);
                // Adiciona 1h + um offset de 1 minuto por índice para diferenciar eventos que começam iguais
                const end = new Date(start.getTime() + 60 * 60 * 1000 + index * 60 * 1000);
                return { ...ev, start, end };
              })}

              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              eventPropGetter={eventPropGetter}
              onSelectEvent={handleSelectEvent}
              toolbar={false}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Nenhum evento neste período",
              }}
              formats={{
                dayHeaderFormat: (date) => format(date, "EEE d", { locale: ptBR }),
                dayRangeHeaderFormat: ({ start, end }) =>
                  `${format(start, "d MMM", { locale: ptBR })} - ${format(end, "d MMM yyyy", { locale: ptBR })}`,
                timeGutterFormat: (date) => format(date, "HH:mm"),
              }}
              min={new Date(2024, 0, 1, 7, 0, 0)}
              max={new Date(2024, 0, 1, 22, 0, 0)}
              step={60}
              timeslots={1}
              style={{ height: "calc(100vh - 140px)" }}
            />
          </div>
        </div>
      </div>

      {/* Dialog for New Event */}
      <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Criar Novo Agendamento
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-6 mt-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cliente_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        {renderSelect(field, clientes, "Selecione o cliente")}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="servico_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serviço</FormLabel>
                      <FormControl>
                        {renderSelect(field, servicos, "Selecione o serviço")}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="colaborador_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaborador</FormLabel>
                    <FormControl>
                      {renderSelect(field, colaboradores, "Selecione o colaborador")}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="data_hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data e Hora</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="procedimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procedimento (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descreva o procedimento..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status_pagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status do Pagamento</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) =>
                          field.onChange(v as FormValues["status_pagamento"])
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pagou">Pago</SelectItem>
                          <SelectItem value="nao_pagou">Pendente</SelectItem>
                          <SelectItem value="nao_compareceu">
                            Não Compareceu
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full mt-2" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" /> Salvando...
                  </>
                ) : (
                  "Confirmar Agendamento"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <DialogTitle className="text-2xl font-bold pr-8">
                      {selectedEvent.title}
                    </DialogTitle>
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: statusConfig[selectedEvent.status_pagamento].bgColor,
                        color: statusConfig[selectedEvent.status_pagamento].color,
                        borderColor: statusConfig[selectedEvent.status_pagamento].borderColor,
                      }}
                    >
                      {statusConfig[selectedEvent.status_pagamento].label}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <Separator />

              <div className="space-y-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Data e Hora
                    </p>
                    <p className="text-sm font-semibold">
                      {format(new Date(selectedEvent.start), "EEEE, dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedEvent.start), "HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Colaborador
                    </p>
                    <p className="text-sm font-semibold">{selectedEvent.colaborador}</p>
                  </div>
                </div>

                {selectedEvent.valor && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Valor</p>
                      <p className="text-sm font-semibold">
                        R$ {selectedEvent.valor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.procedimento && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">
                        Procedimento
                      </p>
                      <p className="text-sm">{selectedEvent.procedimento}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
