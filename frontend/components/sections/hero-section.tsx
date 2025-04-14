import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Through The Art.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Descubra uma jornada na arte abstrata. Crie, gerencie e
                compartilhe obras únicas geradas automaticamente com base em
                seus parâmetros.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/create">
                <Button
                  size="lg"
                  className="
                    relative 
                    overflow-hidden 
                    bg-primary
                    before:absolute 
                    before:inset-0 
                    before:bg-gradient-to-r 
                    before:from-blue-400
                    before:via-green-400
                    before:to-lime-600
                    before:opacity-0 
                    hover:before:opacity-100 
                    before:transition-opacity 
                    before:duration-500
                    z-10
                  "
                >
                  <span className="relative z-20">Comece a Criar</span>
                </Button>
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-lime-600 opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-4xl font-medium text-white">
                  Abstrax
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
