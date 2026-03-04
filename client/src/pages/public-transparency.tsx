import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, MapPin, TrendingUp, Globe, Award, Clock, Heart } from "lucide-react";
import type { TouristFeedback, TouristSpot } from "@shared/schema";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import secretariaLogo from "@assets/secretaria_logo.jpeg";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";

export default function PublicTransparency() {
  // Fetch public data
  const { data: feedbacks = [], isLoading: loadingFeedback } = useQuery<TouristFeedback[]>({
    queryKey: ["/api/tourist-feedback"],
  });

  const { data: spots = [], isLoading: loadingSpots } = useQuery<TouristSpot[]>({
    queryKey: ["/api/spots"],
  });

  const isLoading = loadingFeedback || loadingSpots;

  // Calculate statistics
  const stats = useMemo(() => {
    const totalVisitors = feedbacks.length;
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((acc, f) => acc + parseFloat(f.rating || "0"), 0) / feedbacks.length
      : 0;
    
    const satisfactionRate = feedbacks.length > 0
      ? (feedbacks.filter(f => parseFloat(f.rating || "0") >= 4).length / feedbacks.length) * 100
      : 0;

    // Country distribution
    const countries = feedbacks.reduce((acc, f) => {
      acc[f.country] = (acc[f.country] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const topCountries = Object.entries(countries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Category visits
    const categoryVisits = feedbacks.reduce((acc, feedback) => {
      const spot = spots.find(s => s.id === feedback.spotId);
      if (spot?.category) {
        acc[spot.category] = (acc[spot.category] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    const categoryLabels: { [key: string]: string } = {
      praia: "Praias",
      historico: "Histórico",
      cultura: "Cultura",
      restaurante: "Gastronomia",
      natureza: "Natureza"
    };

    const categoryData = Object.entries(categoryVisits).map(([key, value]) => ({
      name: categoryLabels[key] || key,
      value
    }));

    // Top rated spots
    const spotRatings = feedbacks.reduce((acc, feedback) => {
      const spotId = feedback.spotId;
      if (!acc[spotId]) {
        acc[spotId] = { total: 0, count: 0, spotName: '' };
      }
      acc[spotId].total += parseFloat(feedback.rating || "0");
      acc[spotId].count += 1;
      const spot = spots.find(s => s.id === spotId);
      if (spot) acc[spotId].spotName = spot.name_pt;
      return acc;
    }, {} as { [key: string]: { total: number; count: number; spotName: string } });

    const topSpots = Object.entries(spotRatings)
      .map(([, data]) => ({
        name: data.spotName,
        rating: (data.total / data.count).toFixed(1),
        visits: data.count
      }))
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 5);

    return {
      totalVisitors,
      avgRating,
      satisfactionRate,
      totalSpots: spots.length,
      activeSpots: spots.filter(s => s.isActive).length,
      topCountries,
      categoryData,
      topSpots
    };
  }, [feedbacks, spots]);

  const COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
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
          <div className="inline-flex items-center justify-center gap-3 mb-4 bg-orange-100 px-6 py-3 rounded-full">
            <Award className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-orange-900">
              Transparência Turística
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dados públicos sobre o turismo em Aracaju - Conheça os números que mostram o sucesso da nossa cidade
          </p>
          <div className="mt-4 inline-block">
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Clock className="w-4 h-4 mr-2 inline" />
              Atualizado em tempo real
            </Badge>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-600" data-testid="card-total-visitors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Visitantes</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalVisitors.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">registrados no sistema</p>
                </div>
                <Users className="w-12 h-12 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500" data-testid="card-avg-rating">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avaliação Média</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)} ⭐</p>
                  <p className="text-xs text-gray-500 mt-1">de 5.0 estrelas</p>
                </div>
                <Star className="w-12 h-12 text-yellow-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600" data-testid="card-satisfaction">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Satisfação</p>
                  <p className="text-3xl font-bold text-green-600">{stats.satisfactionRate.toFixed(0)}%</p>
                  <p className="text-xs text-gray-500 mt-1">avaliações 4+ estrelas</p>
                </div>
                <Heart className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600" data-testid="card-active-spots">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pontos Turísticos</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeSpots}</p>
                  <p className="text-xs text-gray-500 mt-1">ativos de {stats.totalSpots} total</p>
                </div>
                <MapPin className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Origin by Country */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                Origem dos Visitantes (Top 5 Países)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topCountries.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.topCountries}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {stats.topCountries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Dados insuficientes
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Visitas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ea580c" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Dados insuficientes
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Rated Spots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Pontos Turísticos Mais Bem Avaliados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topSpots.length > 0 ? (
              <div className="space-y-3">
                {stats.topSpots.map((spot, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-lg border border-orange-100"
                    data-testid={`spot-ranking-${index + 1}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{spot.name}</p>
                        <p className="text-sm text-gray-500">{spot.visits} avaliações</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-yellow-600">{spot.rating}</span>
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Nenhuma avaliação disponível ainda
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500 bg-white p-6 rounded-lg shadow-sm">
          <p className="mb-2">
            <strong className="text-orange-600">Prefeitura de Aracaju</strong> - Compromisso com a Transparência
          </p>
          <p>
            Todos os dados são coletados de forma anônima e agregada, respeitando a privacidade dos visitantes.
            As estatísticas são atualizadas em tempo real conforme novos feedbacks são registrados.
          </p>
        </div>
      </div>
    </div>
  );
}
