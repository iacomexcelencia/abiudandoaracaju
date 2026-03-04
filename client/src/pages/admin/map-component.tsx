import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icons issue in Webpack
const defaultIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Spot {
  id: string;
  name_pt: string;
  description_pt: string;
  latitude: string;
  longitude: string;
  category: string;
  address: string;
}

interface MapComponentProps {
  spots: Spot[];
}

export default function MapComponent({ spots }: MapComponentProps) {
  // Center on Aracaju
  const aracajuCenter: LatLngExpression = [-10.9472, -37.0731];

  return (
    <MapContainer
      center={aracajuCenter}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      data-testid="leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {spots.map((spot) => {
        const lat = parseFloat(spot.latitude);
        const lng = parseFloat(spot.longitude);
        
        // Skip invalid coordinates
        if (isNaN(lat) || isNaN(lng)) return null;
        
        return (
          <Marker
            key={spot.id}
            position={[lat, lng]}
            icon={defaultIcon}
            data-testid={`marker-${spot.id}`}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">{spot.name_pt}</h3>
                <p className="text-xs text-gray-600 mb-2">{spot.description_pt}</p>
                <p className="text-xs text-gray-500">
                  <strong>Categoria:</strong> {spot.category}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Endereço:</strong> {spot.address}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}