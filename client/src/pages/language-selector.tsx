import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import secretariaLogo from "@assets/secretaria_logo.jpeg";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";
import { createBrazilianSpeech, listAvailableVoices } from "@/utils/voice-selector";

export default function LanguageSelector() {
  const { spotId } = useParams();
  const [, setLocation] = useLocation();
  const [hasSpoken, setHasSpoken] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const languages = [
    {
      code: 'pt',
      name: 'Português',
      flag: '🇧🇷',
      color: 'bg-orange-600 hover:bg-orange-700 text-white'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸', 
      color: 'bg-orange-500 hover:bg-orange-600 text-white'
    },
    {
      code: 'es',
      name: 'Español',
      flag: '🇪🇸',
      color: 'bg-orange-700 hover:bg-orange-800 text-white'
    }
  ];

  // Query to get all spots and find the one by ID (only if spotId is provided)
  const spotsQuery = useQuery({
    queryKey: ['/api/spots'],
    enabled: !!spotId && spotId !== 'test',
  });

  // Find the spot by ID from the spots list
  const spotsData = Array.isArray(spotsQuery.data) ? spotsQuery.data : [];
  const spot = spotsData.find((s: any) => s.id === spotId);

  const speakWelcomeMessage = () => {
    if ('speechSynthesis' in window && !hasSpoken) {
      setIsPlaying(true);
      const message = "Por favor, escolha o seu idioma nativo: Português, Inglês ou Espanhol";
      
      // Use Brazilian female voice selector
      const utterance = createBrazilianSpeech(message);
      
      utterance.onend = () => {
        setIsPlaying(false);
        setHasSpoken(true);
      };
      
      // Debug: List available voices (helpful for testing on different devices)
      if (process.env.NODE_ENV === 'development') {
        listAvailableVoices();
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const playWelcomeMessage = () => {
    speechSynthesis.cancel(); // Stop any ongoing speech
    setHasSpoken(false);
    speakWelcomeMessage();
  };

  const handleLanguageSelect = (languageCode: string) => {
    // Stop any ongoing speech
    speechSynthesis.cancel();
    setIsPlaying(false);
    
    // Store the selected language in localStorage
    localStorage.setItem('abiudando-aju-language', languageCode);
    
    if (spotId && spotId !== 'test') {
      if (spot) {
        // Redirect to spot details with language parameter for valid spots
        setLocation(`/spot/${spotId}?lang=${languageCode}`);
      } else if (spotsData && spotsData.length > 0) {
        // If specific spot not found, redirect to first available spot
        const firstSpot = spotsData[0];
        setLocation(`/spot/${firstSpot.id}?lang=${languageCode}`);
      } else {
        // No spots available, redirect to admin
        setLocation(`/admin`);
      }
    } else {
      // For test spotId, redirect to admin (QR code admin testing)
      setLocation(`/admin`);
    }
  };

  useEffect(() => {
    // Wait a moment for voices to load, then speak automatically
    const timer = setTimeout(() => {
      speakWelcomeMessage();
    }, 1500);

    return () => {
      clearTimeout(timer);
      speechSynthesis.cancel();
    };
  }, []);

  // Load voices when they become available
  useEffect(() => {
    const handleVoicesChanged = () => {
      if (!hasSpoken && !isPlaying) {
        speakWelcomeMessage();
      }
    };

    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [hasSpoken, isPlaying]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-none border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-8 w-full flex justify-center p-4">
            <img 
              src={logoAbiudando} 
              alt="ABIUDANDO AJU" 
              className="h-64 md:h-80 w-auto object-contain transition-all duration-300" 
            />
          </div>
          <div className="hidden">
            <img src={secretariaLogo} alt="Secretaria de Turismo" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            ABIUDANDO AJU
          </CardTitle>
          <p className="text-sm text-gray-600 mb-1">
            Prefeitura de Aracaju - Secretaria de Turismo
          </p>
          
          {/* Voice indicator */}
          <div className="flex items-center justify-center mt-4 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={playWelcomeMessage}
              className={`text-sm ${isPlaying ? 'bg-orange-50 border-orange-200' : ''}`}
              data-testid="voice-button"
            >
              <Volume2 className={`w-4 h-4 mr-2 ${isPlaying ? 'animate-pulse text-orange-600' : ''}`} />
              {isPlaying ? 'Reproduzindo...' : 'Ouvir novamente'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Escolha seu idioma nativo
            </h2>
            <p className="text-sm text-gray-600 mb-1">Choose your native language</p>
            <p className="text-sm text-gray-600">Elija su idioma nativo</p>
          </div>

          <div className="space-y-3">
            {languages.map((language) => (
              <Button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full py-4 text-lg font-medium ${language.color} hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
                data-testid={`language-${language.code}`}
              >
                <span className="text-2xl mr-3">{language.flag}</span>
                {language.name}
              </Button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Tecnologia de acessibilidade fornecida por VLibras
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}