import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// WalletConnect project ID - get from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'artyuga-verifier';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    // Farcaster Mini App connector - works in Farcaster environment
    // This connector uses sdk.wallet.getEthereumProvider() internally
    farcasterMiniApp(),
    // Injected connector for Base app and standalone browsers
    injected({
      shimDisconnect: true,
    }),
    // WalletConnect for additional wallet options
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Artyuga Verifier',
        description: 'Verify artwork ownership and authenticity on Base blockchain',
        url: 'https://verify.artyug.art',
        icons: ['https://verify.artyug.art/icon.png'],
      },
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false, // Vite is client-side only
});
