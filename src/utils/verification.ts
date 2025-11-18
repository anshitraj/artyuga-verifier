export interface VerificationParams {
  type: 'mock' | 'onchain' | 'invalid';
  params: Record<string, string>;
}

export function parseVerificationUrl(url: string): VerificationParams {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const searchParams = Object.fromEntries(urlObj.searchParams);

    if (pathname.includes('/verify/mock')) {
      return {
        type: 'mock',
        params: {
          shopId: searchParams.shopId || '',
          artId: searchParams.artId || '',
        },
      };
    }

    if (pathname.includes('/verify/onchain')) {
      return {
        type: 'onchain',
        params: {
          chain: searchParams.chain || '',
          contract: searchParams.contract || '',
          tokenId: searchParams.tokenId || '',
        },
      };
    }

    return {
      type: 'invalid',
      params: {},
    };
  } catch (error) {
    return {
      type: 'invalid',
      params: {},
    };
  }
}

export interface MockArtwork {
  artId: string;
  title: string;
  artist: string;
  shopName: string;
  owner: string;
  price: string;
  network: string;
  verified: boolean;
  txHash: string;
}

export async function fetchMockArtwork(
  shopId: string,
  artId: string
): Promise<MockArtwork> {
  // Simulate API call - in production this would call your actual API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        artId,
        title: artId === '3' ? 'Sunset Dreams' : `Artwork #${artId}`,
        artist: 'Aman',
        shopName: shopId === '1' ? "Aman's Studio" : `Shop ${shopId}`,
        owner: '0xMock...Owner123',
        price: '0.05',
        network: 'Base (Demo)',
        verified: true,
        txHash: '0xDEMO1234567890abcdef',
      });
    }, 500);
  });
}
