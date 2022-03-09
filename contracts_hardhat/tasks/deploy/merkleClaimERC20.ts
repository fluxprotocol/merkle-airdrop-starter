import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { MerkleClaimERC20 } from "../../src/types/MerkleClaimERC20";
import { MerkleClaimERC20__factory } from "../../src/types/factories/MerkleClaimERC20__factory";
import { getAddress } from "ethers/lib/utils";

// npx hardhat --network kovan deploy:MerkleClaimERC20 --merkleroot 0xd46fd9b0e58ae7bce8b9c304304df48f323e967fd6e644a86593556f8edaffe9 --tokenaddress  0xccA604e334471675cE294c2f68B3B158e29EfB86
// deployed to: 0x25C213D9b785416EA0244f4e4814a2600F147143

task("deploy:MerkleClaimERC20")
  .addParam("merkleroot", "The recepients merkle root")
  .addParam("tokenaddress", "The token to be claimed")
  .setAction(async function (taskArgs: TaskArguments, { ethers }) {
    const accounts: Signer[] = await ethers.getSigners();

    console.log("deployer = ", await accounts[0].getAddress());
    console.log("token address = ", getAddress(taskArgs.tokenaddress));
    console.log("merkle root = ", taskArgs.merkleroot);

    const merkleClaimERC20: MerkleClaimERC20__factory = <MerkleClaimERC20__factory>(
      await ethers.getContractFactory("MerkleClaimERC20")
    );
    

    const contract: MerkleClaimERC20 = <MerkleClaimERC20> await merkleClaimERC20.deploy(taskArgs.merkleroot, getAddress(taskArgs.tokenaddress));
    await contract.deployed();
    console.log("MerkleClaimERC20 deployed to: ", contract.address);

  });
