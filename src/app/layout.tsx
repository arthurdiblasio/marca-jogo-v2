import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";

import "@/styles/globals.css";

import { GoogleProvider } from "@/providers/google-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Chama Time",
  description:
    "Fundação visual para aplicativo de futebol amador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body
        className={`${manrope.className} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleProvider>
            {children}

            <Toaster
              richColors
              position="top-right"
            />
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}