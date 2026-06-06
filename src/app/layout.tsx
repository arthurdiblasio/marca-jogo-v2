import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import "@/styles/globals.css";
import { GoogleProvider } from "@/providers/google-provider";
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Marca Jogo",
  description: "Fundacao visual para aplicativo de futebol amador"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`}>
        <GoogleProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-right" />
        </GoogleProvider>
      </body>
    </html>
  );
}
