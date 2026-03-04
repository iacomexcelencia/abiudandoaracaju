import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Star, Image as ImageIcon, MoveUp, MoveDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ImageMetadata } from "@shared/schema";

interface ImageGalleryManagerProps {
  spotId: string;
  images: ImageMetadata[];
  coverImageUrl?: string | null;
  onImagesChange: (images: ImageMetadata[]) => void;
  onCoverImageChange: (imageUrl: string | null) => void;
}

export function ImageGalleryManager({
  spotId,
  images,
  coverImageUrl,
  onImagesChange,
  onCoverImageChange,
}: ImageGalleryManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [editingImage, setEditingImage] = useState<ImageMetadata | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: handleFileUpload,
  });

  async function handleFileUpload(files: File[]) {
    if (!files.length) return;
    
    setIsUploading(true);
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', activeTab === 'cover' ? 'cover' : 'gallery');
        formData.append('order', String(images.length));
        
        const response = await fetch(`/api/spots/${spotId}/images`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        const newImage = result.image;
        
        onImagesChange([...images, newImage]);
        
        // Set as cover if it's the first cover image
        if (newImage.type === 'cover' && !coverImageUrl) {
          onCoverImageChange(newImage.url);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }

  const deleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/spots/${spotId}/images/${imageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      const updatedImages = images.filter(img => img.id !== imageId);
      onImagesChange(updatedImages);
      
      // Clear cover if it was the deleted image
      const deletedImage = images.find(img => img.id === imageId);
      if (deletedImage && coverImageUrl === deletedImage.url) {
        onCoverImageChange(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const setCoverImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/spots/${spotId}/cover-image/${imageId}`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Set cover failed');
      }
      
      const image = images.find(img => img.id === imageId);
      if (image) {
        onCoverImageChange(image.url);
      }
    } catch (error) {
      console.error('Set cover error:', error);
    }
  };

  const updateImageMetadata = async (imageId: string, updates: Partial<ImageMetadata>) => {
    try {
      const response = await fetch(`/api/spots/${spotId}/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Update failed');
      }
      
      const updatedImages = images.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      );
      onImagesChange(updatedImages);
      setEditingImage(null);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    
    const newImages = [...images];
    [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];
    
    // Update order values
    newImages.forEach((img, index) => {
      img.order = index;
    });
    
    onImagesChange(newImages);
  };

  const galleryImages = images.filter(img => img.type === 'gallery').sort((a, b) => a.order - b.order);
  const coverImages = images.filter(img => img.type === 'cover').sort((a, b) => a.order - b.order);
  const inlineImages = images.filter(img => img.type === 'inline').sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gerenciador de Imagens</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{images.length}/10 imagens</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 10}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(Array.from(e.target.files));
              }
            }}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery" className="text-sm">
            <ImageIcon className="w-4 h-4 mr-2" />
            Galeria ({galleryImages.length})
          </TabsTrigger>
          <TabsTrigger value="cover" className="text-sm">
            <Star className="w-4 h-4 mr-2" />
            Capa ({coverImages.length})
          </TabsTrigger>
          <TabsTrigger value="inline" className="text-sm">
            Inline ({inlineImages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arraste imagens para a galeria
            </p>
            <p className="text-sm text-gray-500">
              ou clique para selecionar arquivos (máximo 10MB cada)
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                total={galleryImages.length}
                isCover={coverImageUrl === image.url}
                onDelete={() => deleteImage(image.id)}
                onSetCover={() => setCoverImage(image.id)}
                onEdit={() => setEditingImage(image)}
                onMove={(direction) => moveImage(image.id, direction)}
                data-testid={`image-gallery-${image.id}`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cover" className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Imagem de Capa</h4>
            <p className="text-sm text-yellow-700">
              A imagem de capa é exibida como destaque principal do ponto turístico. 
              Escolha uma imagem representativa e de alta qualidade.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {coverImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                total={coverImages.length}
                isCover={coverImageUrl === image.url}
                onDelete={() => deleteImage(image.id)}
                onSetCover={() => setCoverImage(image.id)}
                onEdit={() => setEditingImage(image)}
                onMove={(direction) => moveImage(image.id, direction)}
                data-testid={`image-cover-${image.id}`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inline" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Imagens Inline</h4>
            <p className="text-sm text-blue-700">
              Imagens inline são inseridas entre os parágrafos da descrição para 
              criar uma narrativa visual mais rica e envolvente.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {inlineImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                total={inlineImages.length}
                isCover={false}
                onDelete={() => deleteImage(image.id)}
                onSetCover={() => {}} // No cover for inline images
                onEdit={() => setEditingImage(image)}
                onMove={(direction) => moveImage(image.id, direction)}
                data-testid={`image-inline-${image.id}`}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Editor Dialog */}
      {editingImage && (
        <ImageEditorDialog
          image={editingImage}
          onSave={(updates) => updateImageMetadata(editingImage.id, updates)}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  );
}

interface ImageCardProps {
  image: ImageMetadata;
  index: number;
  total: number;
  isCover: boolean;
  onDelete: () => void;
  onSetCover: () => void;
  onEdit: () => void;
  onMove: (direction: 'up' | 'down') => void;
  'data-testid'?: string;
}

function ImageCard({ image, index, total, isCover, onDelete, onSetCover, onEdit, onMove, ...props }: ImageCardProps) {
  return (
    <Card className="group relative overflow-hidden" {...props}>
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <img
            src={image.url}
            alt={image.altText_pt || 'Imagem do ponto turístico'}
            className="w-full h-full object-cover"
          />
          
          {isCover && (
            <Badge className="absolute top-2 left-2 bg-yellow-500">
              <Star className="w-3 h-3 mr-1" />
              Capa
            </Badge>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  Editar
                </DropdownMenuItem>
                {!isCover && image.type !== 'inline' && (
                  <DropdownMenuItem onClick={onSetCover}>
                    Definir como capa
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {index > 0 && (
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onMove('up')}
              >
                <MoveUp className="w-4 h-4" />
              </Button>
            )}
            {index < total - 1 && (
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onMove('down')}
              >
                <MoveDown className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {(image.caption_pt || image.caption_en || image.caption_es) && (
          <div className="p-3">
            <p className="text-xs text-gray-600 line-clamp-2">
              {image.caption_pt || image.caption_en || image.caption_es}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ImageEditorDialogProps {
  image: ImageMetadata;
  onSave: (updates: Partial<ImageMetadata>) => void;
  onClose: () => void;
}

function ImageEditorDialog({ image, onSave, onClose }: ImageEditorDialogProps) {
  const [formData, setFormData] = useState({
    caption_pt: image.caption_pt || '',
    caption_en: image.caption_en || '',
    caption_es: image.caption_es || '',
    altText_pt: image.altText_pt || '',
    altText_en: image.altText_en || '',
    altText_es: image.altText_es || '',
    order: image.order,
    inlinePosition: image.inlinePosition || 0,
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video">
            <img
              src={image.url}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <Tabs defaultValue="pt" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pt">🇧🇷 Português</TabsTrigger>
              <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
              <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pt" className="space-y-4">
              <div>
                <Label htmlFor="caption-pt">Legenda</Label>
                <Textarea
                  id="caption-pt"
                  value={formData.caption_pt}
                  onChange={(e) => setFormData({ ...formData, caption_pt: e.target.value })}
                  placeholder="Legenda em português"
                />
              </div>
              <div>
                <Label htmlFor="alt-pt">Texto alternativo (acessibilidade)</Label>
                <Input
                  id="alt-pt"
                  value={formData.altText_pt}
                  onChange={(e) => setFormData({ ...formData, altText_pt: e.target.value })}
                  placeholder="Descrição da imagem para leitores de tela"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label htmlFor="caption-en">Caption</Label>
                <Textarea
                  id="caption-en"
                  value={formData.caption_en}
                  onChange={(e) => setFormData({ ...formData, caption_en: e.target.value })}
                  placeholder="Caption in English"
                />
              </div>
              <div>
                <Label htmlFor="alt-en">Alt text</Label>
                <Input
                  id="alt-en"
                  value={formData.altText_en}
                  onChange={(e) => setFormData({ ...formData, altText_en: e.target.value })}
                  placeholder="Image description for screen readers"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="es" className="space-y-4">
              <div>
                <Label htmlFor="caption-es">Leyenda</Label>
                <Textarea
                  id="caption-es"
                  value={formData.caption_es}
                  onChange={(e) => setFormData({ ...formData, caption_es: e.target.value })}
                  placeholder="Leyenda en español"
                />
              </div>
              <div>
                <Label htmlFor="alt-es">Texto alternativo</Label>
                <Input
                  id="alt-es"
                  value={formData.altText_es}
                  onChange={(e) => setFormData({ ...formData, altText_es: e.target.value })}
                  placeholder="Descripción de imagen para lectores de pantalla"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Ordem de exibição</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            {image.type === 'inline' && (
              <div>
                <Label htmlFor="inline-position">Posição no texto</Label>
                <Input
                  id="inline-position"
                  type="number"
                  value={formData.inlinePosition}
                  onChange={(e) => setFormData({ ...formData, inlinePosition: parseInt(e.target.value) || 0 })}
                  placeholder="Posição do parágrafo"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}