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

    function addWhiteList(address account) public onlyAdmin {
        require(account != address(0) && whiteList[account] == false);
        whiteList[account] = true;
    }

    function isWhiteListed(address account) public view returns (bool) {
        return whiteList[account];
    }

    function removeWhiteListed(address account) public onlyAdmin {
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

// Our token
contract MyERC20Token is ERC20, Owned, WhiteList, Pausable {
    TokenSummary public tokenSummary;

    mapping(address => uint256) internal balances;
    mapping(address => mapping(address => uint256)) internal allowed;

    uint256 internal _totalSupply;

    // CODES & MESSAGES
    // --------------------------
    // success
    uint8 public constant SUCCESS_CODE = 0;
    string public constant SUCCESS_MESSAGE = "SUCCESS";

    // non white list
    uint8 public constant NON_WHITE_LIST_CODE = 1;
    string public constant NON_WHITE_LIST_ERROR =
        "ILLEGAL_TRANSFER_TO_NON_WHITE_LIST_ADDRESS";

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
        addWhiteList(initialAccount);
        balances[initialAccount] = initialBalance;

        _totalSupply = initialBalance;
        tokenSummary = TokenSummary(initialAccount, _name, _symbol);
    }

    modifier verify(
        address from,
        address to,
        uint256 value
    ) {
        uint8 restrictionCode = validateTransferRestrict(to);

        require(
            restrictionCode == SUCCESS_CODE,
            messageHandler(restrictionCode)
        );
        _;
    }

    function validateTransferRestrict(
        address to
    ) public view returns (uint8 restrictionCode) {
        if (!isWhiteListed(to)) {
            return NON_WHITE_LIST_CODE;
        }

        return SUCCESS_CODE;
    }

    function messageHandler(
        uint8 restrictionCode
    ) public pure returns (string memory message) {
        if (restrictionCode == SUCCESS_CODE) {
            return SUCCESS_MESSAGE;
        }

        // if (restrictionCode == NON_WHITE_LIST_CODE) {
        //     return NON_WHITE_LIST_ERROR;
        // }

        return NON_WHITE_LIST_ERROR;
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
        verify(msg.sender, to, value)
        whenNotPaused
        returns (bool success)
    {
        require(to != address(0) && balances[msg.sender] > value);

        balances[msg.sender] -= value;
        balances[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public verify(from, to, value) whenNotPaused returns (bool success) {
        require(
            to != address(0) &&
                value <= balances[from] &&
                value <= allowed[from][msg.sender]
        );

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
        require(balances[msg.sender] >= value);
        balances[msg.sender] -= value;
        _totalSupply -= value;

        emit Burn(msg.sender, value);
        return true;
    }

    function mint(
        address account,
        uint256 value
    ) public whenNotPaused onlyAdmin returns (bool) {
        require(account != address(0));
        balances[account] += value;
        _totalSupply += value;

        emit Transfer(address(0), account, value);
        return true;
    }

    fallback() external {
        revert();
    }
}
