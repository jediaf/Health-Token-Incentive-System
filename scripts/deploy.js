const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 Deploying HealthToken contract...");

    // Get the verifier address from environment variable or use the deployer
    const [deployer] = await hre.ethers.getSigners();
    const verifierAddress = process.env.VERIFIER_ADDRESS || deployer.address;

    console.log("Deploying with account:", deployer.address);
    console.log("Verifier address:", verifierAddress);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    // Deploy the HealthToken contract
    const HealthToken = await hre.ethers.getContractFactory("HealthToken");
    const healthToken = await HealthToken.deploy(verifierAddress);

    await healthToken.waitForDeployment();

    const contractAddress = await healthToken.getAddress();

    console.log("\n✅ HealthToken deployed successfully!");
    console.log("📍 Contract address:", contractAddress);
    console.log("🔐 Verifier address:", verifierAddress);
    console.log("\n📝 Add this to your .env.local file:");
    console.log(`CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`VERIFIER_PRIVATE_KEY=<your_verifier_private_key>`);
    console.log("\n⚠️  Make sure the verifier private key matches the verifier address!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
