import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Clock, DollarSign, Star, Volume2, VolumeX, Heart, ExternalLink } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { usePassport } from "@/hooks/use-passport";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TouristSpot, ImageMetadata } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StarRating } from "@/components/star-rating";
import { ImageCarousel, InlineImage } from "@/components/image-carousel";
import secretariaLogo from "@assets/secretaria_logo.jpeg";
import logoAbiudando from "@assets/logo-abiudando-aracaju.png";
import { createSpeech } from "@/utils/voice-selector";

// Import the shared schema
import type { InsertTouristFeedback } from "@shared/schema";

// Tourist feedback form schema (without spotId and rating since they're handled separately)
const touristFeedbackSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório"),
  visitReason: z.string().min(1, "Motivo da visita é obrigatório"),
  cityOpinion: z.string().min(10, "Por favor, conte-nos sua opinião sobre a cidade"),
  stayDuration: z.string().min(1, "Duração da estadia é obrigatória"),
  accommodation: z.string().min(1, "Local de hospedagem é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")), // Email opcional
});

type TouristFeedback = z.infer<typeof touristFeedbackSchema>;

export default function SpotDetails() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const selectedLang = urlParams.get('lang') || 'pt';
  const { localizeSpot, getLocalizedText } = useLanguage();
  const { toast } = useToast();
  const { getOrCreatePassport } = usePassport();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [nextSpot, setNextSpot] = useState<TouristSpot | null>(null);
  const [rating, setRating] = useState(0);

  // Get spot details
  const { data: spot, isLoading, error } = useQuery<TouristSpot>({
    queryKey: ["/api/spots", id],
  });

  // Get all spots for finding the next closest one
  const { data: allSpots = [] } = useQuery<TouristSpot[]>({
    queryKey: ["/api/spots"],
  });

  const form = useForm<TouristFeedback>({
    resolver: zodResolver(touristFeedbackSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      email: "",
      city: "",
      state: "",
      country: "",
      visitReason: "",
      cityOpinion: "",
      stayDuration: "",
      accommodation: "",
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: (data: InsertTouristFeedback) => 
      apiRequest("POST", "/api/tourist-feedback", data),
    onSuccess: (response: any) => {
      // Save passport code to localStorage if newly created
      if (response.isNewPassport && response.passportCode) {
        const PASSPORT_STORAGE_KEY = 'ajudando-aju-passport';
        localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify({
          passportCode: response.passportCode,
          createdAt: new Date().toISOString()
        }));
        
        console.log(`Passport automatically created and saved: ${response.passportCode}`);
        
        // Show toast notification
        toast({
          title: getLocalizedText({
            pt: "🎉 Passaporte Digital Criado!",
            en: "🎉 Digital Passport Created!",
            es: "🎉 ¡Pasaporte Digital Creado!"
          }),
          description: getLocalizedText({
            pt: `Seu código: ${response.passportCode}`,
            en: `Your code: ${response.passportCode}`,
            es: `Su código: ${response.passportCode}`
          }),
          duration: 5000,
        });
      }
      
      // Invalidate queries to update reports in real-time
      queryClient.invalidateQueries({ queryKey: ["/api/tourist-feedback"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/passport"] });
      
      // Speak thank you message
      speakThankYouMessage();
      
      // Redirect to next destinations page
      setTimeout(() => {
        setLocation(`/next-destinations/${spot?.id}?lang=${selectedLang}`);
      }, 2000); // Small delay to allow thank you audio to start
    },
    onError: () => {
      toast({
        title: getLocalizedText({
          pt: "Erro",
          en: "Error",
          es: "Error"
        }),
        description: getLocalizedText({
          pt: "Erro ao enviar feedback",
          en: "Error sending feedback",
          es: "Error al enviar comentarios"
        }),
        variant: "destructive",
      });
    },
  });

  const speakDescription = () => {
    if (!spot || !('speechSynthesis' in window)) return;
    
    setIsAudioPlaying(true);
    speechSynthesis.cancel();
    
    const localizedSpot = localizeSpot(spot);
    const description = `${localizedSpot.name}. ${localizedSpot.description}`;
    
    // Use intelligent female voice selector based on selected language
    const utterance = createSpeech(description, selectedLang as 'pt' | 'en' | 'es');
    
    utterance.onend = () => {
      setIsAudioPlaying(false);
      setHasPlayedAudio(true);
    };
    
    speechSynthesis.speak(utterance);
  };

  const speakThankYouMessage = () => {
    if (!('speechSynthesis' in window)) return;
    
    const thankYouMessage = getLocalizedText({
      pt: "A Prefeitura de Aracaju agradece pela sua visita. Esperamos que tenha uma experiência maravilhosa em nossa cidade!",
      en: "The Municipality of Aracaju thanks you for your visit. We hope you have a wonderful experience in our city!",
      es: "El Municipio de Aracaju le agradece su visita. ¡Esperamos que tenga una experiencia maravillosa en nuestra ciudad!"
    });
    
    // Use intelligent female voice selector based on selected language
    const utterance = createSpeech(thankYouMessage, selectedLang as 'pt' | 'en' | 'es');
    
    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsAudioPlaying(false);
  };

  const onSubmit = async (data: TouristFeedback) => {
    if (!spot) return;
    
    // Validate rating before submission
    if (rating === 0) {
      toast({
        title: getLocalizedText({
          pt: "Avaliação obrigatória",
          en: "Rating required",
          es: "Calificación obligatoria"
        }),
        description: getLocalizedText({
          pt: "Por favor, avalie este local usando as estrelas acima.",
          en: "Please rate this place using the stars above.",
          es: "Por favor, califica este lugar usando las estrellas de arriba."
        }),
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get or create passport automatically
      const passport = await getOrCreatePassport();
      
      // Submit feedback with passport ID
      feedbackMutation.mutate({ 
        ...data, 
        spotId: spot.id, 
        rating: String(rating),
        passportId: passport.id
      });
    } catch (error) {
      console.error('Error creating passport:', error);
      // Fallback: submit without passport
      feedbackMutation.mutate({ 
        ...data, 
        spotId: spot.id, 
        rating: String(rating) 
      });
    }
  };

  useEffect(() => {
    // Auto-play description removed as per user request to avoid "sound pollution"
    // The user must now click the play button to hear the description.
  }, [spot]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {getLocalizedText({
              pt: "Carregando informações...",
              en: "Loading information...",
              es: "Cargando información..."
            })}
          </p>
        </div>
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {getLocalizedText({
              pt: "Ponto turístico não encontrado",
              en: "Tourist spot not found",
              es: "Punto turístico no encontrado"
            })}
          </p>
        </div>
      </div>
    );
  }

  const localizedSpot = localizeSpot(spot);

  if (showThanks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-700 mb-4">
              {getLocalizedText({
                pt: "Obrigado pela sua visita!",
                en: "Thank you for your visit!",
                es: "¡Gracias por su visita!"
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              {getLocalizedText({
                pt: "A Prefeitura de Aracaju agradece por conhecer nossos pontos turísticos. Sua opinião é muito importante para nós!",
                en: "The Municipality of Aracaju thanks you for visiting our tourist spots. Your opinion is very important to us!",
                es: "El Municipio de Aracaju le agradece por conocer nuestros puntos turísticos. ¡Su opinión es muy importante para nosotros!"
              })}
            </p>
            
            {nextSpot && (
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h3 className="font-semibold text-cyan-800 mb-2">
                  {getLocalizedText({
                    pt: "Conheça também:",
                    en: "Also visit:",
                    es: "Conozca también:"
                  })}
                </h3>
                <p className="text-cyan-700 font-medium">{localizeSpot(nextSpot).name}</p>
                <p className="text-sm text-cyan-600 mt-1">{localizeSpot(nextSpot).description.substring(0, 100)}...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageGallery = (spot.imageGallery as ImageMetadata[]) || [];
  const inlineImages = imageGallery.filter(img => img.type === 'inline').sort((a, b) => a.order - b.order);

  // Function to render description with inline images
  const renderDescriptionWithImages = (spot: TouristSpot) => {
    const localized = localizeSpot(spot);
    const parts = [
      localized.description,
      (spot as any)[`description_${selectedLang}_2`],
      (spot as any)[`description_${selectedLang}_3`]
    ].filter(p => p && p.trim());

    if (parts.length === 0) return null;

    const imageGallery = (spot.imageGallery as ImageMetadata[]) || [];
    const inlineImages = imageGallery.filter(img => img.type === 'inline').sort((a, b) => a.order - b.order);

    return (
      <div className="space-y-6">
        {parts.map((part, index) => (
          <div key={`part-${index}`}>
            <p className="text-gray-700 leading-relaxed">
              {part}
            </p>
            {/* Insert inline image after each part if available */}
            {inlineImages[index] && (
              <InlineImage
                image={inlineImages[index]}
                language={selectedLang as 'pt' | 'en' | 'es'}
                className="my-6"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-none border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
          {/* Logo Principal Ampliada */}
          <div className="mb-8 w-full flex justify-center">
            <img 
              src={logoAbiudando} 
              alt="ABIUDANDO ARACAJU" 
              className="h-64 md:h-80 w-auto object-contain transition-all duration-300"
            />
          </div>
          <div className="w-full flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{localizedSpot.name}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="w-5 h-5 mr-1" />
                <span className="text-lg">{spot.address || 'Aracaju - SE'}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={isAudioPlaying ? stopAudio : speakDescription}
              className="bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700"
            >
              {isAudioPlaying ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  {getLocalizedText({
                    pt: "Parar",
                    en: "Stop",
                    es: "Parar"
                  })}
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  {getLocalizedText({
                    pt: "Ouvir",
                    en: "Listen",
                    es: "Escuchar"
                  })}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Image Carousel */}
        <div className="max-w-4xl mx-auto px-4">
          <ImageCarousel
            images={imageGallery.filter(img => img.type === 'gallery')}
            coverImage={spot.coverImage}
            autoSlide={true}
            autoSlideInterval={6000}
            showThumbnails={true}
            showCaptions={true}
            language={selectedLang as 'pt' | 'en' | 'es'}
            className="w-full"
          />
        </div>

        {/* Video Player */}
        {spot.videoUrl && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <video
                    controls
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={spot.videoUrl}
                    data-testid="video-player"
                  >
                    {getLocalizedText({
                      pt: "Seu navegador não suporta reprodução de vídeo.",
                      en: "Your browser does not support video playback.",
                      es: "Su navegador no soporta reproducción de video."
                    })}
                  </video>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Spot Information */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-cyan-600 border-cyan-200">
                  {getLocalizedText({
                    pt: spot.category === 'praia' ? 'Praia' : spot.category === 'historico' ? 'Histórico' : spot.category === 'cultura' ? 'Cultura' : 'Restaurante',
                    en: spot.category === 'praia' ? 'Beach' : spot.category === 'historico' ? 'Historic' : spot.category === 'cultura' ? 'Culture' : 'Restaurant',
                    es: spot.category === 'praia' ? 'Playa' : spot.category === 'historico' ? 'Histórico' : spot.category === 'cultura' ? 'Cultura' : 'Restaurante'
                  })}
                </Badge>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-3">
              {getLocalizedText({
                pt: "Sobre este local",
                en: "About this place",
                es: "Acerca de este lugar"
              })}
            </h2>
            <div className="mb-6">
              {renderDescriptionWithImages(spot)}
            </div>

            {/* Operational Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {getLocalizedText({
                  pt: "Informações de Visitação",
                  en: "Visitor Information",
                  es: "Información de Visita"
                })}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Opening Hours */}
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {getLocalizedText({
                      pt: "Horário:",
                      en: "Hours:",
                      es: "Horario:"
                    })}
                  </span>
                  <span>
                    {spot?.is24Hours ? 
                      getLocalizedText({
                        pt: "24 horas",
                        en: "24 hours",
                        es: "24 horas"
                      }) :
                      (spot?.openingHours || getLocalizedText({
                        pt: "Consultar no local",
                        en: "Check on site",
                        es: "Consultar en el lugar"
                      }))
                    }
                  </span>
                </div>
                
                {/* Entry Fee */}
                <div className="flex items-center gap-2 text-blue-800">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">
                    {getLocalizedText({
                      pt: "Entrada:",
                      en: "Entry:",
                      es: "Entrada:"
                    })}
                  </span>
                  <span>
                    {spot?.isFree ? 
                      getLocalizedText({
                        pt: "Gratuita",
                        en: "Free",
                        es: "Gratuita"
                      }) :
                      (spot?.entryFee || getLocalizedText({
                        pt: "Consultar no local",
                        en: "Check on site",
                        es: "Consultar en el lugar"
                      }))
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Maps Link */}
        {spot.googleMapsLink && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-800">
                    {getLocalizedText({
                      pt: "Ver no Google Maps",
                      en: "View on Google Maps",
                      es: "Ver en Google Maps"
                    })}
                  </h3>
                  <p className="text-blue-600 text-sm">
                    {getLocalizedText({
                      pt: "Veja mais informações e avaliações",
                      en: "See more information and reviews",
                      es: "Ver más información y reseñas"
                    })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => spot.googleMapsLink && window.open(spot.googleMapsLink, '_blank', 'rel=noopener noreferrer')}
                  className="border-blue-200 text-blue-600 hover:bg-blue-100"
                  data-testid="link-google-maps"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {getLocalizedText({
                    pt: "Abrir",
                    en: "Open",
                    es: "Abrir"
                  })}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Star Rating */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <StarRating
                value={rating}
                onChange={setRating}
                size="lg"
                label={getLocalizedText({
                  pt: "Como você avalia este local?",
                  en: "How would you rate this place?",
                  es: "¿Cómo calificarías este lugar?"
                })}
              />
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {getLocalizedText({
                    pt: "Sua avaliação será enviada junto com seu feedback",
                    en: "Your rating will be sent along with your feedback",
                    es: "Su calificación se enviará junto con sus comentarios"
                  })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tourist Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {getLocalizedText({
                pt: "Conte-nos sobre sua visita",
                en: "Tell us about your visit",
                es: "Cuéntanos sobre tu visita"
              })}
            </CardTitle>
            <p className="text-center text-gray-600">
              {getLocalizedText({
                pt: "Suas informações nos ajudam a melhorar o turismo em Aracaju",
                en: "Your information helps us improve tourism in Aracaju",
                es: "Su información nos ayuda a mejorar el turismo en Aracaju"
              })}
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {getLocalizedText({
                          pt: "Nome completo",
                          en: "Full name",
                          es: "Nombre completo"
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {getLocalizedText({
                          pt: "Data de nascimento",
                          en: "Date of birth",
                          es: "Fecha de nacimiento"
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {getLocalizedText({
                            pt: "Cidade",
                            en: "City",
                            es: "Ciudad"
                          })}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {getLocalizedText({
                            pt: "Estado",
                            en: "State",
                            es: "Estado"
                          })}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={getLocalizedText({
                                pt: "Selecione o estado",
                                en: "Select state",
                                es: "Seleccione el estado"
                              })} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AC">Acre</SelectItem>
                            <SelectItem value="AL">Alagoas</SelectItem>
                            <SelectItem value="AP">Amapá</SelectItem>
                            <SelectItem value="AM">Amazonas</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="CE">Ceará</SelectItem>
                            <SelectItem value="DF">Distrito Federal</SelectItem>
                            <SelectItem value="ES">Espírito Santo</SelectItem>
                            <SelectItem value="GO">Goiás</SelectItem>
                            <SelectItem value="MA">Maranhão</SelectItem>
                            <SelectItem value="MT">Mato Grosso</SelectItem>
                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="PA">Pará</SelectItem>
                            <SelectItem value="PB">Paraíba</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="PE">Pernambuco</SelectItem>
                            <SelectItem value="PI">Piauí</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="RO">Rondônia</SelectItem>
                            <SelectItem value="RR">Roraima</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="SE">Sergipe</SelectItem>
                            <SelectItem value="TO">Tocantins</SelectItem>
                            <SelectItem value="EX">{getLocalizedText({
                              pt: "Estrangeiro",
                              en: "Foreign",
                              es: "Extranjero"
                            })}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {getLocalizedText({
                            pt: "País",
                            en: "Country",
                            es: "País"
                          })}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={getLocalizedText({
                                pt: "Selecione o país",
                                en: "Select country",
                                es: "Seleccione el país"
                              })} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Brasil">Brasil</SelectItem>
                            <SelectItem value="Argentina">Argentina</SelectItem>
                            <SelectItem value="Uruguai">Uruguai</SelectItem>
                            <SelectItem value="Paraguai">Paraguai</SelectItem>
                            <SelectItem value="Chile">Chile</SelectItem>
                            <SelectItem value="Colombia">Colômbia</SelectItem>
                            <SelectItem value="Peru">Peru</SelectItem>
                            <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                            <SelectItem value="Canada">Canadá</SelectItem>
                            <SelectItem value="Portugal">Portugal</SelectItem>
                            <SelectItem value="Espanha">Espanha</SelectItem>
                            <SelectItem value="França">França</SelectItem>
                            <SelectItem value="Alemanha">Alemanha</SelectItem>
                            <SelectItem value="Italia">Itália</SelectItem>
                            <SelectItem value="Reino Unido">Reino Unido</SelectItem>
                            <SelectItem value="Japao">Japão</SelectItem>
                            <SelectItem value="China">China</SelectItem>
                            <SelectItem value="Outro">{getLocalizedText({
                              pt: "Outro",
                              en: "Other",
                              es: "Otro"
                            })}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="visitReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {getLocalizedText({
                          pt: "Motivo da visita",
                          en: "Reason for visit",
                          es: "Motivo de la visita"
                        })}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={getLocalizedText({
                              pt: "Selecione o motivo",
                              en: "Select reason",
                              es: "Seleccione el motivo"
                            })} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="turismo">
                            {getLocalizedText({
                              pt: "Turismo",
                              en: "Tourism",
                              es: "Turismo"
                            })}
                          </SelectItem>
                          <SelectItem value="negocios">
                            {getLocalizedText({
                              pt: "Negócios",
                              en: "Business",
                              es: "Negocios"
                            })}
                          </SelectItem>
                          <SelectItem value="familia">
                            {getLocalizedText({
                              pt: "Visita à família",
                              en: "Family visit",
                              es: "Visita familiar"
                            })}
                          </SelectItem>
                          <SelectItem value="outros">
                            {getLocalizedText({
                              pt: "Outros",
                              en: "Others",
                              es: "Otros"
                            })}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityOpinion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {getLocalizedText({
                          pt: "O que está achando da cidade?",
                          en: "What do you think of the city?",
                          es: "¿Qué piensas de la ciudad?"
                        })}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stayDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {getLocalizedText({
                            pt: "Quanto tempo pretende ficar?",
                            en: "How long do you plan to stay?",
                            es: "¿Cuánto tiempo planea quedarse?"
                          })}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-dia">
                              {getLocalizedText({
                                pt: "1 dia",
                                en: "1 day",
                                es: "1 día"
                              })}
                            </SelectItem>
                            <SelectItem value="2-3-dias">
                              {getLocalizedText({
                                pt: "2-3 dias",
                                en: "2-3 days",
                                es: "2-3 días"
                              })}
                            </SelectItem>
                            <SelectItem value="1-semana">
                              {getLocalizedText({
                                pt: "1 semana",
                                en: "1 week",
                                es: "1 semana"
                              })}
                            </SelectItem>
                            <SelectItem value="mais-1-semana">
                              {getLocalizedText({
                                pt: "Mais de 1 semana",
                                en: "More than 1 week",
                                es: "Más de 1 semana"
                              })}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accommodation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {getLocalizedText({
                            pt: "Onde está hospedado?",
                            en: "Where are you staying?",
                            es: "¿Dónde se hospeda?"
                          })}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={getLocalizedText({
                                pt: "Selecione o tipo de hospedagem",
                                en: "Select accommodation type",
                                es: "Seleccione el tipo de alojamiento"
                              })} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hotel">{getLocalizedText({
                              pt: "Hotel",
                              en: "Hotel",
                              es: "Hotel"
                            })}</SelectItem>
                            <SelectItem value="pousada">{getLocalizedText({
                              pt: "Pousada",
                              en: "Inn/Guesthouse",
                              es: "Posada"
                            })}</SelectItem>
                            <SelectItem value="airbnb">{getLocalizedText({
                              pt: "Airbnb / Aluguel temporário",
                              en: "Airbnb / Short-term rental",
                              es: "Airbnb / Alquiler temporal"
                            })}</SelectItem>
                            <SelectItem value="hostel">{getLocalizedText({
                              pt: "Hostel",
                              en: "Hostel",
                              es: "Hostel"
                            })}</SelectItem>
                            <SelectItem value="resort">{getLocalizedText({
                              pt: "Resort",
                              en: "Resort",
                              es: "Resort"
                            })}</SelectItem>
                            <SelectItem value="casa-familia">{getLocalizedText({
                              pt: "Casa de família/amigos",
                              en: "Family/Friends' home",
                              es: "Casa de familia/amigos"
                            })}</SelectItem>
                            <SelectItem value="morador-local">{getLocalizedText({
                              pt: "Sou morador local",
                              en: "I'm a local resident",
                              es: "Soy residente local"
                            })}</SelectItem>
                            <SelectItem value="outro">{getLocalizedText({
                              pt: "Outro",
                              en: "Other",
                              es: "Otro"
                            })}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email field (optional) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {getLocalizedText({
                          pt: "E-mail (opcional)",
                          en: "Email (optional)",
                          es: "Correo electrónico (opcional)"
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder={getLocalizedText({
                            pt: "seu@email.com",
                            en: "your@email.com",
                            es: "su@email.com"
                          })}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <p className="text-sm text-gray-600 italic mt-1">
                        {getLocalizedText({
                          pt: "📧 Informe seu e-mail para receber um link de acesso ao seu Passaporte Turístico Digital com suas conquistas e pontuações.",
                          en: "📧 Provide your email to receive an access link to your Digital Tourist Passport with your achievements and points.",
                          es: "📧 Proporcione su correo electrónico para recibir un enlace de acceso a su Pasaporte Turístico Digital con sus logros y puntuaciones."
                        })}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={feedbackMutation.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                  data-testid="button-submit-feedback"
                >
                  {feedbackMutation.isPending
                    ? getLocalizedText({
                        pt: "Enviando...",
                        en: "Sending...",
                        es: "Enviando..."
                      })
                    : getLocalizedText({
                        pt: "Enviar Feedback",
                        en: "Send Feedback",
                        es: "Enviar Comentarios"
                      })
                  }
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
      </div>
      
      {/* Footer com logo ABIUDANDO AJU */}
      <footer className="bg-white border-t shadow-sm mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-center">
            <img 
              src={logoAbiudando} 
              alt="ABIUDANDO AJU" 
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}