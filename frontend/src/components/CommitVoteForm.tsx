"use client";

import { useState, useEffect } from "react";
import { keccak256, encodePacked, parseAbi } from "viem";
import { useWriteContract, useAccount } from "wagmi";
import { contractAddress } from "@/lib/contractConfig";

export default function CommitVoteForm() {
  const [vote, setVote] = useState<0 | 1>(1);
  const [salt, setSalt] = useState("");
  const [hash, setHash] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { isConnected } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const calculateHash = () => {
    const packed = encodePacked(["uint8", "string"], [vote, salt]);
    const hashed = keccak256(packed);
    setHash(hashed);
  };

  const handleSubmit = () => {
    if (!isConnected || isPending || !hash) {
      alert("Please connect wallet and generate hash first.");
      return;
    }

    if (submitted) {
      alert("Vote already submitted.");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: parseAbi(["function commitVote(bytes32 _commitment) external"]),
      functionName: "commitVote",
      args: [hash],
    });

    setSubmitted(true);
    localStorage.setItem("vote-submitted", "true");
  };

  useEffect(() => {
    const voteSubmitted = localStorage.getItem("vote-submitted");
    if (voteSubmitted) {
      setSubmitted(true);
    }
    if (error) {
      setSubmitted(false);
    }
  }, [error]);

  return (
    <div className="m-4 w-fit min-w-sm max-w-md flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Vote</h2>
      {!submitted && (
        <>
          {/* VOTE SELECTION */}
          <div>
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
            <label className="block mb-1">Salt</label>
            <input
              type="text"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Type a string to generate hash"
            />
          </div>

          {/* HASH VALUE */}
          {hash && <p className="w-full">Hash: {hash}</p>}
          <div className="flex flex-row">
            {/* HASH GENERATION BUTTON */}
            <button
              onClick={calculateHash}
              className="bg-gray-600 text-white px-4 py-2 mr-2 rounded cursor-pointer"
            >
              Generate Hash
            </button>

            {/* VOTE SUBMISSION BUTTON */}
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Submit Vote
            </button>
          </div>
        </>
      )}

      {/* VOTE SUBMISSION RESULT */}
      {submitted && <p>Vote submitted!</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
    </div>
  );
}
