import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import { isFarcaster } from '@/utils/environment';
import { sdk } from '@farcaster/miniapp-sdk';

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    const inFarcaster = isFarcaster();
    
    if (inFarcaster) {
      // In Farcaster Mini Apps, Base wallet is available as injected provider
      // The wallet is injected by the Farcaster app itself
      try {
        // First, try to find the injected connector (Base wallet in Farcaster)
        const injectedConnector = connectors.find((c) => c.id === 'injected');
        
        if (injectedConnector) {
          // In Farcaster, the injected provider should be Base wallet
          await connect({ connector: injectedConnector });
          return;
        }
        
        // If injected not found, try WalletConnect as fallback
        const walletConnectConnector = connectors.find((c) => c.id === 'walletConnect');
        if (walletConnectConnector) {
          await connect({ connector: walletConnectConnector });
          return;
        }
        
        // Last resort: try any available connector
        if (connectors.length > 0) {
          await connect({ connector: connectors[0] });
          return;
        }
        
        throw new Error('No wallet connector available');
      } catch (error: any) {
        console.error('Failed to connect wallet in Farcaster:', error);
        // Show user-friendly error
        if (error.message?.includes('User rejected') || error.code === 4001) {
          // User rejected, don't show error toast
          return;
        }
        // For other errors, try one more time with injected
        const injectedConnector = connectors.find((c) => c.id === 'injected');
        if (injectedConnector) {
          try {
            await connect({ connector: injectedConnector });
          } catch (fallbackError) {
            console.error('Fallback connection failed:', fallbackError);
          }
        }
      }
    } else {
      // In Base app or standalone browser, use standard wallet connection
      try {
        // Try injected connector first (MetaMask, Base wallet, etc.)
        const injectedConnector = connectors.find((c) => c.id === 'injected' || c.id === 'io.metamask');
        
        if (injectedConnector) {
          await connect({ connector: injectedConnector });
          return;
        }
        
        // Fallback to WalletConnect
        const walletConnectConnector = connectors.find((c) => c.id === 'walletConnect');
        if (walletConnectConnector) {
          await connect({ connector: walletConnectConnector });
          return;
        }
        
        // Last resort: first available connector
        if (connectors.length > 0) {
          await connect({ connector: connectors[0] });
        }
      } catch (error: any) {
        console.error('Failed to connect wallet:', error);
        // User rejection is fine, don't show error
        if (error.message?.includes('User rejected') || error.code === 4001) {
          return;
        }
        // For other errors, try WalletConnect as fallback
        const walletConnectConnector = connectors.find((c) => c.id === 'walletConnect');
        if (walletConnectConnector) {
          try {
            await connect({ connector: walletConnectConnector });
          } catch (fallbackError) {
            console.error('Fallback connection failed:', fallbackError);
          }
        }
      }
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
