const hre = require("hardhat");

async function main() {
  await hre.run('compile');

  const KYCRegistry = await hre.ethers.getContractFactory("KYCRegistry");
  const kycRegistry = await KYCRegistry.deploy();

  // For ethers v6 (Hardhat 2.17.0+)
  console.log("KYCRegistry deployed to:", kycRegistry.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
