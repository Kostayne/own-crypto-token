// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// Just a simple interface for ERC721 token receivers
// Needed for the safeTransferFrom function
interface IERC721Receiver {
    function onERC721Received(
        address operator, 
        address from, 
        uint256 tokenId, 
        bytes calldata data
    ) external returns (bytes4);
}