import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Trophy, MapPin, Award, Search, Star, Calendar } from "lucide-react";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";

interface TouristPassport {
  id: string;
  passportCode: string;
  email: string | null;
  totalPoints: string;
  totalVisits: string;
  level: string | null;
  createdAt: string | null;
  lastVisit: string | null;
}

interface Badge {
  id: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  rarity: string;
  points: string;
  earnedAt?: string;
}

interface Visit {
  id: string;
  spotName: string;
  visitedAt: string;
  rating?: string;
}

export default function MeuPassaporte() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [lang, setLang] = useState<'pt' | 'en' | 'es'>('pt');

  const { data: passport, isLoading: passportLoading, error: passportError } = useQuery<TouristPassport>({
    queryKey: ['/api/passport', submittedQuery],
    enabled: !!submittedQuery,
  });

  const { data: badges = [] } = useQuery<Badge[]>({
    queryKey: ['/api/badges/earned', submittedQuery],
    enabled: !!submittedQuery && !!passport,
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ['/api/passport', passport?.id, 'visits'],
    enabled: !!passport,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
    }
  };

  const getLocalizedText = (texts: { pt: string; en: string; es: string }) => {
    return texts[lang] || texts.pt;
  };

  const getBadgeColor = (rarity: string) => {
    const colors: Record<string, string> = {
      bronze: "bg-amber-100 text-amber-800 border-amber-300",
      silver: "bg-gray-100 text-gray-800 border-gray-400",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-400",
      legendary: "bg-purple-100 text-purple-800 border-purple-400"
    };
    return colors[rarity] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <img 
                src={logoAbiudando} 
                alt="AJUDANDO AJU" 
                className="h-64 md:h-80 w-auto object-contain transition-all duration-300"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {getLocalizedText({
                    pt: "Meu Passaporte Turístico",
                    en: "My Tourist Passport",
                    es: "Mi Pasaporte Turístico"
                  })}
                </h1>
                <p className="text-sm text-gray-600">
                  {getLocalizedText({
                    pt: "Acompanhe suas conquistas em Aracaju",
                    en: "Track your achievements in Aracaju",
                    es: "Sigue tus logros en Aracaju"
                  })}
                </p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex gap-2">
              <Button
                variant={lang === 'pt' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLang('pt')}
                className={lang === 'pt' ? 'bg-orange-600' : ''}
              >
                PT
              </Button>
              <Button
                variant={lang === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLang('en')}
                className={lang === 'en' ? 'bg-orange-600' : ''}
              >
                EN
              </Button>
              <Button
                variant={lang === 'es' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLang('es')}
                className={lang === 'es' ? 'bg-orange-600' : ''}
              >
                ES
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        {!passport && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-6 h-6 text-orange-600" />
                {getLocalizedText({
                  pt: "Buscar Meu Passaporte",
                  en: "Find My Passport",
                  es: "Buscar Mi Pasaporte"
                })}
              </CardTitle>
              <CardDescription>
                {getLocalizedText({
                  pt: "Digite seu código de passaporte ou e-mail cadastrado",
                  en: "Enter your passport code or registered email",
                  es: "Ingrese su código de pasaporte o correo electrónico registrado"
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder={getLocalizedText({
                    pt: "AJU-XXXXX ou email@exemplo.com",
                    en: "AJU-XXXXX or email@example.com",
                    es: "AJU-XXXXX o email@ejemplo.com"
                  })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                  data-testid="input-search-passport"
                />
                <Button 
                  onClick={handleSearch}
                  className="bg-orange-600 hover:bg-orange-700"
                  data-testid="button-search"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {getLocalizedText({ pt: "Buscar", en: "Search", es: "Buscar" })}
                </Button>
              </div>

              {passportError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    {getLocalizedText({
                      pt: "❌ Passaporte não encontrado. Verifique o código ou e-mail e tente novamente.",
                      en: "❌ Passport not found. Check the code or email and try again.",
                      es: "❌ Pasaporte no encontrado. Verifique el código o correo electrónico e intente nuevamente."
                    })}
                  </p>
                </div>
              )}

              {passportLoading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">
                    {getLocalizedText({ pt: "Buscando...", en: "Searching...", es: "Buscando..." })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Passport Display */}
        {passport && (
          <>
            {/* Passport Header Card */}
            <Card className="mb-6 border-2 border-orange-500">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Passport Info */}
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-4 rounded-lg">
                      <CreditCard className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        {getLocalizedText({
                          pt: "Código do Passaporte",
                          en: "Passport Code",
                          es: "Código de Pasaporte"
                        })}
                      </p>
                      <p className="text-2xl font-bold text-orange-700 font-mono">
                        {passport.passportCode}
                      </p>
                      <p className="text-sm text-gray-600">{passport.level}</p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-center bg-yellow-50 rounded-lg p-4">
                    <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-yellow-700">{passport.totalPoints}</p>
                    <p className="text-sm text-gray-600">
                      {getLocalizedText({ pt: "Pontos", en: "Points", es: "Puntos" })}
                    </p>
                  </div>

                  {/* Visits */}
                  <div className="text-center bg-blue-50 rounded-lg p-4">
                    <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-blue-700">{passport.totalVisits}</p>
                    <p className="text-sm text-gray-600">
                      {getLocalizedText({ pt: "Visitas", en: "Visits", es: "Visitas" })}
                    </p>
                  </div>
                </div>

                {passport.createdAt && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {getLocalizedText({ pt: "Membro desde", en: "Member since", es: "Miembro desde" })}:{" "}
                    {new Date(passport.createdAt).toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES')}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Badges Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  {getLocalizedText({
                    pt: "Conquistas Desbloqueadas",
                    en: "Unlocked Achievements",
                    es: "Logros Desbloqueados"
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4">
                    {getLocalizedText({
                      pt: "Nenhuma conquista desbloqueada ainda. Continue explorando Aracaju!",
                      en: "No achievements unlocked yet. Keep exploring Aracaju!",
                      es: "Aún no se han desbloqueado logros. ¡Sigue explorando Aracaju!"
                    })}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.map((badge) => (
                      <div 
                        key={badge.id}
                        className={`p-4 rounded-lg border-2 ${getBadgeColor(badge.rarity)}`}
                      >
                        <div className="flex items-start gap-3">
                          <Star className="w-6 h-6 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">
                              {badge[`name_${lang}`] || badge.name_pt}
                            </h3>
                            <p className="text-sm opacity-90 mt-1">
                              {badge[`description_${lang}`] || badge.description_pt}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                              </Badge>
                              <span className="text-xs font-semibold">
                                +{badge.points} {getLocalizedText({ pt: "pts", en: "pts", es: "pts" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reset Search Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSubmittedQuery("");
                }}
                data-testid="button-search-another"
              >
                {getLocalizedText({
                  pt: "Buscar Outro Passaporte",
                  en: "Search Another Passport",
                  es: "Buscar Otro Pasaporte"
                })}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t shadow-sm mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            {getLocalizedText({
              pt: "© 2025 Secretaria de Turismo de Aracaju - Todos os direitos reservados",
              en: "© 2025 Aracaju Tourism Department - All rights reserved",
              es: "© 2025 Secretaría de Turismo de Aracaju - Todos los derechos reservados"
            })}
          </p>
        </div>
      </footer>
    </div>
  );
}
