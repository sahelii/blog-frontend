/**
 * Converts image buffer data to a displayable image source
 * @param {Object|String} imageData - Image buffer object or URL string
 * @param {String} imageType - MIME type (e.g., 'image/jpeg', 'image/png')
 * @returns {String|null} - Data URL or image URL, or null if invalid
 */
export const imageFromBuffer = (imageData, imageType) => {
  if (!imageData) return null;
  
  // If it's already a URL string (from Cloudinary or external source)
  if (typeof imageData === 'string' && imageData.startsWith('http')) {
    return imageData;
  }
  
  // If it's already a base64 data URL
  if (typeof imageData === 'string' && imageData.startsWith('data:')) {
    return imageData;
  }
  
  // If it's a buffer object with data array (old format from MongoDB)
  if (imageData && typeof imageData === 'object') {
    if (imageData.data && Array.isArray(imageData.data)) {
      try {
        // Convert array buffer to base64
        const uint8Array = new Uint8Array(imageData.data);
        const binaryString = String.fromCharCode.apply(null, uint8Array);
        const base64 = btoa(binaryString);
        return `data:${imageType || 'image/jpeg'};base64,${base64}`;
      } catch (error) {
        console.error('Error converting image buffer:', error);
        return null;
      }
    }
    
    // If it's a Buffer object (Node.js Buffer)
    if (imageData.type === 'Buffer' && Array.isArray(imageData.data)) {
      try {
        const uint8Array = new Uint8Array(imageData.data);
        const binaryString = String.fromCharCode.apply(null, uint8Array);
        const base64 = btoa(binaryString);
        return `data:${imageType || 'image/jpeg'};base64,${base64}`;
      } catch (error) {
        console.error('Error converting Buffer:', error);
        return null;
      }
    }
  }
  
  return null;
};
