import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Clock, DollarSign, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import type { TouristSpot } from "@shared/schema";
import { Link } from "wouter";

const categories = [
  { id: "todos", label: "Todos" },
  { id: "praia", label: "Praia" },
  { id: "cultura", label: "Cultural" },
  { id: "historico", label: "Histórico" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const { localizeSpot, getLocalizedText } = useLanguage();

  // Fetch all spots
  const { data: allSpots = [], isLoading } = useQuery<TouristSpot[]>({
    queryKey: ["/api/spots"],
  });

  // Filter spots by category
  const { data: categorySpots = [] } = useQuery<TouristSpot[]>({
    queryKey: ["/api/spots/category", selectedCategory],
    enabled: selectedCategory !== "todos",
  });

  // Use all spots if "todos" is selected, otherwise use category spots
  const baseSpots = selectedCategory === "todos" ? allSpots : categorySpots;

  // Apply search filter
  const filteredSpots = searchQuery 
    ? baseSpots.filter(spot => 
        localizeSpot(spot).name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        localizeSpot(spot).description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : baseSpots;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">ABIUDANDO AJU</h1>
                <p className="text-orange-100">Descubra os tesouros da nossa cidade</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Mapa Interativo
            </Button>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-lg text-orange-50">
              Explore os pontos turísticos mais incríveis de Aracaju através dos nossos QR codes.
            </p>
            <p className="text-orange-100">
              Cada local tem sua história única para contar.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar pontos turísticos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 py-3"
            data-testid="search-input"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 ${
                selectedCategory === category.id
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              data-testid={`category-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pontos Turísticos de Aracaju</h2>
            <p className="text-gray-600">
              Encontrados {filteredSpots.length} locais incríveis para visitar
            </p>
          </div>
          <Link href="/admin">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Ponto Turístico
            </Button>
          </Link>
        </div>

        {/* Tourist Spots Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando pontos turísticos...</p>
          </div>
        ) : filteredSpots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum ponto turístico encontrado.</p>
            <p className="text-gray-400">Tente ajustar sua busca ou categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => {
              const localizedSpot = localizeSpot(spot);
              return (
                <Card key={spot.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    {localizedSpot.images && localizedSpot.images.length > 0 && (
                      <img
                        src={localizedSpot.images[0]}
                        alt={localizedSpot.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        4.8
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1" data-testid={`spot-name-${spot.id}`}>
                        {localizedSpot.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {spot.address || 'Aracaju - SE'}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {localizedSpot.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        24 horas
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Gratuito
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getLocalizedText({
                          pt: spot.category === 'praia' ? 'Praia' : spot.category === 'historico' ? 'Histórico' : spot.category === 'cultura' ? 'Cultural' : 'Restaurante',
                          en: spot.category === 'praia' ? 'Beach' : spot.category === 'historico' ? 'Historic' : spot.category === 'cultura' ? 'Cultural' : 'Restaurant',
                          es: spot.category === 'praia' ? 'Playa' : spot.category === 'historico' ? 'Histórico' : spot.category === 'cultura' ? 'Cultural' : 'Restaurante'
                        })}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/spot/${spot.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full text-cyan-600 border-cyan-200 hover:bg-cyan-50"
                          data-testid={`details-button-${spot.id}`}
                        >
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Generate and download QR code
                          const qrUrl = `${window.location.origin}/language/${spot.id}`;
                          navigator.clipboard.writeText(qrUrl);
                          alert(`Link do QR Code copiado: ${qrUrl}`);
                        }}
                        data-testid={`qr-button-${spot.id}`}
                        className="px-3"
                      >
                        QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}