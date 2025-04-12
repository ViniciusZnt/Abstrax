import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/navigation/main-nav"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedArts } from "@/components/sections/featured-arts"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <MainNav />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturedArts />
      </main>
      <Footer />
    </div>
  )
}

