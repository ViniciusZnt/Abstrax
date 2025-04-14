"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserHeader } from "@/components/layout/user-header";
import HeartIcon from "@/components/icons/heart-icon";
import { LockClosedIcon, LockOpenIcon } from "@/components/icons/lock-icon";

const publicArts = [
  {
    id: "1",
    title: "Harmonia Tranquila",
    description: "A harmonia tranquila da água, luz e vegetação exuberante.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "João Silva",
    createdAt: "2023-05-15",
    likes: 24,
    isPublic: true,
  },
  {
    id: "2",
    title: "Celebração do Infinito",
    description: "Uma celebração do infinito e da beleza natural.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Maria Oliveira",
    createdAt: "2023-06-22",
    likes: 18,
    isPublic: true,
  },
  {
    id: "3",
    title: "Paisagem Onírica",
    description: "Uma paisagem onírica que transcende a realidade.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Carlos Mendes",
    createdAt: "2023-07-10",
    likes: 32,
    isPublic: false,
  },
  {
    id: "4",
    title: "Abstração Geométrica",
    description: "Formas geométricas em harmonia com cores vibrantes.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Ana Santos",
    createdAt: "2023-08-05",
    likes: 15,
    isPublic: false,
  },
  {
    id: "5",
    title: "Fluidez Cósmica",
    description: "A fluidez do cosmos em uma explosão de cores.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Pedro Costa",
    createdAt: "2023-09-18",
    likes: 27,
    isPublic: true,
  },
  {
    id: "6",
    title: "Sinfonia de Cores",
    description: "Uma sinfonia visual de cores e formas abstratas.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Luísa Ferreira",
    createdAt: "2023-10-02",
    likes: 21,
    isPublic: false,
  },
];

export default function MyGalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent");

  // Filtrar artes com base no termo de pesquisa
  const filteredArts = publicArts.filter(
    (art) =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) || //Pesquisa sobre Titula
      art.description.toLowerCase().includes(searchTerm.toLowerCase()) || //Pesquisa sobre Descrição
      art.creator.toLowerCase().includes(searchTerm.toLowerCase()) //Pesquisa sobre Criador
  );

  // Ordenar artes com base na aba ativa
  const sortedArts = [...filteredArts].sort((a, b) => {
    if (activeTab === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (activeTab === "popular") {
      return b.likes - a.likes;
    }
    return 0;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="container py-6 px-4 md:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Minha Galeria
          </h1>
          <p className="text-muted-foreground">Explore suas artes criadas</p>
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

          {sortedArts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhuma arte encontrada
              </p>
              <Link href="/create">
                <Button>Criar Arte</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedArts.map((art) => (
                <Card key={art.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src={art.imageUrl || "/placeholder.svg"}
                      alt={art.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-[200px]"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{art.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {art.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Por: {art.creator}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {art.isPublic ? (
                            <LockOpenIcon className="h-4 w-4" />
                          ) : (
                            <LockClosedIcon className="h-4 w-4" />
                          )}
                          <HeartIcon className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            {art.likes}
                          </span>
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
