import hre from "hardhat";
import { ethers } from "ethers";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  // Get network name from command line or use default
  // When running with --network base, Hardhat sets it but hre.network.name might be undefined
  // So we'll get it from the config or use a fallback
  const availableNetworks = Object.keys(hre.config.networks || {});
  const networkName = hre.network?.name || process.argv.find(arg => arg.startsWith('--network'))?.split('=')[1] || 'base';
  
  console.log("Using network:", networkName);
  
  // Get network config
  const network = hre.config.networks?.[networkName];
  
  if (!network || !network.url) {
    throw new Error(`Network ${networkName} is not configured with a URL. Available networks: ${availableNetworks.join(", ")}`);
  }

  // Create provider and wallet
  // Read RPC URL directly from environment variable (more reliable than Hardhat config)
  let rpcUrl;
  if (networkName === 'base') {
    rpcUrl = process.env.BASE_MAINNET_RPC;
  } else if (networkName === 'baseSepolia') {
    rpcUrl = process.env.BASE_SEPOLIA_RPC;
  } else {
    throw new Error(`Unknown network: ${networkName}`);
  }
  
  if (!rpcUrl || typeof rpcUrl !== 'string') {
    throw new Error(`Invalid RPC URL for network ${networkName}. Make sure the RPC URL is set in your .env file.`);
  }
  
  console.log("RPC URL:", rpcUrl);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Read private key directly from environment variable (more reliable than Hardhat config)
  let privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error(`No private key found in environment. Make sure PRIVATE_KEY is set in your .env file.`);
  }

  // Convert to string and trim any whitespace (spaces, newlines, carriage returns)
  privateKey = String(privateKey).trim();

  // Debug: Show the exact private key value and length after trimming
  console.log("PRIVATE KEY (trimmed):", `"${privateKey}"`, "Length:", privateKey.length);

  // Validate private key format (should start with 0x and be 66 chars)
  if (typeof privateKey !== 'string' || !privateKey.startsWith('0x') || privateKey.length !== 66) {
    throw new Error(`Invalid private key format. Private key should start with '0x' and be 66 characters long. Make sure PRIVATE_KEY in .env is correct.`);
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  const deployer = wallet;

  console.log("Deploying Artyuga contract with address:", deployer.address);
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Load contract artifact
  const contractArtifact = await hre.artifacts.readArtifact("ArtyugaArtwork");
  
  // Deploy contract
  const factory = new ethers.ContractFactory(
    contractArtifact.abi,
    contractArtifact.bytecode,
    deployer
  );

  const contract = await factory.deploy(deployer.address);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("ArtyugaArtwork deployed at:", contractAddress);
  console.log("\n✅ Deployment successful!");
  console.log("\nContract details:");
  console.log("- Network:", networkName);
  console.log("- Contract Address:", contractAddress);
  console.log("- Owner:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

