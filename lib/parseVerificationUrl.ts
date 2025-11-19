// lib/parseVerificationUrl.ts

export type ParsedVerification =
  | {
      type: "mock";
      params: { shopId: string; artId: string; rawUrl: string };
    }
  | {
      type: "onchain";
      params: { chain: string; contract: string; tokenId: string; rawUrl: string };
    }
  | {
      type: "invalid";
      params: { reason: string; rawUrl: string };
    };

export function parseVerificationUrl(raw: string): ParsedVerification {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return {
      type: "invalid",
      params: { reason: "Not a valid URL", rawUrl: raw },
    };
  }

  const pathname = url.pathname || "";
  const search = url.searchParams;

  // MOCK format: https://artyuga-demo.xyz/verify/mock?shopId=1&artId=3
  if (pathname.includes("/verify/mock")) {
    const shopId = search.get("shopId");
    const artId = search.get("artId");
    if (!shopId || !artId) {
      return {
        type: "invalid",
        params: {
          reason: "Missing shopId or artId for mock verification",
          rawUrl: raw,
        },
      };
    }
    return {
      type: "mock",
      params: { shopId, artId, rawUrl: raw },
    };
  }

  // ONCHAIN format:
  // https://artyuga.app/verify/onchain?chain=base&contract=0x...&tokenId=42
  if (pathname.includes("/verify/onchain")) {
    const chain = search.get("chain") || "";
    const contract = search.get("contract") || "";
    const tokenId = search.get("tokenId") || "";

    if (!chain || !contract || !tokenId) {
      return {
        type: "invalid",
        params: {
          reason: "Missing chain, contract or tokenId for onchain verification",
          rawUrl: raw,
        },
      };
    }

    return {
      type: "onchain",
      params: { chain, contract, tokenId, rawUrl: raw },
    };
  }

  return {
    type: "invalid",
    params: { reason: "URL does not match mock or onchain pattern", rawUrl: raw },
  };
}

