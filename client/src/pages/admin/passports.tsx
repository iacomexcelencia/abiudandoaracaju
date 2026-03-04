import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, Users, Trophy, MapPin } from "lucide-react";
import { useState } from "react";

interface TouristPassport {
  id: string;
  passportCode: string;
  email: string | null;
  totalPoints: string;
  totalVisits: string;
  level: string | null;
  createdAt: string | null;
  lastVisit: string | null;
}

export default function AdminPassports() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: passports = [], isLoading } = useQuery<TouristPassport[]>({
    queryKey: ["/api/passports"],
  });

  const filteredPassports = passports.filter(passport =>
    passport.passportCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passport.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: passports.length,
    totalVisits: passports.reduce((sum, p) => sum + Number(p.totalVisits || 0), 0),
    totalPoints: passports.reduce((sum, p) => sum + Number(p.totalPoints || 0), 0),
    avgVisits: passports.length > 0 
      ? (passports.reduce((sum, p) => sum + Number(p.totalVisits || 0), 0) / passports.length).toFixed(1) 
      : "0"
  };

  return (
    <AdminLayout title="Passaportes Digitais" subtitle="Gerencie os passaportes turísticos dos visitantes">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Passaportes</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Visitas</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Pontos</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPoints}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Média de Visitas</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.avgVisits}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Pesquisar Passaportes</CardTitle>
            <CardDescription>Busque por código do passaporte ou e-mail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Digite o código ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-passport"
              />
            </div>
          </CardContent>
        </Card>

        {/* Passports List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Passaportes ({filteredPassports.length})</CardTitle>
            <CardDescription>Todos os passaportes digitais emitidos</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Carregando passaportes...</div>
            ) : filteredPassports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "Nenhum passaporte encontrado com esse critério" : "Nenhum passaporte emitido ainda"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3 font-semibold">Código</th>
                      <th className="pb-3 font-semibold">E-mail</th>
                      <th className="pb-3 font-semibold">Nível</th>
                      <th className="pb-3 font-semibold text-center">Visitas</th>
                      <th className="pb-3 font-semibold text-center">Pontos</th>
                      <th className="pb-3 font-semibold">Criado em</th>
                      <th className="pb-3 font-semibold">Última Visita</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredPassports.map((passport) => (
                      <tr key={passport.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-passport-${passport.id}`}>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-orange-600" />
                            <span className="font-mono font-semibold text-orange-700">{passport.passportCode}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-700">
                          {passport.email || <span className="text-gray-400 italic">Não informado</span>}
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="text-xs">
                            {passport.level || "Iniciante"}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-semibold text-blue-700">{passport.totalVisits || 0}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-semibold text-yellow-700">{passport.totalPoints || 0}</span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {passport.createdAt ? new Date(passport.createdAt).toLocaleDateString('pt-BR') : "-"}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {passport.lastVisit ? new Date(passport.lastVisit).toLocaleDateString('pt-BR') : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
