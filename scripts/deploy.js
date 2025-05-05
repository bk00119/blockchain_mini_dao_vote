async function main() {
  const MiniDAO = await ethers.getContractFactory("MiniDAO");

  const proposal = ethers.utils.formatBytes32String("Buy Stock X?");
  const commitDuration = 60 * 5; // 5 mins
  const revealDuration = 60 * 5; // 5 mins

  const contract = await MiniDAO.deploy(
    proposal,
    commitDuration,
    revealDuration
  );
  await contract.deployed();

  console.log(`MiniDAO deployed to: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// npx hardhat run scripts/deploy.js --network sepolia
