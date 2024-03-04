// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mDai is ERC20 {
    constructor(uint256 intialSupply) ERC20("mDai", "mDai") {
        _mint(msg.sender, intialSupply);
    }
}
