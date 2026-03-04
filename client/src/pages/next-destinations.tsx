import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Heart, MapPin, Navigation, Check, ChevronDown, ChevronUp, Award, Trophy, CreditCard, Star, Route as RouteIcon, Sparkles, Volume2, List, Map } from "lucide-react";
import type { TouristSpot } from "@shared/schema";
import { usePassport } from "@/hooks/use-passport";
import { createSpeech } from "@/utils/voice-selector";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";

interface NextDestinationsProps {
  params?: {
    spotId?: string;
    lang?: string;
  };
}

interface TouristRoute {
  id: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  duration: string;
  difficulty: string;
  spotIds: string[];
  categories: string[];
  totalDistance: string | null;
  isActive: boolean | null;
}

export default function NextDestinations({ params }: NextDestinationsProps) {
  const [, setLocation] = useLocation();
  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'spots' | 'routes'>('spots');
  
  const spotId = params?.spotId || new URLSearchParams(window.location.search).get('spotId');
  const selectedLang = (params?.lang || new URLSearchParams(window.location.search).get('lang') || 'pt') as 'pt' | 'en' | 'es';
  
  const { data: allSpots = [], isLoading } = useQuery<TouristSpot[]>({
    queryKey: ['/api/spots'],
  });

  const { data: allRoutes = [] } = useQuery<TouristRoute[]>({
    queryKey: ['/api/routes'],
  });

  // Integração com Passaporte Digital
  const { passport, passportCode } = usePassport();

  // Buscar badges conquistados
  const { data: earnedBadges = [] } = useQuery<any[]>({
    queryKey: ['/api/badges/earned', passportCode],
    enabled: !!passportCode,
  });

  const currentSpot = allSpots.find(s => s.id === spotId);
  const otherSpots = allSpots.filter(s => s.id !== spotId);

  // Check if this is the user's first visit (passport just created)
  useEffect(() => {
    const isFirstVisit = localStorage.getItem('ajudando-aju-first-visit');
    if (passport && !isFirstVisit) {
      setShowWelcomeModal(true);
      localStorage.setItem('ajudando-aju-first-visit', 'false');
    }
  }, [passport]);

  // Voice narration on page load
  useEffect(() => {
    if (!hasSpoken && passport && earnedBadges) {
      speakThankYouMessage();
    }
  }, [passport, earnedBadges, hasSpoken]);

  const speakThankYouMessage = () => {
    if ('speechSynthesis' in window && !hasSpoken) {
      setIsPlaying(true);

      let message = selectedLang === 'pt' 
        ? "A Prefeitura de Aracaju agradece por conhecer nossos pontos turísticos. "
        : selectedLang === 'en'
        ? "The Municipality of Aracaju thanks you for visiting our tourist spots. "
        : "El Municipio de Aracaju le agradece por conocer nuestros puntos turísticos. ";

      // Add passport info
      if (passport) {
        if (passport.totalVisits === "1") {
          message += selectedLang === 'pt'
            ? `Parabéns! Você recebeu seu passaporte digital de número ${passport.passportCode}. `
            : selectedLang === 'en'
            ? `Congratulations! You received your digital passport number ${passport.passportCode}. `
            : `¡Felicitaciones! Recibió su pasaporte digital número ${passport.passportCode}. `;
        } else {
          message += selectedLang === 'pt'
            ? `Bem-vindo de volta, viajante! Você já possui ${passport.totalVisits} visitas e ${passport.totalPoints} pontos. `
            : selectedLang === 'en'
            ? `Welcome back, traveler! You now have ${passport.totalVisits} visits and ${passport.totalPoints} points. `
            : `¡Bienvenido de nuevo, viajero! Ya tiene ${passport.totalVisits} visitas y ${passport.totalPoints} puntos. `;
        }
      }

      // Add badge info
      if (earnedBadges && earnedBadges.length > 0) {
        message += selectedLang === 'pt'
          ? `Você conquistou ${earnedBadges.length} ${earnedBadges.length === 1 ? 'medalha' : 'medalhas'}! `
          : selectedLang === 'en'
          ? `You earned ${earnedBadges.length} ${earnedBadges.length === 1 ? 'badge' : 'badges'}! `
          : `¡Ganó ${earnedBadges.length} ${earnedBadges.length === 1 ? 'medalla' : 'medallas'}! `;
      }

      // Add routes info
      if (allRoutes && allRoutes.length > 0) {
        message += selectedLang === 'pt'
          ? `Explore ${allRoutes.length} rotas turísticas disponíveis para conhecer Aracaju de forma completa. `
          : selectedLang === 'en'
          ? `Explore ${allRoutes.length} tourist routes available to discover Aracaju completely. `
          : `Explore ${allRoutes.length} rutas turísticas disponibles para conocer Aracaju completamente. `;
      }

      message += selectedLang === 'pt'
        ? "Continue explorando!"
        : selectedLang === 'en'
        ? "Keep exploring!"
        : "¡Sigue explorando!";

      // Use intelligent female voice selector based on selected language
      const utterance = createSpeech(message, selectedLang as 'pt' | 'en' | 'es');
      
      utterance.onend = () => {
        setIsPlaying(false);
        setHasSpoken(true);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const replayAudio = () => {
    speechSynthesis.cancel();
    setHasSpoken(false);
    setTimeout(() => speakThankYouMessage(), 100);
  };

  const getLocalizedText = (texts: { pt: string; en: string; es: string }) => {
    return texts[selectedLang] || texts.pt;
  };

  const localizeSpot = (spot: TouristSpot) => ({
    name: spot[`name_${selectedLang}`] || spot.name_pt,
    description: spot[`description_${selectedLang}`] || spot.description_pt,
  });

  const localizeRoute = (route: TouristRoute) => ({
    name: route[`name_${selectedLang}`] || route.name_pt,
    description: route[`description_${selectedLang}`] || route.description_pt,
  });

  const openGoogleMaps = (spot: TouristSpot) => {
    const lat = Number(spot.latitude);
    const lng = Number(spot.longitude);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
  };

  const openRouteNavigation = (route: TouristRoute) => {
    const firstSpot = allSpots.find(s => s.id === route.spotIds[0]);
    if (firstSpot) {
      openGoogleMaps(firstSpot);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      praia: "bg-blue-100 text-blue-800",
      historico: "bg-amber-100 text-amber-800",
      cultura: "bg-purple-100 text-purple-800",
      restaurante: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      facil: "bg-green-100 text-green-800 border-green-300",
      moderado: "bg-yellow-100 text-yellow-800 border-yellow-300",
      desafiador: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, { pt: string; en: string; es: string }> = {
      praia: { pt: "Praia", en: "Beach", es: "Playa" },
      historico: { pt: "Histórico", en: "Historical", es: "Histórico" },
      cultura: { pt: "Cultura", en: "Culture", es: "Cultura" },
      restaurante: { pt: "Restaurante", en: "Restaurant", es: "Restaurante" },
    };
    return getLocalizedText(names[category] || { pt: category, en: category, es: category });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
        <p className="text-gray-600">
          {getLocalizedText({
            pt: "Carregando destinos...",
            en: "Loading destinations...",
            es: "Cargando destinos..."
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 pb-8">
      {/* Welcome to Digital Passport Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-2xl text-center">
              {getLocalizedText({
                pt: "Bem-vindo ao Passaporte Digital!",
                en: "Welcome to Digital Passport!",
                es: "¡Bienvenido al Pasaporte Digital!"
              })}
            </DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <p className="text-base text-gray-700">
                {getLocalizedText({
                  pt: `Seu código: `,
                  en: `Your code: `,
                  es: `Su código: `
                })}
                <span className="font-bold text-orange-600 font-mono">{passport?.passportCode}</span>
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <Trophy className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  {getLocalizedText({
                    pt: "Ganhe pontos visitando pontos turísticos",
                    en: "Earn points by visiting tourist spots",
                    es: "Gana puntos visitando puntos turísticos"
                  })}
                </p>
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  {getLocalizedText({
                    pt: "Desbloqueie badges e conquistas especiais",
                    en: "Unlock badges and special achievements",
                    es: "Desbloquea insignias y logros especiales"
                  })}
                </p>
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <RouteIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  {getLocalizedText({
                    pt: "Explore rotas turísticas recomendadas",
                    en: "Explore recommended tourist routes",
                    es: "Explora rutas turísticas recomendadas"
                  })}
                </p>
              </div>
              <p className="text-sm text-gray-600 italic">
                {getLocalizedText({
                  pt: "Seu passaporte é salvo automaticamente no navegador!",
                  en: "Your passport is automatically saved in the browser!",
                  es: "¡Su pasaporte se guarda automáticamente en el navegador!"
                })}
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setShowWelcomeModal(false)}
            className="bg-orange-600 hover:bg-orange-700 w-full"
            data-testid="button-close-welcome"
          >
            {getLocalizedText({
              pt: "Começar a Explorar",
              en: "Start Exploring",
              es: "Empezar a Explorar"
            })}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Thank You Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <img 
                src={logoAbiudando} 
                alt="ABIUDANDO ARACAJU" 
                className="h-64 md:h-80 w-auto object-contain transition-all duration-300"
              />
            </div>
            <div className="mx-auto mb-6 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              {getLocalizedText({
                pt: "Obrigado pela sua visita!",
                en: "Thank you for your visit!",
                es: "¡Gracias por su visita!"
              })}
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto mb-4">
              {getLocalizedText({
                pt: "A Prefeitura de Aracaju agradece por conhecer nossos pontos turísticos. Sua opinião é muito importante para nós!",
                en: "The Municipality of Aracaju thanks you for visiting our tourist spots. Your opinion is very important to us!",
                es: "El Municipio de Aracaju le agradece por conocer nuestros puntos turísticos. ¡Su opinión es muy importante para nosotros!"
              })}
            </p>
            
            {/* Audio Replay Button */}
            <Button
              onClick={replayAudio}
              variant="outline"
              size="sm"
              className="mt-2"
              disabled={isPlaying}
              data-testid="button-replay-audio"
            >
              <Volume2 className={`w-4 h-4 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
              {getLocalizedText({
                pt: isPlaying ? "Reproduzindo..." : "Ouvir Mensagem",
                en: isPlaying ? "Playing..." : "Hear Message",
                es: isPlaying ? "Reproduciendo..." : "Escuchar Mensaje"
              })}
            </Button>
          </div>

          {currentSpot && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">
                {getLocalizedText({
                  pt: `Você visitou: ${localizeSpot(currentSpot).name}`,
                  en: `You visited: ${localizeSpot(currentSpot).name}`,
                  es: `Visitó: ${localizeSpot(currentSpot).name}`
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Passaporte Digital e Conquistas */}
      {passport && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="bg-white rounded-xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Passaporte Info */}
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <CreditCard className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {getLocalizedText({
                        pt: "Seu Passaporte Digital",
                        en: "Your Digital Passport",
                        es: "Su Pasaporte Digital"
                      })}
                    </p>
                    <p className="text-xl font-bold text-orange-700 font-mono">{passport.passportCode}</p>
                    <p className="text-sm text-gray-600">{passport.level || "Explorador Iniciante"}</p>
                  </div>
                </div>

                {/* Pontos e Visitas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-yellow-50 rounded-lg p-3">
                    <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-yellow-700">{passport.totalPoints || 0}</p>
                    <p className="text-xs text-gray-600">
                      {getLocalizedText({ pt: "Pontos", en: "Points", es: "Puntos" })}
                    </p>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-3">
                    <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-blue-700">{passport.totalVisits || 0}</p>
                    <p className="text-xs text-gray-600">
                      {getLocalizedText({ pt: "Visitas", en: "Visits", es: "Visitas" })}
                    </p>
                  </div>
                </div>

                {/* Badges Conquistados */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-semibold text-gray-700">
                      {getLocalizedText({
                        pt: "Conquistas Desbloqueadas",
                        en: "Unlocked Achievements",
                        es: "Logros Desbloqueados"
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {earnedBadges.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">
                        {getLocalizedText({
                          pt: "Continue explorando para desbloquear badges!",
                          en: "Keep exploring to unlock badges!",
                          es: "¡Sigue explorando para desbloquear insignias!"
                        })}
                      </p>
                    ) : (
                      earnedBadges.slice(0, 3).map((badge: any) => (
                        <Badge key={badge.id} className="bg-purple-100 text-purple-700 border-purple-300" variant="outline">
                          <Star className="w-3 h-3 mr-1" />
                          {badge.name_pt}
                        </Badge>
                      ))
                    )}
                    {earnedBadges.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{earnedBadges.length - 3} {getLocalizedText({ pt: "mais", en: "more", es: "más" })}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <Button
              onClick={() => setViewMode('spots')}
              variant={viewMode === 'spots' ? 'default' : 'ghost'}
              size="sm"
              className={viewMode === 'spots' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              data-testid="button-view-spots"
            >
              <List className="w-4 h-4 mr-2" />
              {getLocalizedText({
                pt: "Todos os Pontos",
                en: "All Spots",
                es: "Todos los Puntos"
              })}
            </Button>
            <Button
              onClick={() => setViewMode('routes')}
              variant={viewMode === 'routes' ? 'default' : 'ghost'}
              size="sm"
              className={viewMode === 'routes' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              data-testid="button-view-routes"
            >
              <Map className="w-4 h-4 mr-2" />
              {getLocalizedText({
                pt: "Rotas Turísticas",
                en: "Tourist Routes",
                es: "Rutas Turísticas"
              })}
            </Button>
          </div>
        </div>

        {/* Spots View */}
        {viewMode === 'spots' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {getLocalizedText({
                pt: "Continue Explorando Aracaju",
                en: "Continue Exploring Aracaju",
                es: "Continúe Explorando Aracaju"
              })}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherSpots.map((spot) => {
                const localized = localizeSpot(spot);
                const coverImageUrl = spot.coverImage || (spot.imageGallery as any)?.[0]?.url || spot.images?.[0] || '/placeholder-image.jpg';
                const isExpanded = expandedSpotId === spot.id;

                return (
                  <Card 
                    key={spot.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    data-testid={`card-spot-${spot.id}`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={coverImageUrl}
                        alt={localized.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        data-testid={`img-spot-${spot.id}`}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getCategoryColor(spot.category)}>
                          {getCategoryName(spot.category)}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg" data-testid={`title-spot-${spot.id}`}>
                        {localized.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      {!isExpanded && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2" data-testid={`description-preview-${spot.id}`}>
                          {localized.description.substring(0, 100)}...
                        </p>
                      )}

                      {isExpanded && (
                        <div className="mb-4 space-y-3" data-testid={`description-expanded-${spot.id}`}>
                          <CardDescription className="text-sm text-gray-700 leading-relaxed">
                            {localized.description.substring(0, 300)}...
                          </CardDescription>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-800 font-medium mb-1">
                              {getLocalizedText({
                                pt: "💡 Quer saber mais?",
                                en: "💡 Want to know more?",
                                es: "💡 ¿Quieres saber más?"
                              })}
                            </p>
                            <p className="text-xs text-blue-700">
                              {getLocalizedText({
                                pt: "Vá até o local e escaneie o QR Code para acessar todas as informações!",
                                en: "Go to the location and scan the QR Code to access all information!",
                                es: "¡Ve al lugar y escanea el Código QR para acceder a toda la información!"
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {spot.address && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{spot.address}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => setExpandedSpotId(isExpanded ? null : spot.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          data-testid={`button-details-${spot.id}`}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              {getLocalizedText({
                                pt: "Recolher",
                                en: "Collapse",
                                es: "Contraer"
                              })}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              {getLocalizedText({
                                pt: "Ver Detalhes",
                                en: "View Details",
                                es: "Ver Detalles"
                              })}
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => openGoogleMaps(spot)}
                          size="sm"
                          className="flex-1 bg-orange-500 hover:bg-orange-600"
                          data-testid={`button-navigate-${spot.id}`}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          {getLocalizedText({
                            pt: "Como Chegar",
                            en: "Directions",
                            es: "Cómo Llegar"
                          })}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Routes View */}
        {viewMode === 'routes' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {getLocalizedText({
                pt: "Rotas Turísticas Recomendadas",
                en: "Recommended Tourist Routes",
                es: "Rutas Turísticas Recomendadas"
              })}
            </h2>

            {allRoutes.length === 0 ? (
              <div className="text-center py-12">
                <RouteIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {getLocalizedText({
                    pt: "Nenhuma rota turística disponível no momento.",
                    en: "No tourist routes available at the moment.",
                    es: "No hay rutas turísticas disponibles en este momento."
                  })}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allRoutes.map((route) => {
                  const localized = localizeRoute(route);
                  
                  return (
                    <Card key={route.id} className="hover:shadow-xl transition-shadow" data-testid={`card-route-${route.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg flex-1">{localized.name}</CardTitle>
                          <Badge className={getDifficultyColor(route.difficulty)} variant="outline">
                            {getLocalizedText({
                              pt: route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1),
                              en: route.difficulty === 'facil' ? 'Easy' : route.difficulty === 'moderado' ? 'Moderate' : 'Challenging',
                              es: route.difficulty === 'facil' ? 'Fácil' : route.difficulty === 'moderado' ? 'Moderado' : 'Desafiante'
                            })}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {localized.description.substring(0, 100)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <RouteIcon className="h-4 w-4 text-orange-600" />
                            <span className="text-gray-700">{route.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700">{route.spotIds?.length || 0} pontos</span>
                          </div>
                        </div>

                        {route.categories && route.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {route.categories.map((cat, idx) => (
                              <Badge key={idx} className={getCategoryColor(cat)} variant="outline">
                                {getCategoryName(cat)}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Button
                          onClick={() => openRouteNavigation(route)}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          data-testid={`button-start-route-${route.id}`}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          {getLocalizedText({
                            pt: "Iniciar Rota",
                            en: "Start Route",
                            es: "Iniciar Ruta"
                          })}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {viewMode === 'spots' && otherSpots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {getLocalizedText({
                pt: "Não há mais pontos turísticos disponíveis no momento.",
                en: "No more tourist spots available at the moment.",
                es: "No hay más puntos turísticos disponibles en este momento."
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
