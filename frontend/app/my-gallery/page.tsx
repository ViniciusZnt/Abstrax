"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthImage } from "@/components/AuthImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyGalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [arts, setArts] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para criar álbum
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [newAlbumData, setNewAlbumData] = useState({
    title: "",
    description: "",
  });

  // Estados para mover arte
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [selectedArtId, setSelectedArtId] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState("");

  // Carregar dados do usuário
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userArts, userAlbums] = await Promise.all([
        api.arts.getMyArts(),
        api.albums.getMyAlbums()
      ]);
      setArts(userArts);
      setAlbums(userAlbums);
    } catch (error) {
      toast.error("Erro ao carregar dados");
      console.error(error);
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

  // Criar álbum
  const handleCreateAlbum = async () => {
    if (!newAlbumData.title.trim()) {
      toast.error("Título do álbum é obrigatório");
      return;
    }

    try {
      const newAlbum = await api.albums.create(newAlbumData);
      setAlbums([...albums, newAlbum]);
      setNewAlbumData({ title: "", description: "" });
      setIsCreatingAlbum(false);
      toast.success("Álbum criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar álbum");
    }
  };

  // Deletar álbum
  const handleDeleteAlbum = async (albumId: string) => {
    try {
      await api.albums.delete(albumId);
      setAlbums(albums.filter(album => album.id !== albumId));
      // Recarregar artes para atualizar as que estavam no álbum
      const userArts = await api.arts.getMyArts();
      setArts(userArts);
      toast.success("Álbum deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar álbum");
    }
  };

  // Mover arte para álbum
  const handleMoveArt = async () => {
    if (!selectedArtId) return;

    try {
      const albumId = selectedAlbumId === "no-album" ? null : selectedAlbumId;
      const updatedArt = await api.albums.moveArt(
        selectedArtId, 
        albumId
      );
      setArts(arts.map(art => art.id === selectedArtId ? updatedArt : art));
      setIsMoveDialogOpen(false);
      setSelectedArtId("");
      setSelectedAlbumId("");
      toast.success("Arte movida com sucesso!");
    } catch (error) {
      toast.error("Erro ao mover arte");
    }
  };

  // Filtrar artes
  const filteredArts = arts.filter(
    (art) =>
      art.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar álbuns
  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <p className="text-muted-foreground">Carregando...</p>
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
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Minha Galeria
          </h1>
          <p className="text-muted-foreground">Gerencie suas artes e álbuns</p>
        </div>

        <Tabs defaultValue="arts" className="w-full">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <TabsList className="grid w-full md:w-[200px] grid-cols-2">
              <TabsTrigger value="arts">Artes</TabsTrigger>
              <TabsTrigger value="albums">Álbuns</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="arts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Minhas Artes ({filteredArts.length})
              </h2>
              <Link href="/create">
                <Button>Nova Arte</Button>
              </Link>
            </div>

            {filteredArts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem nenhuma arte
                </p>
                <Link href="/create">
                  <Button>Criar Primeira Arte</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArts.map((art) => (
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
                        {art.albumId && (
                          <p className="text-xs text-blue-600 mt-1">
                            Em álbum: {albums.find(a => a.id === art.albumId)?.title || "..."}
                          </p>
                        )}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedArtId(art.id);
                          setSelectedAlbumId(art.albumId || "no-album");
                          setIsMoveDialogOpen(true);
                        }}
                      >
                        Mover
                      </Button>
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
          </TabsContent>

          <TabsContent value="albums" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Meus Álbuns ({filteredAlbums.length})
              </h2>
              <Dialog open={isCreatingAlbum} onOpenChange={setIsCreatingAlbum}>
                <DialogTrigger asChild>
                  <Button>Novo Álbum</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Álbum</DialogTitle>
                    <DialogDescription>
                      Crie um álbum para organizar suas artes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newAlbumData.title}
                        onChange={(e) => setNewAlbumData({
                          ...newAlbumData,
                          title: e.target.value
                        })}
                        placeholder="Nome do álbum"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição (opcional)</Label>
                      <Textarea
                        id="description"
                        value={newAlbumData.description}
                        onChange={(e) => setNewAlbumData({
                          ...newAlbumData,
                          description: e.target.value
                        })}
                        placeholder="Descrição do álbum"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingAlbum(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateAlbum}>
                      Criar Álbum
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {filteredAlbums.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem nenhum álbum
                </p>
                <Button onClick={() => setIsCreatingAlbum(true)}>
                  Criar Primeiro Álbum
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAlbums.map((album) => (
                  <Card key={album.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg">{album.title}</CardTitle>
                      {album.description && (
                        <p className="text-sm text-muted-foreground">
                          {album.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {album._count?.arts || 0} arte(s)
                        </span>
                        <span>
                          {new Date(album.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Link href={`/album/${album.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Ver Álbum
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
                            <AlertDialogTitle>Deletar Álbum</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja deletar este álbum? As artes não serão deletadas, apenas removidas do álbum.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAlbum(album.id)}
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
          </TabsContent>
        </Tabs>

        {/* Dialog para mover arte */}
        <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mover Arte</DialogTitle>
              <DialogDescription>
                Escolha um álbum para mover a arte ou deixe em branco para removê-la de qualquer álbum
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="album-select">Álbum de destino</Label>
                <Select value={selectedAlbumId} onValueChange={setSelectedAlbumId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um álbum ou deixe vazio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-album">Sem álbum</SelectItem>
                    {albums.map((album) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleMoveArt}>
                Mover Arte
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
