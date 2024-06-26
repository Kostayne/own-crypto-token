// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    event TransferEvt(address indexed from, address indexed to, uint256 value);

    event ApprovalEvt(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
