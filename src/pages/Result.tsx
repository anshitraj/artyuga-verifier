import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useReadContract } from 'wagmi';
import { Header } from '@/components/Header';
import { VerificationCard } from '@/components/VerificationCard';
import { ModeToggle } from '@/components/ModeToggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchMockArtwork, type MockArtwork } from '@/utils/verification';
import { AlertCircle, Loader2 } from 'lucide-react';
import { base } from 'wagmi/chains';
import { sdk } from '@farcaster/miniapp-sdk';

const ERC721_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export default function Result() {
  useEffect(() => {
    // Tell Base/Farcaster that the app is ready
    sdk.actions.ready();
  }, []);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') as 'mock' | 'onchain' | 'invalid';

  const [mockData, setMockData] = useState<MockArtwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock mode
  useEffect(() => {
    if (mode === 'mock') {
      const shopId = searchParams.get('shopId') || '';
      const artId = searchParams.get('artId') || '';

      fetchMockArtwork(shopId, artId)
        .then((data) => {
          setMockData(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch artwork data');
          setLoading(false);
        });
    } else if (mode === 'invalid') {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [mode, searchParams]);

  // Onchain mode
  const contract = searchParams.get('contract') as `0x${string}` | undefined;
  const tokenId = searchParams.get('tokenId');
  const chain = searchParams.get('chain');

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    address: contract,
    abi: ERC721_ABI,
    functionName: 'ownerOf',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    chainId: base.id,
    query: {
      enabled: mode === 'onchain' && !!contract && !!tokenId && chain === 'base',
    },
  });

  if (loading || (mode === 'onchain' && isLoadingOwner)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Verifying artwork...</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'invalid' || error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-2xl mx-auto p-4 md:p-6">
          <Card className="p-8 text-center space-y-4 border-destructive/50">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Invalid Verification Data</h2>
            <p className="text-muted-foreground">
              {error || 'The QR code or NFC tag contains invalid data. Please try again.'}
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Back and Rescan
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verification Result</h1>
          <ModeToggle mode={mode} />
        </div>

        {mode === 'mock' && mockData && (
          <VerificationCard
            data={{
              title: mockData.title,
              artist: mockData.artist,
              owner: mockData.owner,
              network: mockData.network,
              price: mockData.price,
              txHash: mockData.txHash,
            }}
            verified={mockData.verified}
            mode="mock"
          />
        )}

        {mode === 'onchain' && owner && (
          <VerificationCard
            data={{
              owner: owner as string,
              network: 'Base Mainnet',
              tokenId: tokenId || '',
              contract: contract || '',
            }}
            verified={true}
            mode="onchain"
          />
        )}

        {mode === 'onchain' && !owner && !isLoadingOwner && (
          <Card className="p-8 text-center space-y-4 border-destructive/50">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-muted-foreground">
              Could not verify this token on the Base blockchain. The token may not exist or the contract address is invalid.
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Back
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
