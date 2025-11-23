import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { WalletStatus } from '@/components/WalletStatus';
import { Scanner } from '@/components/Scanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Link2, QrCode, Radio } from 'lucide-react';
import { parseVerificationUrl } from '@/utils/verification';
import { sdk } from '@farcaster/miniapp-sdk';
import { QRCodeSVG } from 'qrcode.react';

export default function Index() {
  useEffect(() => {
    // Tell Base/Farcaster that the app is ready
    sdk.actions.ready();
  }, []);

  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'mock' | 'onchain'>('mock');
  const navigate = useNavigate();

  const demoMockUrl = "https://artyuga-demo.xyz/verify/mock?shopId=1&artId=3";
  const demoOnchainUrl = "https://artyuga.app/verify/onchain?chain=base&contract=0x9e389a61F96CAa8204dcA1A7E66a01d9493D49bC&tokenId=1";

  const handleStartScan = (mode: 'mock' | 'onchain') => {
    setScanMode(mode);
    setShowScanner(true);
  };

  const handleScan = (result: string) => {
    const parsed = parseVerificationUrl(result);
    
    const params = new URLSearchParams({
      mode: parsed.type,
      ...parsed.params,
    });

    navigate(`/result?${params.toString()}`);
    setShowScanner(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <Header />

      <main className="mx-auto flex min-h-[100vh] max-w-[500px] w-full flex-col gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-4 sm:py-6 md:py-8">
          <div className="inline-block p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
            <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Verify Artwork Ownership
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Scan a QR code or tap an NFC tag to verify Artyuga artwork authenticity on Base blockchain
          </p>
        </div>

        {/* Scan Mode Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Demo Mode</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Test with mock data from Artyuga marketplace demos
                </p>
                <Button
                  onClick={() => handleStartScan('mock')}
                  className="w-full gap-2 text-sm sm:text-base py-2 sm:py-3"
                  variant="secondary"
                >
                  <Sparkles className="w-4 h-4" />
                  Scan Mock QR
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4 hover:border-accent/50 transition-colors cursor-pointer group">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Onchain Mode</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Verify real NFT ownership on Base blockchain
                </p>
                <Button
                  onClick={() => handleStartScan('onchain')}
                  className="w-full gap-2 text-sm sm:text-base py-2 sm:py-3"
                >
                  <Link2 className="w-4 h-4" />
                  Scan Onchain QR
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Scan Section */}
        <section className="grid gap-4 sm:gap-6 md:grid-cols-2 w-full">
          <div className="rounded-2xl sm:rounded-3xl border border-purple-500/40 bg-slate-950/80 p-3 sm:p-4 md:p-5">
            <h2 className="mb-2 text-sm sm:text-base font-semibold text-slate-100">
              Scan a code
            </h2>
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-slate-400">
              Use your camera or NFC reader to scan a demo or real Artyug code.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={() => handleStartScan('mock')}
                className="w-full rounded-xl bg-purple-600 py-3 sm:py-3 md:py-4 text-sm sm:text-base font-medium text-white hover:bg-purple-500 transition-colors"
              >
                Scan Demo QR (Mock JSON)
              </Button>
              <Button
                onClick={() => handleStartScan('onchain')}
                variant="outline"
                className="w-full rounded-xl border border-purple-500/60 bg-slate-950 py-3 sm:py-3 md:py-4 text-sm sm:text-base font-medium text-purple-100 hover:bg-purple-900/40 transition-colors"
              >
                Scan Onchain QR (Base)
              </Button>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950/80 p-3 sm:p-4 md:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-100">
              Example QR codes for your slide
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <QRCodeSVG value={demoMockUrl} className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
                <p className="text-[10px] sm:text-xs text-slate-400 break-words">
                  Mock demo QR (reads JSON from your demo site)
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <QRCodeSVG value={demoOnchainUrl} className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
                <p className="text-[10px] sm:text-xs text-slate-400 break-words">
                  Future real onchain QR (Base NFT)
                </p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500">
              These will be scanned live during your pitch from the projector / slide deck.
            </p>
          </div>
        </section>

        {/* Wallet Status */}
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            Your Portfolio
          </h2>
          <WalletStatus />
        </div>

        {/* Footer Note */}
        <footer className="mt-auto pb-4 text-center text-[10px] sm:text-xs text-slate-500">
          Powered by Artyug • Built for Base Mini Apps • NFC support enabled
        </footer>
      </main>

      {/* Scanner Modal */}
      {showScanner && (
        <Scanner
          mode={scanMode}
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
