import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ImageMetadata } from "@shared/schema";

// Utility function to convert Google Drive sharing URLs to direct view URLs
function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Check if it's a Google Drive sharing URL
  const shareUrlMatch = url.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=sharing/);
  if (shareUrlMatch) {
    const fileId = shareUrlMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // Check if it's already a direct URL or another format
  return url;
}

interface ImageCarouselProps {
  images: ImageMetadata[];
  coverImage?: string | null;
  className?: string;
  autoSlide?: boolean;
  autoSlideInterval?: number;
  showThumbnails?: boolean;
  showCaptions?: boolean;
  language?: 'pt' | 'en' | 'es';
}

export function ImageCarousel({
  images,
  coverImage,
  className = "",
  autoSlide = false,
  autoSlideInterval = 5000,
  showThumbnails = true,
  showCaptions = true,
  language = 'pt',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter and sort images for display
  const displayImages = [
    ...(coverImage ? [{ id: 'cover', url: convertGoogleDriveUrl(coverImage), type: 'cover', order: -1, caption_pt: '', caption_en: '', caption_es: '' }] : []),
    ...images.filter(img => img.type === 'gallery').sort((a, b) => a.order - b.order).map(img => ({ ...img, url: convertGoogleDriveUrl(img.url) }))
  ];

  const totalImages = displayImages.length;

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || totalImages <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, totalImages]);

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < totalImages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const getCaption = (image: any) => {
    if (language === 'en') return image.caption_en || image.caption_pt || '';
    if (language === 'es') return image.caption_es || image.caption_pt || '';
    return image.caption_pt || '';
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const shareImage = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aracaju - Ponto Turístico',
          url: imageUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(imageUrl);
    }
  };

  if (totalImages === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
            📷
          </div>
          <p>Nenhuma imagem disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Main Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="overflow-hidden rounded-t-xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {displayImages.map((image, index) => (
              <div key={image.id || index} className="w-full flex-shrink-0 relative">
                <div className="aspect-video relative group cursor-pointer" onClick={() => openLightbox(index)}>
                  <img
                    src={image.url}
                    alt={getCaption(image) || `Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  
                  {/* Overlay with zoom hint */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <ZoomIn className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                  </div>

                  {/* Image type badge */}
                  {image.type === 'cover' && (
                    <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
                      Capa
                    </Badge>
                  )}
                </div>

                {/* Caption */}
                {showCaptions && getCaption(image) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm leading-relaxed">
                      {getCaption(image)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {totalImages > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              data-testid="carousel-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
              onClick={nextSlide}
              disabled={currentIndex === totalImages - 1}
              data-testid="carousel-next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Slide Indicators */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {displayImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                onClick={() => goToSlide(index)}
                data-testid={`carousel-indicator-${index}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && totalImages > 1 && (
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {displayImages.map((image, index) => (
              <button
                key={image.id || index}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? 'border-blue-500 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => goToSlide(index)}
                data-testid={`thumbnail-${index}`}
              >
                <img
                  src={image.url}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation */}
            {totalImages > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  onClick={() => {
                    const newIndex = (lightboxIndex - 1 + totalImages) % totalImages;
                    setLightboxIndex(newIndex);
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  onClick={() => {
                    const newIndex = (lightboxIndex + 1) % totalImages;
                    setLightboxIndex(newIndex);
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 z-50 flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => downloadImage(displayImages[lightboxIndex].url, `image-${lightboxIndex + 1}.jpg`)}
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => shareImage(displayImages[lightboxIndex].url)}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Image */}
            <img
              src={displayImages[lightboxIndex]?.url}
              alt={getCaption(displayImages[lightboxIndex]) || `Imagem ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Caption in Lightbox */}
            {getCaption(displayImages[lightboxIndex]) && (
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white bg-black/50 px-4 py-2 rounded-lg inline-block">
                  {getCaption(displayImages[lightboxIndex])}
                </p>
              </div>
            )}

            {/* Counter in Lightbox */}
            <div className="absolute bottom-4 right-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
              {lightboxIndex + 1} / {totalImages}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simplified version for inline images
interface InlineImageProps {
  image: ImageMetadata;
  language?: 'pt' | 'en' | 'es';
  className?: string;
}

export function InlineImage({ image, language = 'pt', className = "" }: InlineImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const getCaption = () => {
    if (language === 'en') return image.caption_en || image.caption_pt || '';
    if (language === 'es') return image.caption_es || image.caption_pt || '';
    return image.caption_pt || '';
  };

  const getAltText = () => {
    if (language === 'en') return image.altText_en || image.altText_pt || '';
    if (language === 'es') return image.altText_es || image.altText_pt || '';
    return image.altText_pt || '';
  };

  return (
    <div className={`my-6 ${className}`}>
      <div className="relative group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
        <img
          src={convertGoogleDriveUrl(image.url)}
          alt={getAltText()}
          className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        />
        
        {/* Zoom overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-lg">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>
      </div>
      
      {getCaption() && (
        <p className="text-sm text-gray-600 mt-2 text-center italic">
          {getCaption()}
        </p>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <img
              src={convertGoogleDriveUrl(image.url)}
              alt={getAltText()}
              className="max-w-full max-h-full object-contain"
            />
            
            {getCaption() && (
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white bg-black/50 px-4 py-2 rounded-lg inline-block">
                  {getCaption()}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}