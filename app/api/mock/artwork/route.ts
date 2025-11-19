// app/api/mock/artwork/route.ts
import { NextRequest, NextResponse } from "next/server";

const MOCK_DB = [
  {
    shopId: "1",
    artId: "3",
    title: "Sunset Dreams",
    artist: "Aman",
    shopName: "Aman's Studio",
    owner: "0xMockOwner1234567890abcdef1234567890abcdef12",
    price: "0.05",
    network: "Base (Demo)",
    verified: true,
    txHash: "0xDEADBEEF1234567890abcdef1234567890abcdef1234567890abcdef12345678",
  },
  {
    shopId: "1",
    artId: "2",
    title: "Golden Hour",
    artist: "Aman",
    shopName: "Aman's Studio",
    owner: "0xMockOwner9999999999999999999999999999999999",
    price: "0.08",
    network: "Base (Demo)",
    verified: true,
    txHash: "0xFEEDFACEaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("shopId");
  const artId = searchParams.get("artId");

  const item = MOCK_DB.find(
    (x) => x.shopId === shopId && x.artId === artId
  );

  if (!item) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(item);
}

