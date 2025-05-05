// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MiniDAO {
    bytes32 public proposal;
    address public admin;
    uint40 public commitDeadline;
    uint40 public revealDeadline;

    mapping(address => bytes32) public commitments;
    mapping(address => bool) public hasRevealed;
    mapping(uint8 => uint) public voteCounts;

    constructor(bytes32 _proposal, uint64 commitDuration, uint64 revealDuration) {
        proposal = _proposal;
        admin = msg.sender;
        commitDeadline = uint40(block.timestamp + commitDuration);
        revealDeadline = uint40(commitDeadline + revealDuration);
    }

    function commitVote(bytes32 _commitment) external {
        require(block.timestamp <= commitDeadline, "Commit phase ended");
        commitments[msg.sender] = _commitment;
    }

    function revealVote(uint8 _vote, string memory _salt) external {
        require(block.timestamp > commitDeadline && block.timestamp <= revealDeadline, "Not in reveal phase");
        require(keccak256(abi.encodePacked(_vote, _salt)) == commitments[msg.sender], "Invalid reveal");
        require(!hasRevealed[msg.sender], "Already revealed");
        hasRevealed[msg.sender] = true;
        voteCounts[_vote]++;
    }

    function getTally() public view returns (uint256 yes, uint256 no) {
        return (voteCounts[1], voteCounts[0]);
    }

    function getCurrentPhase() public view returns (uint8) {
        if (block.timestamp <= commitDeadline) {
            return 0; // Commit
        } else if (block.timestamp <= revealDeadline) {
            return 1; // Reveal
        } else {
            return 2; // Ended
        }
    }
}
