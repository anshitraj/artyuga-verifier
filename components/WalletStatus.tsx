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
        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
        disabled={isPending}
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs">
      <div className="flex flex-col">
        <span className="font-mono text-slate-100">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <span className="text-[10px] text-slate-400">
          Chain: {chainId === base.id ? "Base" : `Other (${chainId})`}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[11px] text-slate-300">
          Balance: {balance ? `${balance.formatted.slice(0, 6)} ${balance.symbol}` : "—"}
        </span>
        <button
          onClick={() => disconnect()}
          className="text-[10px] text-slate-400 hover:text-slate-200"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

