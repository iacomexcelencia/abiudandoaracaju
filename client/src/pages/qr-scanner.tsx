import { useState } from "react";
import { useLocation } from "wouter";
import { QRScannerModal } from "@/components/qr-scanner-modal";
import { useToast } from "@/hooks/use-toast";

export default function QRScanner() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleQRDetected = async (qrCode: string) => {
    try {
      // Fetch spot by QR code
      const response = await fetch(`/api/spots/qr/${qrCode}`);
      if (response.ok) {
        const spot = await response.json();
        setLocation(`/spot/${spot.id}`);
        toast({
          title: "Local encontrado!",
          description: `Redirecionando para ${spot.name}...`,
        });
      } else {
        toast({
          title: "QR Code não reconhecido",
          description: "Este QR code não corresponde a nenhum ponto turístico.",
          variant: "destructive",
        });
        setLocation("/admin");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar o QR code.",
        variant: "destructive",
      });
      setLocation("/admin");
    }
  };

  const handleClose = () => {
    setLocation("/admin");
  };

  return (
    <QRScannerModal
      isOpen={true}
      onClose={handleClose}
      onQRDetected={handleQRDetected}
    />
  );
}
