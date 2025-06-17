"use client";

import { useEffect, useState } from "react";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { LoginRegister } from "@/components/layout/login-register";

export function AuthActions() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  if (isLogged === null) return null; // evita piscar

  return isLogged ? <ProfileMenu /> : <LoginRegister />;
} 