import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
  const [scanning, setScanning] = useState(false);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = useRef<string>(`qr-reader-${Math.random().toString(36).substr(2, 9)}`);

  const stopQrScan = async () => {
    if (qrCodeRef.current) {
      try {
        await qrCodeRef.current.stop();
      } catch (err) {
        console.error("Error stopping QR scan", err);
      } finally {
        try {
          if (qrCodeRef.current) {
            qrCodeRef.current.clear();
          }
        } catch (e) {
          console.error("Error clearing QR scanner", e);
        }
        qrCodeRef.current = null;
        setScanning(false);
      }
    } else {
      setScanning(false);
    }
    
    // Stop all active video tracks
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      try {
        document.querySelectorAll('video').forEach((video) => {
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => {
              track.stop();
            });
            video.srcObject = null;
          }
        });
      } catch (e) {
        console.debug("Cleanup error (non-critical):", e);
      }
    }
  };

  const startQrScan = async () => {
    if (scanning || qrCodeRef.current) return;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera access is not available. Please check your browser permissions.');
        return;
      }

      const html5QrCode = new Html5Qrcode(scannerId.current);
      qrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          stopQrScan().then(() => {
            onScan(decodedText);
            toast.success('QR Code detected!');
          }).catch(() => {
            onScan(decodedText);
            toast.success('QR Code detected!');
          });
        },
        (errorMessage) => {
          if (errorMessage && !errorMessage.includes("NotFoundException")) {
            console.debug("QR scan:", errorMessage);
          }
        }
      );
      setScanning(true);
    } catch (err: any) {
      console.error("QR scan error", err);
      setScanning(false);
      if (err?.name === "NotAllowedError" || err?.message?.includes("permission")) {
        toast.error("Camera permission denied. Please allow camera access and try again.");
      } else if (err?.name === "NotFoundError" || err?.message?.includes("camera")) {
        toast.error("No camera found. Please ensure your device has a camera.");
      } else {
        toast.error("Failed to start QR scanner. Please try again.");
      }
      if (qrCodeRef.current) {
        qrCodeRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (showCamera) {
      startQrScan();
    } else {
      stopQrScan();
    }
    return () => {
      stopQrScan();
    };
  }, [showCamera]);

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

    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      toast.error('NFC requires a secure context (HTTPS or localhost)');
      return;
    }

    try {
      // @ts-ignore - NDEFReader is experimental
      const reader = new NDEFReader();
      
      toast.info('Tap your phone to the NFC tag...', { duration: 5000 });
      
      // @ts-ignore
      reader.onreading = (event: NDEFReadingEvent) => {
        const decoder = new TextDecoder();
        let foundUrl = false;
        
        for (const record of event.message.records) {
          try {
            if (record.recordType === 'text') {
              const text = decoder.decode(record.data);
              onScan(text);
              toast.success('NFC tag detected!');
              foundUrl = true;
              break;
            } else if (record.recordType === 'url') {
              // Handle URL records
              const url = decoder.decode(record.data);
              onScan(url);
              toast.success('NFC tag detected!');
              foundUrl = true;
              break;
            } else if (record.recordType === 'empty') {
              // Some tags have empty records, skip them
              continue;
            }
          } catch (err) {
            console.error('Error processing NFC record:', err);
          }
        }
        
        if (!foundUrl) {
          toast.warning('NFC tag detected but no valid URL found');
        }
      };
      
      // @ts-ignore
      reader.onreadingerror = (error: Error) => {
        console.error('NFC reading error:', error);
        toast.error('Error reading NFC tag. Please try again.');
      };
      
      await reader.scan();
    } catch (error: any) {
      console.error('NFC scan error:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('NFC permission denied. Please allow NFC access.');
      } else if (error.name === 'NotSupportedError') {
        toast.error('NFC is not supported on this device');
      } else if (error.message?.includes('not available')) {
        toast.error('NFC is not available. Make sure NFC is enabled on your device.');
      } else {
        toast.error('Failed to initialize NFC reader. Please try again.');
      }
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
                    Or
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
                {isNFCSupported ? 'Scan NFC Tag' : 'NFC Not Supported'}
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="relative">
                <div id={scannerId.current} className="w-full" />
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
                  onClick={() => {
                    setShowCamera(false);
                    stopQrScan();
                  }}
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
