"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserHeader } from "@/components/layout/user-header";

// TODO: Substituir por dados da API quando o backend estiver pronto
const publicArts = [
  {
    id: "1",
    title: "Harmonia Tranquila",
    description: "A harmonia tranquila da água, luz e vegetação exuberante.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "João Silva",
    createdAt: "2023-05-15",
    likes: 24,
  },
  {
    id: "2",
    title: "Celebração do Infinito",
    description: "Uma celebração do infinito e da beleza natural.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Maria Oliveira",
    createdAt: "2023-06-22",
    likes: 18,
  },
  {
    id: "3",
    title: "Paisagem Onírica",
    description: "Uma paisagem onírica que transcende a realidade.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Carlos Mendes",
    createdAt: "2023-07-10",
    likes: 32,
  },
  {
    id: "4",
    title: "Abstração Geométrica",
    description: "Formas geométricas em harmonia com cores vibrantes.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Ana Santos",
    createdAt: "2023-08-05",
    likes: 15,
  },
  {
    id: "5",
    title: "Fluidez Cósmica",
    description: "A fluidez do cosmos em uma explosão de cores.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Pedro Costa",
    createdAt: "2023-09-18",
    likes: 27,
  },
  {
    id: "6",
    title: "Sinfonia de Cores",
    description: "Uma sinfonia visual de cores e formas abstratas.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    creator: "Luísa Ferreira",
    createdAt: "2023-10-02",
    likes: 21,
  },
];

export default function GalleryPage() {
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Galeria de Arte
          </h1>
          <p className="text-muted-foreground">
            Explore obras de arte criadas pela comunidade
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                          {art.likes}
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
