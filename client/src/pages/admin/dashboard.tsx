import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, MapPin, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { TouristSpot, TouristFeedback } from "@shared/schema";

export default function AdminDashboard() {
  const spotsQuery = useQuery({
    queryKey: ["/api/spots"],
  });

  const feedbackQuery = useQuery({
    queryKey: ["/api/tourist-feedback"],
  });

  const spots = (spotsQuery.data as TouristSpot[]) || [];
  const feedbacks = (feedbackQuery.data as TouristFeedback[]) || [];

  // Calcular estatísticas reais
  const totalSpots = spots.length;
  const totalFeedbacks = feedbacks.length;
  
  // Calcular avaliação média dos feedbacks
  const ratingsWithValues = feedbacks
    .map(f => f.rating)
    .filter(rating => rating !== null && rating !== undefined)
    .map(rating => parseFloat(String(rating)));
  
  const averageRating = ratingsWithValues.length > 0 
    ? (ratingsWithValues.reduce((sum, rating) => sum + rating, 0) / ratingsWithValues.length).toFixed(1)
    : null;
  return (
    <AdminLayout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/spots">
          <Card data-testid="card-total-spots" className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Turísticos</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600" data-testid="total-spots-count">
                {spotsQuery.isLoading ? "..." : totalSpots}
              </div>
              <p className="text-xs text-muted-foreground">Total cadastrados</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/feedback">
          <Card data-testid="card-total-feedbacks" className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedbacks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600" data-testid="total-feedbacks-count">
                {feedbackQuery.isLoading ? "..." : totalFeedbacks}
              </div>
              <p className="text-xs text-muted-foreground">Recebidos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/feedback">
          <Card data-testid="card-avg-rating" className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600" data-testid="average-rating">
                {feedbackQuery.isLoading 
                  ? "..." 
                  : averageRating 
                    ? `${averageRating}/5` 
                    : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">De 5 estrelas</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reports">
          <Card data-testid="card-reports" className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {feedbackQuery.isLoading ? "..." : totalFeedbacks}
              </div>
              <p className="text-xs text-muted-foreground">Análises disponíveis</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Sistema Administrativo
        </h2>
        <p className="text-gray-600">
          Gerencie os pontos turísticos de Aracaju através das opções do menu lateral.
        </p>
      </div>
    </AdminLayout>
  );
}