// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {ComradeToken} from "../src/ComradeToken.sol";
import {DeployComradeToken} from "../script/DeployComradeToken.s.sol";

contract TestComradeToken is Test {
    DeployComradeToken public deployComradeToken;
    ComradeToken public comradeToken;

    uint256 public constant INTIAL_BALANCE = 50 ether;
    address public prabhas = makeAddr("prabhas");
    address public adithya = makeAddr("adithya");

    function setUp() public {
        deployComradeToken = new DeployComradeToken();
        comradeToken = deployComradeToken.run();

        vm.prank(msg.sender);
        comradeToken.transfer(prabhas, INTIAL_BALANCE);
    }

    function testTransfer() public {
        assertEq(comradeToken.balanceOf(prabhas), INTIAL_BALANCE);
    }

    function testApproval() public {
        vm.prank(prabhas);
        comradeToken.approve(adithya, 7 ether);

        vm.prank(adithya);
        comradeToken.transferFrom(prabhas, adithya, 3 ether);
        assertEq(comradeToken.balanceOf(adithya), 3 ether);
    }
}
