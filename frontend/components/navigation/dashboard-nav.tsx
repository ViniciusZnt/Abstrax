import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PaintBucket, FolderOpen, User, LogOut } from "lucide-react"

interface DashboardNavProps {
  activeItem?: string
}

export function DashboardNav({ activeItem }: DashboardNavProps) {
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      id: "dashboard",
    },
    {
      title: "Minhas Artes",
      href: "/dashboard/arts",
      icon: <PaintBucket className="h-4 w-4" />,
      id: "arts",
    },
    {
      title: "Meus Álbuns",
      href: "/dashboard/albums",
      icon: <FolderOpen className="h-4 w-4" />,
      id: "albums",
    },
    {
      title: "Meu Perfil",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
      id: "profile",
    },
  ]

  return (
    <nav className="grid gap-2">
      {navItems.map((item) => (
        <Link key={item.id} href={item.href}>
          <Button variant={activeItem === item.id ? "secondary" : "ghost"} className="w-full justify-start">
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
        </Link>
      ))}
      <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
        <LogOut className="h-4 w-4" />
        <span className="ml-2">Sair</span>
      </Button>
    </nav>
  )
}

