import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    // In Base/Farcaster Mini Apps, the Base wallet is available via injected connector
    // This will work with Base wallet in the Farcaster app
    const injectedConnector = connectors.find((c) => c.id === 'injected' || c.id === 'io.metamask');
    
    if (injectedConnector) {
      try {
        await connect({ connector: injectedConnector });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        // Fallback to first available connector
        if (connectors.length > 0) {
          await connect({ connector: connectors[0] });
        }
      }
    } else if (connectors.length > 0) {
      // Fallback to first available connector
      await connect({ connector: connectors[0] });
    }
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full p-4 sm:p-6 border-b border-border/50">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <img 
          src="/icon.png" 
          alt="Artyuga Logo" 
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-contain flex-shrink-0 shadow-lg shadow-primary/20"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-50">
            Verifier
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
            Scan QR or NFC to verify artwork authenticity on Base.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto">
        <Button
          variant={isConnected ? 'secondary' : 'default'}
          size="sm"
          onClick={isConnected ? () => disconnect() : handleConnect}
          className="gap-2 w-full sm:w-auto"
        >
          <Wallet className="w-4 h-4" />
          {isConnected
            ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
            : 'Connect Wallet'}
        </Button>
      </div>
    </header>
  );
};
