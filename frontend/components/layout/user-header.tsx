import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/navigation/main-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { userData } from "@/data/user-data";
import Link from "next/link";
import { AuthActions } from "./auth-actions";

export function UserHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <MainNav />
        <div className="flex items-center gap-4">
        <AuthActions />
        </div>
      </div>
    </header>
  );
}
