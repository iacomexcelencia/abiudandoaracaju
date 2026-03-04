import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { QrCode, Navigation, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TouristSpot } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.divIcon({
  html: `<div class="bg-primary text-primary-foreground p-2 rounded-full shadow-lg animate-pulse cursor-pointer hover:scale-110 transition-transform">
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
      <path d="M15 15h2v2h-2zM17 17h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  className: 'custom-marker'
});

interface InteractiveMapProps {
  spots: TouristSpot[];
  selectedSpot?: TouristSpot | null;
  userLocation?: { latitude: number; longitude: number } | null;
  onSpotSelect: (spot: TouristSpot) => void;
  onLocationRequest: () => void;
}

function MapUpdater({ center, zoom }: { center: LatLngTuple; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

export function InteractiveMap({ 
  spots, 
  selectedSpot, 
  userLocation, 
  onSpotSelect, 
  onLocationRequest 
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map>(null);
  const { localizeSpot } = useLanguage();
  
  // Default center on Aracaju
  const defaultCenter: LatLngTuple = [-10.9472, -37.0731];
  const mapCenter: LatLngTuple = userLocation 
    ? [userLocation.latitude, userLocation.longitude]
    : selectedSpot
    ? [parseFloat(selectedSpot.latitude), parseFloat(selectedSpot.longitude)]
    : defaultCenter;

  const createCustomIcon = (category: string) => {
    const colorMap = {
      praia: 'bg-primary',
      historico: 'bg-accent', 
      cultura: 'bg-secondary',
      restaurante: 'bg-secondary'
    };
    
    const bgColor = colorMap[category as keyof typeof colorMap] || 'bg-primary';
    
    return L.divIcon({
      html: `<div class="${bgColor} text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
          <path d="M15 15h2v2h-2zM17 17h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/>
        </svg>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      className: 'custom-qr-marker'
    });
  };

  return (
    <div className="lg:w-3/5 h-96 lg:h-screen lg:sticky lg:top-20">
      <div className="bg-card rounded-lg border border-border overflow-hidden h-full relative">
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-10"
        >
          <MapUpdater center={mapCenter} zoom={selectedSpot ? 15 : 13} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Tourist spots markers */}
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={[parseFloat(spot.latitude), parseFloat(spot.longitude)]}
              icon={createCustomIcon(spot.category)}
              eventHandlers={{
                click: () => onSpotSelect(spot),
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-medium">{localizeSpot(spot).name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {localizeSpot(spot).description?.substring(0, 100) || ''}...
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={L.divIcon({
                html: `<div class="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-6z"/>
                  </svg>
                </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                className: 'user-location-marker'
              })}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-medium">Sua localização</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 space-y-2 z-20">
          <Button
            size="sm"
            onClick={onLocationRequest}
            className="bg-card text-foreground p-3 rounded-lg shadow-md hover:bg-muted transition-colors"
            data-testid="center-location-button"
          >
            <Navigation className="w-5 h-5" />
          </Button>
          <Button
            size="sm" 
            className="bg-card text-foreground p-3 rounded-lg shadow-md hover:bg-muted transition-colors"
            data-testid="toggle-layers-button"
          >
            <Layers className="w-5 h-5" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-card p-3 rounded-lg shadow-md z-20">
          <h3 className="font-medium text-sm mb-2">Legenda</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Praias</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>Históricos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span>Cultura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
