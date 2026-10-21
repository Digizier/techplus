import { supabase } from './supabase';

/**
 * Compresses an image file in the browser, converts it to WebP format,
 * and uploads it directly to Supabase Storage.
 * Returns the clean, short public CDN URL (Zero Base64 in DB).
 */
export async function compressAndUploadImage(
  file: File,
  bucket: 'product-images' | 'banners' | 'site-assets' = 'product-images',
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Read the user's uploaded file as an Image
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = async () => {
        try {
          // 2. Calculate aspect-ratio preserved dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // 3. Render onto Canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Canvas context not available'));
          }

          // High-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // 4. Convert directly to WebP Blob (compressed into tens of KBs)
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                return reject(new Error('WebP compression failed'));
              }

              console.log(
                `Compressed ${file.name} (${Math.round(file.size / 1024)} KB) -> WebP (${Math.round(blob.size / 1024)} KB)`
              );

              // 5. Generate unique filename: timestamp_clean-name.webp
              const cleanName = file.name
                .toLowerCase()
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-z0-9_-]/g, '_');
              const fileName = `${Date.now()}_${cleanName}.webp`;

              // 6. Upload binary WebP Blob to Supabase Storage Bucket
              const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, blob, {
                  contentType: 'image/webp',
                  cacheControl: '31536000', // 1-year immutable edge cache
                  upsert: true,
                });

              if (uploadError) {
                console.error('Storage upload error:', uploadError);
                return reject(new Error(`Storage upload failed: ${uploadError.message}`));
              }

              // 7. Get public CDN URL
              const { data: publicUrlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

              resolve(publicUrlData.publicUrl);
            },
            'image/webp',
            quality
          );
        } catch (err: any) {
          reject(err);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
