import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();

  // Token cfg
  const initSum = 5000;
  const initAddress = signers[0];
  const tokenName = 'Kostayne Token';
  const tokenSymbol = 'KST';

  const token = await ethers.deployContract('MyToken', [tokenName, tokenSymbol, initAddress, initSum]);

  await token.waitForDeployment();
  
  console.log('Token deployed to:', token.address);
  console.log(`Minted ${initSum}${tokenSymbol} to ${initAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
