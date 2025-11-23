import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID - get from https://cloud.walletconnect.com
// For Base/Farcaster, injected() connector works with Base wallet
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'artyuga-verifier';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    // Injected connector works with Base wallet in Farcaster/Base Mini Apps
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
