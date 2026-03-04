import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { TouristFeedback } from "@shared/schema";

export default function AdminFeedback() {
  const feedbackQuery = useQuery({
    queryKey: ["/api/tourist-feedback"],
  });

  const feedbacks = (feedbackQuery.data as TouristFeedback[]) || [];

  return (
    <AdminLayout title="Feedbacks" subtitle="Avaliações e comentários dos turistas">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Feedbacks dos Turistas</h2>
        <p className="text-gray-600">Total de feedbacks recebidos: {feedbacks.length}</p>
      </div>

      {feedbacks.length === 0 ? (
        <Card data-testid="no-feedback-message">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Nenhum feedback recebido</h3>
            <p className="text-gray-600">Os feedbacks dos turistas aparecerão aqui.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} data-testid={`feedback-card-${feedback.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Feedback #{feedback.id.slice(0, 8)}</CardTitle>
                  {feedback.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{feedback.rating}/5</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Nome:</strong> {feedback.name}</p>
                      <p><strong>Data de Nascimento:</strong> {feedback.birthDate}</p>
                      <p><strong>Origem:</strong> {feedback.city}, {feedback.state} - {feedback.country}</p>
                    </div>
                    <div>
                      <p><strong>Motivo da Visita:</strong> {feedback.visitReason}</p>
                      <p><strong>Duração da Estadia:</strong> {feedback.stayDuration}</p>
                      <p><strong>Acomodação:</strong> {feedback.accommodation}</p>
                    </div>
                  </div>
                  
                  {feedback.cityOpinion && (
                    <div className="border-t pt-3">
                      <strong>Opinião sobre a cidade:</strong>
                      <p className="mt-1 text-gray-600 italic">"{feedback.cityOpinion}"</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                    <span>Ponto Turístico ID: {feedback.spotId}</span>
                    <span>Recebido em: {new Date(feedback.createdAt || "").toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}