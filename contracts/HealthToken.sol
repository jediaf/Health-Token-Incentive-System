// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HealthToken
 * @dev ERC20 Token that can only be minted by a designated verifier (backend)
 * Symbol: HLT
 * This contract is designed for the Health Behavior Logging incentive system
 */
contract HealthToken is ERC20, Ownable {
    address public verifier;

    event VerifierUpdated(address indexed oldVerifier, address indexed newVerifier);
    event RewardIssued(address indexed recipient, uint256 amount);

    modifier onlyVerifier() {
        require(msg.sender == verifier, "HealthToken: caller is not the verifier");
        _;
    }

    /**
     * @dev Constructor that sets the initial verifier
     * @param _verifier Address of the backend wallet that can mint tokens
     */
    constructor(address _verifier) ERC20("HealthToken", "HLT") Ownable(msg.sender) {
        require(_verifier != address(0), "HealthToken: verifier cannot be zero address");
        verifier = _verifier;
        emit VerifierUpdated(address(0), _verifier);
    }

    /**
     * @dev Mints tokens to a user as a reward for logging health activities
     * Can only be called by the verifier (backend API)
     * @param user Address of the user to receive tokens
     * @param amount Amount of tokens to mint (in wei, 18 decimals)
     */
    function rewardUser(address user, uint256 amount) external onlyVerifier {
        require(user != address(0), "HealthToken: cannot reward zero address");
        require(amount > 0, "HealthToken: amount must be greater than zero");
        
        _mint(user, amount);
        emit RewardIssued(user, amount);
    }

    /**
     * @dev Updates the verifier address
     * Can only be called by the contract owner
     * @param newVerifier New verifier address
     */
    function updateVerifier(address newVerifier) external onlyOwner {
        require(newVerifier != address(0), "HealthToken: new verifier cannot be zero address");
        address oldVerifier = verifier;
        verifier = newVerifier;
        emit VerifierUpdated(oldVerifier, newVerifier);
    }

    /**
     * @dev Returns the number of decimals used for token amounts
     * @return uint8 Number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
