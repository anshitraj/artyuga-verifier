# Artyuga Verifier

A Next.js 14 app for verifying Artyuga artworks using QR codes and NFC tags. Supports both mock (demo) and onchain (Base blockchain) verification.

## Features

- 📱 **QR Code Scanning** - Scan QR codes from artworks
- 🏷️ **NFC Tag Support** - Read NFC tags (beta, requires Web NFC support)
- 🔗 **Manual URL Input** - Paste verification URLs manually
- 🔐 **Wallet Integration** - Connect wallet via Wagmi (Base & Base Sepolia)
- ✅ **Mock & Onchain Verification** - Supports both demo JSON and real blockchain verification
- 🎨 **Premium UI** - Dark theme with purple accents

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Wagmi v2** (Web3 wallet integration)
- **react-qr-reader** (QR code scanning)
- **qrcode.react** (QR code generation)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- WalletConnect Project ID (optional, for WalletConnect support)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID (optional):

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
artyuga-verifier/
├── app/
│   ├── api/mock/artwork/    # Mock API endpoint
│   ├── scan/                 # QR/NFC scanner page
│   ├── result/               # Verification result page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/
│   ├── Scanner.tsx           # QR/NFC scanner component
│   ├── VerificationCard.tsx  # Verification result card
│   ├── WalletStatus.tsx      # Wallet connection status
│   └── Providers.tsx         # Wagmi & React Query providers
├── lib/
│   ├── parseVerificationUrl.ts  # URL parsing logic
│   └── wagmi.ts              # Wagmi configuration
└── package.json
```

## Usage

### Mock Verification

Mock verification URLs follow this format:
```
https://artyuga-demo.xyz/verify/mock?shopId=1&artId=3
```

The app will fetch artwork data from `/api/mock/artwork`.

### Onchain Verification

Onchain verification URLs follow this format:
```
https://artyuga.app/verify/onchain?chain=base&contract=0x...&tokenId=42
```

The app will read the NFT owner from the Base blockchain using Wagmi.

## API Routes

- **`/api/mock/artwork`** - Returns mock artwork data for demo verification
  - Query params: `shopId`, `artId`

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables (if using WalletConnect)
4. Deploy automatically

## Contract Deployment

This project includes Hardhat setup for deploying the ArtyugaArtwork NFT contract to Base.

See [README-DEPLOY.md](./README-DEPLOY.md) for detailed deployment instructions.

Quick start:
```bash
# Compile contract
npm run compile

# Deploy to Base Mainnet
npm run deploy:base

# Or deploy to Base Sepolia (testnet)
npm run deploy:baseSepolia
```

## Notes

- QR scanning requires camera permissions
- NFC support requires Web NFC API (currently Chrome/Edge on Android)
- WalletConnect Project ID is optional but recommended for better UX
- The app supports both Base Mainnet and Base Sepolia testnet
- Contract deployment requires a wallet with ETH for gas fees

## License

MIT
