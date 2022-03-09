import { expect } from "chai";
import { BigNumber, utils } from "ethers";
import { getAddress, keccak256 } from "ethers/lib/utils";
import { TEST_VALUE } from "../types";

export function shouldBehaveLikeMerkleAirdrop(): void {
  

  it("should let user1 claim tokens", async function () {
    
   
    // console.log("solidityPack = ", utils.solidityPack([ "address", "uint256" ], [ getAddress("0x5513D4Efd95A19aeF075278d4189D042332aF440"), utils.parseEther("1000") ]))
    // let proof = utils.solidityKeccak256([ "address", "uint256" ], [ getAddress("0x5513D4Efd95A19aeF075278d4189D042332aF440"), utils.parseEther("1000") ])
    // user1Proof[0] = proof;
    // console.log("solidityKeccak256 = ", user1Proof[0]);
    // Collect user1 balance of tokens before claim
    let user1PreBalance = await this.merkleClaimERC20.connect(this.signers.admin).balanceOf(this.user1Address);
    console.log("user1PreBalance", user1PreBalance);
    // Claim tokens
    await this.merkleClaimERC20.connect(this.signers.admin).claim(
      // Claiming for user1
      this.user1Address,
      // 1000 tokens
      utils.parseEther("10000"),
      // With valid proof
      this.user1CorrectProof
    );

    // Collect user1 balance of tokens after claim
    let user1PostBalance = await this.merkleClaimERC20.connect(this.signers.admin).balanceOf(this.user1Address);
    console.log("user1PostBalance", user1PostBalance);

    expect(user1PostBalance).to.be.equal(user1PreBalance + utils.parseEther("10000"))
  });


  it("should revert wrong proof", async function () {

    try{

      await this.merkleClaimERC20.connect(this.signers.admin).claim(
        // Claiming for user1
        this.user1Address,
        // 1000 tokens
        utils.parseEther("10000"),
        // With valid proof
        this.user1WrongProof
      );
      

    }catch(e){
      if (!(e instanceof Error)) return;
      expect(e.message).to.include(
        "VM Exception while processing transaction: reverted with custom error 'NotInMerkle()'",
      );

    }
  
  
  });

  it("should revert user2 ", async function () {
    
   
  
    try{

      await this.merkleClaimERC20.connect(this.signers.admin).claim(
        // Claiming for user1
        this.user2Address,
        // 1000 tokens
        utils.parseEther("10000"),
        // With valid proof
        this.user1CorrectProof
      );
  
      

    }catch(e){
      if (!(e instanceof Error)) return;
      expect(e.message).to.include(
        "VM Exception while processing transaction: reverted with custom error 'NotInMerkle()'",
      );

    }
  
  });



  
 
}
