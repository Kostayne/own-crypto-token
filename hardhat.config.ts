import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",

  networks: {
    hardhat: {
      gas: 'auto',

      // needed for metamask extension
      initialBaseFeePerGas: 0,
    },
  },
};

export default config;
