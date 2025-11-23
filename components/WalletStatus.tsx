// components/WalletStatus.tsx
"use client";

import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { base } from "wagmi/chains";

export function WalletStatus() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balance } = useBalance({
    address,
    chainId: base.id,
    query: { enabled: !!address },
  });

  if (!isConnected) {
    const primary = connectors[0];
    return (
      <button
        onClick={() => connect({ connector: primary })}
        className="rounded-lg sm:rounded-xl bg-purple-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-purple-500 transition-colors w-full sm:w-auto"
        disabled={isPending}
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-700 bg-slate-900/70 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs w-full sm:w-auto">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-mono text-slate-100 truncate">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <span className="text-[9px] sm:text-[10px] text-slate-400">
          Chain: {chainId === base.id ? "Base" : `Other (${chainId})`}
        </span>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-[10px] sm:text-[11px] text-slate-300">
          Balance: {balance ? `${balance.formatted.slice(0, 6)} ${balance.symbol}` : "—"}
        </span>
        <button
          onClick={() => disconnect()}
          className="text-[9px] sm:text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

