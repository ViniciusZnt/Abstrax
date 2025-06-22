import Link from "next/link";

export function MainNav() {
  return (
    <div className="flex items-center md:gap-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight">Abstrax</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <Link
          href="/gallery"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Galeria
        </Link>
        <Link
          href="/my-gallery"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Minha Galeria
        </Link>
        <Link
          href="/create"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Criar Arte
        </Link>
      </nav>
    </div>
  );
}
