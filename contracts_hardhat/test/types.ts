import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { MerkleClaimERC20 } from "../src/types/MerkleClaimERC20";
import type { ERC20Faucet } from "../src/types/ERC20Faucet";

export const TEST_VALUE = 12345;

declare module "mocha" {
  export interface Context {
    merkleClainERC20: MerkleClaimERC20;
    erc20Faucet: ERC20Faucet;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  nonadmin: SignerWithAddress;
  // alice: SignerWithAddress;
  // bob: SignerWithAddress;
}
