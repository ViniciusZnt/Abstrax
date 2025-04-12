"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardNav } from "@/components/navigation/dashboard-nav"
import { UserHeader } from "@/components/layout/user-header"

// TODO: Substituir por dados da API quando o backend estiver pronto
const userArts = [
  {
    id: "1",
    title: "Harmonia Tranquila",
    description: "A harmonia tranquila da água, luz e vegetação exuberante.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: "2023-05-15",
    isPublic: true,
  },
  {
    id: "2",
    title: "Celebração do Infinito",
    description: "Uma celebração do infinito e da beleza natural.",
    imageUrl: "/placeholder.svg?height=300&width=400",
    createdAt: "2023-06-22",
    isPublic: false,
  },
]

const userAlbums = [
  {
    id: "1",
    title: "Coleção de Verão",
    description: "Artes inspiradas no verão",
    imageUrl: "/placeholder.svg?height=300&width=400",
    artCount: 5,
  },
  {
    id: "2",
    title: "Abstrações Geométricas",
    description: "Explorando formas e padrões geométricos",
    imageUrl: "/placeholder.svg?height=300&width=400",
    artCount: 3,
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("arts")

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] px-4 py-6 md:px-6">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav activeItem="dashboard" />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <Link href="/create">
              <Button>Criar Nova Arte</Button>
            </Link>
          </div>
          <Tabs defaultValue="arts" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="arts">Minhas Artes</TabsTrigger>
              <TabsTrigger value="albums">Meus Álbuns</TabsTrigger>
            </TabsList>
            <TabsContent value="arts" className="space-y-4">
              {userArts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma arte</p>
                  <Link href="/create">
                    <Button>Criar Primeira Arte</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {userArts.map((art) => (
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
                          <p className="text-sm text-muted-foreground">{art.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Criado em: {art.createdAt}</span>
                            <span className={`text-xs ${art.isPublic ? "text-green-600" : "text-amber-600"}`}>
                              {art.isPublic ? "Público" : "Privado"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Link href={`/art/${art.id}`}>
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/art/${art.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="albums" className="space-y-4">
              {userAlbums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">Você ainda não criou nenhum álbum</p>
                  <Link href="/albums/create">
                    <Button>Criar Primeiro Álbum</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {userAlbums.map((album) => (
                    <Card key={album.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Image
                          src={album.imageUrl || "/placeholder.svg"}
                          alt={album.title}
                          width={400}
                          height={300}
                          className="object-cover w-full h-[200px]"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-lg">{album.title}</h3>
                          <p className="text-sm text-muted-foreground">{album.description}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p>{album.artCount} obras</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Link href={`/albums/${album.id}`}>
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/albums/${album.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

