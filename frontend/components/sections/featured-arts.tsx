import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { featuredArtsData } from "@/data/featured-arts"

export function FeaturedArts() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Descubra Nossas Obras Exquisitas
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Que capturam a essência do mundo abstrato.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {featuredArtsData.map((art) => (
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
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Dimensão: {art.dimensions}</p>
                    <p>Criador: {art.creator}</p>
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
        <div className="flex justify-center">
          <Link href="/gallery">
            <Button size="lg" variant="outline">
              Explorar Galeria
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

