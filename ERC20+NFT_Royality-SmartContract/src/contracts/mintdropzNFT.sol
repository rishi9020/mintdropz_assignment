// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface Token20 {

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address owner, address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

}



contract MintdropzNFT is ERC721 {

    address public owner;
    address public mintDropzTokenAddress;

    //Maximum NFT supply
    uint public constant MAX_NFT_SUPPLY = 1000;

    //TokenId to original(first) owner
    mapping(uint => address) tokenIdToOriginalOwner;

    //unique tokenURI
    mapping(string => bool) isURIExist;
    //Minimum puchasing price of NFT
    uint public constant MINIMUM_NFT_PRICE = 1 * 10**18;

    mapping(uint => address) public isTokenSellBy;
    mapping(uint => bool) public isTokenAvailableToBuy;

    constructor(address _MDTAddress) public ERC721("MintDropzNFT", "MDN") {
        owner = msg.sender;
        mintDropzTokenAddress = _MDTAddress;
    }


    modifier onlyOwner {
        require(owner == msg.sender, "Only owner is authorized");
        _;
    }

    function mintToken(string memory _uri) public payable{

        require(msg.value >= MINIMUM_NFT_PRICE, "Please send greater than or equal to 1 ETH to mint NFT");
        require(totalSupply() <= MAX_NFT_SUPPLY, "All NFT's are minted, cannot mint more NFT's");

        uint id = totalSupply() + 1;

        require(!isURIExist[_uri], "URI already exist");
        isURIExist[_uri] = true;

        tokenIdToOriginalOwner[id] = msg.sender;

        _safeMint(msg.sender, id);
        _setTokenURI(id, _uri);
    }

    function sellNFT(uint _tokenId, uint _amount) public {
        isTokenSellBy[_tokenId] = msg.sender;
        isTokenAvailableToBuy[_tokenId] = true;
        Token20(mintDropzTokenAddress).approve(msg.sender, address(this), _amount);
        transferFrom(msg.sender, address(this), _tokenId);
    }

    function buyNFT(uint _tokenId) public payable {
        require(isTokenAvailableToBuy[_tokenId], "NFT not available to sell");
        isTokenAvailableToBuy[_tokenId] = false;
        bool res1 = Token20(mintDropzTokenAddress).transferFrom(msg.sender, isTokenSellBy[_tokenId], msg.value*9/10);
        require(res1, "Failed to transfer MNT");
         bool res2 = Token20(mintDropzTokenAddress).transferFrom(msg.sender, tokenIdToOriginalOwner[_tokenId], msg.value*1/10);
        require(res2, "Failed to transfer MNT");
        transferFrom(address(this), msg.sender, _tokenId);
    }


    function getContractBalance() public onlyOwner view returns(uint256) {
      return address(this).balance;
    }

    //Owner can withdraw the Ethers collected via NFT minting
    function withdrawCollectedEther() public onlyOwner {
      address payable addr = payable(msg.sender);
      uint amount = getContractBalance();
      addr.transfer(amount);
    }

}