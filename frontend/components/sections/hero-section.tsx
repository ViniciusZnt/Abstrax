import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Through The Art.</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Descubra uma jornada na arte abstrata. Crie, gerencie e compartilhe obras únicas geradas automaticamente
                com base em seus parâmetros.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/create">
                <Button size="lg">Comece a Criar</Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline">
                  Explorar Galeria
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] overflow-hidden rounded-lg border bg-background">
              {/* Placeholder para arte abstrata gerada */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-lg font-medium text-white">Arte abstrata gerada pelo Abstrax</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

