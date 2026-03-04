import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MapComponent from './map-component';

export default function AdminMap() {
  const { data: spots, isLoading, error } = useQuery({
    queryKey: ['/api/spots']
  });

  return (
    <AdminLayout title="Mapa Interativo" subtitle="Visualização dos pontos turísticos no mapa">
      <Card data-testid="map-container">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="w-5 h-5 mr-2" />
            Mapa de Aracaju
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div data-testid="map-loading" className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              Carregando pontos turísticos...
            </div>
          ) : error ? (
            <div data-testid="map-error" className="h-96 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
              Erro ao carregar dados do mapa
            </div>
          ) : (
            <div className="h-96 rounded-lg overflow-hidden">
              <MapComponent spots={spots || []} />
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}