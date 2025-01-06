export const optimizeImage = async (file: File): Promise<File | null> => {
  try {
    // Only optimize if file is larger than 1MB
    if (file.size <= 1024 * 1024) return file;

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = URL.createObjectURL(file);
    });

    // Calculate new dimensions while maintaining aspect ratio
    let { width, height } = img;
    const maxDimension = 1920;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = (height / width) * maxDimension;
        width = maxDimension;
      } else {
        width = (width / height) * maxDimension;
        height = maxDimension;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(img, 0, 0, width, height);

    // Convert to blob with reduced quality
    const blob = await new Promise<Blob>((resolve) => 
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
    );

    return new File([blob], file.name, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error optimizing image:', error);
    return null;
  }
};