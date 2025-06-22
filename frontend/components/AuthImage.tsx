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
    // Se a src não começa com '/', é uma URL externa ou placeholder
    if (!src.startsWith('/')) {
      setImageSrc(src);
      return;
    }

    const token = localStorage.getItem('token');
    
    // Se não tem token (usuário não logado), tenta buscar diretamente
    if (!token) {
      const directUrl = `${process.env.NEXT_PUBLIC_API_URL}${src}`;
      
      // Tenta carregar a imagem diretamente (para artes públicas)
      fetch(directUrl)
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error('Imagem não acessível publicamente');
        })
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob);
          setImageSrc(objectUrl);
        })
        .catch(() => {
          setImageSrc('/placeholder-art.svg');
        });
      
      return;
    }

    // Se tem token (usuário logado), usa autenticação
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${src}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Erro ao carregar imagem autenticada');
      })
      .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      })
      .catch(() => {
        // Se falhar com token, tenta sem autenticação (fallback para artes públicas)
        const directUrl = `${process.env.NEXT_PUBLIC_API_URL}${src}`;
        
        fetch(directUrl)
          .then(response => {
            if (response.ok) {
              return response.blob();
            }
            throw new Error('Imagem não encontrada');
          })
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            setImageSrc(objectUrl);
          })
          .catch(() => {
            setImageSrc('/placeholder-art.svg');
          });
      });

    // Cleanup function para URLs de blob
    return () => {
      if (imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src, imageSrc]);

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
