// app/result/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { VerificationCard } from "@/components/VerificationCard";
import { useReadContract } from "wagmi";
import { base } from "wagmi/chains";

// Minimal ERC721 ABI for ownerOf + tokenURI
const ERC721_ABI = [
  {
    constant: true,
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "owner", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "uri", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

type MockResponse = {
  artId: string;
  title: string;
  artist: string;
  shopName: string;
  owner: string;
  price: string;
  network: string;
  verified: boolean;
  txHash: string;
};

function ResultPageContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") ||
    "invalid") as "mock" | "onchain" | "invalid";
  const rawUrl = searchParams.get("raw") || "";
  const reasonInvalid = searchParams.get("reason") || "";
  const shopId = searchParams.get("shopId");
  const artId = searchParams.get("artId");
  const chain = searchParams.get("chain") || "base";
  const contract = searchParams.get("contract") || "";
  const tokenIdParam = searchParams.get("tokenId") || "0";

  const [mockData, setMockData] = useState<MockResponse | null>(null);
  const [mockLoading, setMockLoading] = useState(false);

  const tokenId = BigInt(tokenIdParam || "0");

  const { data: ownerOnchain } = useReadContract({
    abi: ERC721_ABI,
    address: contract as `0x${string}`,
    functionName: "ownerOf",
    args: [tokenId],
    chainId: base.id,
    query: {
      enabled: mode === "onchain" && !!contract && !!tokenId && contract.length > 0,
    },
  });

  const { data: tokenUri } = useReadContract({
    abi: ERC721_ABI,
    address: contract as `0x${string}`,
    functionName: "tokenURI",
    args: [tokenId],
    chainId: base.id,
    query: {
      enabled: mode === "onchain" && !!contract && !!tokenId && contract.length > 0,
    },
  });

  useEffect(() => {
    if (mode !== "mock" || !shopId || !artId) return;
    setMockLoading(true);
    // You can change this to call your real demo site:
    // fetch(`https://artyuga-demo.xyz/api/mock/artwork?shopId=${shopId}&artId=${artId}`)
    fetch(`/api/mock/artwork?shopId=${shopId}&artId=${artId}`)
      .then((res) => res.json())
      .then((data: MockResponse) => {
        setMockData(data);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setMockLoading(false));
  }, [mode, shopId, artId]);

  if (mode === "invalid") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <VerificationCard
          mode="invalid"
          rawUrl={rawUrl}
          reasonInvalid={reasonInvalid || "Invalid or unsupported QR / NFC data"}
        />
      </main>
    );
  }

  if (mode === "mock") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        {mockLoading || !mockData ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 text-sm text-slate-300">
            Loading mock verification…
          </div>
        ) : (
          <VerificationCard
            mode="mock"
            rawUrl={rawUrl}
            title={mockData.title}
            artist={mockData.artist}
            shopName={mockData.shopName}
            owner={mockData.owner}
            network={mockData.network}
            txHash={mockData.txHash}
          />
        )}
      </main>
    );
  }

  // ONCHAIN
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <VerificationCard
        mode="onchain"
        rawUrl={rawUrl}
        title={`Token #${tokenIdParam}`}
        artist={undefined}
        owner={ownerOnchain as string | undefined}
        contract={contract}
        tokenId={tokenIdParam}
        network={chain === "base" ? "Base Mainnet" : chain}
      />
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 text-sm text-slate-300">
          Loading...
        </div>
      </main>
    }>
      <ResultPageContent />
    </Suspense>
  );
}

