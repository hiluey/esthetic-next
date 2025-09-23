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

const teamMembers = [
  {
    name: "Sofia Lima",
    email: "sofia.lima@example.com",
    role: "Proprietária",
    avatar: "SL",
    img: "user-avatar",
    status: "active",
    lastActivity: "2 min atrás",
  },
  {
    name: "Ana Clara",
    email: "ana.clara@example.com",
    role: "Esteticista",
    avatar: "AC",
    img: "1",
    status: "active",
    lastActivity: "30 min atrás",
  },
  {
    name: "Joana Martins",
    email: "joana.martins@example.com",
    role: "Esteticista",
    avatar: "JM",
    img: "2",
    status: "active",
    lastActivity: "2 horas atrás",
  },
  {
    name: "Beatriz Oliveira",
    email: "beatriz.oliveira@example.com",
    role: "Recepcionista",
    avatar: "BO",
    img: "3",
    status: "inactive",
    lastActivity: "3 dias atrás",
  },
];

export default function TeamPage() {
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
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Convidar Membro
          </Button>
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
            {teamMembers.map((member) => (
              <TableRow key={member.email}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://picsum.photos/seed/${member.img}/40/40`}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.role === 'Proprietária' ? 'default' : 'secondary'}>{member.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{member.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </TableCell>
                <TableCell>{member.lastActivity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
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
