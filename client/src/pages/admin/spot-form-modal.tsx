import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertTouristSpotSchema, type InsertTouristSpot, type TouristSpot, type ImageMetadata } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { Save, X, Image, Upload, Trash2, Star, Loader2 } from "lucide-react";

interface SpotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  spot?: TouristSpot | null;
}

export default function SpotFormModal({ isOpen, onClose, spot }: SpotFormModalProps) {
  const { toast } = useToast();

  // Estados para gerenciar imagens
  const [coverImage, setCoverImage] = useState("");
  const [inlineImages, setInlineImages] = useState<string[]>(["", "", ""]);
  const [galleryImages, setGalleryImages] = useState<string[]>(Array(7).fill(""));
  const [uploadingStates, setUploadingStates] = useState<{[key: string]: boolean}>({});
  
  // Refs para file inputs
  const coverFileRef = useRef<HTMLInputElement>(null);
  const inlineFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const galleryFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<InsertTouristSpot>({
    resolver: zodResolver(insertTouristSpotSchema),
    defaultValues: {
      name_pt: "",
      description_pt: "",
      description_pt_2: "",
      description_pt_3: "",
      name_en: "",
      description_en: "",
      description_en_2: "",
      description_en_3: "",
      name_es: "",
      description_es: "",
      description_es_2: "",
      description_es_3: "",
      category: "",
      latitude: "",
      longitude: "",
      address: "",
      images: [],
      googleMapsLink: "",
      videoUrl: "",
      isActive: true,
      imageGallery: [],
      coverImage: "",
      features: {},
      openingHours: "",
      is24Hours: false,
      isFree: true,
      entryFee: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertTouristSpot) => {
      if (spot) {
        return apiRequest("PUT", `/api/spots/${spot.id}`, data);
      }
      return apiRequest("POST", "/api/spots", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spots"] });
      toast({
        title: spot ? "Ponto atualizado" : "Ponto criado",
        description: spot 
          ? "Ponto turístico atualizado com sucesso" 
          : "Novo ponto turístico criado com sucesso",
      });
      onClose();
      form.reset();
      resetImageStates();
    },
    onError: (error) => {
      console.error("Error saving spot:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar ponto turístico",
        variant: "destructive",
      });
    },
  });

  const resetImageStates = () => {
    setCoverImage("");
    setInlineImages(["", "", ""]);
    setGalleryImages(Array(7).fill(""));
    setUploadingStates({});
  };

  const uploadFile = async (file: File): Promise<string> => {
    const metaRes = await fetch('/api/uploads/request-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type || 'application/octet-stream',
      }),
    });

    if (!metaRes.ok) {
      const error = await metaRes.json().catch(() => ({}));
      throw new Error(error.error || 'Falha ao obter URL de upload');
    }

    const { uploadURL, objectPath } = await metaRes.json();

    const uploadRes = await fetch(uploadURL, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
    });

    if (!uploadRes.ok) {
      throw new Error('Falha no upload do arquivo');
    }

    return objectPath;
  };

  // Handler para upload de imagem de capa
  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingStates(prev => ({ ...prev, cover: true }));
    try {
      const url = await uploadFile(file);
      setCoverImage(url);
      toast({
        title: "Sucesso",
        description: "Imagem de capa enviada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar imagem de capa",
        variant: "destructive",
      });
    } finally {
      setUploadingStates(prev => ({ ...prev, cover: false }));
    }
  };

  // Handler para upload de imagens inline
  const handleInlineImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingStates(prev => ({ ...prev, [`inline-${index}`]: true }));
    try {
      const url = await uploadFile(file);
      setInlineImages(prev => {
        const newImages = [...prev];
        newImages[index] = url;
        return newImages;
      });
      toast({
        title: "Sucesso",
        description: "Imagem inline enviada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar imagem inline",
        variant: "destructive",
      });
    } finally {
      setUploadingStates(prev => ({ ...prev, [`inline-${index}`]: false }));
    }
  };

  // Handler para upload de imagens da galeria
  const handleGalleryImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingStates(prev => ({ ...prev, [`gallery-${index}`]: true }));
    try {
      const url = await uploadFile(file);
      setGalleryImages(prev => {
        const newImages = [...prev];
        newImages[index] = url;
        return newImages;
      });
      toast({
        title: "Sucesso",
        description: "Imagem da galeria enviada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar imagem da galeria",
        variant: "destructive",
      });
    } finally {
      setUploadingStates(prev => ({ ...prev, [`gallery-${index}`]: false }));
    }
  };

  useEffect(() => {
    if (spot && isOpen) {
      // Preencher formulário com dados do ponto existente
      form.reset({
        name_pt: spot.name_pt,
        description_pt: spot.description_pt,
        description_pt_2: (spot as any).description_pt_2 || "",
        description_pt_3: (spot as any).description_pt_3 || "",
        name_en: spot.name_en || "",
        description_en: spot.description_en || "",
        description_en_2: (spot as any).description_en_2 || "",
        description_en_3: (spot as any).description_en_3 || "",
        name_es: spot.name_es || "",
        description_es: spot.description_es || "",
        description_es_2: (spot as any).description_es_2 || "",
        description_es_3: (spot as any).description_es_3 || "",
        category: spot.category,
        latitude: spot.latitude || "",
        longitude: spot.longitude || "",
        address: spot.address || "",
        images: spot.images || [],
        googleMapsLink: spot.googleMapsLink || "",
        videoUrl: spot.videoUrl || "",
        isActive: spot.isActive === null ? true : (spot.isActive ?? true),
        imageGallery: (spot.imageGallery as ImageMetadata[]) || [],
        coverImage: spot.coverImage || "",
        features: spot.features || {},
        openingHours: spot.openingHours || "",
        is24Hours: spot.is24Hours || false,
        isFree: spot.isFree || false,
        entryFee: spot.entryFee || "",
      });

      // Configurar estados das imagens
      setCoverImage(spot.coverImage || "");
      
      // Extrair imagens inline da imageGallery
      const existingImageGallery = (spot.imageGallery as ImageMetadata[]) || [];
      const inlineImgs = existingImageGallery
        .filter(img => img.type === 'inline')
        .sort((a, b) => a.order - b.order)
        .map(img => img.url);
      
      const galleryImgs = existingImageGallery
        .filter(img => img.type === 'gallery')
        .sort((a, b) => a.order - b.order)
        .map(img => img.url);
      
      setInlineImages([
        inlineImgs[0] || "",
        inlineImgs[1] || "",
        inlineImgs[2] || ""
      ]);
      
      setGalleryImages([
        ...galleryImgs,
        ...Array(Math.max(0, 7 - galleryImgs.length)).fill("")
      ].slice(0, 7));
      
    } else if (!isOpen) {
      resetImageStates();
    }
  }, [spot, isOpen, form]);

  const updateInlineImage = (index: number, url: string) => {
    const newInlineImages = [...inlineImages];
    newInlineImages[index] = url;
    setInlineImages(newInlineImages);
  };

  const updateGalleryImage = (index: number, url: string) => {
    const newGalleryImages = [...galleryImages];
    newGalleryImages[index] = url;
    setGalleryImages(newGalleryImages);
  };

  const onSubmit = (data: any) => {
    console.log("Form data before processing:", data);
    
    // Preparar imageGallery
    const imageGallery: ImageMetadata[] = [];
    let order = 0;
    
    // Adicionar imagens inline
    inlineImages.forEach((url, index) => {
      if (url && url.trim()) {
        imageGallery.push({
          id: `inline-${index}`,
          url: url.trim(),
          type: 'inline' as const,
          order: order++,
          inlinePosition: index + 1,
        });
      }
    });
    
    // Adicionar imagens da galeria
    galleryImages.forEach((url, index) => {
      if (url && url.trim()) {
        imageGallery.push({
          id: `gallery-${index}`,
          url: url.trim(),
          type: 'gallery' as const,
          order: order++,
        });
      }
    });
    
    // Validar limite de 10 imagens
    const totalImages = (coverImage ? 1 : 0) + imageGallery.length;
    if (totalImages > 10) {
      toast({
        title: "Muitas imagens",
        description: "Máximo de 10 imagens permitidas (1 capa + 9 outras)",
        variant: "destructive",
      });
      return;
    }
    
    const formData = {
      ...data,
      coverImage: coverImage.trim() || null,
      imageGallery: imageGallery,
    };
    
    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {spot ? "Editar Ponto Turístico" : "Novo Ponto Turístico"}
          </DialogTitle>
          <DialogDescription>
            {spot 
              ? "Edite as informações do ponto turístico" 
              : "Adicione um novo ponto turístico ao sistema"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="pt" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pt">🇧🇷 Português</TabsTrigger>
                <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
              </TabsList>

              <TabsContent value="pt" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name_pt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome (Português)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Praia de Atalaia" data-testid="input-name-pt" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="description_pt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Parte 1 (Português)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Descreva a primeira parte em português..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-pt"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_pt_2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Parte 2 (Português) - Opcional</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            placeholder="Descreva a segunda parte em português..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-pt-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_pt_3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Parte 3 (Português) - Opcional</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            placeholder="Descreva a terceira parte em português..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-pt-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Atalaia Beach" data-testid="input-name-en" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description Part 1 (English)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe the first part in English..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-en"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_en_2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description Part 2 (English) - Optional</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            placeholder="Describe the second part in English..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-en-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_en_3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description Part 3 (English) - Optional</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            placeholder="Describe the third part in English..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-en-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="es" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name_es"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre (Español)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Playa de Atalaia" data-testid="input-name-es" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="description_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Parte 1 (Español)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe la primera parte en español..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-es"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_es_2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Parte 2 (Español) - Opcional</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            placeholder="Describe la segunda parte en español..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-es-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_es_3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción Parte 3 (Español) - Opcional</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            placeholder="Describe la tercera parte en español..."
                            className="min-h-[100px]"
                            data-testid="textarea-description-es-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Funcionamento</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""} 
                        placeholder="Ex: Segunda a Sexta: 08h às 18h" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is24Hours"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                    <div className="space-y-0.5">
                      <FormLabel>Aberto 24 Horas?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                    <div className="space-y-0.5">
                      <FormLabel>Entrada Gratuita?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {!form.watch("isFree") && (
                <FormField
                  control={form.control}
                  name="entryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Entrada</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="Ex: R$ 10,00" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} data-testid="select-category">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="praia">Praia</SelectItem>
                        <SelectItem value="historico">Histórico</SelectItem>
                        <SelectItem value="cultura">Cultura</SelectItem>
                        <SelectItem value="restaurante">Restaurante</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""} 
                        placeholder="Ex: Av. Santos Dumont, 1234"
                        data-testid="input-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="Ex: -10.9472"
                        data-testid="input-latitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="Ex: -37.0731"
                        data-testid="input-longitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="googleMapsLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Google Maps</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ""} 
                      placeholder="https://maps.google.com/..."
                      data-testid="input-google-maps"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Vídeo (Cloudflare)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ""} 
                      placeholder="https://customer-xxx.cloudflarestream.com/..."
                      data-testid="input-video-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sistema de Imagens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Gestão de Imagens
                  <Badge variant="outline">Upload de Arquivos</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Imagem de Capa */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium">Imagem de Capa</h4>
                    <Badge className="bg-orange-100 text-orange-700 text-xs">Obrigatória</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        ref={coverFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => coverFileRef.current?.click()}
                        disabled={uploadingStates.cover}
                        data-testid="button-upload-cover-image"
                      >
                        {uploadingStates.cover ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                        ) : (
                          <><Upload className="w-4 h-4 mr-2" /> Selecionar Imagem</>
                        )}
                      </Button>
                      {coverImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCoverImage("")}
                          data-testid="button-clear-cover-image"
                        >
                          <Trash2 className="w-4 h-4" />
                          Limpar
                        </Button>
                      )}
                    </div>
                    {coverImage && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <Image className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Imagem de capa configurada</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCoverImage("")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Imagens Inline (para aparecer entre os textos) */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium">Imagens Inline (Entre textos)</h4>
                    <Badge variant="outline" className="text-xs">Máximo 3</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inlineImages.map((url, index) => (
                      <div key={`inline-${index}`} className="space-y-2">
                        <FormLabel className="text-xs text-gray-500">Posição {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <input
                            ref={el => inlineFileRefs.current[index] = el}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleInlineImageUpload(index, e)}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => inlineFileRefs.current[index]?.click()}
                            disabled={uploadingStates[`inline-${index}`]}
                            data-testid={`button-upload-inline-image-${index}`}
                          >
                            {uploadingStates[`inline-${index}`] ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 mr-2" />
                            )}
                            Subir {index + 1}
                          </Button>
                        </div>
                        {url && (
                          <div className="relative aspect-video rounded border overflow-hidden bg-gray-100">
                            <img src={url} alt={`Inline ${index + 1}`} className="w-full h-full object-cover" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => updateInlineImage(index, "")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Galeria de Imagens */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium">Galeria de Imagens</h4>
                    <Badge variant="outline" className="text-xs">Opcional</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {galleryImages.map((url, index) => (
                      <div key={`gallery-${index}`} className="space-y-1">
                        <input
                          ref={el => galleryFileRefs.current[index] = el}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleGalleryImageUpload(index, e)}
                          className="hidden"
                        />
                        <div 
                          className={`aspect-square rounded border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden ${url ? 'border-green-200' : 'border-gray-200'}`}
                          onClick={() => !url && galleryFileRefs.current[index]?.click()}
                        >
                          {uploadingStates[`gallery-${index}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          ) : url ? (
                            <div className="relative w-full h-full">
                              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateGalleryImage(index, "");
                                }}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <Upload className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> {spot ? "Salvar Alterações" : "Criar Ponto"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
