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
        qrCodeRef.current.clear();
        qrCodeRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error("Error stopping QR scan", err);
        // Force cleanup even if stop fails
        qrCodeRef.current = null;
        setScanning(false);
      }
    }
    // Stop all active video tracks from any source
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      try {
        // Get all media tracks and stop them
        const devices = await navigator.mediaDevices.enumerateDevices();
        // This is a fallback - html5-qrcode should handle it, but just in case
        const tracks = document.querySelectorAll('video').forEach(video => {
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
        });
      } catch (e) {
        // Ignore errors
      }
    }
  }, []);

  const startQrScan = async () => {
    if (scanning || qrCodeRef.current) return;

    try {
      const html5QrCode = new Html5Qrcode(scannerId.current);
      qrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          // Stop immediately after scan
          if (qrCodeRef.current) {
            qrCodeRef.current.stop().catch(() => {}).finally(() => {
              if (qrCodeRef.current) {
                qrCodeRef.current.clear();
                qrCodeRef.current = null;
              }
              setScanning(false);
            });
          }
        },
        (errorMessage) => {
          // Ignore scanning errors
        }
      );
      setScanning(true);
    } catch (err) {
      console.error("QR scan error", err);
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
    try {
      // @ts-ignore - Web NFC types not in TS by default
      const reader = new NDEFReader();
      await reader.scan();
      setNfcStatus("Tap your phone to the NFC tag…");
      // @ts-ignore
      reader.onreading = (event: any) => {
        try {
          const message = event.message;
          for (const record of message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder(record.encoding || "utf-8");
              const url = textDecoder.decode(record.data);
              setNfcStatus("NFC tag read successfully.");
              onScan(url);
              return;
            }
          }
          setNfcStatus("No text record found on NFC tag.");
        } catch (e) {
          console.error(e);
          setNfcStatus("Failed to read NFC tag.");
        }
      };
    } catch (e) {
      console.error(e);
      setNfcStatus("Error starting NFC scan.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-purple-500/40 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-2 text-sm text-purple-200">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
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
        <div className="aspect-square overflow-hidden rounded-xl bg-black relative">
          <div id={scannerId.current} className="w-full h-full" />
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startQrScan}
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
              >
                Start Camera
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-200">
          <Keyboard className="h-4 w-4" />
          <span>Or paste NFC / QR URL manually</span>
        </div>
        <textarea
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-2 text-sm text-slate-100 outline-none focus:border-purple-500"
          rows={3}
          placeholder="Paste something like https://artyuga-demo.xyz/verify/mock?shopId=1&artId=3"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
        />
        <button
          onClick={handleManualSubmit}
          className="w-full rounded-xl bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-500"
        >
          Verify manually
        </button>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-200">
          <Nfc className="h-4 w-4" />
          <span>Scan NFC tag (beta)</span>
        </div>
        <button
          onClick={handleNfcScan}
          className="w-full rounded-xl border border-purple-500/60 py-2 text-sm font-medium text-purple-100 hover:bg-purple-900/30"
        >
          Start NFC scan
        </button>
        {nfcStatus && (
          <p className="text-xs text-slate-400 mt-1 min-h-[1.5rem]">{nfcStatus}</p>
        )}
      </div>
    </div>
  );
}

