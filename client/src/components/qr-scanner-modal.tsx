import { useState, useRef, useEffect } from "react";
import { X, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQRDetected: (qrCode: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onQRDetected }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
      toast({
        title: "Erro de câmera",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For demo purposes, simulate QR code detection
    // In a real implementation, you would use a QR code library like qr-scanner
    const mockQRCode = `qr-${Math.random().toString(36).substr(2, 9)}`;
    
    toast({
      title: "QR Code detectado",
      description: "Redirecionando para informações do local...",
    });
    
    onQRDetected(mockQRCode);
    onClose();
  };

  const simulateQRDetection = () => {
    // Simulate QR code detection for demo
    const mockQRCode = `qr-${Math.random().toString(36).substr(2, 9)}`;
    onQRDetected(mockQRCode);
    onClose();
  };

  useEffect(() => {
    if (isOpen && !isScanning) {
      startCamera();
    }
    
    return () => {
      if (!isOpen) {
        stopCamera();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Scanner QR Code</span>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-scanner">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hasPermission === null && (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Solicitando permissão da câmera...
              </p>
            </div>
          )}
          
          {hasPermission === false && (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Permissão da câmera negada. Você pode fazer upload de uma imagem com QR code.
              </p>
              <label htmlFor="qr-upload" className="cursor-pointer">
                <input
                  id="qr-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="file-upload-input"
                />
                <Button asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Imagem
                  </span>
                </Button>
              </label>
            </div>
          )}
          
          {hasPermission === true && isScanning && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-black"
                data-testid="camera-video"
              />
              
              {/* QR Code scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-primary w-48 h-48 rounded-lg">
                  <div className="relative w-full h-full">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded inline-block">
                  Aponte para um QR Code
                </p>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                const input = document.getElementById('qr-upload') as HTMLInputElement;
                input?.click();
              }}
              data-testid="upload-qr-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            
            {/* Demo button - remove in production */}
            <Button 
              className="flex-1"
              onClick={simulateQRDetection}
              data-testid="simulate-qr-button"
            >
              <Camera className="w-4 h-4 mr-2" />
              Demo Scan
            </Button>
          </div>
          
          <input
            id="qr-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
