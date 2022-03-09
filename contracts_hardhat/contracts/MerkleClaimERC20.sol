// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

/// ============ Imports ============

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // OZ: IERC20
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol"; // OZ: Ownable

/// @title MerkleClaimERC20
/// @notice ERC20 claimable by members of a merkle tree
contract MerkleClaimERC20 is Ownable {
    /// ============ Immutable storage ============

    /// @notice ERC20-claimee inclusion root
    bytes32 public immutable merkleRoot;
    IERC20 public immutable token;

    /// ============ Mutable storage ============

    /// @notice Mapping of addresses who have claimed tokens
    mapping(address => bool) public hasClaimed;

    /// ============ Errors ============

    /// @notice Thrown if address has already claimed
    error AlreadyClaimed();
    /// @notice Thrown if address/amount are not part of Merkle tree
    error NotInMerkle();

    /// ============ Constructor ============

    /// @notice Creates a new MerkleClaimERC20 contract
    /// @param _merkleRoot of claimees
    /// @param _token ERC20 contract for claims
    constructor(bytes32 _merkleRoot, address _token) {
        merkleRoot = _merkleRoot; // Update root
        token = IERC20(_token); // Update token
    }

    /// ============ Events ============

    /// @notice Emitted after a successful token claim
    /// @param to recipient of claim
    /// @param amount of tokens claimed
    event Claim(address indexed to, uint256 amount);

    /// ============ Functions ============

    /// @notice Allows claiming tokens if address is part of merkle tree
    /// @param to address of claimee
    /// @param amount of tokens owed to claimee
    /// @param proof merkle proof to prove address and amount are in tree
    function claim(
        address to,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        // Throw if address has already claimed tokens
        if (hasClaimed[to]) revert AlreadyClaimed();
        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(to, amount));
        bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
        if (!isValidLeaf) revert NotInMerkle();

        // Set address to claimed
        hasClaimed[to] = true;

        // Transfer tokens to address
        token.transfer(to, amount);

        // Emit claim event
        emit Claim(to, amount);
    }

    /// @notice Forwards stuck ERC20s to owner
    /// @param _token ERC20 contract to forward to owner
    /// @param _amount of tokens to forward
    function forwardERC20s(IERC20 _token, uint256 _amount) public onlyOwner {
        _token.transfer(msg.sender, _amount);
    }
}
