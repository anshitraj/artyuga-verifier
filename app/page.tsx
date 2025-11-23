// app/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WalletStatus } from "@/components/WalletStatus";
import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/Logo";
import { sdk } from "@farcaster/miniapp-sdk";

export default function HomePage() {
  useEffect(() => {
    // Tell Base/Farcaster that the app is ready
    sdk.actions.ready();
  }, []);
  const demoMockUrl =
    "https://artyuga-demo.xyz/verify/mock?shopId=1&artId=3";
  const demoOnchainUrl =
    "https://artyuga.app/verify/onchain?chain=base&contract=0x9e389a61F96CAa8204dcA1A7E66a01d9493D49bC&tokenId=1";

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <main className="mx-auto flex min-h-[100vh] max-w-[500px] w-full flex-col gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 pb-24">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Logo size="sm" className="sm:hidden" showText={true} />
            <Logo size="md" className="hidden sm:block" showText={true} />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-50">
                Verifier
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
                Scan QR or NFC to verify artwork authenticity on Base.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <WalletStatus />
          </div>
        </header>

        <section className="grid gap-4 sm:gap-6 md:grid-cols-2 w-full">
          <div className="rounded-2xl sm:rounded-3xl border border-purple-500/40 bg-slate-950/80 p-3 sm:p-4 md:p-5">
            <h2 className="mb-2 text-sm sm:text-base font-semibold text-slate-100">
              Scan a code
            </h2>
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-slate-400">
              Use your camera or NFC reader to scan a demo or real Artyug code.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/scan?mode=mock"
                className="block w-full rounded-xl bg-purple-600 py-3 sm:py-3 md:py-4 text-center text-sm sm:text-base font-medium text-white hover:bg-purple-500 transition-colors"
              >
                Scan Demo QR (Mock JSON)
              </Link>
              <Link
                href="/scan?mode=onchain"
                className="block w-full rounded-xl border border-purple-500/60 bg-slate-950 py-3 sm:py-3 md:py-4 text-center text-sm sm:text-base font-medium text-purple-100 hover:bg-purple-900/40 transition-colors"
              >
                Scan Onchain QR (Base)
              </Link>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4 md:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-100">
              Example QR codes for your slide
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <QRCodeSVG value={demoMockUrl} className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
                <p className="text-[10px] sm:text-xs text-slate-400 break-words">
                  Mock demo QR (reads JSON from your demo site)
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <QRCodeSVG value={demoOnchainUrl} className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
                <p className="text-[10px] sm:text-xs text-slate-400 break-words">
                  Future real onchain QR (Base NFT)
                </p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500">
              These will be scanned live during your pitch from the projector /
              slide deck.
            </p>
          </div>
        </section>

        <footer className="mt-auto pb-4 text-center text-[10px] sm:text-xs text-slate-500">
          Powered by Artyug • Built for Base Mini Apps • NFC support coming soon
        </footer>
      </main>
    </div>
  );
}

