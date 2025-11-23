import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, ExternalLink, Share2, Scan } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface VerificationCardProps {
  data: {
    title?: string;
    artist?: string;
    owner: string;
    network: string;
    tokenId?: string;
    contract?: string;
    price?: string;
    txHash?: string;
  };
  verified: boolean;
  mode: 'mock' | 'onchain';
}

export const VerificationCard = ({ data, verified, mode }: VerificationCardProps) => {
  const navigate = useNavigate();

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Artyuga Verification',
          text: `Verified artwork: ${data.title || 'Artwork'}`,
          url,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Verification link copied to clipboard');
    }
  };

  const handleViewOnBaseScan = () => {
    if (mode === 'onchain' && data.contract && data.tokenId) {
      const url = `https://basescan.org/nft/${data.contract}/${data.tokenId}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={`p-6 space-y-6 ${verified ? 'bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
        {/* Verified Badge */}
        {verified && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <CheckCircle className="w-12 h-12 text-primary" />
              <div className="absolute inset-0 blur-xl bg-primary/50" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Verified</h3>
              <p className="text-sm text-muted-foreground">
                Authenticity confirmed on {data.network}
              </p>
            </div>
          </div>
        )}

        {/* Artwork Details */}
        {data.title && (
          <div>
            <h2 className="text-2xl font-bold mb-1">{data.title}</h2>
            {data.artist && (
              <p className="text-muted-foreground">by {data.artist}</p>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
            <span className="text-sm text-muted-foreground">Owner</span>
            <code className="text-sm font-mono">{data.owner}</code>
          </div>

          {data.tokenId && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
              <span className="text-sm text-muted-foreground">Token ID</span>
              <span className="text-sm font-semibold">#{data.tokenId}</span>
            </div>
          )}

          {data.price && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="text-sm font-semibold">{data.price} ETH</span>
            </div>
          )}

          {data.contract && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
              <span className="text-sm text-muted-foreground">Contract</span>
              <code className="text-xs font-mono">
                {data.contract.slice(0, 8)}...{data.contract.slice(-6)}
              </code>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
            <span className="text-sm text-muted-foreground">Network</span>
            <Badge variant="secondary" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-accent" />
              {data.network}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button onClick={handleShare} className="w-full gap-2" size="lg">
            <Share2 className="w-4 h-4" />
            Share Verification
          </Button>

          {mode === 'onchain' && data.contract && (
            <Button
              onClick={handleViewOnBaseScan}
              variant="secondary"
              className="w-full gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on BaseScan
            </Button>
          )}

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full gap-2"
          >
            <Scan className="w-4 h-4" />
            Scan Another
          </Button>
        </div>

        {/* Transaction Hash */}
        {data.txHash && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
            <code className="text-xs font-mono break-all">{data.txHash}</code>
          </div>
        )}
      </div>
    </Card>
  );
};
