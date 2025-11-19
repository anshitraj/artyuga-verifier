// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtyugaArtwork is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("Artyuga Artwork", "ARTYUGA")
        Ownable(initialOwner)
    {}

    function mintArtwork(address to, string memory uri) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    function getArtwork(uint256 tokenId)
        external
        view
        returns (address, string memory)
    {
        return (ownerOf(tokenId), tokenURI(tokenId));
    }
}

