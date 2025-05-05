"use client";

import { useState, useEffect } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { parseAbi } from "viem";
import { sepolia } from "wagmi/chains";
import { contractAddress } from "@/lib/contractConfig";

if (!contractAddress) {
  throw new Error("Missing contract address in environment variables");
}

const abi = parseAbi([
  "function tallyVotes() external",
  "function getTally() view returns (uint256 yesVotes, uint256 noVotes)",
]);

export default function VoteTally() {
  const { writeContractAsync } = useWriteContract();
  const [tallied, setTallied] = useState(false);

  const {
    data: tallyData,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "getTally",
    chainId: sepolia.id,
    enabled: true,
    refreshInterval: 10_000,
  });

  const handleTallyVotes = async () => {
    try {
      await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "tallyVotes",
        chainId: sepolia.id,
      });
      alert("Votes tallied!");
      setTallied(true);
      await refetch();
    } catch (err) {
      console.error("Tally failed", err);
      alert("Tally failed or already completed.");
    }
  };

  useEffect(() => {
    if (tallyData) {
      const [yes, no] = tallyData;
      const bothZero = BigInt(yes) === BigInt(0) && BigInt(no) === BigInt(0);
      setTallied(!bothZero);
    }
  }, [tallyData]);

  const yesVotes = tallyData?.[0];
  const noVotes = tallyData?.[1];

  return (
    <div className="m-4 w-fit min-w-sm max-w-md lex flex-col gap-4">
      <h2 className="text-lg font-semibold">Vote Results</h2>
      {!tallied ? (
        <>
          <p>
            Tally must be triggered after the reveal phase to see vote counts
          </p>
          {/* VOTE TALLY BUTTON */}
          <button
            onClick={handleTallyVotes}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Tally Votes
          </button>
        </>
      ) : (
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
      )}
    </div>
  );
}
