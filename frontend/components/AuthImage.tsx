import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AuthImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function AuthImage({ src, alt, width, height, className }: AuthImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('/placeholder-art.svg');

  useEffect(() => {
    if (!src.startsWith('/')) {
      setImageSrc(src);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}${src}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.blob())
      .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      })
      .catch(() => {
        setImageSrc('/placeholder-art.svg');
      });

    return () => {
      if (imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageSrc('/placeholder-art.svg')}
    />
  );
} 