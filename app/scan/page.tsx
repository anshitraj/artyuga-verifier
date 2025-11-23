// app/scan/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Scanner } from "@/components/Scanner";
import { parseVerificationUrl } from "@/lib/parseVerificationUrl";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { sdk } from "@farcaster/miniapp-sdk";

function ScanPageContent() {
  useEffect(() => {
    // Tell Base/Farcaster that the app is ready
    sdk.actions.ready();
  }, []);
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = (searchParams.get("mode") as "mock" | "onchain") || "mock";

  const handleScan = (value: string) => {
    const parsed = parseVerificationUrl(value);

    if (parsed.type === "mock") {
      const { shopId, artId } = parsed.params;
      router.push(
        `/result?mode=mock&shopId=${encodeURIComponent(
          shopId
        )}&artId=${encodeURIComponent(artId)}&raw=${encodeURIComponent(value)}`
      );
    } else if (parsed.type === "onchain") {
      const { chain, contract, tokenId } = parsed.params;
      router.push(
        `/result?mode=onchain&chain=${encodeURIComponent(
          chain
        )}&contract=${encodeURIComponent(
          contract
        )}&tokenId=${encodeURIComponent(
          tokenId
        )}&raw=${encodeURIComponent(value)}`
      );
    } else {
      router.push(
        `/result?mode=invalid&reason=${encodeURIComponent(
          parsed.params.reason
        )}&raw=${encodeURIComponent(value)}`
      );
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <main className="mx-auto flex min-h-[100vh] max-w-[500px] w-full flex-col gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-6 pb-24">
        <div className="flex items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Logo size="sm" showText={false} />
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-slate-50 truncate">
              Scan {modeParam === "mock" ? "Demo" : "Onchain"} Code
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4 flex-shrink-0"
          >
            Back home
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-400">
          Align the QR code in the frame or use NFC / manual input. We will detect
          whether it&apos;s a mock demo URL or a real onchain Artyug URL.
        </p>

        <Scanner mode={modeParam} onScan={handleScan} />
      </main>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-full overflow-x-hidden">
        <main className="mx-auto flex min-h-[100vh] max-w-[500px] w-full flex-col gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-6 pb-24">
          <div className="flex items-center justify-between gap-3 sm:gap-4 w-full">
            <div className="flex items-center gap-2 sm:gap-3">
              <Logo size="sm" showText={false} />
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-slate-50">Loading...</h1>
            </div>
          </div>
        </main>
      </div>
    }>
      <ScanPageContent />
    </Suspense>
  );
}

