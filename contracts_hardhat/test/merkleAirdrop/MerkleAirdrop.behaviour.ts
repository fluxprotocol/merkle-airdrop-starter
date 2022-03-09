import { expect } from "chai";
import { BigNumber, utils } from "ethers";
import { getAddress, keccak256 } from "ethers/lib/utils";
import { TEST_VALUE } from "../types";

export function shouldBehaveLikeMerkleAirdrop(): void {
  it("should let user1 claim tokens", async function () {
    // Collect user1 balance of tokens before claim
    let user1PreBalance = await this.erc20Faucet.connect(this.signers.admin).balanceOf(this.user1Address);
    console.log("user1PreBalance", user1PreBalance);
    // Claim tokens
    await this.merkleClaimERC20.connect(this.signers.admin).claim(
      // Claiming for user1
      this.user1Address,
      // 1000 tokens
      utils.parseEther("10000"),
      // With valid proof
      this.user1CorrectProof,
    );

    // Collect user1 balance of tokens after claim
    let user1PostBalance = await this.erc20Faucet.connect(this.signers.admin).balanceOf(this.user1Address);
    console.log("user1PostBalance", user1PostBalance);

    expect(user1PostBalance).to.be.equal(user1PreBalance.add(utils.parseEther("10000")));
  });

  it("should revert wrong proof", async function () {
    try {
      await this.merkleClaimERC20.connect(this.signers.admin).claim(
        // Claiming for user1
        this.user1Address,
        // 1000 tokens
        utils.parseEther("10000"),
        // With valid proof
        this.user1WrongProof,
      );
    } catch (e) {
      if (!(e instanceof Error)) return;
      expect(e.message).to.include(
        "VM Exception while processing transaction: reverted with custom error 'NotInMerkle()'",
      );
    }
  });

  it("should revert user2 ", async function () {
    try {
      await this.merkleClaimERC20.connect(this.signers.admin).claim(
        // Claiming for user1
        this.user2Address,
        // 1000 tokens
        utils.parseEther("10000"),
        // With valid proof
        this.user1CorrectProof,
      );
    } catch (e) {
      if (!(e instanceof Error)) return;
      expect(e.message).to.include(
        "VM Exception while processing transaction: reverted with custom error 'NotInMerkle()'",
      );
    }
  });

  it("should let admin forward (stuck) erc20s", async function () {
    // Collect admin balance of tokens before claim
    let adminPreBalance = await this.erc20Faucet.connect(this.signers.admin).balanceOf(this.signers.admin.address);
    console.log("adminPreBalance", adminPreBalance);

    // forward erc20s
    await this.merkleClaimERC20.connect(this.signers.admin).forwardERC20s(
      this.erc20Faucet.address, // FLX token
      utils.parseEther("123"),
    );

    // Collect admin balance of tokens after claim
    let adminPostBalance = await this.erc20Faucet.connect(this.signers.admin).balanceOf(this.signers.admin.address);
    console.log("adminPostBalance", adminPostBalance);

    expect(adminPostBalance).to.be.equal(adminPreBalance.add(utils.parseEther("123")));
  });

  it("should not let users forward (stuck) erc20s", async function () {
    try {
      // forward erc20s
      await this.merkleClaimERC20.connect(this.signers.nonadmin).forwardERC20s(
        this.erc20Faucet.address, // FLX token
        utils.parseEther("123"),
      );
    } catch (e) {
      if (!(e instanceof Error)) return;
      console.log(e.message);
      expect(e.message).to.include(
        "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'",
      );
    }
  });
}
