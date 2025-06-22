"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthImage } from "@/components/AuthImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MainNav } from "@/components/navigation/main-nav";
import { AuthActions } from "@/components/layout/auth-actions";
import HeartIcon from "@/components/icons/heart-icon";
import { LockClosedIcon, LockOpenIcon } from "@/components/icons/lock-icon";
import { api } from "@/services/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;
  
  const [album, setAlbum] = useState<any>(null);
  const [arts, setArts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (albumId) {
      loadAlbumData();
    }
  }, [albumId]);

  const loadAlbumData = async () => {
    try {
      const [albumData, albumArts] = await Promise.all([
        api.albums.getById(albumId),
        api.albums.getArts(albumId)
      ]);
      setAlbum(albumData);
      setArts(albumArts);
    } catch (error) {
      toast.error("Erro ao carregar álbum");
      console.error(error);
      router.push("/my-gallery");
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar visibilidade da arte
  const handleToggleVisibility = async (artId: string) => {
    try {
      const updatedArt = await api.arts.toggleVisibility(artId);
      setArts(arts.map(art => art.id === artId ? updatedArt : art));
      toast.success("Visibilidade alterada com sucesso!");
    } catch (error) {
      toast.error("Erro ao alterar visibilidade da arte");
    }
  };

  // Deletar arte
  const handleDeleteArt = async (artId: string) => {
    try {
      await api.arts.delete(artId);
      setArts(arts.filter(art => art.id !== artId));
      toast.success("Arte deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar arte");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <MainNav />
            <AuthActions />
          </div>
        </header>
        <div className="container py-6 px-4 md:px-6">
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-muted-foreground">Carregando álbum...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <MainNav />
            <AuthActions />
          </div>
        </header>
        <div className="container py-6 px-4 md:px-6">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Álbum não encontrado</p>
              <Link href="/my-gallery">
                <Button>Voltar para Galeria</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <MainNav />
          <AuthActions />
        </div>
      </header>
      <div className="container py-6 px-4 md:px-6">
        {/* Cabeçalho do álbum */}
        <div className="mb-8">
          <Link href="/my-gallery" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Minha Galeria
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{album.title}</h1>
            {album.description && (
              <p className="text-lg text-muted-foreground">{album.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{arts.length} arte(s)</span>
              <span>Criado em {new Date(album.createdAt).toLocaleDateString()}</span>
              <span>por {album.creator.name}</span>
            </div>
          </div>
        </div>

        {/* Lista de artes */}
        {arts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Este álbum ainda não tem nenhuma arte
            </p>
            <Link href="/my-gallery">
              <Button>Ir para Minhas Artes</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {arts.map((art) => (
              <Card key={art.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <AuthImage
                      src={art.imageUrl}
                      alt={art.name}
                      width={400}
                      height={300}
                      className="object-cover w-full h-[200px]"
                    />
                    <button
                      onClick={() => handleToggleVisibility(art.id)}
                      className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background/90 transition-colors"
                      title={art.isPublic ? "Tornar privada" : "Tornar pública"}
                    >
                      {art.isPublic ? (
                        <LockOpenIcon className="h-4 w-4" />
                      ) : (
                        <LockClosedIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{art.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {art.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(art.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <HeartIcon className="h-4 w-4 text-red-500" />
                        <span>{art.likes || 0}</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link href={`/art/${art.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Arte</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar esta arte? Esta ação não
                          pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteArt(art.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 