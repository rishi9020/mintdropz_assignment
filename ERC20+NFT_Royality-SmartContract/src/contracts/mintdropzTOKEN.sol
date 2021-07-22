// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MintdropzTOKEN is ERC20 {

    address public owner;
    address public mintDropzNFTAddress;

    constructor() public ERC20("MintDropzToken", "MDT") {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(owner == msg.sender, "Only owner is authorized");
        _;
    }

    function setNFTAddress(address _nftAddress) external onlyOwner {
        require(mintDropzNFTAddress == address(0), "Already set");
        mintDropzNFTAddress = _nftAddress;
    }

    function mintERC20MintdropzToken(address _to) public payable {
        address payable addr = payable(address(this));
        addr.transfer(msg.value);
        _mint(_to, msg.value);
    }

    function getTokenContractBalance() public onlyOwner view returns(uint256) {
      return address(this).balance;
  }
}