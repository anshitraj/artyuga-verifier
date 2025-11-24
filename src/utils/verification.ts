export interface VerificationParams {
  type: 'mock' | 'onchain' | 'invalid';
  params: Record<string, string>;
}

export function parseVerificationUrl(url: string): VerificationParams {
  try {
    // Handle relative URLs (e.g., "/verify/1")
    let urlObj: URL;
    if (url.startsWith('/')) {
      // Relative URL - construct full URL
      urlObj = new URL(url, window.location.origin);
    } else if (!url.includes('://')) {
      // URL without protocol - try to parse as relative or add protocol
      urlObj = new URL(url.startsWith('/') ? url : `/${url}`, window.location.origin);
    } else {
      // Full URL
      urlObj = new URL(url);
    }

    const pathname = urlObj.pathname;
    const searchParams = Object.fromEntries(urlObj.searchParams);

    // Check for /verify/mock format
    if (pathname.includes('/verify/mock')) {
      return {
        type: 'mock',
        params: {
          shopId: searchParams.shopId || '',
          artId: searchParams.artId || '',
        },
      };
    }

    // Check for /verify/onchain format
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

    // Check for marketplace verification page format: /verify/[artId]
    // This is used by the Artyuga marketplace
    const verifyMatch = pathname.match(/\/verify\/([^\/]+)/);
    if (verifyMatch) {
      const artId = verifyMatch[1];
      // If it's a marketplace URL, treat it as mock with the artId
      // We'll need shopId from the marketplace API or default to '1'
      return {
        type: 'mock',
        params: {
          shopId: searchParams.shopId || '1',
          artId: artId,
        },
      };
    }

    // Check if URL contains query parameters that suggest verification
    if (searchParams.artId || searchParams.tokenId || searchParams.contract) {
      // Has verification parameters - try to determine type
      if (searchParams.contract && searchParams.tokenId) {
        // Onchain format
        return {
          type: 'onchain',
          params: {
            chain: searchParams.chain || 'base',
            contract: searchParams.contract,
            tokenId: searchParams.tokenId,
          },
        };
      } else if (searchParams.artId) {
        // Mock format
        return {
          type: 'mock',
          params: {
            shopId: searchParams.shopId || '1',
            artId: searchParams.artId,
          },
        };
      }
    }

    // If URL contains "verify" but doesn't match known patterns, try to extract info
    if (pathname.toLowerCase().includes('verify')) {
      // Last resort: try to extract any ID from the path
      const idMatch = pathname.match(/\/(\d+)/);
      if (idMatch) {
        return {
          type: 'mock',
          params: {
            shopId: '1',
            artId: idMatch[1],
          },
        };
      }
    }

    return {
      type: 'invalid',
      params: {},
    };
  } catch (error) {
    console.error('Error parsing verification URL:', error, url);
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

/**
 * Extracts marketplace URL from a verification URL
 * @param verificationUrl - The scanned URL
 * @returns The marketplace base URL
 */
function extractMarketplaceUrl(verificationUrl?: string): string {
  // If a verification URL was provided, extract the origin
  if (verificationUrl) {
    try {
      const url = new URL(verificationUrl);
      return `${url.protocol}//${url.host}`;
    } catch {
      // Invalid URL, fall through to defaults
    }
  }
  
  // Try environment variable first
  if (import.meta.env.VITE_MARKETPLACE_URL) {
    return import.meta.env.VITE_MARKETPLACE_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
}

export async function fetchMockArtwork(
  shopId: string,
  artId: string,
  verificationUrl?: string
): Promise<MockArtwork> {
  // Get marketplace URL from the verification URL or env
  const marketplaceUrl = extractMarketplaceUrl(verificationUrl);
  
  try {
    const apiUrl = `${marketplaceUrl}/api/verify/mock?shopId=${shopId}&artId=${artId}`;
    console.log('Fetching artwork from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add CORS mode for cross-origin requests
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artwork: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched artwork data:', data);
    
    // Ensure the data matches MockArtwork interface
    return {
      artId: data.artId || artId,
      title: data.title || `Artwork #${artId}`,
      artist: data.artist || data.shopName || 'Unknown Artist',
      shopName: data.shopName || `Shop ${shopId}`,
      owner: data.owner || '0xUnknown...',
      price: data.price || '0.00 ETH',
      network: data.network || 'Base (Demo)',
      verified: data.verified !== false, // Default to true
      txHash: data.txHash || '0xDEMO1234567890abcdef',
    };
  } catch (error) {
    console.error('Error fetching artwork from marketplace:', error);
    console.log('Falling back to local mock data');
    
    // Fallback to local mock data if API fails
    return {
      artId,
      title: `Artwork #${artId}`,
      artist: 'Unknown Artist',
      shopName: `Shop ${shopId}`,
      owner: '0xMock...Owner123',
      price: '0.05 ETH',
      network: 'Base (Demo)',
      verified: true,
      txHash: '0xDEMO1234567890abcdef',
    };
  }
}
