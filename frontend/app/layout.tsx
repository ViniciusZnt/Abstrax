//Estrutura raiz do app
//Providers (tema, autenticação)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abstrax - Gerador de Arte Abstrata",
  description:
    "Crie, gerencie e compartilhe obras de arte abstrata geradas automaticamente",
  generator: "Vinicius Zanatta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="abstrax-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
