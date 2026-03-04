import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, Star, MapPin, Calendar, TrendingUp, Download, Filter, Activity, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import type { TouristFeedback, TouristSpot } from "@shared/schema";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";

interface DashboardStats {
  totalSpots: number;
  totalFeedbacks: number;
  averageRating: number;
  spotsPerCategory: { [key: string]: number };
  recentFeedbacks: TouristFeedback[];
  topRatedSpots: (TouristSpot & { avgRating: number; feedbackCount: number })[];
  activeSpots: number;
  spotsWithImages: number;
  spotsWithAddress: number;
  spotsWithQRCode: number;
}

export default function AdminReports() {
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Buscar dados estatísticos
  const statsQuery = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Buscar todos os feedbacks para análises detalhadas
  const feedbackQuery = useQuery<TouristFeedback[]>({
    queryKey: ["/api/tourist-feedback"],
  });

  // Buscar todos os pontos turísticos
  const spotsQuery = useQuery<TouristSpot[]>({
    queryKey: ["/api/spots"],
  });

  const stats = statsQuery.data;
  const feedbacks = feedbackQuery.data || [];
  const spots = spotsQuery.data || [];

  // Filtrar dados baseado nos filtros selecionados
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Filtro por período
    if (filterPeriod !== "all") {
      const feedbackDate = new Date(feedback.createdAt || "");
      const now = new Date();
      
      switch (filterPeriod) {
        case "7days":
          const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (feedbackDate < week) return false;
          break;
        case "30days":
          const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (feedbackDate < month) return false;
          break;
        case "90days":
          const quarter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          if (feedbackDate < quarter) return false;
          break;
      }
    }

    // Filtro por categoria do ponto turístico
    if (filterCategory !== "all") {
      const spot = spots.find(s => s.id === feedback.spotId);
      if (!spot || spot.category !== filterCategory) return false;
    }

    return true;
  });

  // Análises dos dados filtrados
  const avgRatingFiltered = filteredFeedbacks.length > 0 
    ? filteredFeedbacks.reduce((acc, f) => acc + parseFloat(f.rating || "0"), 0) / filteredFeedbacks.length
    : 0;

  // Distribuição por país
  const countryDistribution = filteredFeedbacks.reduce((acc, feedback) => {
    acc[feedback.country] = (acc[feedback.country] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Distribuição por estado
  const stateDistribution = filteredFeedbacks.reduce((acc, feedback) => {
    acc[feedback.state] = (acc[feedback.state] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Motivos de visita mais comuns
  const visitReasons = filteredFeedbacks.reduce((acc, feedback) => {
    acc[feedback.visitReason] = (acc[feedback.visitReason] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Distribuição por tipo de hospedagem
  const accommodationTypes = filteredFeedbacks.reduce((acc, feedback) => {
    acc[feedback.accommodation] = (acc[feedback.accommodation] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Distribuição por duração da estadia
  const stayDurations = filteredFeedbacks.reduce((acc, feedback) => {
    acc[feedback.stayDuration] = (acc[feedback.stayDuration] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Pontos mais visitados (baseado no feedback)
  const spotVisits = filteredFeedbacks.reduce((acc, feedback) => {
    const spot = spots.find(s => s.id === feedback.spotId);
    if (spot) {
      const spotName = spot.name_pt;
      acc[spotName] = (acc[spotName] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  // Distribuição de avaliações
  const ratingDistribution = {
    "1": filteredFeedbacks.filter(f => Math.floor(parseFloat(f.rating || "0")) === 1).length,
    "2": filteredFeedbacks.filter(f => Math.floor(parseFloat(f.rating || "0")) === 2).length,
    "3": filteredFeedbacks.filter(f => Math.floor(parseFloat(f.rating || "0")) === 3).length,
    "4": filteredFeedbacks.filter(f => Math.floor(parseFloat(f.rating || "0")) === 4).length,
    "5": filteredFeedbacks.filter(f => Math.floor(parseFloat(f.rating || "0")) === 5).length,
  };

  // Tendências temporais - agrupar feedbacks por data
  const timeSeriesData = useMemo(() => {
    const grouped = filteredFeedbacks.reduce((acc, feedback) => {
      if (!feedback.createdAt) return acc;
      const date = new Date(feedback.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (!acc[date]) {
        acc[date] = { date, visitas: 0, avaliacaoMedia: 0, total: 0 };
      }
      acc[date].visitas += 1;
      acc[date].total += parseFloat(feedback.rating || "0");
      return acc;
    }, {} as { [key: string]: { date: string; visitas: number; avaliacaoMedia: number; total: number } });

    return Object.values(grouped)
      .map(item => ({
        ...item,
        avaliacaoMedia: item.visitas > 0 ? parseFloat((item.total / item.visitas).toFixed(1)) : 0
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-30); // Last 30 days
  }, [filteredFeedbacks]);

  // Heatmap de visitas por dia da semana e hora
  const heatmapData = useMemo(() => {
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const heatmap: { [key: string]: number } = {};
    
    filteredFeedbacks.forEach(feedback => {
      if (!feedback.createdAt) return;
      const date = new Date(feedback.createdAt);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const hour = date.getHours();
      const key = `${dayOfWeek}`;
      heatmap[key] = (heatmap[key] || 0) + 1;
    });

    return daysOfWeek.map(day => ({
      dia: day,
      visitas: heatmap[day] || 0
    }));
  }, [filteredFeedbacks]);

  // Dados para gráfico de pizza - origens por país (top 5)
  const countryPieData = useMemo(() => {
    const COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];
    return Object.entries(countryDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, value], index) => ({
        name: country,
        value,
        color: COLORS[index % COLORS.length]
      }));
  }, [countryDistribution]);

  const exportReport = () => {
    const reportData = {
      period: filterPeriod,
      category: filterCategory,
      totalFeedbacks: filteredFeedbacks.length,
      averageRating: avgRatingFiltered,
      countryDistribution,
      stateDistribution,
      visitReasons,
      accommodationTypes,
      stayDurations,
      spotVisits,
      ratingDistribution,
      feedbacks: filteredFeedbacks
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-turismo-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (statsQuery.isLoading || feedbackQuery.isLoading || spotsQuery.isLoading) {
    return (
      <AdminLayout title="Relatórios" subtitle="Análises e estatísticas do turismo">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando relatórios...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Relatórios" subtitle="Análises e estatísticas do turismo">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filtros:</span>
        </div>
        
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="90days">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            <SelectItem value="praia">Praia</SelectItem>
            <SelectItem value="historico">Histórico</SelectItem>
            <SelectItem value="cultura">Cultura</SelectItem>
            <SelectItem value="restaurante">Restaurante</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={exportReport}
          variant="outline"
          className="ml-auto"
          data-testid="button-export-report"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Visitantes</p>
                <p className="text-2xl font-bold text-orange-600">{filteredFeedbacks.length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                <p className="text-2xl font-bold text-yellow-600">{avgRatingFiltered.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pontos Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats?.activeSpots || 0}</p>
              </div>
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfação</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredFeedbacks.filter(f => parseFloat(f.rating || "0") >= 4).length > 0 
                    ? Math.round((filteredFeedbacks.filter(f => parseFloat(f.rating || "0") >= 4).length / filteredFeedbacks.length) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Tendências Avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tendências Temporais - Linha do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Tendências de Visitas (Últimos 30 Dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visitas" 
                  stroke="#ea580c" 
                  strokeWidth={2}
                  name="Visitas"
                  dot={{ fill: '#ea580c' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avaliacaoMedia" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  name="Avaliação Média"
                  dot={{ fill: '#eab308' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap de Visitas por Dia da Semana */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Visitas por Dia da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="visitas" fill="#ea580c" radius={[8, 8, 0, 0]}>
                  {heatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(234, 88, 12, ${0.4 + (entry.visitas / Math.max(...heatmapData.map(d => d.visitas))) * 0.6})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Visualizações Avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Origem Geográfica dos Visitantes - Gráfico Combinado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Origem Geográfica dos Visitantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Gráfico de Pizza Compacto */}
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={countryPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {countryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Lista Detalhada */}
              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">PAÍSES (Top 5):</p>
                {Object.entries(countryDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([country, count], index) => (
                    <div key={country} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-5 h-5 p-0 justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium text-sm">{country}</span>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200" variant="outline">
                        {count} visitantes
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Avaliações com Gráfico de Barras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Distribuição de Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { estrelas: '⭐', quantidade: ratingDistribution["1"] },
                { estrelas: '⭐⭐', quantidade: ratingDistribution["2"] },
                { estrelas: '⭐⭐⭐', quantidade: ratingDistribution["3"] },
                { estrelas: '⭐⭐⭐⭐', quantidade: ratingDistribution["4"] },
                { estrelas: '⭐⭐⭐⭐⭐', quantidade: ratingDistribution["5"] },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estrelas" style={{ fontSize: '14px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#eab308" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pontos Mais Visitados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Pontos Mais Visitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(spotVisits)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([spotName, visits], index) => (
                <div key={spotName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{spotName}</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">
                    {visits} visitas
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivos de Visita */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Motivos de Visita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(visitReasons)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([reason, count]) => (
                <div key={reason} className="flex items-center justify-between p-2 border-b">
                  <span className="font-medium text-sm">{reason}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: filteredFeedbacks.length > 0 
                            ? `${(count / filteredFeedbacks.length) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duração da Estadia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Duração da Estadia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stayDurations)
                .sort(([,a], [,b]) => b - a)
                .map(([duration, count]) => (
                <div key={duration} className="flex items-center justify-between p-2 border-b">
                  <span className="font-medium">{duration}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ 
                          width: filteredFeedbacks.length > 0 
                            ? `${(count / filteredFeedbacks.length) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Hospedagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Tipos de Hospedagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(accommodationTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([accommodation, count]) => (
                <div key={accommodation} className="flex items-center justify-between p-2 border-b">
                  <span className="font-medium text-sm">{accommodation}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-cyan-600 h-2 rounded-full"
                        style={{ 
                          width: filteredFeedbacks.length > 0 
                            ? `${(count / filteredFeedbacks.length) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}