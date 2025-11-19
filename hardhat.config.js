import dotenv from "dotenv";

dotenv.config();

export default {
  solidity: "0.8.20",
  networks: {
    base: {
      url: process.env.BASE_MAINNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
      type: "http",
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY],
      type: "http",
    },
  },
};

