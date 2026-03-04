import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Route, Star, Navigation, Filter } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { TouristRoute, TouristSpot } from "@shared/schema";
import secretariaLogo from "@assets/secretaria_logo.jpeg";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";

export default function TouristRoutes() {
  const { getLocalizedText } = useLanguage();
  const [filterDuration, setFilterDuration] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Fetch all tourist routes
  const { data: routes = [], isLoading } = useQuery<TouristRoute[]>({
    queryKey: ["/api/tourist-routes"],
  });

  // Fetch all spots for route details
  const { data: spots = [] } = useQuery<TouristSpot[]>({
    queryKey: ["/api/spots"],
  });

  // Filter routes based on criteria
  const filteredRoutes = routes.filter(route => {
    if (filterDuration !== "all") {
      const durationMinutes = parseInt(route.duration || "0");
      switch (filterDuration) {
        case "short":
          if (durationMinutes > 120) return false;
          break;
        case "medium":
          if (durationMinutes <= 120 || durationMinutes > 240) return false;
          break;
        case "long":
          if (durationMinutes <= 240) return false;
          break;
      }
    }

    if (filterCategory !== "all") {
      if (!route.categories?.includes(filterCategory)) return false;
    }

    return true;
  });

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      praia: "Praias",
      historico: "Histórico",
      cultura: "Cultura",
      restaurante: "Gastronomia",
      natureza: "Natureza"
    };
    return labels[category] || category;
  };

  const getDurationLabel = (minutes: string) => {
    const mins = parseInt(minutes);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}min` : `${hours}h`;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      facil: "bg-green-100 text-green-700",
      moderado: "bg-yellow-100 text-yellow-700",
      dificil: "bg-red-100 text-red-700"
    };
    const labels: { [key: string]: string } = {
      facil: "Fácil",
      moderado: "Moderado",
      dificil: "Difícil"
    };
    return { color: colors[difficulty] || colors.facil, label: labels[difficulty] || difficulty };
  };

  const getSpotsForRoute = (spotIds: string[]) => {
    return spotIds
      .map(id => spots.find(s => s.id === id))
      .filter(Boolean) as TouristSpot[];
  };

  const startGPSNavigation = (route: TouristRoute) => {
    const routeSpots = getSpotsForRoute(route.spotIds);
    if (routeSpots.length > 0) {
      const firstSpot = routeSpots[0];
      if (firstSpot.latitude && firstSpot.longitude) {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${firstSpot.latitude},${firstSpot.longitude}&travelmode=walking`;
        window.open(googleMapsUrl, '_blank');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando rotas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      {/* Header com Logos */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-between">
          <img 
            src={logoAbiudando} 
            alt="Abiudando Aju Logo" 
            className="h-64 md:h-80 object-contain transition-all duration-300"
            data-testid="img-logo-abiudando"
          />
          <img 
            src={secretariaLogo} 
            alt="Secretaria Logo" 
            className="h-10 md:h-14 object-contain"
            data-testid="img-logo-secretaria"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Route className="w-10 h-10 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Rotas Turísticas
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra os melhores roteiros para explorar Aracaju com percursos otimizados
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filtros:</span>
          </div>
          
          <Select value={filterDuration} onValueChange={setFilterDuration}>
            <SelectTrigger className="w-40" data-testid="select-duration">
              <SelectValue placeholder="Duração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas durações</SelectItem>
              <SelectItem value="short">Curta (até 2h)</SelectItem>
              <SelectItem value="medium">Média (2-4h)</SelectItem>
              <SelectItem value="long">Longa (4h+)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40" data-testid="select-category">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="praia">Praias</SelectItem>
              <SelectItem value="historico">Histórico</SelectItem>
              <SelectItem value="cultura">Cultura</SelectItem>
              <SelectItem value="restaurante">Gastronomia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Routes Grid */}
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-12">
            <Route className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma rota encontrada com esses filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => {
              const routeSpots = getSpotsForRoute(route.spotIds);
              const difficulty = getDifficultyBadge(route.difficulty);

              return (
                <Card key={route.id} className="hover:shadow-xl transition-shadow duration-300" data-testid={`card-route-${route.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {route.name_pt}
                      </CardTitle>
                      <Badge className={difficulty.color}>
                        {difficulty.label}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {route.description_pt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Route Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>{getDurationLabel(route.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>{routeSpots.length} pontos turísticos</span>
                      </div>
                    </div>

                    {/* Categories */}
                    {route.categories && route.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {route.categories.map((cat, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {getCategoryLabel(cat)}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Spots List */}
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-gray-500 mb-2">PERCURSO:</p>
                      <ol className="space-y-1">
                        {routeSpots.slice(0, 5).map((spot, idx) => (
                          <li key={spot.id} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-orange-600 font-semibold">{idx + 1}.</span>
                            <span className="line-clamp-1">{spot.name_pt}</span>
                          </li>
                        ))}
                        {routeSpots.length > 5 && (
                          <li className="text-sm text-gray-500 italic">
                            +{routeSpots.length - 5} pontos...
                          </li>
                        )}
                      </ol>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => startGPSNavigation(route)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      data-testid={`button-navigate-${route.id}`}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Iniciar Navegação
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
