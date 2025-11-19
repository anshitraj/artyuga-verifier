// lib/wagmi.ts
import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    // Only add WalletConnect if project ID is provided
    ...(walletConnectProjectId && walletConnectProjectId !== "YOUR_WALLETCONNECT_PROJECT_ID"
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            metadata: {
              name: "Artyug Verifier",
              description: "Verify Artyug artworks on Base.",
              url: "https://artyug.app",
              icons: ["https://artyug.app/icon.png"],
            },
          }),
        ]
      : []),
  ],
  ssr: true,
});

