// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC20.sol";

// Defines owner & admin roles
contract Owned {
    address public owner;
    mapping(address => bool) admins;

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] == true);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function isAdmin(address account) public view onlyOwner returns (bool) {
        return admins[account];
    }

    function addAdmin(address account) public onlyOwner {
        require(account != address(0) && !admins[account]);
        admins[account] = true;
    }

    function removeAdmin(address account) public onlyOwner {
        require(account != address(0) && admins[account]);
        admins[account] = false;
    }
}

// Typical white list implementation
contract WhiteList is Owned {
    mapping(address => bool) whiteList;

    function addToWhiteList(address account) public onlyAdmin {
        require(account != address(0) && whiteList[account] == false);
        whiteList[account] = true;
    }

    function isWhiteListed(address account) public view returns (bool) {
        return whiteList[account];
    }

    function removeFromWhiteList(address account) public onlyAdmin {
        require(account != address(0) && whiteList[account] == true);
        whiteList[account] = false;
    }
}

// Lock all tokens
contract Pausable is Owned {
    event PausedEvt(address account);
    event UnpausedEvt(address account);

    bool private paused;

    constructor() {
        paused = false;
    }

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() public onlyAdmin whenNotPaused {
        paused = true;
        emit PausedEvt(msg.sender);
    }

    function unpause() public onlyAdmin whenPaused {
        paused = false;
        emit UnpausedEvt(msg.sender);
    }
}

// actual implementation
contract MyToken is ERC20, Owned, WhiteList, Pausable {
    TokenSummary public tokenSummary;

    mapping(address => uint256) internal balances;
    mapping(address => mapping(address => uint256)) internal allowed;

    uint256 internal _totalSupply;

    struct TokenSummary {
        address initialAccount;
        string name;
        string symbol;
    }

    // EVENTS
    // -----------------------
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    event Burn(address from, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        address initialAccount,
        uint initialBalance
    ) {
        require(bytes(_name).length > 0, "Empty token name!");
        require(bytes(_symbol).length > 0, "Empty token symbol!");
        require(initialBalance >= 0, "Balance can't be negative");

        addToWhiteList(initialAccount);
        balances[initialAccount] = initialBalance;

        _totalSupply = initialBalance;
        tokenSummary = TokenSummary(initialAccount, _name, _symbol);
    }

    modifier verifyTransfer(
        address from,
        address to,
        uint256 value
    ) {
        // person needs to be white listed to accept transfers
        require(
            isWhiteListed(to),
            "Illegal transfer to non white listed address!"
        );

        require(to != from, "You can't transfer to your self");
        require(value >= 0, "Value must be greater than zero");
        require(from != address(0), "Can not transfer from zero address");
        require(to != address(0), "Can not transfer to zero address");
        require(balanceOf(from) >= value, "Not enough balance");

        _;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function transfer(
        address to,
        uint256 value
    )
        public
        verifyTransfer(msg.sender, to, value)
        whenNotPaused
        returns (bool success)
    {
        balances[msg.sender] -= value;
        balances[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    )
        public
        verifyTransfer(from, to, value)
        whenNotPaused
        returns (bool success)
    {
        require(value <= allowed[from][msg.sender]);

        balances[from] -= value;
        balances[to] += value;

        allowed[from][msg.sender] -= value;

        emit Transfer(from, to, value);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view returns (uint256) {
        return allowed[owner][spender];
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0));
        allowed[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);
        return true;
    }

    function burn(uint256 value) public whenNotPaused onlyAdmin returns (bool) {
        require(
            balances[msg.sender] >= value,
            "Value to burn is greater than address balance"
        );

        require(value >= 0, "Can't burn value <= 0");

        balances[msg.sender] -= value;
        _totalSupply -= value;

        emit Burn(msg.sender, value);
        return true;
    }

    function mint(
        address account,
        uint256 value
    ) public whenNotPaused onlyAdmin returns (bool) {
        require(account != address(0), "Can not mint to zero address");
        require(value > 0, "Can not mint value less or equal zero");

        balances[account] += value;
        _totalSupply += value;

        emit Transfer(address(0), account, value);
        return true;
    }

    fallback() external {
        revert();
    }
}
