import { MapPin, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TouristSpot } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

interface SpotCardProps {
  spot: TouristSpot;
  distance?: number;
  onSelect: (spot: TouristSpot) => void;
}

const categoryColors = {
  praia: "bg-primary/10 text-primary",
  historico: "bg-accent/10 text-accent",
  cultura: "bg-secondary/10 text-secondary",
  restaurante: "bg-secondary/10 text-secondary",
};

const categoryLabels = {
  praia: "Praia",
  historico: "Histórico",
  cultura: "Cultura",
  restaurante: "Restaurante",
};

export function SpotCard({ spot, distance, onSelect }: SpotCardProps) {
  const { localizeSpot, getLocalizedText } = useLanguage();
  const localizedSpot = localizeSpot(spot);
  
  const categoryColor = categoryColors[spot.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-600";
  const categoryLabel = getLocalizedText({
    pt: categoryLabels[spot.category as keyof typeof categoryLabels] || spot.category,
    en: {
      praia: "Beach",
      historico: "Historic",
      cultura: "Culture", 
      restaurante: "Restaurant"
    }[spot.category] || spot.category,
    es: {
      praia: "Playa",
      historico: "Histórico",
      cultura: "Cultura",
      restaurante: "Restaurante"
    }[spot.category] || spot.category
  });

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(spot)}
      data-testid={`spot-card-${spot.id}`}
    >
      <div className="flex">
        {localizedSpot.images && localizedSpot.images.length > 0 && (
          <img 
            src={localizedSpot.images[0]} 
            alt={localizedSpot.name}
            className="w-24 h-24 object-cover"
            loading="lazy"
          />
        )}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-foreground" data-testid={`spot-name-${spot.id}`}>
                {localizedSpot.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {localizedSpot.description}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={categoryColor}>
                  {categoryLabel}
                </Badge>
                {distance && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {distance.toFixed(1)} km
                  </span>
                )}
              </div>
            </div>
            <div className={`p-1 rounded ${
              spot.category === 'praia' ? 'bg-primary' :
              spot.category === 'historico' ? 'bg-accent' : 'bg-secondary'
            }`}>
              <QrCode className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
