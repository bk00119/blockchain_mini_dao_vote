# INSTRUCTIONS
```sh
vim .env
# PRIVATE_KEY: Crypto Wallet Private Key (ex. MetaMask)
# ALCHEMY_API_KEY: API Key from dashboard.alchemy.com
```


# CREATE CONTRACT
```sh
npx hardhat run scripts/deploy.js --network sepolia
# Vote Commit Duration: 5 minutes
# Vote Reveal Duration: 5 minutes
```

# LOCAL NEXT.JS APP
```sh
cd frontend
vim .env.local
# NEXT_PUBLIC_CONTRACT_ADDRESS: Output from npx hardhat run scripts/deploy.js --network sepolia
# NEXT_PUBLIC_PROJECT_ID: Project ID from https://cloud.reown.com

npm run dev

# Within 5 minutes of contract creation, a vote must be committed.
# After 5 minutes of contract creation, a vote can be revealed. If not revealed, the vote will not be counted.
# After 10 minutes of contract creation, the vote results can be checked.
```