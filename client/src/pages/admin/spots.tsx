import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Edit, Trash2, ExternalLink } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import type { TouristSpot, InsertTouristSpot } from "@shared/schema";
import SpotFormModal from "./spot-form-modal";

export default function AdminSpots() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<TouristSpot | null>(null);

  const spotsQuery = useQuery({
    queryKey: ["/api/spots"],
  });

  const spots = (spotsQuery.data as TouristSpot[]) || [];

  const deleteSpotMutation = useMutation({
    mutationFn: async (spotId: string) => {
      return apiRequest("DELETE", `/api/spots/${spotId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spots"] });
    },
  });

  const handleAddNew = () => {
    setEditingSpot(null);
    setIsModalOpen(true);
  };

  const handleEdit = (spot: TouristSpot) => {
    setEditingSpot(spot);
    setIsModalOpen(true);
  };

  const handleDelete = async (spotId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este ponto turístico?")) {
      deleteSpotMutation.mutate(spotId);
    }
  };

  const handleVisit = (spotId: string) => {
    const url = `/spot/${spotId}?lang=pt`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AdminLayout title="Pontos Turísticos" subtitle="Gerenciar pontos turísticos de Aracaju">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lista de Pontos Turísticos</h2>
        <Button onClick={handleAddNew} data-testid="button-add-spot">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Novo
        </Button>
      </div>

      <div className="grid gap-4">
        {spots.map((spot) => (
          <Card key={spot.id} data-testid={`spot-card-${spot.id}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {spot.name_pt}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{spot.description_pt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Categoria: {spot.category}</span>
                <div className="space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleVisit(spot.id)}
                    data-testid={`button-visit-${spot.id}`}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visitar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(spot)}
                    data-testid={`button-edit-${spot.id}`}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(spot.id)}
                    data-testid={`button-delete-${spot.id}`}
                    disabled={deleteSpotMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SpotFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSpot(null);
        }}
        spot={editingSpot}
      />
    </AdminLayout>
  );
}