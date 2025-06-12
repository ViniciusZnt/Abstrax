"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthImage } from "@/components/AuthImage";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserHeader } from "@/components/layout/user-header";
import { Heart, Share2, Download, MessageSquare } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function ArtDetailPage() {
  const params = useParams();
  const [art, setArt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadArt();
  }, [params.id]);

  const loadArt = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arts/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Arte não encontrada');
      }

      const artData = await response.json();
      setArt(artData);
      setLikeCount(artData.likes || 0);
    } catch (error) {
      toast.error('Erro ao carregar a arte');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado para a área de transferência!');
  };

  const handleDownload = () => {
    // TODO: Implementar download da imagem
    toast.info('Download será implementado em breve!');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio de comentário
    toast.info('Comentários serão implementados em breve!');
    setComment("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <div className="container py-6 px-4 md:px-6">
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!art) {
    return (
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <div className="container py-6 px-4 md:px-6">
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-muted-foreground">Arte não encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="container py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link
            href="/my-gallery"
            className="text-primary hover:underline mb-4 inline-block"
          >
            &larr; Voltar para a Galeria
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {art.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {art.creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Por{" "}
              <Link
                href={`/user/${art.creator.id}`}
                className="text-primary hover:underline"
              >
                {art.creator.name}
              </Link>{" "}
              • {new Date(art.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="relative flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                  <AuthImage
                    src={art.imageUrl}
                    alt={art.name}
                    width={800}
                    height={600}
                    className="object-contain max-h-[600px]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleLike}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={liked ? "currentColor" : "none"}
                  />
                  <span>{likeCount}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Compartilhar</span>
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground">{art.description}</p>
            </div>

            {art.tags && art.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {art.tags.map((tag: string) => (
                    <Link key={tag} href={`/gallery?tag=${tag}`}>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted">
                        #{tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {art.metadata && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Detalhes Técnicos</h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Tipo:</strong> {art.metadata.artType}
                  </p>
                  <p className="text-sm">
                    <strong>Parâmetros:</strong>
                  </p>
                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                    {JSON.stringify(art.metadata.parameters, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Comentários</h2>
              <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comentar
                </Button>
              </form>

              <div className="text-center text-muted-foreground">
                <p>Comentários serão implementados em breve!</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Mais do artista</h2>
              <div className="text-center text-muted-foreground">
                <p>Em breve você poderá ver mais obras deste artista!</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Obras relacionadas</h2>
              <div className="text-center text-muted-foreground">
                <p>Em breve você poderá ver obras relacionadas!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
