
pragma solidity ^0.5.0;

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

contract Governor {
    address private _owner;
    address public moneyAgent  = 0xf6148aD4C8b2138B9029301310074F391ea4529D;    //address of the money Agent wallet
    address public escrowAgent = 0xf6148aD4C8b2138B9029301310074F391ea4529D;    //address of the escrow Agent wallet
    bool    public lockStatus;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
    
    function transferMoneyAgent(address newOwner) public onlyOwner {		// In-house Yubi.Exchange Money Agent
        require(newOwner != address(0));
        moneyAgent = newOwner;
    }

    function transferEscrowAgent(address newOwner) public onlyOwner {		// In-house Yubi.Exchange Escrow Agent
        require(newOwner != address(0));
        // emit transferOwnership(escrowAgent, newOwner);
        escrowAgent = newOwner;
    }

    function setLockStatus(bool RunningStatusLock) external onlyOwner
    {
        lockStatus = RunningStatusLock;
    }
}

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract YubiCoin is Governor,IERC20
{
    using SafeMath for uint256;
    string  public constant name         = "Yubi Stablecoin";
    string  public constant symbol       = "YUSD";
    uint256 public constant decimals     = 9;
    uint256 public constant decimalsETH  = 10 ** 18;
    uint256 public constant decimalsYUBI = 10 ** 9;
    uint256 public constant decimalsUSD  = 10 ** 2;
    uint256 public totalCoinSupply       = 21111100 * decimalsYUBI;	       // Total coins in circulation
    uint256 public moneyAgentsSupply     = 20000000 * decimalsYUBI;	       // Total coins held by Yubi Exchange Money Agents
    uint256 public coinExchangeSupply    = 1000000 * decimalsYUBI;	       // Total coins held by Yubi Exchange (Owner)
    uint256 public bonusPoolSupply       = 100000 * decimalsYUBI;	       // Bonus coins to be distributed to public wallet purchasers
    uint256 public otcSupply    	     = 10000 * decimalsYUBI;               // Only the Public OTC Stakeholders can invoke a Blackswan attack
    uint256 public buybackSupply         = 1000 * decimalsYUBI;	               // Coins taken out of circulation to be burned
    uint256 public b2bSupply             = 100 * decimalsYUBI;                 // Coins in circulation for money remittances	    		
    uint256 public escrowSupply          = 10 * decimalsYUBI;	               // Coins in circulation for escrow servicing
    address public bonusPool   = 0xf6148aD4C8b2138B9029301310074F391ea4529D;   // Stores the community bonus coins
    address public buybackPool = 0xf6148aD4C8b2138B9029301310074F391ea4529D;   // Stores the public buyback coins
    uint256 public CashReserve       	  = 1100000;		               // Total Yubi Cash Reserves
    uint256 public CashReserveMoneyAgent  = 1000000;		               // Cash Reserve allocated by Money Agents
    uint256 public CashReserveYubiB2B     = 0;			               // Cash Reserve allocated for B2B Trust Services
    uint256 public CashReserveYubiOTC     = 100000;		               // Cash Reserve allocated for OTC Trading Market
    uint256 public otcCashReserve         = 100000;
    uint256 public b2bCashReserve;
    string  public otcCoverage   	      = "1.0";                             // The otcSupply divided by the totalCashReserve
    bool    public mintedbonusPool;
    mapping(address => mapping(address => uint)) allowed;
    mapping(address => uint) balances;

    constructor() public
    {
        lockStatus = false;
        balances[owner()] = coinExchangeSupply;
        balances[moneyAgent] = moneyAgentsSupply;
        balances[bonusPool] = bonusPoolSupply;
        emit Transfer(address(0), owner(), balances[owner()]);
        emit Transfer(address(0), moneyAgent, balances[moneyAgent]);
        emit Transfer(address(0), bonusPool, balances[bonusPool]);
        mintedbonusPool = true;
    }
    function balanceOf(address tokenOwner) public view returns(uint256 balance) {
        return balances[tokenOwner];
    }
    function totalSupply() public view returns(uint256 _totalCoinSupply){
        return totalCoinSupply.div(decimalsYUBI);
    }
    function allowance(address tokenOwner, address spender) public view returns(uint256 tokenAllowance)
    {
        require(tokenOwner != address(0x0) && spender != address(0x0),"Incorrect Adddress");
        return allowed[tokenOwner][spender];
    }
    function approve(address spender, uint256 tokenValue) public returns(bool) {
        require(spender != address(0),"Incorrect Address");
        allowed[msg.sender][spender] = tokenValue;
        emit Approval(msg.sender, spender, tokenValue);
    }
    function transfer(address receiver, uint256 tokenValue) public returns(bool success) {
        require(msg.sender == owner() && !lockStatus && receiver != address(0) && balances[owner()] >= tokenValue, "Not Allowed to transact");
        balances[owner()] = balances[owner()].sub(tokenValue);
        balances[receiver] = balances[receiver].add(tokenValue);
        emit Transfer(msg.sender, receiver, tokenValue);
        return true;
    }
    function transferFrom(address sender, address receiver, uint256 tokenValue) public returns(bool success)
    {
        require(receiver != address(0x0) && sender == owner() && !lockStatus,"Not Allowed to transact");
        require(balances[sender] >= tokenValue && allowed[sender][msg.sender] >= tokenValue && tokenValue >= 0,"Invalid Token Amount");
        balances[sender] = balances[sender].sub(tokenValue);
        allowed[sender][msg.sender] = allowed[sender][msg.sender].sub(tokenValue);
        balances[receiver] = balances[receiver].add(tokenValue);
        emit Transfer(sender, receiver, tokenValue);
        return true;
    }
    function burn(uint256 tokenValue) external onlyOwner {
        require(tokenValue > 0 && balances[msg.sender] >= tokenValue,"The amount can't be burn");
        totalCoinSupply = totalCoinSupply.sub(tokenValue);
        balances[msg.sender] = balances[msg.sender].sub(tokenValue);
        emit Transfer(msg.sender, address(0), tokenValue);
    }
    function burnFrom(address sender, uint256 tokenValue) public onlyOwner {
        require(tokenValue > 0 && balances[sender] >= tokenValue,"The amount can't be burn");
        totalCoinSupply = totalCoinSupply.sub(tokenValue);
        balances[sender] = balances[sender].sub(tokenValue);
        emit Transfer(sender, address(0), tokenValue);
    }
    function mint(uint256 tokenValue) public onlyOwner returns(bool success){
        require(tokenValue > 0,"The amount should be greater than 0");
        balances[msg.sender] = balances[msg.sender].add(tokenValue);
        coinExchangeSupply = coinExchangeSupply.add(tokenValue);
        totalCoinSupply = totalCoinSupply.add(tokenValue);
        emit Transfer(address(0), msg.sender, tokenValue);
        return true;
    }
    function getSupply() public view returns(
        uint256 _totalCoinSupply,
        uint256 _coinExchangeSupply,
        uint256 _moneyAgentsSupply,
        uint256 _b2bSupply,
        uint256 _escrowSupply,
        uint256 _otcSupply,
        uint256 _bonusPoolSupply,
        uint256 _buybackSupply)
        {
        _totalCoinSupply = totalCoinSupply.div(decimalsYUBI);
        _coinExchangeSupply = coinExchangeSupply.div(decimalsYUBI);
        _moneyAgentsSupply = moneyAgentsSupply.div(decimalsYUBI);
        _b2bSupply = b2bSupply.div(decimalsYUBI);
        _otcSupply = otcSupply.div(decimalsYUBI);
        _escrowSupply = escrowSupply.div(decimalsYUBI);
        _bonusPoolSupply = bonusPoolSupply.div(decimalsYUBI);
        _buybackSupply = buybackSupply.div(decimalsYUBI);
    }
    
}
contract YubiExchange is YubiCoin {
    string  public bonusPlanVersion = "1.0";             // The Bonus Plan assigned to current public wallet purchasers
    string  public bonusPlanDate = "07/01/2019";	 // The date the current Bonus Plan was activated
    uint256 public totalBonusesPaid = 0;		 // The total bonuses paid to the Yubi Community to date in US Dollars
    string  public endOfdateTime = "GMT 11:59:59";	 // The Greenwich Mean Time marking the official end of day (EOD)
    string  public buybackPrice = "0.99";                // The maximum EOD price invoking the protocol to buy back and burn coins
    string  public mintCoinPrice = "1.05";               // The minimum EOD price invoking the protocol to mint coins
    uint256 public nodecimalYUSD = 100;    		 // The current trading price of one Yubi without the decimal position
    uint256 public dollarsETH;				 // The current conversion price of ETH in US Dollars
    uint256 public dollarsBTC;				 // The current conversion price of BITCOIN in US Dollars
    uint256 private newAllowance = 0;
    uint256 private purchaseAmountWEI = 0;

    mapping(address => uint256) public EthTransfers_wei; // Variable to track eth transfer by addresses

    modifier validateTransfer(address sender, address receiver, uint256 coinAmount){
        require(sender != address(0x0),"Invalid sender address");
        require(receiver != address(0x0),"Invalid receiver address");
        require(coinAmount > 0,"Insufficient amount");
        require(balances[sender] >= coinAmount,"Out of tokens");
        _;
    }
    function yubiTransfer(address sender, address receiver, uint256 coinAmount) internal{
        balances[sender] = balances[sender].sub(coinAmount);
        balances[receiver] = balances[receiver].add(coinAmount);
        emit Transfer(sender, receiver, coinAmount);
    }
    function approveTransfer(address tokenOwner, uint256 coinAmount) public onlyOwner returns(bool)
    {
        require(tokenOwner != address(0x0),"Invalid Address");
        require(coinAmount > 0,"Insufficient amount");
        newAllowance = allowed[owner()][tokenOwner] + coinAmount;
        allowed[tokenOwner][owner()] = newAllowance;
        emit Approval(tokenOwner, owner(), newAllowance);
    }
    function checkExchangeSupply(uint256 tokenValue, uint256 coinAmount) external onlyOwner returns(bool)
    {
        require(tokenValue >= 0,"Floor amount must be greater than 0.");
        require(coinAmount >= 0,"Mint amount must be greater than 0.");
        if (balances[owner()] <= tokenValue) {
            mint(coinAmount);
            return true;
        }
    }
    function setCoinPrices(uint256 newYubiPrice, uint256 newEtherPrice, uint256 newBitcoinPrice) external onlyOwner returns(bool)
    {
        require(newYubiPrice >= 100,"Invalid Price");
        require(newEtherPrice > 0,"Invalid Price");
        require(newBitcoinPrice > 0,"Invalid Price");
        nodecimalYUSD = newYubiPrice;
        dollarsETH = newEtherPrice;
        dollarsBTC = newBitcoinPrice;
        return true;
    }
    function postCashBalances(uint256 _otcCashReserve, uint256 _b2bCashReserve, uint256 _moneyAgentCashReserve) external onlyOwner returns(bool)
    {
        b2bCashReserve = _b2bCashReserve;
        otcCashReserve = _otcCashReserve;
        moneyAgentCashReserve 	= _moneyAgentCashReserve;
	    totalCashReserve= _b2bCashReserve + _otcCashReserve + _moneyAgentCashReserve;
        return true;
    }
    function postBonusPlan(string calldata newBonusVersion, string calldata newBonusDate, uint256 newBonusAmount) external onlyOwner returns(bool) {
        require(newBonusAmount > totalBonusesPaid,"Invalid Bonus Amount");
        bonusPlanVersion = newBonusVersion;
        bonusPlanDate = newBonusDate;
        totalBonusesPaid = newBonusAmount;
        return true;
    }
    function purchaseYubi() external payable {
        require(dollarsETH >= 10,"ETH Price is too low to purchase Yubi.");
        require(msg.value >= 1000,"Transfer amount must be greater than 1000 WEI.");
        EthTransfers_wei[msg.sender] = msg.value;
        purchaseAmountWEI = (msg.value * dollarsETH * decimalsYUBI * decimalsUSD) / (nodecimalYUSD * decimalsETH);
        Yubi2Public(msg.sender, purchaseAmountWEI);
    }
    function Yubi2Public(address receiver, uint256 coinAmount) internal returns(bool) {
	coinExchangeSupply = coinExchangeSupply.sub(coinAmount);
        otcSupply = otcSupply.add(coinAmount);
        yubiTransfer(owner(),receiver,coinAmount);
    }
    function withdrawETH() external onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
    function Public2Public(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool) {
	approveTransfer(sender,coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }
    function PublicBuyback(address sender, uint256 coinAmount) external onlyOwner validateTransfer(sender,buybackPool,coinAmount) returns(bool) {
	approveTransfer(sender,coinAmount);
        otcSupply = otcSupply.sub(coinAmount);
        buybackSupply = buybackSupply.add(coinAmount);
        yubiTransfer(sender,buybackPool,coinAmount);
    }
    function burnBuyback(uint256 coinAmount) external onlyOwner returns(bool) {
        require(balances[buybackPool] >= coinAmount,"Insufficient Amount");
        balances[buybackPool] = balances[buybackPool].sub(coinAmount);
        transfer(buybackPool, coinAmount);
        buybackSupply = buybackSupply.sub(coinAmount);
        totalCoinSupply = totalCoinSupply.sub(coinAmount);
    } 
    function mintBonuscoins(address _bonusPoolSupply, uint256 coinAmount) external onlyOwner returns(bool) {
        require(_bonusPoolSupply != address(0x0),"Incorrect Addresses");
        require(coinAmount > 0,"Coin amount must be > 0");
        require(mintedbonusPool,"Bonus Pool not minted.");
        mint(coinAmount);
	    approveTransfer(owner(),coinAmount);
        balances[_bonusPoolSupply] = balances[_bonusPoolSupply].add(coinAmount);
        emit Transfer(owner(), _bonusPoolSupply, coinAmount);
	    coinExchangeSupply = coinExchangeSupply.sub(coinAmount);
        bonusPoolSupply = bonusPoolSupply.add(coinAmount);
    }
    function payBonuscoins(address receiver, uint256 coinAmount) external onlyOwner validateTransfer(bonusPool,receiver,coinAmount) returns(bool) {
        approveTransfer(bonusPool,coinAmount);
        bonusPoolSupply = bonusPoolSupply.sub(coinAmount);
        otcSupply = otcSupply.add(coinAmount);
        yubiTransfer(bonusPool,receiver,coinAmount);
    }
    /** MONEY AGENT FUNCTIONS **/
    function Yubi2MoneyAgent(address receiver, uint256 coinAmount) external onlyOwner validateTransfer(owner(),receiver,coinAmount) returns(bool) {
	    approveTransfer(owner(),coinAmount); //Owner Approval not needed
        coinExchangeSupply = coinExchangeSupply.sub(coinAmount);
        moneyAgentsSupply = moneyAgentsSupply.add(coinAmount);
        yubiTransfer(owner(),receiver,coinAmount);
    }
    function MoneyAgent2Public(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool) {
	    approveTransfer(sender,coinAmount);
        moneyAgentsSupply = moneyAgentsSupply.sub(coinAmount);
        otcSupply = otcSupply.add(coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }
    function Public2MoneyAgent(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool) {
	    approveTransfer(sender,coinAmount);
        otcSupply = otcSupply.sub(coinAmount);
        moneyAgentsSupply = moneyAgentsSupply.add(coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }
    function MoneyAgentBuyback(address sender, uint256 coinAmount) external onlyOwner validateTransfer(sender,buybackPool,coinAmount) returns(bool){
    	approveTransfer(sender,coinAmount);
        moneyAgentsSupply = moneyAgentsSupply.sub(coinAmount);
        buybackSupply = buybackSupply.add(coinAmount);
        yubiTransfer(sender,buybackPool,coinAmount);
    }

    /** MONEY SERVICES BUSINESSES AND B2B FUNCTIONS **/
    function Yubi2B2B(address receiver, uint256 coinAmount) external onlyOwner validateTransfer(owner(),receiver,coinAmount) returns(bool) {
	    approveTransfer(owner(),coinAmount);
        coinExchangeSupply = coinExchangeSupply.sub(coinAmount);
        b2bSupply = b2bSupply.add(coinAmount);
        yubiTransfer(owner(),receiver,coinAmount);
    }
    function B2B2Yubi(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool) {
        approveTransfer(sender,coinAmount);
        b2bSupply = b2bSupply.sub(coinAmount);
        coinExchangeSupply = coinExchangeSupply.add(coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }
    function Cashout(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool){
        approveTransfer(sender,coinAmount);
        coinExchangeSupply = coinExchangeSupply.sub(coinAmount);
        buybackSupply = buybackSupply.add(coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }

    /** ESCROW SERVICING FUNCTIONS **/
    function escrowFunds(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool) {
	    approveTransfer(sender,coinAmount);
        otcSupply = otcSupply.sub(coinAmount);
        escrowSupply = escrowSupply.add(coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }
    function cancelEscrow(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool){
	    approveTransfer(receiver,coinAmount);
        escrowSupply = escrowSupply.sub(coinAmount);
        otcSupply = otcSupply.add(coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }
    function releaseFunds(address sender, address receiver, uint256 coinAmount) external onlyOwner validateTransfer(sender,receiver,coinAmount) returns(bool){
        approveTransfer(sender,coinAmount);
        escrowSupply = escrowSupply.sub(coinAmount);
        coinExchangeSupply = coinExchangeSupply.add(coinAmount);
        yubiTransfer(sender,receiver,coinAmount);
    }
}
