"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserHeader } from "@/components/layout/user-header";
import { AuthImage } from "@/components/AuthImage";
import { LockOpenIcon } from "@/components/icons/lock-icon";
import { api } from "@/services/api";

interface Art {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
  };
}

export default function GalleryPage() {
  const [arts, setArts] = useState<Art[]>([]);
  const [filteredArts, setFilteredArts] = useState<Art[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicArts = async () => {
      try {
        setLoading(true);
        const publicArts = await api.arts.getPublicArts();
        setArts(publicArts);
        setFilteredArts(publicArts);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar artes públicas");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicArts();
  }, []);

  useEffect(() => {
    // Filtrar artes com base no termo de pesquisa
    const filtered = arts.filter(
      (art) =>
        art.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (art.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        art.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar artes com base na aba ativa
    const sorted = [...filtered].sort((a, b) => {
      if (activeTab === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (activeTab === "popular") {
        // Por enquanto, usar criação mais recente como popularidade
        // Você pode adicionar um campo de likes/views futuramente
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    setFilteredArts(sorted);
  }, [arts, searchTerm, activeTab]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <div className="container py-6 px-4 md:px-6">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando artes públicas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <div className="container py-6 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="container py-6 px-4 md:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Galeria de Arte
          </h1>
          <p className="text-muted-foreground">
            Explore obras de arte criadas pela comunidade
          </p>
        </div>

        <div className="flex flex-col gap-6 md:gap-10">
          <div className="flex flex-row gap-4 items-center justify-between">
            <Input
              placeholder="Pesquisar por título, descrição ou criador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Tabs
              defaultValue="recent"
              className="w-[400px]"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Mais Recentes</TabsTrigger>
                <TabsTrigger value="popular">Mais Populares</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredArts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Nenhuma arte encontrada" : "Nenhuma arte pública disponível"}
              </p>
              <Link href="/create">
                <Button>Contribuir com Arte</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArts.map((art) => (
                <Card key={art.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="w-full h-[200px] relative">
                      <AuthImage
                        src={art.imageUrl || "/placeholder.svg"}
                        alt={art.name}
                        width={400}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{art.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {art.description || "Sem descrição"}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Por: {art.creator.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <LockOpenIcon
                            className="h-4 w-4 text-green-500"
                            aria-label="arte pública"
                          />
                          <span className="text-green-500">Pública</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/art/${art.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
