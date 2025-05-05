"use client";

import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { sepolia } from "wagmi/chains";
import ConnectWallet from "@/components/ConnectWallet";
import CommitVoteForm from "@/components/CommitVoteForm";
import RevealVoteForm from "@/components/RevealVoteForm";
import VoteResults from "@/components/VoteResults";
import { contractAddress } from "@/lib/contractConfig";

if (!contractAddress) {
  throw new Error("Missing contract address in environment variables");
}

const abi = parseAbi(["function getCurrentPhase() view returns (uint8)"]);

export default function Page() {
  const { data: phase, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "getCurrentPhase",
    chainId: sepolia.id,
    enabled: true,
    refreshInterval: 10_000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [phase, refetch]);

  return (
    <main className="p-6 space-y-6">
      <ConnectWallet />
      {phase === 0 ? (
        <CommitVoteForm />
      ) : phase === 1 ? (
        <RevealVoteForm />
      ) : phase === 2 ? (
        <VoteResults />
      ) : (
        <p className="text-gray-500">Loading contract...</p>
      )}
    </main>
  );
}
