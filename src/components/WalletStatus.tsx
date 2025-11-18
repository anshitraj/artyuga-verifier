import { useAccount, useBalance } from 'wagmi';
import { base } from 'wagmi/chains';
import { Card } from './ui/card';
import { Wallet, AlertCircle } from 'lucide-react';

export const WalletStatus = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: base.id,
  });

  if (!isConnected) {
    return (
      <Card className="p-4 bg-card/50 border-border/50">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Wallet className="w-5 h-5" />
          <p className="text-sm">Connect wallet to see your portfolio</p>
        </div>
      </Card>
    );
  }

  const isCorrectChain = chain?.id === base.id;

  return (
    <Card className="p-4 bg-gradient-to-br from-card to-card/50 border-primary/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Your Address</span>
          <span className="text-sm font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>

        {!isCorrectChain ? (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Please switch to Base network</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ETH Balance</span>
            <span className="text-sm font-semibold">
              {balance ? `${Number(balance.formatted).toFixed(4)} ETH` : '0 ETH'}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Connected to {isCorrectChain ? 'Base' : chain?.name || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
