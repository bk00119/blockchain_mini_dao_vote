"use client";

import { useState, useEffect } from "react";
import { parseAbi } from "viem";
import { useWriteContract, useAccount } from "wagmi";
import { contractAddress } from "@/lib/contractConfig";

export default function RevealVoteForm() {
  const { isConnected } = useAccount();
  const [vote, setVote] = useState<0 | 1>(1);
  const [salt, setSalt] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleSubmit = () => {
    if (!isConnected || isPending || !salt) {
      alert("Please connect your wallet and enter salt.");
      return;
    }

    if (submitted) {
      alert("Vote already revealed.");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: parseAbi(["function revealVote(uint8 vote, string salt) external"]),
      functionName: "revealVote",
      args: [vote, salt],
    });

    setSubmitted(true);
    localStorage.setItem("vote-revealed", "true");
  };

  useEffect(() => {
    const voteRevealed = localStorage.getItem("vote-revealed");
    if (voteRevealed) {
      setSubmitted(true);
    }
    if (error){
      setSubmitted(false);
    }
  }, [error]);

  return (
    <div className="m-4 w-fit min-w-md max-w-md flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Reveal Your Vote</h2>
      {/* VOTE SELECTION */}
      <div>
        <label className="block mb-1">Select your vote</label>
        <div className="flex gap-4">
          <label className="cursor-pointer">
            <input
              type="radio"
              checked={vote === 1}
              onChange={() => setVote(1)}
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              checked={vote === 0}
              onChange={() => setVote(0)}
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>

      {/* SALT INPUT */}
      <div>
        <label className="block mb-1">Salt from commit phase</label>
        <input
          type="text"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Type the same salt"
        />
      </div>

      {/* VOTE REVEAL BUTTON */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Revealing..." : "Submit Reveal"}
      </button>

      {isSuccess && submitted && <p>✅ Vote revealed!</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
    </div>
  );
}
