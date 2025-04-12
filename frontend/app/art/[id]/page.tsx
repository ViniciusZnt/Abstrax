"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserHeader } from "@/components/user-header"
import { Heart, Share2, Download, MessageSquare } from "lucide-react"

// TODO: Substituir por dados da API quando o backend estiver pronto
const artDetails = {
  id: "1",
  title: "Harmonia Tranquila",
  description:
    "A harmonia tranquila da água, luz e vegetação exuberante. Esta obra explora a interação entre elementos naturais e a percepção humana, criando uma experiência visual que evoca tranquilidade e contemplação.",
  imageUrl: "/placeholder.svg?height=600&width=800",
  creator: {
    id: "user1",
    name: "João Silva",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  createdAt: "15 de maio de 2023",
  likes: 24,
  tags: ["abstrato", "natureza", "tranquilidade", "água", "luz"],
  dimensions: '28" x 36"',
  comments: [
    {
      id: "c1",
      user: {
        name: "Maria Oliveira",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      text: "Incrível como você conseguiu capturar essa sensação de tranquilidade. As cores são perfeitas!",
      createdAt: "18 de maio de 2023",
    },
    {
      id: "c2",
      user: {
        name: "Carlos Mendes",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      text: "A composição é fascinante. Adoro como os elementos se integram harmoniosamente.",
      createdAt: "20 de maio de 2023",
    },
  ],
}

export default function ArtDetailPage() {
  const params = useParams()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(artDetails.likes)
  const [comment, setComment] = useState("")

  // TODO: Buscar detalhes da arte do backend usando o ID
  // useEffect(() => {
  //   const fetchArtDetails = async () => {
  //     const response = await fetch(`/api/arts/${params.id}`)
  //     const data = await response.json()
  //     // Atualizar estado com os dados
  //   }
  //   fetchArtDetails()
  // }, [params.id])

  const handleLike = () => {
    // TODO: Integrar com o endpoint de like do backend
    // const response = await fetch(`/api/arts/${params.id}/like`, {
    //   method: 'POST',
    // })

    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const handleShare = () => {
    // TODO: Implementar funcionalidade de compartilhamento
    navigator.clipboard.writeText(window.location.href)
    alert("Link copiado para a área de transferência!")
  }

  const handleDownload = () => {
    // TODO: Implementar funcionalidade de download
    alert("Funcionalidade de download será implementada em breve!")
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) return

    // TODO: Integrar com o endpoint de comentário do backend
    // const response = await fetch(`/api/arts/${params.id}/comments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: comment }),
    // })

    alert("Comentário enviado com sucesso!")
    setComment("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="container py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link href="/gallery" className="text-primary hover:underline mb-4 inline-block">
            &larr; Voltar para a Galeria
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{artDetails.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={artDetails.creator.avatar} alt={artDetails.creator.name} />
              <AvatarFallback>{artDetails.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Por{" "}
              <Link href={`/user/${artDetails.creator.id}`} className="text-primary hover:underline">
                {artDetails.creator.name}
              </Link>{" "}
              • {artDetails.createdAt}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="relative flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={artDetails.imageUrl || "/placeholder.svg"}
                    alt={artDetails.title}
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
                  <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
                  <span>{likeCount}</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  <span>Compartilhar</span>
                </Button>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground">{artDetails.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {artDetails.tags.map((tag) => (
                  <Link key={tag} href={`/gallery?tag=${tag}`}>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

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

              <div className="space-y-4">
                {artDetails.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Detalhes</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Dimensões:</dt>
                    <dd className="text-muted-foreground">{artDetails.dimensions}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Data de criação:</dt>
                    <dd className="text-muted-foreground">{artDetails.createdAt}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Criador:</dt>
                    <dd className="text-primary hover:underline">
                      <Link href={`/user/${artDetails.creator.id}`}>{artDetails.creator.name}</Link>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-4">Mais do artista</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Link key={i} href={`/art/${i}`}>
                    <div className="relative aspect-square overflow-hidden rounded-md border">
                      <Image
                        src={`/placeholder.svg?height=150&width=150&text=Arte ${i}`}
                        alt={`Arte ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href={`/user/${artDetails.creator.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver todas as obras
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Obras relacionadas</h2>
              <div className="grid grid-cols-2 gap-4">
                {[5, 6, 7, 8].map((i) => (
                  <Link key={i} href={`/art/${i}`}>
                    <div className="relative aspect-square overflow-hidden rounded-md border">
                      <Image
                        src={`/placeholder.svg?height=150&width=150&text=Arte ${i}`}
                        alt={`Arte ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/gallery">
                  <Button variant="outline" className="w-full">
                    Explorar mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

