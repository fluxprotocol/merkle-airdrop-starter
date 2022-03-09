import fs from "fs"; // Filesystem
import path from "path"; // Path
import keccak256 from "keccak256"; // Keccak256 hashing
import MerkleTree from "merkletreejs"; // MerkleTree.js
import { logger } from "./utils/logger"; // Logging
import { getAddress, parseUnits, solidityKeccak256 } from "ethers/lib/utils"; // Ethers utils

// Output file path
const outputPath: string = path.join(__dirname, "../merkle.json");
const proofsPath: string = path.join(__dirname, "../proofs.json");


// Airdrop recipient addresses and scaled token values
type AirdropRecipient = {
  // Recipient address
  address: string;
  // Scaled-to-decimals token value
  value: string;
};



export default class Generator {
  // Airdrop recipients
  recipients: AirdropRecipient[] = [];
  proofs: any[] = [];
  /**
   * Setup generator
   * @param {number} decimals of token
   * @param {Record<string, number>} airdrop address to token claim mapping
   */
  constructor(decimals: number, airdrop: Record<string, number>) {
    // For each airdrop entry
    for (const [address, tokens] of Object.entries(airdrop)) {
      // Push:
      this.recipients.push({
        // Checksum address
        address: getAddress(address),
        // Scaled number of tokens claimable by recipient
        value: parseUnits(tokens.toString(), decimals).toString()
      });
    }
  }

  /**
   * Generate Merkle Tree leaf from address and value
   * @param {string} address of airdrop claimee
   * @param {string} value of airdrop tokens to claimee
   * @returns {Buffer} Merkle Tree node
   */
  generateLeaf(address: string, value: string): Buffer {
    return Buffer.from(
      // Hash in appropriate Merkle format
      solidityKeccak256(["address", "uint256"], [address, value]).slice(2),
      "hex"
    );
  }

  async process(): Promise<void> {
    logger.info("Generating Merkle tree.");

    // Generate merkle tree
    const merkleTree = new MerkleTree(
      // Generate leafs
      this.recipients.map(({ address, value }) => this.generateLeaf(address, value)),
      // Hashing function
      keccak256,
      { sortPairs: true }
    );

    // Collect and log merkle root
    const merkleRoot: string = merkleTree.getHexRoot();
    logger.info(`Generated Merkle root: ${merkleRoot}`);
    let indices = Array.from(Array(merkleTree.getLeafCount()).keys())
    // console.log("indeces = ", indices.length)
    // this.proofs = merkleTree.getProof(merkleTree.getHexLeaves()[0]);
    // console.log("leaves = ", merkleTree.getHexLeaves())
    let lvs =  merkleTree.getHexLeaves();
    for(let key in lvs){
      // console.log(lvs[key])
      // console.log("leaf proof = ", merkleTree.getHexProof(lvs[key]));
      this.proofs.push(merkleTree.getHexProof(lvs[key]));
    }
    console.log("proofs = ", this.proofs.length)
    console.log("diamond leaf", this.generateLeaf(getAddress("0x5513D4Efd95A19aeF075278d4189D042332aF440"), parseUnits("10000", 18).toString()));
    console.log("leaf3300"," ++ ", merkleTree.getLeaf(330));
    // for(let i=0; i<merkleTree.getLeafCount(); i++){
    //   console.log(i," ++ ", merkleTree.getLeaf(i));

    // };

    // console.log("first diamond user proof", merkleTree.getProof(merkleTree.getLeaf(330)));
    console.log("first diamond user proof", merkleTree.getHexProof(merkleTree.getLeaf(330)));



    // Collect and save merkle tree + root
    await fs.writeFileSync(
      // Output to merkle.json
      outputPath,
      // Root + full tree
      JSON.stringify({
        root: merkleRoot,
        tree: merkleTree
      })
    );
    logger.info("Generated merkle tree and root saved to merkle.json.");

    // Collect and save merkle tree + root
    await fs.writeFileSync(
      // Output to merkle.json
      proofsPath,
      // Root + full tree
      JSON.stringify(this.proofs)
    );
    logger.info("Generated merkle proofs and saved to proofs.json.");

  }
}
