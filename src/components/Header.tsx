import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b border-border/50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
          <span className="text-lg font-bold">A</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Artyuga Verifier
        </h1>
      </div>

      <Button
        variant={isConnected ? 'secondary' : 'default'}
        size="sm"
        onClick={isConnected ? () => disconnect() : handleConnect}
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isConnected
          ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
          : 'Connect Wallet'}
      </Button>
    </header>
  );
};
