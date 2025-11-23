// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artyuga Verifier",
  description: "Scan QR or NFC to verify artwork authenticity on Base.",
  metadataBase: new URL("https://verify.artyug.art"),
  openGraph: {
    title: "Artyuga Verifier",
    description: "Scan QR or NFC to verify artwork authenticity on Base.",
    images: [
      {
        url: "https://verify.artyug.art/icon.png",
        width: 1024,
        height: 1024,
        alt: "Artyuga Verifier",
      },
    ],
    url: "https://verify.artyug.art",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artyuga Verifier",
    description: "Scan QR or NFC to verify artwork authenticity on Base.",
    images: ["https://verify.artyug.art/icon.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950 overflow-x-hidden">
      <head>
        {/* BASE MINI APP REQUIRED META */}
        <meta property="og:card" content="app" />
        
        {/* Force inject in hydration as well */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const meta = document.querySelector('meta[property="og:card"]');
                if (!meta) {
                  const m = document.createElement('meta');
                  m.setAttribute('property', 'og:card');
                  m.setAttribute('content', 'app');
                  document.head.appendChild(m);
                }
              })();
            `,
          }}
        />
      </head>
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

