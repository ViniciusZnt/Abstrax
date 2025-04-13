import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginRegister() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Button variant="ghost">Entrar</Button>
      </Link>
      <Link href="/register">
        <Button>Cadastrar</Button>
      </Link>
    </div>
  );
}
