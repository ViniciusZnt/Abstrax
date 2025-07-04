import { MainNav } from "@/components/navigation/main-nav";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedArts } from "@/components/sections/featured-arts";
import { Footer } from "@/components/layout/footer";
import { AuthActions } from "@/components/layout/auth-actions";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <MainNav />
          <AuthActions />
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturedArts />
      </main>
      <Footer />
    </div>
  );
}
