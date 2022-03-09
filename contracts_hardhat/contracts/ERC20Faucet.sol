// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

import { ERC20 } from "@rari-capital/solmate/src/tokens/ERC20.sol"; // Solmate: ERC20

/**
 * @title Generic ERC20 token for testing
 * @notice This contract simulates a generic ERC20 token that is mintable and burnable.
 */
contract ERC20Faucet is ERC20 {
    /* solhint-disable no-empty-blocks */
    /**
     * @notice Deploy this contract with given name, symbol, and decimals
     * @dev the caller of this constructor will become the owner of this contract
     * @param name_ name of this token
     * @param symbol_ symbol of this token
     * @param decimals_ number of decimals this token will be based on
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_, decimals_) {}

    /* solhint-enable no-empty-blocks */

    /**
     * @notice Mints given amount of tokens to recipient
     * @dev anyone can call this mint function
     * @param recipient address of account to receive the tokens
     * @param amount amount of tokens to mint
     */
    function mint(address recipient, uint256 amount) external {
        require(amount != 0, "amount == 0");
        _mint(recipient, amount);
    }
}
