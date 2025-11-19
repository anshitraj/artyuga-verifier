# Deploying to Vercel

This guide will help you deploy the Artyuga Verifier app to Vercel.

## Prerequisites

- ✅ Code pushed to GitHub (already done!)
- A Vercel account (sign up at https://vercel.com if needed)
- WalletConnect Project ID (optional but recommended)

## Step-by-Step Deployment

### 1. Go to Vercel Dashboard

1. Visit [https://vercel.com](https://vercel.com)
2. Sign in or create an account
3. Click **"Add New..."** → **"Project"**

### 2. Import Your GitHub Repository

1. Click **"Import Git Repository"**
2. Find and select **`anshitraj/artyuga-verifier`**
3. Click **"Import"**

### 3. Configure Project Settings

Vercel will auto-detect Next.js settings. Verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (or leave default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 4. Add Environment Variables (Optional)

If you want WalletConnect support:

1. Click **"Environment Variables"** section
2. Add the following variable:
   - **Name**: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - **Value**: Your WalletConnect Project ID
   - **Environments**: Production, Preview, Development (select all)

   > **Note**: To get a WalletConnect Project ID:
   > 1. Go to https://cloud.walletconnect.com
   > 2. Create a new project
   > 3. Copy the Project ID

3. Click **"Add"**

> **Note**: The WalletConnect Project ID is optional. The app will work without it, but WalletConnect connector won't be available.

### 5. Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 1-3 minutes)
3. Once deployed, you'll get a URL like: `https://artyuga-verifier-xxx.vercel.app`

### 6. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `verifier.artyuga.app`)
3. Follow DNS configuration instructions

## Post-Deployment

### Verify Deployment

1. Visit your deployment URL
2. Test the QR scanner functionality
3. Test wallet connection (if WalletConnect is configured)

### Environment Variables

If you need to add/update environment variables later:

1. Go to **Settings** → **Environment Variables**
2. Add or edit variables
3. Redeploy the project (Vercel will auto-redeploy on next push, or click "Redeploy")

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### WalletConnect Not Working

- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
- Check that the variable is available in all environments
- Redeploy after adding environment variables

### Module Resolution Errors

- Clear `.next` cache (Vercel does this automatically)
- Check `next.config.mjs` is correct
- Verify `postcss.config.js` uses ES module syntax

## Next Steps

After successful deployment:

1. ✅ Test the deployed app
2. ✅ Share the URL with your team
3. ✅ Set up custom domain (optional)
4. ✅ Configure automatic deployments (already enabled by default)

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

No manual deployment needed! 🎉

