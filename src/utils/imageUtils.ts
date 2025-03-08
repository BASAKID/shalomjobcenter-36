import { FALLBACK_IMAGES } from '@/constants/images';
import { compressImage, cleanupImageUrls } from '@/hooks/upload';

// Images de secours alternatives (des images stables d'Unsplash)
const UNSPLASH_FALLBACKS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", 
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800"
];

/**
 * BUGFIX: Cette fonction préservera maintenant TOUTES les URLs d'images telles quelles
 * et n'utilisera une image de secours qu'en cas d'URL complètement vide
 */
export const getValidImageUrl = (imageUrl: string, index: number = 0): string => {
  // Retourner l'URL telle quelle dans presque tous les cas
  if (imageUrl && imageUrl !== 'undefined' && imageUrl !== 'null') {
    console.log(`URL d'image préservée: ${imageUrl}`);
    return imageUrl;
  }
  
  // Ne remplacer que si l'URL est complètement vide ou invalide
  console.log(`URL d'image vide ou invalide, utilisation de secours à l'index ${index}`);
  return UNSPLASH_FALLBACKS[index % UNSPLASH_FALLBACKS.length];
};

/**
 * Normalise un tableau d'images en préservant STRICTEMENT les URLs fournies
 */
export const normalizeImages = (images: string[] | undefined): string[] => {
  if (!images || images.length === 0) {
    console.log("Aucune image fournie, utilisation d'une image par défaut");
    return [getRandomFallbackImage()];
  }
  
  // Log pour le débogage
  console.log(`Préservation stricte des ${images.length} images sans aucune modification`);
  
  // CRITIQUE: Retourner exactement les mêmes images sans aucune modification
  return [...images];
};

// Re-export the image utility functions from the new location
export { compressImage, cleanupImageUrls };

/**
 * Obtenir une image d'avatar valide pour les propriétaires
 */
export const getHostAvatar = (avatarUrl: string | undefined): string => {
  if (!avatarUrl) {
    return "/placeholder.svg";
  }
  
  // Préserver les URLs blob et HTTP
  return avatarUrl;
};

/**
 * Obtenir une image de secours aléatoire
 */
export const getRandomFallbackImage = (): string => {
  return UNSPLASH_FALLBACKS[Math.floor(Math.random() * UNSPLASH_FALLBACKS.length)];
};

/**
 * Vérifier si une image est valide via une promesse
 */
export const isImageValid = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    // Les URLs blob sont considérées comme valides
    if (url.startsWith('blob:')) {
      resolve(true);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Récupérer la première image valide d'un tableau
 */
export const getFirstValidImage = async (images: string[]): Promise<string> => {
  if (!images || images.length === 0) {
    return getRandomFallbackImage();
  }
  
  for (const img of images) {
    const isValid = await isImageValid(img);
    if (isValid) return img;
  }
  
  return getRandomFallbackImage();
};
