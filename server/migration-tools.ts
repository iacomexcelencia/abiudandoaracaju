import { storage } from "./storage";
import type { TouristSpot } from "@shared/schema";
import { randomUUID } from "crypto";
import path from "path";

/**
 * Tool para migração automática de imagens do Google Drive para Object Storage
 */

// Função para detectar se uma URL é do Google Drive
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

// Função para baixar imagem de URL e fazer upload para Object Storage
export async function migrateImageFromUrl(imageUrl: string, fileName?: string): Promise<string> {
  try {
    // Fazer download da imagem
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Verificar se é uma imagem
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('URL não retorna uma imagem válida');
    }

    // Converter para buffer
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Gerar nome de arquivo único
    const fileExtension = contentType.split('/')[1] || 'jpg';
    const finalFileName = fileName || `${randomUUID()}.${fileExtension}`;
    
    // Upload para Object Storage
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
      throw new Error('Object storage não configurado');
    }

    const objectPath = `/public/tourist-images/migrated/${finalFileName}`;
    const uploadUrl = `https://objectstorage.replit.com/${bucketId}${objectPath}`;
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: uint8Array,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': uint8Array.length.toString(),
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload falhou: ${uploadResponse.statusText}`);
    }

    // Retornar URL pública do arquivo
    const newUrl = `https://objectstorage.replit.com/${bucketId}${objectPath}`;
    console.log(`✅ Migrada imagem: ${imageUrl.substring(0, 50)}... → ${newUrl}`);
    return newUrl;
    
  } catch (error) {
    console.error(`❌ Erro ao migrar imagem ${imageUrl}:`, error);
    throw error;
  }
}

// Função para migrar todas as imagens de um ponto turístico
export async function migrateTouristSpotImages(spot: TouristSpot): Promise<TouristSpot> {
  console.log(`🔄 Migrando imagens do ponto: ${spot.name_pt}`);
  
  const migratedSpot = { ...spot };
  let changesMade = false;

  try {
    // Migrar imagem de capa
    if (migratedSpot.coverImage && isGoogleDriveUrl(migratedSpot.coverImage)) {
      try {
        migratedSpot.coverImage = await migrateImageFromUrl(migratedSpot.coverImage, `cover-${spot.id}.jpg`);
        changesMade = true;
      } catch (error) {
        console.error(`❌ Erro ao migrar imagem de capa:`, error);
      }
    }

    // Migrar imagens da galeria
    if (migratedSpot.imageGallery && Array.isArray(migratedSpot.imageGallery)) {
      const newGallery = [];
      for (let i = 0; i < migratedSpot.imageGallery.length; i++) {
        const imageUrl = migratedSpot.imageGallery[i];
        if (typeof imageUrl === 'string' && isGoogleDriveUrl(imageUrl)) {
          try {
            const newUrl = await migrateImageFromUrl(imageUrl, `gallery-${spot.id}-${i}.jpg`);
            newGallery.push(newUrl);
            changesMade = true;
          } catch (error) {
            console.error(`❌ Erro ao migrar imagem da galeria ${i}:`, error);
            newGallery.push(imageUrl); // Manter URL original em caso de erro
          }
        } else {
          newGallery.push(imageUrl);
        }
      }
      migratedSpot.imageGallery = newGallery;
    }

    // Migrar array de imagens (legacy)
    if (migratedSpot.images && Array.isArray(migratedSpot.images)) {
      const newImages = [];
      for (let i = 0; i < migratedSpot.images.length; i++) {
        const imageUrl = migratedSpot.images[i];
        if (typeof imageUrl === 'string' && isGoogleDriveUrl(imageUrl)) {
          try {
            const newUrl = await migrateImageFromUrl(imageUrl, `image-${spot.id}-${i}.jpg`);
            newImages.push(newUrl);
            changesMade = true;
          } catch (error) {
            console.error(`❌ Erro ao migrar imagem ${i}:`, error);
            newImages.push(imageUrl); // Manter URL original em caso de erro
          }
        } else {
          newImages.push(imageUrl);
        }
      }
      migratedSpot.images = newImages;
    }

    if (changesMade) {
      console.log(`✅ Migração concluída para: ${spot.name_pt}`);
    } else {
      console.log(`ℹ️ Nenhuma migração necessária para: ${spot.name_pt}`);
    }

    return migratedSpot;
    
  } catch (error) {
    console.error(`❌ Erro geral na migração do ponto ${spot.name_pt}:`, error);
    return spot; // Retornar ponto original em caso de erro
  }
}

// Função para migrar todos os pontos turísticos
export async function migrateAllTouristSpots(): Promise<{success: number, failed: number, total: number}> {
  console.log('🚀 Iniciando migração de todas as imagens do Google Drive para Object Storage...');
  
  const spots = await storage.getAllTouristSpots();
  const results = { success: 0, failed: 0, total: spots.length };

  for (const spot of spots) {
    try {
      const migratedSpot = await migrateTouristSpotImages(spot);
      
      // Salvar alterações no storage
      const { id, createdAt, updatedAt, ...updateData } = migratedSpot;
      await storage.updateTouristSpot(spot.id, updateData);
      results.success++;
      
      // Aguardar um pouco entre migrações para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Falha ao migrar ponto ${spot.name_pt}:`, error);
      results.failed++;
    }
  }

  console.log(`📊 Migração concluída: ${results.success} sucessos, ${results.failed} falhas, ${results.total} total`);
  return results;
}

// Função para verificar quantas imagens precisam ser migradas
export async function checkMigrationNeeds(): Promise<{needsMigration: number, total: number, details: Array<{id: string, name: string, googleDriveUrls: string[]}>}> {
  const spots = await storage.getAllTouristSpots();
  const result = {
    needsMigration: 0,
    total: spots.length,
    details: [] as Array<{id: string, name: string, googleDriveUrls: string[]}>
  };

  for (const spot of spots) {
    const googleDriveUrls: string[] = [];
    
    // Verificar imagem de capa
    if (spot.coverImage && isGoogleDriveUrl(spot.coverImage)) {
      googleDriveUrls.push(spot.coverImage);
    }
    
    // Verificar galeria
    if (spot.imageGallery && Array.isArray(spot.imageGallery)) {
      spot.imageGallery.forEach((url) => {
        if (typeof url === 'string' && isGoogleDriveUrl(url)) {
          googleDriveUrls.push(url);
        }
      });
    }
    
    // Verificar array de imagens (legacy)
    if (spot.images && Array.isArray(spot.images)) {
      spot.images.forEach((url) => {
        if (typeof url === 'string' && isGoogleDriveUrl(url)) {
          googleDriveUrls.push(url);
        }
      });
    }
    
    if (googleDriveUrls.length > 0) {
      result.needsMigration++;
      result.details.push({
        id: spot.id,
        name: spot.name_pt,
        googleDriveUrls
      });
    }
  }

  return result;
}