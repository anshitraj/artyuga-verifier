import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Camera, X, Scan, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface ScannerProps {
  mode: 'mock' | 'onchain';
  onScan: (result: string) => void;
  onClose: () => void;
}

export const Scanner = ({ mode, onScan, onClose }: ScannerProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isNFCSupported] = useState('NDEFReader' in window);

  const handleQRScan = (result: any) => {
    if (result) {
      const text = result?.text || result;
      if (text) {
        onScan(text);
        toast.success('QR Code detected!');
      }
    }
  };

  const handleManualVerify = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
    } else {
      toast.error('Please enter a verification URL');
    }
  };

  const handleNFCScan = async () => {
    if (!isNFCSupported) {
      toast.error('NFC not supported on this device');
      return;
    }

    try {
      // @ts-ignore - NDEFReader is experimental
      const reader = new NDEFReader();
      await reader.scan();
      
      toast.info('Tap your phone to the NFC tag');
      
      // @ts-ignore
      reader.onreading = (event) => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          if (record.recordType === 'text') {
            const text = decoder.decode(record.data);
            onScan(text);
            toast.success('NFC tag detected!');
            break;
          }
        }
      };
    } catch (error) {
      toast.error('Failed to initialize NFC reader');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-scanner-overlay/95 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div>
            <h2 className="text-xl font-bold">
              Scan {mode === 'mock' ? 'Mock' : 'Onchain'} QR Code
            </h2>
            <p className="text-sm text-muted-foreground">
              Align QR code within the frame
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {!showCamera ? (
            <Card className="p-6 space-y-4">
              <Button
                onClick={() => setShowCamera(true)}
                className="w-full gap-2"
                size="lg"
              >
                <Camera className="w-5 h-5" />
                Start Camera
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Manual Input</label>
                <Textarea
                  placeholder="Paste verification URL here..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={handleManualVerify}
                  variant="secondary"
                  className="w-full gap-2"
                >
                  <Scan className="w-4 h-4" />
                  Verify Manually
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Future
                  </span>
                </div>
              </div>

              <Button
                onClick={handleNFCScan}
                variant="outline"
                className="w-full gap-2"
                disabled={!isNFCSupported}
              >
                <Radio className="w-4 h-4" />
                {isNFCSupported ? 'Scan NFC Tag (Beta)' : 'NFC Not Supported'}
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="relative">
                <QrReader
                  onResult={handleQRScan}
                  constraints={{ facingMode: 'environment' }}
                  containerStyle={{ width: '100%' }}
                  videoContainerStyle={{ paddingTop: '100%' }}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-primary/50 m-12 rounded-lg" />
                  <div className="absolute top-12 left-12 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-12 right-12 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-12 left-12 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-12 right-12 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
              </div>
              <div className="p-4">
                <Button
                  onClick={() => setShowCamera(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Close Camera
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
