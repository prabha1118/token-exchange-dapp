// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {ComradeToken} from "../src/ComradeToken.sol";

contract DeployComradeToken is Script {
    uint256 public constant INTIAL_SUPPLY = 10000 ether;

    function run() external returns (ComradeToken) {
        vm.startBroadcast();
        ComradeToken comradeToken = new ComradeToken(INTIAL_SUPPLY);
        vm.stopBroadcast();
        return comradeToken;
    }
}
