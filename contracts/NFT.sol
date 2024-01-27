// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC721Receiver.sol";

interface ERC721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);

    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    function transfer(address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;
}

contract DigitalArt is ERC721 {
    string private _name;
    string private _symbol;

    Art[] public arts;

    // unsaled arts
    uint256 private pendingArtCount;

    // tokenId => owner
    mapping(uint256 => address) private _tokenOwner;

    // owner => token count
    mapping(address => uint256) private _ownedTokensCount;

    // owner => operator
    mapping(uint256 => address) private _tokenApprovals;

    // owner => operator
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // art transactions by id
    mapping(uint256 => ArtTxn[]) private _artTxns;

    // Id of the next art to be minted
    uint256 public index;

    struct Art {
        uint256 id;
        string title;
        string description;
        uint256 price;
        string date;
        string authorName;

        address payable author;
        address payable owner;

        uint status;
        string image;
    }

    struct ArtTxn {
        uint256 id;
        uint256 price;

        address seller;
        address buyer;

        uint txnDate;
        uint status;
    }

    event LogArtSold(uint _tokenId, string _title, string _authorName, uint256 _price, address _author,  address _currentOwner, address _buyer);
    event LogArtTokenCreate(uint _tokenId, string _title, string _category, string _authorName, uint256 _price, address _author,  address _currentOwner);
    event LogArtResell(uint _tokenId, uint _status, uint256 _price); 

    constructor(string memory name, string memory symbol) {
        _name = name;
        _symbol = symbol;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function createTokenAndSellArt(string memory title, string memory description, string memory date, string memory authorName, uint256 price, string memory image) public {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(date).length > 0, "Date cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(authorName).length > 0, "Author name cannot be empty");
        require(bytes(image).length > 0, "Image cannot be empty");
        require(price > 0, "Price cannot be zero");

        Art memory _art = Art({
            id: index,
            date: date,
            price: price,
            title: title,
            image: image,
            description: description,
            authorName: authorName,
            owner: payable(msg.sender),
            author: payable(msg.sender),
            status: 1
        });

        arts.push(_art);
        index += 1;

        _mint(msg.sender, index - 1);
        emit LogArtTokenCreate(index - 1, title, "Digital Art", authorName, price, msg.sender, msg.sender);
        
        pendingArtCount += 1;
    }

    function buyArt(uint256 tokenId) public payable {
        Art memory art = findArt(tokenId);

        require(art.owner != address(0), "Art does not exist");
        require(art.owner != msg.sender, "You cannot buy your own art");
        require(msg.value >= art.price, "You must pay the correct price");

        address payable origOwner = art.owner;

        _transferOwnership(art.owner, msg.sender, tokenId);

        // return extra payment to the buyer
        if (msg.value > art.price) {
            (payable(msg.sender)).transfer(msg.value - art.price);
        }

        // send money to the seller
        origOwner.transfer(art.price);

        arts[tokenId].owner = payable(msg.sender);
        arts[tokenId].status = 0;

        ArtTxn memory txn = ArtTxn({
            id: art.id,
            price: art.price,
            seller: origOwner,
            buyer: msg.sender,
            txnDate: block.timestamp,
            status: art.status
        });

        // save txn info
        _artTxns[art.id].push(txn);

        // decrease selling arts count
        pendingArtCount -= 1;

        emit LogArtSold(tokenId, art.title, art.authorName, art.price, origOwner, msg.sender, msg.sender);
    }

    function resellArt(uint256 tokenId, uint256 price) public payable {
        require(msg.sender != address(0), "Invalid seller address");
        require(isOwnerOf(tokenId, msg.sender), "You are not the owner of this art");

        // update status to selling
        arts[tokenId].status = 1;
        arts[tokenId].price = price;

        // incr selling arts count
        pendingArtCount += 1;

        emit LogArtResell(tokenId, 1, price);
    }

    function findArt(uint256 tokenId) public view returns (Art memory) {
        return arts[tokenId];
    }

    function findAllArts() public view returns (Art[] memory) {
        return arts;
    }

    function findAllPendingArts() public view returns (Art[] memory) {
        Art[] memory pendingArts = new Art[](pendingArtCount);

        uint pendingIndex = 0;
        for (uint i = 0; i < arts.length; i++) {
            if (arts[i].status == 1) {
                pendingArts[pendingIndex] = arts[i];
                pendingIndex++;
            }
        }

        return pendingArts;
    }

    function findMyArts() public view returns (uint256[] memory) {
        require(msg.sender != address(0), "Invalid account address");
        uint256 ownerArtCount = balanceOf(msg.sender);

        // empty case
        if (ownerArtCount == 0) {
            return new uint256[](0);
        }

        // non-empty case
        uint256[] memory ownerArts = new uint256[](ownerArtCount);

        uint256 ownerIndex = 0;
        for (uint i = 0; i < arts.length; i++) {
            if (arts[i].owner == msg.sender) {
                ownerArts[ownerIndex] = i;
                ownerIndex++;
            }
        }

        return ownerArts;
    }

    function getArtAllTxn(uint256 tokenId) public view returns (ArtTxn[] memory) {
        return _artTxns[tokenId];
    }

    function isOwnerOf(uint256 tokenId, address account) public view returns (bool) {
        address owner = _tokenOwner[tokenId];
        require(owner != address(0), "Art does not exist");
        return owner == account;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _ownedTokensCount[account];
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        return _tokenOwner[tokenId];
    }

    function approve(address to, uint256 tokenId) approvalTargetIsValid(to) public override {
        require(isOwnerOf(tokenId, msg.sender), "You are not the owner of this art");
        _tokenApprovals[tokenId] = to;

        emit Approval(msg.sender, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) transferIsValid(from, to, tokenId) public override {
        _transferOwnership(from, to, tokenId);
    }

    function transfer(address to, uint256 tokenId) transferIsValid(msg.sender, to, tokenId) public override {
        _transferOwnership(msg.sender, to, tokenId);
    }

    function getApproved(uint256 tokenId) public view override returns (address) {
        require(_isArtExists(tokenId), "Art does not exist");
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) approvalTargetIsValid(operator) public override {
        _operatorApprovals[msg.sender][operator] = approved;

        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) transferIsValid(from, to, tokenId) public override {
        require(_checkOnERC721Received(from, to, tokenId, ""), "Transfer rejected");

        _transferOwnership(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        require(_checkOnERC721Received(from, to, tokenId, data), "Transfer rejected");

        _transferOwnership(from, to, tokenId);
    }

    // INTERNAL FUNCTIONS
    // ---------------------------
    function _isContract(address account) internal view returns (bool) {
        if (account.code.length > 0) {
            return true;
        }

        return false;
    }

    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) internal returns (bool) {
        if (!_isContract(to)) {
            return true;
        }

        // is contract, needs additional check
        try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
            return retval == IERC721Receiver.onERC721Received.selector;
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                revert("ERC721: transfer to non ERC721Receiver implementer");
            } else {
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }

    function _transferOwnership(address from, address to, uint256 tokenId) internal {
        _ownedTokensCount[to] += 1;
        _ownedTokensCount[from] -= 1;
        _tokenOwner[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    // Adds a new art to a user
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "Called mint for the zero address");
        require(!_isArtExists(tokenId), "Token already exists");

        _tokenOwner[tokenId] = to;
        _ownedTokensCount[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function _isArtExists(uint256 tokenId) internal view returns (bool) {
        return _tokenOwner[tokenId] != address(0);
    }

    function _isOwnerOrApproved(address account, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);

        return isOwnerOf(tokenId, account) || 
            getApproved(tokenId) == account || 
            isApprovedForAll(owner, account);
    }

    // MODIFIERS
    modifier transferIsValid(address from, address to, uint256 tokenId) {
        require(to != address(0), "Called transferFrom for the zero address");
        require(to != from, "You cannot transfer art to yourself");
        require(_isOwnerOrApproved(from, tokenId), "You are not approved to transfer this art");

        _;
    }

    modifier approvalTargetIsValid(address operator) {
        require(operator != address(0), "Called setApprovalForAll for the zero address");
        require(operator != msg.sender, "You cannot approve yourself");

        _;
    }
}