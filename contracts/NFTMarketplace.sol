//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    address public owner;
    mapping(address => mapping(uint256 => uint256)) public nftPrice;

    constructor() {
        owner = msg.sender;
    }

    function sellNFT(address nftContract, uint256 tokenId, uint256 price) public {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        nft.transferFrom(msg.sender, address(this), tokenId);
        emit NFTForSale(nftContract, tokenId, price, msg.sender);
    }

   function buyNFT(address nftContract, uint256 tokenId) public payable {
    IERC721 nft = IERC721(nftContract);
    uint256 price = nftPrice[nftContract][tokenId];
    require(price > 0, "NFT is not for sale");
    require(msg.value == price, "Incorrect payment amount");
    address seller = nft.ownerOf(tokenId);
    nft.transferFrom(seller, msg.sender, tokenId);
    (bool success, ) = payable(seller).call{value: price}("");
    require(success, "Failed to send payment to seller");
    emit NFTSold(nftContract, tokenId, price, seller, msg.sender);
}

    function setNFTPrice(address nftContract, uint256 tokenId, uint256 price) public {
        IERC721 nft = IERC721(nftContract);
        require(msg.sender == owner || msg.sender == nft.ownerOf(tokenId), "You are not authorized to set the price of this NFT");
        nftPrice[nftContract][tokenId] = price;
        emit NFTPriceSet(nftContract, tokenId, price);
    }

    event NFTForSale(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed seller);
    event NFTSold(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed seller, address buyer);
    event NFTPriceSet(address indexed nftContract, uint256 indexed tokenId, uint256 price);
}
