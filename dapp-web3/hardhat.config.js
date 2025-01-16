require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
const RPC_URL = "https://rpc.ankr.com/polygon_mumbai";

const {
  SOLIDITY_VERSION,
  INFURA_URL,
  INFURA_API_KEY,
  API_URL,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

module.exports = {
  solidity: "0.8.24",
  // defaultNetwork: "hardhat",
  defaultNetwork: "sepolia",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    // polygon_amoy: {
    //   url: NEXT_PUBLIC_POLYGON_MUMBAI_RPC,
    //   accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
    // },
    // polygon_mumbai: {
    //   url: "https://rpc.ankr.com/polygon_mumbai",
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
  },
};
