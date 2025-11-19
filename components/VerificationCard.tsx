// components/VerificationCard.tsx
"use client";

import { CheckCircle2, AlertTriangle, ExternalLink, Share2 } from "lucide-react";

type BaseInfo = {
  mode: "mock" | "onchain" | "invalid";
  title?: string;
  artist?: string;
  owner?: string;
  network?: string;
  txHash?: string;
  contract?: string;
  tokenId?: string | number;
  shopName?: string;
  rawUrl: string;
  reasonInvalid?: string;
};

export function VerificationCard(info: BaseInfo) {
  const isValid = info.mode !== "invalid";

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Artyug Artwork Verification",
          text: "Verified artwork on Base using Artyug.",
          url: shareUrl,
        });
      } catch {
        // ignore
      }
    } else if (navigator.clipboard && shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      alert("Verification link copied to clipboard");
    }
  };

  const shorten = (addr?: string) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "—";

  const basescanUrl =
    info.mode === "onchain" && info.contract && info.tokenId
      ? `https://basescan.org/token/${info.contract}?a=${info.tokenId}`
      : info.txHash
      ? `https://basescan.org/tx/${info.txHash}`
      : null;

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-purple-500/50 bg-slate-950/80 p-6 shadow-xl shadow-purple-900/40">
      <div className="mb-4 flex items-center gap-3">
        {isValid ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            {isValid ? "Artwork Verified" : "Verification Failed"}
          </h2>
          <p className="text-xs text-slate-400">
            Mode: {info.mode === "mock" ? "Demo (mock JSON)" : info.mode === "onchain" ? "Onchain (Base)" : "Invalid"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-100">
        <Row label="Title" value={info.title || "Unknown artwork"} />
        {info.shopName && <Row label="Shop" value={info.shopName} />}
        <Row label="Artist" value={info.artist || "Unknown artist"} />
        <Row label="Owner" value={shorten(info.owner)} />
        {info.contract && <Row label="Contract" value={shorten(info.contract)} />}
        {info.tokenId && <Row label="Token ID" value={String(info.tokenId)} />}
        <Row
          label="Network"
          value={info.network || (info.mode === "onchain" ? "Base" : "Demo")}
        />
        {info.txHash && <Row label="Tx Hash" value={shorten(info.txHash)} />}
        {!isValid && (
          <Row
            label="Reason"
            value={info.reasonInvalid || "Could not parse or verify this code."}
          />
        )}
      </div>

      <div className="mt-4 space-y-2">
        {basescanUrl && (
          <a
            href={basescanUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2 text-sm font-medium text-slate-50 hover:bg-slate-700"
          >
            View on BaseScan
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <button
          onClick={handleShare}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/60 bg-slate-950 py-2 text-sm font-medium text-purple-100 hover:bg-purple-900/40"
        >
          <Share2 className="h-4 w-4" />
          Share Verification
        </button>
      </div>

      <p className="mt-4 truncate text-[10px] text-slate-500">
        Raw: {info.rawUrl}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-mono text-slate-100">{value}</span>
    </div>
  );
}

