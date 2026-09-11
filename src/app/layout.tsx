import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PresentationModeProvider } from "@/contexts/PresentationModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BRAND } from "@/lib/brand";
import "./globals.css";
import "./landing.css";

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
  metadataBase: new URL("https://rr-aliados-mega-dashboard.vercel.app"),
  title: "RR ALIADOS — Mega Dashboard",
  description:
    "Centro de comando centralizado. Con las manos en el fuego. Reportes IA, skills y apps corporativas.",
  // Favicon e iconos servidos desde la base de datos (Supabase Storage).
  icons: {
    icon: [
      { url: BRAND.favicon, sizes: "any" },
      { url: BRAND.favicon192, type: "image/png", sizes: "192x192" },
      { url: BRAND.favicon512, type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: BRAND.appleTouch, sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "RR ALIADOS — Growth Partner",
    description:
      "Estrategia, arquitectura y ejecución con las manos en el fuego.",
    url: "/",
    siteName: "RR ALIADOS",
    locale: "es_CO",
    type: "website",
    images: [{ url: BRAND.ogImage, width: 1200, height: 630, alt: "RR ALIADOS" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [BRAND.ogImage],
  },
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
