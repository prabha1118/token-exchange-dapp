// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {mDai} from "../src/mDai.sol";

contract DeploymDai is Script {
    address public constant deployer =
        0xc647f5325baBBef6D837d99049EF004Ed50E64BC;
    uint256 public constant INTIAL_SUPPLY = 10000 ether;

    mDai public _mDai;

    function run() external returns (mDai) {
        if (block.chainid == 11155111) {
            vm.startBroadcast(deployer);
            _mDai = new mDai(INTIAL_SUPPLY);
            vm.stopBroadcast();
            return _mDai;
        } else {
            vm.startBroadcast();
            _mDai = new mDai(INTIAL_SUPPLY);
            vm.stopBroadcast();
            return _mDai;
        }
    }
}
