import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatAssistant } from "@/components/ChatAssistant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BI-VAC | Bio-Intelligence Vaccine Early-Warning Center",
  description: "Advanced AI-driven genomic surveillance and vaccine evasion monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
        <ChatAssistant />
      </body>
    </html>
  );
}
