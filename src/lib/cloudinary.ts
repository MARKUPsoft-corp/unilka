import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary avec fallbacks sécurisés
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || (import.meta.env && import.meta.env.CLOUDINARY_CLOUD_NAME) || 'dacfzjszd',
  api_key: process.env.CLOUDINARY_API_KEY || (import.meta.env && import.meta.env.CLOUDINARY_API_KEY) || '826596618712481',
  api_secret: process.env.CLOUDINARY_API_SECRET || (import.meta.env && import.meta.env.CLOUDINARY_API_SECRET) || '7Dil9Y6QSYkY5_ak8RqsAFI0ebU',
  secure: true
});

export interface UploadedPhotoResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  originalName?: string;
}

/**
 * Téléverse une image (Base64 ou URL) vers Cloudinary
 * Optimise automatiquement le format (WebP/AVIF auto) et limite la résolution
 */
export async function uploadPhoto(
  base64OrUrl: string,
  folder: string = 'unilka/soumissions',
  originalName?: string
): Promise<UploadedPhotoResult> {
  try {
    const result = await cloudinary.uploader.upload(base64OrUrl, {
      folder,
      resource_type: 'image',
      transformation: [
        { max_width: 1920, max_height: 1920, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      tags: ['unilka', 'soumission']
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      originalName: originalName || ''
    };
  } catch (error: any) {
    console.error('[Cloudinary Error] Échec du téléversement :', error?.message || error);
    throw error;
  }
}

export { cloudinary };
export default uploadPhoto;
