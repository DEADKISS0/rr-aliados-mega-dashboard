import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PresentationModeProvider } from "@/contexts/PresentationModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "RR ALIADOS — Mega Dashboard",
  description:
    "Centro de comando centralizado. Con las manos en el fuego. Reportes IA, skills y apps corporativas.",
  icons: { icon: "/brand/favicon.svg" },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${ibmPlexMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <PresentationModeProvider>
            <AuthProvider>{children}</AuthProvider>
          </PresentationModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
