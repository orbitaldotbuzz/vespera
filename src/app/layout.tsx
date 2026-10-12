import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "VÉSPERA — streetwear autoral · drop NOITE 01",
  description:
    "Roupas de autor feitas em São Paulo. Camisetas, moletons e bonés em drops limitados — quando esgota, fica para a história.",
  keywords: ["streetwear", "moda autoral", "drop", "camisetas", "bonés", "moletons", "Brasil"],
  authors: [{ name: "VÉSPERA" }],
  icons: {
    icon: "/favicon-vespera.svg",
  },
  openGraph: {
    title: "VÉSPERA — streetwear autoral",
    description: "Drops limitados de roupas de autor feitas em São Paulo.",
    siteName: "VÉSPERA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <body
        className={`${anton.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
