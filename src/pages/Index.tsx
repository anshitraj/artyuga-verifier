import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { WalletStatus } from '@/components/WalletStatus';
import { Scanner } from '@/components/Scanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Link2, QrCode, Radio } from 'lucide-react';
import { parseVerificationUrl } from '@/utils/verification';

export default function Index() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'mock' | 'onchain'>('mock');
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8 md:py-12">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
            <QrCode className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Verify Artwork Ownership
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scan a QR code or tap an NFC tag to verify Artyuga artwork authenticity on Base blockchain
          </p>
        </div>

        {/* Scan Mode Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Demo Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Test with mock data from Artyuga marketplace demos
                </p>
                <Button
                  onClick={() => handleStartScan('mock')}
                  className="w-full gap-2"
                  variant="secondary"
                >
                  <Sparkles className="w-4 h-4" />
                  Scan Mock QR
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 hover:border-accent/50 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Link2 className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Onchain Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Verify real NFT ownership on Base blockchain
                </p>
                <Button
                  onClick={() => handleStartScan('onchain')}
                  className="w-full gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  Scan Onchain QR
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Wallet Status */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            Your Portfolio
          </h2>
          <WalletStatus />
        </div>

        {/* Features */}
        <Card className="p-6 bg-gradient-to-br from-card/50 to-card/30 border-border/50">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What You Can Do</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <QrCode className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">QR Scanning</p>
                  <p className="text-muted-foreground">
                    Instant verification via camera or manual input
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Radio className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">NFC Support</p>
                  <p className="text-muted-foreground">
                    Future: Tap to verify with NFC-enabled tags
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Link2 className="w-5 h-5 text-primary-glow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Blockchain Verified</p>
                  <p className="text-muted-foreground">
                    Direct reads from Base network smart contracts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground">
          Supports QR codes generated by Artyuga Marketplace and future NFC tags
        </p>
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
