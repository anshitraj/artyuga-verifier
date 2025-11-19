// app/page.tsx
"use client";

import Link from "next/link";
import { WalletStatus } from "@/components/WalletStatus";
import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  const demoMockUrl =
    "https://artyuga-demo.xyz/verify/mock?shopId=1&artId=3";
  const demoOnchainUrl =
    "https://artyuga.app/verify/onchain?chain=base&contract=0x9e389a61F96CAa8204dcA1A7E66a01d9493D49bC&tokenId=1";

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo size="md" showText={true} />
          <div>
            <h1 className="text-xl font-semibold text-slate-50">
              Verifier
            </h1>
            <p className="text-xs text-slate-400">
              Scan QR or NFC to verify artwork authenticity on Base.
            </p>
          </div>
        </div>
        <WalletStatus />
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-purple-500/40 bg-slate-950/80 p-5 shadow-lg shadow-purple-900/40">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            Scan a code
          </h2>
          <p className="mb-4 text-xs text-slate-400">
            Use your camera or NFC reader to scan a demo or real Artyug code.
          </p>
          <div className="space-y-3">
            <Link
              href="/scan?mode=mock"
              className="block w-full rounded-xl bg-purple-600 py-2 text-center text-sm font-medium text-white hover:bg-purple-500"
            >
              Scan Demo QR (Mock JSON)
            </Link>
            <Link
              href="/scan?mode=onchain"
              className="block w-full rounded-xl border border-purple-500/60 bg-slate-950 py-2 text-center text-sm font-medium text-purple-100 hover:bg-purple-900/40"
            >
              Scan Onchain QR (Base)
            </Link>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <h2 className="text-sm font-semibold text-slate-100">
            Example QR codes for your slide
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <QRCodeSVG value={demoMockUrl} className="h-28 w-28" />
              <p className="text-[10px] text-slate-400">
                Mock demo QR (reads JSON from your demo site)
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <QRCodeSVG value={demoOnchainUrl} className="h-28 w-28" />
              <p className="text-[10px] text-slate-400">
                Future real onchain QR (Base NFT)
              </p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">
            These will be scanned live during your pitch from the projector /
            slide deck.
          </p>
        </div>
      </section>

      <footer className="mt-auto pb-4 text-center text-[10px] text-slate-500">
        Powered by Artyug • Built for Base Mini Apps • NFC support coming soon
      </footer>
    </main>
  );
}

