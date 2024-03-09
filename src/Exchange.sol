// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {console} from "forge-std/Test.sol";

contract Exchange {
    error Exchange__InvalidToken();
    error Exchange__InvalidAmount(uint256 _amount);
    error Exchange__ExceedingMaximumAmount();
    error Exchange__InvalidOrderNumber();
    error Exchange__NotOwnerOfThisOrder();
    error Exchange__OrderWasCancelled();
    error Exchange__BalanceNotSufficient(uint256 _userBalance);
    error Exchange__OrderWasExcuted();

    address private feeAccount;
    uint256 private feePercent;
    mapping(address => mapping(address => uint256)) private tokensDeposited;
    mapping(uint256 => _Order) private ordersPlaced;
    mapping(uint256 => bool) private cancelledOrders;
    mapping(uint256 => bool) private excutedOrders;

    uint256 private ordersCount;
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    event TokensDeposited(address _token, address _depositer, uint256 _amount);
    event TokensWithdrawn(address _token, address _depositer, uint256 _amount);

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event OrderCancelled(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event TradeSuccessfull(
        uint256 id,
        address seller,
        address buyer,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositTokens(address _token, uint256 _amount) public {
        if (_token == address(0)) {
            revert Exchange__InvalidToken();
        }

        if (_amount == 0) {
            revert Exchange__InvalidAmount(_amount);
        }

        address _depositer = msg.sender;

        tokensDeposited[_token][msg.sender] += _amount;
        ERC20(_token).transferFrom(_depositer, address(this), _amount);

        emit TokensDeposited(_token, msg.sender, _amount);
    }

    function withdrawTokens(address _token, uint256 _amount) public {
        if (_token == address(0)) {
            revert Exchange__InvalidToken();
        }
        if (_amount > tokensDeposited[_token][msg.sender]) {
            revert Exchange__ExceedingMaximumAmount();
        }

        address _depositer = msg.sender;

        tokensDeposited[_token][msg.sender] -= _amount;
        ERC20(_token).transfer(_depositer, _amount);

        emit TokensWithdrawn(_token, msg.sender, _amount);
    }

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        if (_amountGive > depositedAmount(_tokenGive, msg.sender)) {
            revert Exchange__ExceedingMaximumAmount();
        }
        ordersCount = ordersCount + 1;

        ordersPlaced[ordersCount] = _Order(
            ordersCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        emit Order(
            ordersCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        if (_id > ordersCount) {
            revert Exchange__InvalidOrderNumber();
        }

        _Order memory order = ordersPlaced[_id];

        if (order.user != msg.sender) {
            revert Exchange__NotOwnerOfThisOrder();
        }

        cancelledOrders[_id] = true;

        emit OrderCancelled(
            order.id,
            order.user,
            order.tokenGet,
            order.amountGet,
            order.tokenGive,
            order.amountGive,
            block.timestamp
        );
    }

    function feePayment(address _token) internal {
        uint256 balance = tokensDeposited[_token][feeAccount];
        tokensDeposited[_token][feeAccount] = 0;
        ERC20(_token).transfer(feeAccount, balance);
    }

    function fillOrder(uint256 _id) public {
        if (_id > ordersCount) {
            revert Exchange__InvalidOrderNumber();
        }

        if (cancelledOrders[_id]) {
            revert Exchange__OrderWasCancelled();
        }

        if (excutedOrders[_id]) {
            revert Exchange__OrderWasExcuted();
        }

        _Order memory order = ordersPlaced[_id];
        uint256 feeAmount = (order.amountGet * feePercent) / 100;

        if (
            order.amountGet + feeAmount >
            tokensDeposited[order.tokenGet][msg.sender]
        ) {
            revert Exchange__BalanceNotSufficient(
                tokensDeposited[order.tokenGet][msg.sender]
            );
        }

        // Paying fees
        tokensDeposited[order.tokenGet][feeAccount] += feeAmount;
        feePayment(order.tokenGet);

        // Changing user balances

        // User2
        tokensDeposited[order.tokenGet][msg.sender] -= (order.amountGet +
            feeAmount);
        tokensDeposited[order.tokenGive][msg.sender] += order.amountGive;

        // User1
        tokensDeposited[order.tokenGive][order.user] -= order.amountGive;
        tokensDeposited[order.tokenGet][order.user] += order.amountGet;

        // Marking order as excuted
        excutedOrders[order.id] = true;

        emit TradeSuccessfull(
            order.id,
            order.user,
            msg.sender,
            order.tokenGet,
            order.amountGet,
            order.tokenGive,
            order.amountGive,
            block.timestamp
        );
    }

    function depositedAmount(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokensDeposited[_token][_user];
    }

    function doesThisOrderCancelled(uint256 _id) public view returns (bool) {
        return cancelledOrders[_id];
    }

    function doesThisOrderExcuted(uint256 _id) public view returns (bool) {
        return excutedOrders[_id];
    }
}
