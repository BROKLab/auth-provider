import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  react: {
    providerPriority: ["besuDev", "web3modal", "hardhat"],
  },
  networks: {
    brreg: {
      url:
        "https://e0cteq8qnh:IY2scS2ywMZkinR5m4sS7GBs7EDgm4Mh9F1uUVkmKFI@e0qchlost7-e0zi3w4q2r-rpc.de0-aws.kaleido.io",
      providerType: "JsonRpcProvider",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },
    besuDev: {
      url: "http://localhost:8545",
      providerType: "JsonRpcProvider",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.7.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
};
export default config;
