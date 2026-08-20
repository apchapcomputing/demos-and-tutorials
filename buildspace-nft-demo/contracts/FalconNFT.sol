// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

// Inherit imported contract from ERC721
contract FalconNFT is ERC721URIStorage {

    // Used to track token ids
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><defs><style>@import url('https://fonts.googleapis.com/css2?family=Carrois+Gothic');</style></defs><style>.base { fill: yellow; font-family: 'Carrois Gothic', sans-serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    // Combinations to generate random ship name
    string[] firstWords = ["TIE", "X", "Y", "B", "Star", "Upsilon", 'Lambda', 'N-1', 'The'];
    string[] secondWords = ['Class', 'Chain', 'Millenium', 'Ghost', 'Solar'];
    string[] thirdWords = ['Juggernaut', 'Infiltrator', 'Navigator', 'Fighter', 'Ravager', 'Wing', 'Destroyer', 'Craft', 'Bomber', 'Cruiser', 'Falcon', 'Shuttle'];

    constructor() ERC721 ('FalconNFT', 'FALC') {
        console.log('This is my Falcon NFT contract. Whoa!');
    }

    // Select first word for NFT
    function selectRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    // Select second word for NFT
    function selectRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    // Select third word for NFT
    function selectRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    // User calls to make NFT
    function makeFalconNFT() public {
        // Get current tokenId
        uint256 newItemId = _tokenIds.current();

        // Generate random ship name
        string memory first = selectRandomFirstWord(newItemId);
        string memory second = selectRandomSecondWord(newItemId);
        string memory third = selectRandomThirdWord(newItemId);
        string memory combined = string(abi.encodePacked(first, second, third));

        string memory finalSvg = string(abi.encodePacked(baseSvg, combined, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combined,
                        '", "description": "An epic and tasteful collection of imaginary Star Wars ships.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(abi.encodePacked('data:application/json;base64,', json));

        console.log("\n--------------------");
        console.log(string(abi.encodePacked("https://nftpreview.0xdev.codes/?code=", finalTokenUri)));
        console.log("--------------------\n");

        // Mint NFT to sender
        _safeMint(msg.sender, newItemId);
        // Set NFT data
        _setTokenURI(newItemId, finalTokenUri);

        _tokenIds.increment();
        console.log('An NFT with ID %s has been minted to %s', newItemId, msg.sender);
    }

}

