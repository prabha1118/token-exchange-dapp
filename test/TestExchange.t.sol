// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Exchange} from "../src/Exchange.sol";
import {DeployExchange} from "../script/DeployExchange.s.sol";
import {ComradeToken} from "../src/ComradeToken.sol";
import {DeployComradeToken} from "../script/DeployComradeToken.s.sol";
import {mDai} from "../src/mDai.sol";
import {DeploymDai} from "../script/DeploymDai.s.sol";

contract TestExchange is Test {
    Exchange public exchange;
    DeployExchange public deployExchange;
    ComradeToken public comradeToken;
    DeployComradeToken public deployComradeToken;
    mDai public _mDai;
    DeploymDai public deploymDai;

    address public prabhas = makeAddr("prabhas");
    address public adithya = makeAddr("adithya");
    address public feeAccount = 0x618E3a1b163cbe342D26cC1eE3348fA46e03C88b;

    function setUp() public {
        deployExchange = new DeployExchange();
        exchange = deployExchange.run();

        deployComradeToken = new DeployComradeToken();
        comradeToken = deployComradeToken.run();

        deploymDai = new DeploymDai();
        _mDai = deploymDai.run();

        vm.prank(msg.sender);
        comradeToken.transfer(prabhas, 50 ether);

        vm.prank(msg.sender);
        _mDai.transfer(adithya, 50 ether);
    }

    modifier approvingForExchange() {
        vm.prank(prabhas);
        comradeToken.approve(address(exchange), 5 ether);
        _;
    }

    function testDepositTokens() public approvingForExchange {
        // Arrange - Act
        vm.prank(prabhas);
        exchange.depositTokens(address(comradeToken), 3 ether);

        // Assert
        assertEq(comradeToken.balanceOf(address(exchange)), 3 ether);
    }

    function testDepositedAmount() public approvingForExchange {
        // Arrange - Act
        vm.prank(prabhas);
        exchange.depositTokens(address(comradeToken), 4 ether);

        // Assert
        vm.prank(prabhas);
        assertEq(
            exchange.depositedAmount(address(comradeToken), prabhas),
            4 ether
        );
    }

    function testInvalidToken() public approvingForExchange {
        // Arrange
        vm.startPrank(prabhas);
        exchange.depositTokens(address(comradeToken), 4 ether);

        // Act - Assert

        vm.expectRevert(Exchange.Exchange__InvalidToken.selector);
        exchange.withdrawTokens(address(0x00), 4 ether);
        vm.stopPrank();
    }

    function testExcessAmount() public approvingForExchange {
        // Arrange
        vm.startPrank(prabhas);
        exchange.depositTokens(address(comradeToken), 4 ether);

        // Act - Assert
        vm.expectRevert(Exchange.Exchange__ExceedingMaximumAmount.selector);
        exchange.withdrawTokens(address(comradeToken), 6 ether);
        vm.stopPrank();
    }

    function testWithdrawTokens() public approvingForExchange {
        // Arrange
        vm.prank(prabhas);
        exchange.depositTokens(address(comradeToken), 3 ether);
        console.log(comradeToken.balanceOf(prabhas));

        // Act
        vm.prank(prabhas);
        exchange.withdrawTokens(address(comradeToken), 3 ether);
        console.log(comradeToken.balanceOf(prabhas));

        // Assert
        assertEq((comradeToken.balanceOf(prabhas)), 50 ether);
    }

    function testErrorInMakeOrder() public approvingForExchange {
        // Arrange
        vm.prank(prabhas);

        // Act - Assert
        vm.expectRevert(Exchange.Exchange__ExceedingMaximumAmount.selector);
        exchange.makeOrder(
            address(comradeToken),
            10 ether,
            address(_mDai),
            10 ether
        );
    }

    function testCancellingInvalidOrder() public approvingForExchange {
        // Arrange
        vm.prank(prabhas);
        exchange.depositTokens(address(comradeToken), 5 ether);

        vm.prank(prabhas);
        exchange.makeOrder(
            address(_mDai),
            5 ether,
            address(comradeToken),
            5 ether
        );

        // Act - Assert
        vm.expectRevert(Exchange.Exchange__InvalidOrderNumber.selector);
        vm.prank(prabhas);
        exchange.cancelOrder(7);
    }

    function testInvalidOwnerCancellingOrder() public approvingForExchange {
        // Arrange
        vm.prank(prabhas);
        exchange.depositTokens(address(comradeToken), 5 ether);

        vm.prank(prabhas);
        exchange.makeOrder(
            address(_mDai),
            5 ether,
            address(comradeToken),
            5 ether
        );

        // Act - Assert
        vm.expectRevert(Exchange.Exchange__NotOwnerOfThisOrder.selector);
        vm.prank(adithya);
        exchange.cancelOrder(1);
    }

    function testCancellingOrder() public approvingForExchange {
        // Arrange
        vm.prank(prabhas);
        exchange.depositTokens(address(comradeToken), 5 ether);

        vm.prank(prabhas);
        exchange.makeOrder(
            address(_mDai),
            5 ether,
            address(comradeToken),
            5 ether
        );

        // Act
        vm.prank(prabhas);
        exchange.cancelOrder(1);

        // Assert
        assertEq(exchange.doesThisOrderCancelled(1), true);
    }

    function testFillingCorrectOrder() public approvingForExchange {
        // Arrange
        vm.startPrank(prabhas);
        exchange.depositTokens(address(comradeToken), 1 ether);
        exchange.makeOrder(
            address(_mDai),
            1 ether,
            address(comradeToken),
            1 ether
        );
        vm.stopPrank();

        vm.startPrank(adithya);
        _mDai.approve(address(exchange), 2 ether);
        exchange.depositTokens(address(_mDai), 2 ether);

        // Act
        exchange.fillOrder(1);
        vm.stopPrank();

        // Assert
        vm.startPrank(prabhas);
        assertEq(
            exchange.depositedAmount(address(comradeToken), prabhas),
            0 ether
        );
        assertEq(exchange.depositedAmount(address(_mDai), prabhas), 1 ether);
        vm.stopPrank();

        vm.startPrank(adithya);
        assertEq(
            exchange.depositedAmount(address(comradeToken), adithya),
            1 ether
        );
        assertEq(exchange.depositedAmount(address(_mDai), adithya), 0.9 ether);
        vm.stopPrank();

        assertEq(_mDai.balanceOf(feeAccount), 0.1 ether);

        assertEq(exchange.doesThisOrderExcuted(1), true);
    }

    function testFillingOrderWithInsufficientTokens()
        public
        approvingForExchange
    {
        // Arrange
        vm.startPrank(prabhas);
        exchange.depositTokens(address(comradeToken), 1 ether);
        exchange.makeOrder(
            address(_mDai),
            2 ether,
            address(comradeToken),
            1 ether
        );
        vm.stopPrank();

        vm.startPrank(adithya);
        _mDai.approve(address(exchange), 2 ether);
        exchange.depositTokens(address(_mDai), 2 ether);

        // Act - Assert
        vm.expectRevert(
            abi.encodeWithSelector(
                Exchange.Exchange__BalanceNotSufficient.selector,
                exchange.depositedAmount(address(_mDai), adithya)
            )
        );
        exchange.fillOrder(1);
        vm.stopPrank();
    }
}
