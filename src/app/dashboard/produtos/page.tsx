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

const products = [
  {
    name: "Sérum Vitamina C",
    category: "Skincare",
    price: "R$ 129,90",
    stock: 15,
    status: "in-stock",
  },
  {
    name: "Máscara de Argila Verde",
    category: "Skincare",
    price: "R$ 79,90",
    stock: 3,
    status: "low-stock",
  },
  {
    name: "Óleo Essencial Lavanda",
    category: "Aromaterapia",
    price: "R$ 49,90",
    stock: 25,
    status: "in-stock",
  },
  {
    name: "Creme Hidratante Facial",
    category: "Skincare",
    price: "R$ 89,90",
    stock: 0,
    status: "out-of-stock",
  },
  {
    name: "Limpeza de Pele Profunda",
    category: "Serviço",
    price: "R$ 180,00",
    stock: Infinity,
    status: "service",
  },
  {
    name: "Drenagem Linfática",
    category: "Serviço",
    price: "R$ 250,00",
    stock: Infinity,
    status: "service",
  },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "in-stock":
      return <Badge variant="secondary">Em Estoque</Badge>;
    case "low-stock":
      return <Badge variant="outline" className="text-orange-500 border-orange-500">Estoque Baixo</Badge>;
    case "out-of-stock":
      return <Badge variant="destructive">Sem Estoque</Badge>;
    case "service":
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Serviço</Badge>;
    default:
      return <Badge variant="outline">N/A</Badge>;
  }
}

export default function ProductsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Produtos & Serviços</CardTitle>
            <CardDescription>
              Gerencie seus produtos, serviços e controle o estoque.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-center">Estoque</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={product.status} />
                </TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell className="text-center">
                  {isFinite(product.stock) ? product.stock : "N/A"}
                </TableCell>
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Deletar
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
