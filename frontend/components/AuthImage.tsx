'use client';

import { useState, useEffect, useRef } from 'react';
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
  // Guarda a blob URL atual para revogar só quando `src` mudar de fato
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // `imageSrc` foi removido das dependências — o effect só roda quando `src` muda
    if (!src || !src.startsWith('/')) {
      setImageSrc(src || '/placeholder-art.svg');
      return;
    }

    const token = localStorage.getItem('token');
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${src}`;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    let cancelled = false;

    fetch(fullUrl, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar imagem');
        return res.blob();
      })
      .then(blob => {
        if (cancelled) return;

        // Revoga o blob anterior antes de criar o novo
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }

        const objectUrl = URL.createObjectURL(blob);
        blobUrlRef.current = objectUrl;
        setImageSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setImageSrc('/placeholder-art.svg');
      });

    return () => {
      // Cancela o fetch em andamento se o componente desmontar ou `src` mudar
      cancelled = true;
    };
  }, [src]); // <- só `src` aqui, nunca `imageSrc`

  // Revoga o blob quando o componente desmontar de vez
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

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
