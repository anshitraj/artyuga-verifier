// app/scan/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Scanner } from "@/components/Scanner";
import { parseVerificationUrl } from "@/lib/parseVerificationUrl";
import Link from "next/link";
import { Logo } from "@/components/Logo";

function ScanPageContent() {
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
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <h1 className="text-lg font-semibold text-slate-50">
            Scan {modeParam === "mock" ? "Demo" : "Onchain"} Code
          </h1>
        </div>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
        >
          Back home
        </Link>
      </div>

      <p className="text-xs text-slate-400">
        Align the QR code in the frame or use NFC / manual input. We will detect
        whether it&apos;s a mock demo URL or a real onchain Artyug URL.
      </p>

      <Scanner mode={modeParam} onScan={handleScan} />
    </main>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <h1 className="text-lg font-semibold text-slate-50">Loading...</h1>
          </div>
        </div>
      </main>
    }>
      <ScanPageContent />
    </Suspense>
  );
}

