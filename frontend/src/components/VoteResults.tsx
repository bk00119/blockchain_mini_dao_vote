"use client";

import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { sepolia } from "wagmi/chains";
import { contractAddress } from "@/lib/contractConfig";
import { useEffect } from "react";

if (!contractAddress) {
  throw new Error("Missing contract address in environment variables");
}

const abi = parseAbi([
  "function getTally() view returns (uint256 yesVotes, uint256 noVotes)",
]);

export default function VoteResults() {
  const {
    data: tallyData,
    isLoading,
    error,
  } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "getTally",
    chainId: sepolia.id,
    enabled: true,
  });

  const yesVotes = tallyData?.[0];
  const noVotes = tallyData?.[1];

  useEffect(() => {
    const voteRevealed = localStorage.getItem("vote-revealed");
    const voteSubmitted = localStorage.getItem("vote-submitted");
    if (voteRevealed) {
      localStorage.removeItem("vote-revealed");
    }
    if (voteSubmitted) {
      localStorage.removeItem("vote-submitted");
    }      
  }, []);

  return (
    <div className="m-4 w-fit min-w-sm max-w-md lex flex-col gap-4">
      <h2 className="text-lg font-semibold">Vote Results</h2>
        <>
          {isLoading && <p className="text-gray-500">Loading vote counts...</p>}
          {error && <p className="text-red-500">Error loading votes</p>}
          {/* VOTE RESULTS */}
          {!isLoading && !error && (
            <>
              <p>Yes: {BigInt(yesVotes ?? 0).toString()}</p>
              <p>No: {BigInt(noVotes ?? 0).toString()}</p>
            </>
          )}
        </>
    </div>
  );
}
