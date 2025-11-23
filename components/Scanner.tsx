// components/Scanner.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, Nfc, Keyboard } from "lucide-react";

type ScannerProps = {
  mode: "mock" | "onchain";
  onScan: (value: string) => void;
};

export function Scanner({ mode, onScan }: ScannerProps) {
  const [manual, setManual] = useState("");
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = useRef<string>(`qr-reader-${Math.random().toString(36).substr(2, 9)}`);

  const stopQrScan = useCallback(async () => {
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
    
    // Stop all active video tracks from any source (fallback cleanup)
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      try {
        document.querySelectorAll('video').forEach(video => {
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => {
              track.stop();
            });
            video.srcObject = null;
          }
        });
      } catch (e) {
        // Ignore cleanup errors
        console.debug("Cleanup error (non-critical):", e);
      }
    }
  }, []);

  const startQrScan = async () => {
    if (scanning || qrCodeRef.current) return;

    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is not available. Please check your browser permissions.");
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
          // Stop immediately after successful scan
          stopQrScan().then(() => {
            onScan(decodedText);
          }).catch(() => {
            // Even if stop fails, proceed with scan result
            onScan(decodedText);
          });
        },
        (errorMessage) => {
          // Ignore scanning errors (they're expected during scanning)
          // Only log if it's a critical error
          if (errorMessage && !errorMessage.includes("NotFoundException")) {
            console.debug("QR scan:", errorMessage);
          }
        }
      );
      setScanning(true);
    } catch (err: any) {
      console.error("QR scan error", err);
      setScanning(false);
      // Provide user-friendly error messages
      if (err?.name === "NotAllowedError" || err?.message?.includes("permission")) {
        alert("Camera permission denied. Please allow camera access and try again.");
      } else if (err?.name === "NotFoundError" || err?.message?.includes("camera")) {
        alert("No camera found. Please ensure your device has a camera.");
      } else {
        alert("Failed to start QR scanner. Please try again.");
      }
      // Clean up on error
      if (qrCodeRef.current) {
        qrCodeRef.current = null;
      }
    }
  };

  useEffect(() => {
    // Very basic NFC feature detection (Web NFC)
    if (typeof window !== "undefined" && "NDEFReader" in window) {
      setNfcSupported(true);
    }

    // Stop camera when page becomes hidden
    const handleVisibilityChange = () => {
      if (document.hidden && qrCodeRef.current) {
        stopQrScan();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().catch(() => {});
        qrCodeRef.current.clear();
      }
    };
  }, [stopQrScan]);

  // Cleanup on unmount - ensure camera is stopped
  useEffect(() => {
    return () => {
      // Force stop camera on unmount
      const cleanup = async () => {
        if (qrCodeRef.current) {
          try {
            await qrCodeRef.current.stop();
          } catch (e) {
            // Ignore errors
          }
          try {
            qrCodeRef.current.clear();
          } catch (e) {
            // Ignore errors
          }
          qrCodeRef.current = null;
        }
        // Stop all video tracks from video elements
        document.querySelectorAll('video').forEach(video => {
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => {
              track.stop();
              video.srcObject = null;
            });
          }
        });
      };
      cleanup();
    };
  }, []);

  const handleManualSubmit = () => {
    if (!manual.trim()) return;
    onScan(manual.trim());
  };

  const handleNfcScan = async () => {
    if (!nfcSupported) {
      setNfcStatus("NFC not supported on this device.");
      return;
    }
    
    // Check if we're in a secure context (HTTPS or localhost)
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setNfcStatus("NFC requires a secure context (HTTPS or localhost).");
      return;
    }

    try {
      // @ts-ignore - Web NFC types not in TS by default
      const reader = new NDEFReader();
      
      // Set up error handler
      // @ts-ignore
      reader.onerror = (event: any) => {
        console.error("NFC error:", event);
        setNfcStatus("NFC scan error. Please try again.");
      };

      await reader.scan();
      setNfcStatus("Tap your phone to the NFC tag…");
      
      // @ts-ignore
      reader.onreading = (event: any) => {
        try {
          const message = event.message;
          if (!message || !message.records || message.records.length === 0) {
            setNfcStatus("No data found on NFC tag.");
            return;
          }
          
          for (const record of message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder(record.encoding || "utf-8");
              const url = textDecoder.decode(record.data);
              setNfcStatus("NFC tag read successfully.");
              onScan(url);
              // Stop scanning after successful read
              try {
                // @ts-ignore
                reader.onreading = null;
              } catch (e) {
                // Ignore cleanup errors
              }
              return;
            } else if (record.recordType === "url") {
              // Also handle URL records
              const url = new TextDecoder().decode(record.data);
              setNfcStatus("NFC tag read successfully.");
              onScan(url);
              try {
                // @ts-ignore
                reader.onreading = null;
              } catch (e) {
                // Ignore cleanup errors
              }
              return;
            }
          }
          setNfcStatus("No text or URL record found on NFC tag.");
        } catch (e) {
          console.error("Error reading NFC tag:", e);
          setNfcStatus("Failed to read NFC tag data.");
        }
      };
    } catch (e: any) {
      console.error("NFC scan error:", e);
      if (e?.name === "NotAllowedError" || e?.message?.includes("permission")) {
        setNfcStatus("NFC permission denied. Please allow NFC access.");
      } else if (e?.name === "NotSupportedError") {
        setNfcStatus("NFC not supported on this device.");
      } else {
        setNfcStatus(`Error starting NFC scan: ${e?.message || "Unknown error"}`);
      }
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      <div className="rounded-xl sm:rounded-2xl border border-purple-500/40 bg-slate-900/60 p-3 sm:p-4 w-full">
        <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2 text-xs sm:text-sm text-purple-200">
          <div className="flex items-center gap-2">
            <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Scan {mode === "mock" ? "demo" : "onchain"} QR</span>
          </div>
          {scanning && (
            <button
              onClick={stopQrScan}
              className="text-xs text-purple-300 hover:text-purple-100"
            >
              Stop
            </button>
          )}
        </div>
        <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-black relative w-full">
          <div id={scannerId.current} className="w-full h-full" />
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startQrScan}
                className="rounded-xl bg-purple-600 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white hover:bg-purple-500 transition-colors"
              >
                Start Camera
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-slate-700 bg-slate-900/60 p-3 sm:p-4 space-y-2 sm:space-y-3 w-full">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
          <Keyboard className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Or paste NFC / QR URL manually</span>
        </div>
        <textarea
          className="w-full rounded-lg sm:rounded-xl border border-slate-700 bg-slate-950/80 p-2 sm:p-3 text-xs sm:text-sm text-slate-100 outline-none focus:border-purple-500 resize-none"
          rows={3}
          placeholder="Paste something like https://artyuga-demo.xyz/verify/mock?shopId=1&artId=3"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
        />
        <button
          onClick={handleManualSubmit}
          className="w-full rounded-lg sm:rounded-xl bg-purple-600 py-3 sm:py-3 md:py-4 text-xs sm:text-sm font-medium text-white hover:bg-purple-500 transition-colors"
        >
          Verify manually
        </button>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-slate-700 bg-slate-900/60 p-3 sm:p-4 space-y-2 w-full">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
          <Nfc className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Scan NFC tag (beta)</span>
        </div>
        <button
          onClick={handleNfcScan}
          className="w-full rounded-lg sm:rounded-xl border border-purple-500/60 py-3 sm:py-3 md:py-4 text-xs sm:text-sm font-medium text-purple-100 hover:bg-purple-900/30 transition-colors"
        >
          Start NFC scan
        </button>
        {nfcStatus && (
          <p className="text-xs text-slate-400 mt-1 min-h-[1.5rem] break-words">{nfcStatus}</p>
        )}
      </div>
    </div>
  );
}

