import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route as RouteIcon, MapPin, Clock, Navigation, Plus, Edit, Trash2, Power, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TouristSpot } from "@shared/schema";

interface TouristRoute {
  id: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  duration: string;
  difficulty: string;
  spotIds: string[];
  categories: string[];
  totalDistance: string | null;
  isActive: boolean | null;
  createdAt: string | null;
}

interface RouteFormData {
  name_pt: string;
  name_en: string;
  name_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  duration: string;
  difficulty: string;
  spotIds: string[];
  categories: string[];
  totalDistance: string;
  isActive: boolean;
}

const emptyFormData: RouteFormData = {
  name_pt: "",
  name_en: "",
  name_es: "",
  description_pt: "",
  description_en: "",
  description_es: "",
  duration: "",
  difficulty: "facil",
  spotIds: [],
  categories: [],
  totalDistance: "",
  isActive: true,
};

export default function AdminRoutes() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TouristRoute | null>(null);
  const [formData, setFormData] = useState<RouteFormData>(emptyFormData);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);

  const { data: routes = [], isLoading } = useQuery<TouristRoute[]>({
    queryKey: ["/api/routes"],
  });

  const { data: allSpots = [] } = useQuery<TouristSpot[]>({
    queryKey: ["/api/spots"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: RouteFormData) => {
      return await apiRequest("POST", "/api/routes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      setIsDialogOpen(false);
      setFormData(emptyFormData);
      setSelectedSpots([]);
      toast({
        title: "Rota criada!",
        description: "A rota turística foi cadastrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a rota. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RouteFormData> }) => {
      return await apiRequest("PUT", `/api/routes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      setIsDialogOpen(false);
      setEditingRoute(null);
      setFormData(emptyFormData);
      setSelectedSpots([]);
      toast({
        title: "Rota atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a rota. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/routes/${id}/toggle`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      toast({
        title: "Status alterado!",
        description: "O status da rota foi atualizado.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/routes/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routes"] });
      toast({
        title: "Rota excluída!",
        description: "A rota foi removida do sistema.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a rota.",
        variant: "destructive",
      });
    },
  });

  const handleSpotToggle = (spotId: string) => {
    setSelectedSpots((prev) =>
      prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categories = Array.from(new Set(
      selectedSpots
        .map((spotId) => allSpots.find((s) => s.id === spotId)?.category)
        .filter(Boolean) as string[]
    ));

    const dataToSubmit = {
      ...formData,
      spotIds: selectedSpots,
      categories,
    };

    if (editingRoute) {
      updateMutation.mutate({ id: editingRoute.id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const openEditDialog = (route: TouristRoute) => {
    setEditingRoute(route);
    setFormData({
      name_pt: route.name_pt,
      name_en: route.name_en,
      name_es: route.name_es,
      description_pt: route.description_pt,
      description_en: route.description_en,
      description_es: route.description_es,
      duration: route.duration,
      difficulty: route.difficulty,
      spotIds: route.spotIds || [],
      categories: route.categories || [],
      totalDistance: route.totalDistance || "",
      isActive: route.isActive ?? true,
    });
    setSelectedSpots(route.spotIds || []);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingRoute(null);
    setFormData(emptyFormData);
    setSelectedSpots([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      facil: "bg-green-100 text-green-800 border-green-300",
      moderado: "bg-yellow-100 text-yellow-800 border-yellow-300",
      desafiador: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      praia: "bg-blue-50 text-blue-700",
      historico: "bg-amber-50 text-amber-700",
      cultura: "bg-purple-50 text-purple-700",
      restaurante: "bg-red-50 text-red-700",
    };
    return colors[category] || "bg-gray-50 text-gray-700";
  };

  const stats = {
    total: routes.length,
    active: routes.filter((r) => r.isActive).length,
    inactive: routes.filter((r) => !r.isActive).length,
    avgSpots:
      routes.length > 0
        ? (routes.reduce((sum, r) => sum + (r.spotIds?.length || 0), 0) / routes.length).toFixed(1)
        : "0",
  };

  return (
    <AdminLayout title="Rotas Turísticas" subtitle="Gerencie as rotas e roteiros turísticos cadastrados">
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <div></div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingRoute(null);
                  setFormData(emptyFormData);
                  setSelectedSpots([]);
                }}
                className="bg-orange-600 hover:bg-orange-700"
                data-testid="button-create-route"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Nova Rota
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRoute ? "Editar Rota Turística" : "Cadastrar Nova Rota Turística"}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações em todos os idiomas para criar uma rota completa
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Multilingual Tabs */}
                <Tabs defaultValue="pt" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pt">🇧🇷 Português</TabsTrigger>
                    <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                    <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pt" className="space-y-4">
                    <div>
                      <Label htmlFor="name_pt">Nome da Rota (Português)</Label>
                      <Input
                        id="name_pt"
                        value={formData.name_pt}
                        onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
                        placeholder="Ex: Rota das Praias Históricas"
                        required
                        data-testid="input-name-pt"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_pt">Descrição (Português)</Label>
                      <Textarea
                        id="description_pt"
                        value={formData.description_pt}
                        onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                        placeholder="Descreva a rota turística..."
                        rows={4}
                        required
                        data-testid="textarea-description-pt"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label htmlFor="name_en">Route Name (English)</Label>
                      <Input
                        id="name_en"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="Ex: Historic Beaches Route"
                        required
                        data-testid="input-name-en"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_en">Description (English)</Label>
                      <Textarea
                        id="description_en"
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        placeholder="Describe the tourist route..."
                        rows={4}
                        required
                        data-testid="textarea-description-en"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="es" className="space-y-4">
                    <div>
                      <Label htmlFor="name_es">Nombre de la Ruta (Español)</Label>
                      <Input
                        id="name_es"
                        value={formData.name_es}
                        onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                        placeholder="Ej: Ruta de las Playas Históricas"
                        required
                        data-testid="input-name-es"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_es">Descripción (Español)</Label>
                      <Textarea
                        id="description_es"
                        value={formData.description_es}
                        onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                        placeholder="Describe la ruta turística..."
                        rows={4}
                        required
                        data-testid="textarea-description-es"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Route Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duração Estimada</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Ex: 3 horas, meio dia, dia inteiro"
                      required
                      data-testid="input-duration"
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Nível de Dificuldade</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger data-testid="select-difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facil">Fácil</SelectItem>
                        <SelectItem value="moderado">Moderado</SelectItem>
                        <SelectItem value="desafiador">Desafiador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="totalDistance">Distância Total (km)</Label>
                    <Input
                      id="totalDistance"
                      type="number"
                      step="0.1"
                      value={formData.totalDistance}
                      onChange={(e) => setFormData({ ...formData, totalDistance: e.target.value })}
                      placeholder="Ex: 5.5"
                      data-testid="input-distance"
                    />
                  </div>
                </div>

                {/* Spot Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Selecione os Pontos Turísticos da Rota
                  </Label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                    {allSpots.map((spot) => (
                      <div
                        key={spot.id}
                        onClick={() => handleSpotToggle(spot.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedSpots.includes(spot.id)
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        data-testid={`checkbox-spot-${spot.id}`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedSpots.includes(spot.id)
                              ? "bg-orange-500 border-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedSpots.includes(spot.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{spot.name_pt}</p>
                          <Badge className={`${getCategoryColor(spot.category)} text-xs mt-1`} variant="outline">
                            {spot.category}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          {selectedSpots.indexOf(spot.id) + 1 || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedSpots.length} pontos selecionados
                  </p>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog} data-testid="button-cancel">
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-route"
                  >
                    {editingRoute ? "Salvar Alterações" : "Criar Rota"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Rotas</CardTitle>
              <RouteIcon className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rotas Ativas</CardTitle>
              <Navigation className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rotas Inativas</CardTitle>
              <RouteIcon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{stats.inactive}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Média de Pontos</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.avgSpots}</div>
            </CardContent>
          </Card>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Carregando rotas...</div>
          ) : routes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <RouteIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma rota cadastrada</p>
              <p className="text-gray-400 text-sm mt-2">
                Clique em "Cadastrar Nova Rota" para começar
              </p>
            </div>
          ) : (
            routes.map((route) => (
              <Card
                key={route.id}
                className="hover:shadow-lg transition-shadow"
                data-testid={`card-route-${route.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg flex-1">{route.name_pt}</CardTitle>
                    <Badge className={getDifficultyColor(route.difficulty)} variant="outline">
                      {route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {route.description_pt.substring(0, 100)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Route Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-gray-700">{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">{route.spotIds?.length || 0} pontos</span>
                    </div>
                  </div>

                  {/* Distance */}
                  {route.totalDistance && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Navigation className="h-4 w-4" />
                      <span>Distância total: {route.totalDistance} km</span>
                    </div>
                  )}

                  {/* Categories */}
                  {route.categories && route.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {route.categories.map((cat, idx) => (
                        <Badge key={idx} className={getCategoryColor(cat)} variant="outline">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Status and Date */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    {route.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Inativa
                      </Badge>
                    )}
                    {route.createdAt && (
                      <span className="text-xs text-gray-500">
                        Criada em {new Date(route.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(route)}
                      className="flex-1"
                      data-testid={`button-edit-${route.id}`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleMutation.mutate(route.id)}
                      className={route.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                      data-testid={`button-toggle-${route.id}`}
                    >
                      <Power className="w-4 h-4 mr-1" />
                      {route.isActive ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm("Deseja realmente excluir esta rota?")) {
                          deleteMutation.mutate(route.id);
                        }
                      }}
                      className="text-red-600 hover:bg-red-50"
                      data-testid={`button-delete-${route.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
