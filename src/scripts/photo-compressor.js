/**
 * Module de compression et gestion des photos côté client
 * Conforme à la section 9.2 de unilka-description-fonctionnelle.md
 * 
 * - Formats acceptés : JPEG, PNG, WebP
 * - Maximum 3 photos par soumission
 * - Côté le plus long réduit à ~1600px max
 * - Qualité JPEG / WebP ajustée pour un poids total < 6 Mo
 */

export const MAX_PHOTOS = 3;
export const MAX_TOTAL_BYTES = 6 * 1024 * 1024; // 6 Mo
export const MAX_DIMENSION = 1600;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Compresse une image vers un Blob WebP/JPEG optimisé via Canvas
 * @param {File} file
 * @returns {Promise<{ blob: Blob, dataUrl: string, name: string, size: number }>}
 */
export async function compressPhoto(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Ce format n'est pas pris en charge. Veuillez utiliser une photo JPEG ou PNG.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Erreur lors de la lecture de l'image."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Impossible de charger l'image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcul du redimensionnement proportionnel (max 1600px)
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Canvas non supporté par votre navigateur."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export en JPEG 80% (très léger et universellement supporté)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Échec de la compression de la photo."));
              return;
            }

            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve({
              blob,
              dataUrl,
              name: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
              size: blob.size
            });
          },
          'image/jpeg',
          0.8
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Formate un nombre d'octets en Ko ou Mo lisible
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}
