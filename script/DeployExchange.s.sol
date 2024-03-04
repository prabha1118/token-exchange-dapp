// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {Exchange} from "../src/Exchange.sol";

contract DeployExchange is Script {
    address public constant FEE_ACCOUNT =
        0x618E3a1b163cbe342D26cC1eE3348fA46e03C88b;
    uint256 public constant FEE_PERCENT = 10;

    Exchange public exchange;

    function run() external returns (Exchange) {
        vm.startBroadcast();
        exchange = new Exchange(FEE_ACCOUNT, FEE_PERCENT);
        vm.stopBroadcast();
        return exchange;
    }
}
