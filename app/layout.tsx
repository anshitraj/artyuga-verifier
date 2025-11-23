// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artyug Verifier",
  description: "Verify Artyug artworks on Base using QR or NFC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950 overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          <div className="min-h-[100vh] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50 overflow-x-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

