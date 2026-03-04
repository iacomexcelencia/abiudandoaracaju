import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import type { TouristSpot } from "@shared/schema";

export default function AdminQRCodes() {
  const spotsQuery = useQuery({
    queryKey: ["/api/spots"],
  });

  const spots = (spotsQuery.data as TouristSpot[]) || [];

  const generateAndDownloadQR = async (spot: TouristSpot) => {
    try {
      // Gerar a URL que o QR code deve apontar
      const qrURL = `${window.location.origin}/language/${spot.id}`;
      
      // Gerar o QR code como data URL
      const qrCodeDataURL = await QRCode.toDataURL(qrURL, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Criar elemento temporário para download
      const link = document.createElement('a');
      link.href = qrCodeDataURL;
      link.download = `qr-code-${spot.name_pt.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      alert('Erro ao gerar o QR code. Tente novamente.');
    }
  };

  return (
    <AdminLayout title="QR Codes" subtitle="Gerenciar códigos QR dos pontos turísticos">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Códigos QR</h2>
        <p className="text-gray-600">Gere e baixe códigos QR para cada ponto turístico</p>
      </div>

      <div className="grid gap-4">
        {spots.map((spot) => (
          <Card key={spot.id} data-testid={`qr-card-${spot.id}`}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <QrCode className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">{spot.name_pt}</h3>
                  <p className="text-sm text-gray-600">QR Code: {spot.qrCode}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => generateAndDownloadQR(spot)}
                data-testid={`button-download-qr-${spot.id}`}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar QR
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}