export const getOptimizedImageUrl = (url, width, quality = 80) => {
  if (!url) return '';
  // In production, this would append query params for an image CDN (e.g. Cloudinary or Imgix)
  // For local, we just return the URL or a mock format.
  
  if (url.includes('images.unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&fm=webp`;
  }
  
  return url; // Fallback
};
