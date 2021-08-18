// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MyERC721.sol";

contract SilkRoad is ERC721 {
    
    mapping(uint256 => string) values;
    mapping(string => uint256) tokenMap;
    uint256 totalSupply;
    
    constructor() ERC721("SilkRoad", "SAUTH") public {
        totalSupply = 0;
        mint(msg.sender, "token for request header");
    }
    
    function mint(address to, string memory uri) public {
        require(tokenMap[uri] == 0);
        uint256 newTokenId = totalSupply + 1;
        _mint(to, newTokenId);
        
        values[newTokenId] = uri;
        tokenMap[uri] = newTokenId;
        totalSupply = totalSupply + 1;
    }
    
    function burn(string memory uri) public {
        require(tokenMap[uri]!=0);
        uint256 removedToken = tokenMap[uri];
        _burn(removedToken);
        
        totalSupply = totalSupply -1;
        values[removedToken] = "";
        tokenMap[uri] = 0;
    }
 
}