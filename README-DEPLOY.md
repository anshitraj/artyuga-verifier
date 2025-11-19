# Deploying ArtyugaArtwork Contract to Base

This guide will help you deploy the ArtyugaArtwork NFT contract to Base Mainnet.

## Prerequisites

1. A wallet with some ETH on Base Mainnet (for gas fees)
2. Your wallet's private key (keep it secret!)

## Setup

1. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your credentials**:
   ```
   PRIVATE_KEY=your_wallet_private_key_here
   BASE_MAINNET_RPC=https://mainnet.base.org
   ```

   ⚠️ **WARNING**: Never commit your `.env` file to git! It contains your private key.

3. **Compile the contract**:
   ```bash
   npm run compile
   ```

## Deploy to Base Mainnet

```bash
npm run deploy:base
```

This will:
- Deploy the ArtyugaArtwork contract
- Set you as the owner
- Print the contract address

## Deploy to Base Sepolia (Testnet)

For testing, you can deploy to Base Sepolia first:

```bash
npm run deploy:baseSepolia
```

## After Deployment

1. **Save the contract address** - You'll need it for:
   - Updating the verifier app to use the real contract
   - Minting artworks
   - Verifying ownership

2. **Verify on BaseScan** (optional but recommended):
   - Go to https://basescan.org
   - Find your contract
   - Click "Verify and Publish"
   - Upload the contract source code

## Contract Functions

- `mintArtwork(address to, string memory uri)` - Mint a new artwork (owner only)
- `totalMinted()` - Get total number of minted artworks
- `getArtwork(uint256 tokenId)` - Get artwork owner and URI

## Security Notes

- ⚠️ Never share your private key
- ⚠️ Use a dedicated wallet for deployment (not your main wallet)
- ⚠️ Test on Sepolia first before deploying to Mainnet
- ⚠️ Keep your `.env` file secure and never commit it

