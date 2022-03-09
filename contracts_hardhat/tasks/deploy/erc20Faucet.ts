import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { ERC20Faucet } from "../../src/types/ERC20Faucet";
import { ERC20Faucet__factory } from "../../src/types/factories/ERC20Faucet__factory";


// npx hardhat --network kovan deploy:ERC20Faucet --symbol FLX --name FLUX --decimals 18
// deployed to: 0xccA604e334471675cE294c2f68B3B158e29EfB86

task("deploy:ERC20Faucet")
  .addParam("name", "Token name")
  .addParam("symbol", "Token Symbol")
  .addParam("decimals", "Token decimals")
  .setAction(async function (taskArgs: TaskArguments, { ethers }) {
    const accounts: Signer[] = await ethers.getSigners();
    console.log("deployer = ", await accounts[0].getAddress());
   
    const erc20Faucet: ERC20Faucet__factory = <ERC20Faucet__factory>(
      await ethers.getContractFactory("ERC20Faucet")
    );
    const contract: ERC20Faucet = <ERC20Faucet> await erc20Faucet.deploy(taskArgs.name, taskArgs.symbol, Number(taskArgs.decimals));
    await contract.deployed();
    console.log("ERC20Faucet deployed to: ", contract.address);

  });
