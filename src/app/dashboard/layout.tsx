"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Megaphone,
  Box,
  Users2,
  ChevronDown,
  LogOut,
  Settings,
  Wrench,
  User,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
const colorClasses = {
  base: "text-gray-700", // cor padrão do texto
  hover: "hover:bg-gray-100 hover:text-gray-900", // hover leve
  active: "bg-gray-200 text-gray-900", // ativo discreto
};

function SidebarLink({
  href,
  title,
  icon: Icon,
  isActive,
}: SidebarLinkProps) {
  const classes = clsx(
    "flex items-center gap-2 px-4 py-2 w-full rounded transition-colors duration-200",
    isActive ? colorClasses.active : `${colorClasses.base} ${colorClasses.hover}`
  );

  return (
    <Link href={href} passHref>
      <SidebarMenuButton tooltip={title} className={classes}>
        <Icon className="h-5 w-5" />
        <span>{title}</span>
      </SidebarMenuButton>
    </Link>
  );
}

const navLinks = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Chat IA", href: "/dashboard/ia", icon: Sparkles },
  { title: "Agenda", href: "/dashboard/agenda", icon: Calendar },
  { title: "Financeiro", href: "/dashboard/financeiro", icon: DollarSign },
  { title: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
  { title: "Produtos", href: "/dashboard/produtos", icon: Box },
  { title: "Equipe", href: "/dashboard/equipe", icon: Users2 },
  { title: "Clientes", href: "/dashboard/cliente", icon: User },
  { title: "Serviços", href: "/dashboard/servico", icon: Wrench },
];

function UserNav({ user }: { user: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-full justify-start gap-2 px-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://picsum.photos/seed/${user.id}/40/40`} />
            <AvatarFallback>{user.nome[0]}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium">{user.nome}</p>
            <p className="text-xs text-muted-foreground">
              {user.tipo === "esteticista" ? "Proprietário(a)" : user.tipo}
            </p>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.nome}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            location.href = "/";
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SidebarLinkProps {
  href: string;
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  userColor: string;
}


 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const userColor = user?.cor_app || "default";

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/");
  }

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Não autenticado</div>;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="EsteticaAI Logo"
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarLink
                  href={link.href}
                  title={link.title}
                  icon={link.icon}
                  isActive={pathname === link.href}
                  userColor={userColor}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">{/* page title ou breadcrumbs */}</div>
          <div className="flex items-center gap-2">
            <UserNav user={user} />
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
