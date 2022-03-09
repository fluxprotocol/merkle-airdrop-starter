import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { MerkleClaimERC20 } from "../../src/types/MerkleClaimERC20";
import type { ERC20Faucet } from "../../src/types/ERC20Faucet";
import { getAddress } from "ethers/lib/utils";

import { Signers } from "../types";
import { shouldBehaveLikeMerkleAirdrop } from "./MerkleAirdrop.behaviour";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.nonadmin = signers[1];
  });

  describe("MerkleClaimERC20", function () {
    beforeEach(async function () {
      let merkleRoot = "0xd46fd9b0e58ae7bce8b9c304304df48f323e967fd6e644a86593556f8edaffe9";
      this.user1CorrectProof = [
        "0xf606f9ec80f988b5cd8506c7b47b731cf8170544c12045645c5d0577cb077c29",
        "0xf1b69391a46ebf09c49b38a55a6e829321ee15cab1742a238279cd0b994837ef",
        "0x48cea6996d916f8c872ab49d03b2833d5884c89cbb1368d76cc0b7dd808ef25c",
        "0x4809d994c9b352b50e6ca9600c3e483c86a540e0fd7a90a1ef27947cc61cf2a0",
        "0x1508c2851746dea7c64d0818ad1e4e16033baf15baed165ea76650b514d2487a",
        "0x7ec4ccb50c0f645b4aee3fceee9accf3a503e792f7c514241391c30d5ba33e07",
        "0x667723eab046c6336c9f81b4129a032c9cd653141afacd5a2eb523e9c27e0272",
      ];
      this.user1WrongProof = [
        "0xf606f9ec80f988b5cd8506c7b47b731cf8170544c12045645c5d0577cb077c00",
        "0xf1b69391a46ebf09c49b38a55a6e829321ee15cab1742a238279cd0b994837ef",
        "0x48cea6996d916f8c872ab49d03b2833d5884c89cbb1368d76cc0b7dd808ef25c",
        "0x4809d994c9b352b50e6ca9600c3e483c86a540e0fd7a90a1ef27947cc61cf2a0",
        "0x1508c2851746dea7c64d0818ad1e4e16033baf15baed165ea76650b514d2487a",
        "0x7ec4ccb50c0f645b4aee3fceee9accf3a503e792f7c514241391c30d5ba33e07",
        "0x667723eab046c6336c9f81b4129a032c9cd653141afacd5a2eb523e9c27e0272",
      ];
      this.user1Address = getAddress("0x5513D4Efd95A19aeF075278d4189D042332aF440");

      this.user2Address = getAddress("0xE19E8d5346Ade8294ec07c5431E5f6A1bb7F8ab2");

      // deploy a test token
      const erc20FaucetArtifact: Artifact = await artifacts.readArtifact("ERC20Faucet");
      this.erc20Faucet = <ERC20Faucet>(
        await waffle.deployContract(this.signers.admin, erc20FaucetArtifact, ["Flux", "FLX", 18])
      );

      // deploy the main contract
      const merkleClaimERC20Artifact: Artifact = await artifacts.readArtifact("MerkleClaimERC20");
      this.merkleClaimERC20 = <MerkleClaimERC20>(
        await waffle.deployContract(this.signers.admin, merkleClaimERC20Artifact, [
          merkleRoot,
          this.erc20Faucet.address,
        ])
      );
      // let tx = await this.merkleClaimERC20.deployed();
      console.log("merkleClaimERC20.address = ", this.merkleClaimERC20.address);

      // mint some tokens to the merkle claim contract
      await this.erc20Faucet.mint(this.merkleClaimERC20.address, ethers.utils.parseEther("1000000"));
    });

    shouldBehaveLikeMerkleAirdrop();
  });
});
