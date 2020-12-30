pragma solidity ^0.4.24;

 /**
 * Token Smart contract for RYZ token 
 * Token Name: RYZ
 * Token Symbol: RYZ
 * Initial Supply : 1000000000000
 * Standard: ERC20
 */

 /**
 * @title SafeMath
 * @dev   Unsigned math operations with safety checks that revert on error
 */
library SafeMath {
    /**
    * @dev Multiplies two unsigned integers, reverts on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256){
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b,"Calculation error");
        return c;
    }

    /**
    * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256){
        // Solidity only automatically asserts when dividing by 0
        require(b > 0,"Calculation error");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256){
        require(b <= a,"Calculation error");
        uint256 c = a - b;
        return c;
    }

    /**
    * @dev Adds two unsigned integers, reverts on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256){
        uint256 c = a + b;
        require(c >= a,"Calculation error");
        return c;
    }

    /**
    * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns (uint256){
        require(b != 0,"Calculation error");
        return a % b;
    }
}

 /**
 * @title ERC20 interface
 * @dev see https://eips.ethereum.org/EIPS/eip-20
 */

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

 /**
 * @title RYZ Contract For ERC20 Tokens
 * @dev RYZ tokens as per ERC20 Standards
 */
 contract RYZ is IERC20 {

    using SafeMath for uint256;

    address private _owner;                         // Variable for Owner of the Contract.
    string  private _name;                          // Variable for Name of the token.
    string  private _symbol;                        // Variable for symbol of the token.
    uint8   private _decimals;                      // variable to maintain decimal precision of the token.
    uint256 private _totalSupply;                   // Variable for total supply of token.
    bool    public  _lockStatus = false;        
    address private _tokenPoolAddress;              // Pool Address to manage Staking user's Token.
    address private _purchaseableTokensAddress;     // Address for managing token for token purchase.
    uint256 private _tokenPriceTRX;                 // variable to set price of token with respect to TRX.
    address private _referralAddress;               // variable for referral amount.
    uint256 private _claimTokens;                   // number of tokens per claim.
    uint256 public airdropcount = 0;                // variable to keep track on number of airdrop
    
    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowed;

    constructor (string memory name, string memory symbol, uint8 decimals, uint256 totalSupply, address owner, address tokenPoolAddress) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
        _totalSupply = totalSupply*(10**uint256(decimals));
        _balances[owner] = _totalSupply;
        _owner = owner;
        _tokenPoolAddress = tokenPoolAddress;
    }
 
     /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------
     * Functions for owner
     * ----------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
    * @dev get address of smart contract owner
    * @return address of owner
    */
    function getowner() public view returns (address) {
      return _owner;
    }

    /**
    * @dev modifier to check if the message sender is owner
    */
    modifier onlyOwner() {
        require(isOwner(),"You are not authenticate to make this transfer");
        _;
    }

    /**
     * @dev Internal function for modifier
    */
    function isOwner() internal view returns (bool) {
      return msg.sender == _owner;
    }

    /**
     * @dev Transfer ownership of the smart contract. For owner only
     * @return request status
    */
    function transferOwnership(address newOwner) public onlyOwner returns (bool){
      _owner = newOwner;
      return true;
    }
    
    
     /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------
     * View only functions
     * ----------------------------------------------------------------------------------------------------------------------------------------------
     */
     

    /**
     * @return the name of the token.
     */
    function name() public view returns (string memory) {
      return _name;
    }

    /**
     * @return the symbol of the token.
     */
    function symbol() public view returns (string memory) {
      return _symbol;
    }

    /**
     * @return the number of decimals of the token.
     */
    function decimals() public view returns (uint8) {
      return _decimals;
    }

    /**
     * @dev Total number of tokens in existence.
     */
    function totalSupply() public view returns (uint256) {
      return _totalSupply;
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     * @return A uint256 representing the amount owned by the passed address.
     */
    function balanceOf(address owner) public view returns (uint256) {
      return _balances[owner];
    }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
     */
    function allowance(address owner, address spender) public view returns (uint256) {
      return _allowed[owner][spender];
    }

   /*
   * ----------------------------------------------------------------------------------------------------------------------------------------------
   * Transfer, allow, mint and burn functions
   * ----------------------------------------------------------------------------------------------------------------------------------------------
   */

    /**
     * @dev Transfer token to a specified address.
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function transfer(address to, uint256 value) public returns (bool) {
      _transfer(msg.sender, to, value);
      return true;
    }

    /**
     * @dev Transfer tokens from one address to another.
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
      _transfer(from, to, value);
      _approve(from, msg.sender, _allowed[from][msg.sender].sub(value));
      return true;
    }

    /**
     * @dev Transfer token for a specified addresses.
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function _transfer(address from, address to, uint256 value) internal {
      //require(from != address(0),"Invalid from Address");
      require(to != address(0),"Invalid to Address");
      require(value > 0, "Invalid Amount");
      _balances[from] = _balances[from].sub(value);
      _balances[to] = _balances[to].add(value);
      emit Transfer(from, to, value);
    }

    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    function approve(address spender, uint256 value) public returns (bool) {
      _approve(msg.sender, spender, value);
      return true;
    }

    /**
     * @dev Approve an address to spend another addresses' tokens.
     * @param owner The address that owns the tokens.
     * @param spender The address that will spend the tokens.
     * @param value The number of tokens that can be spent.
     */
    function _approve(address owner, address spender, uint256 value) internal {
      require(spender != address(0),"Invalid address");
      require(owner != address(0),"Invalid address");
      require(value > 0, "Invalid Amount");
      _allowed[owner][spender] = value;
      emit Approval(owner, spender, value);
    }

    /**
     * @dev Increase the amount of tokens that an owner allowed to a spender.
     * @param spender The address which will spend the funds.
     * @param addedValue The amount of tokens to increase the allowance by.
     */
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
      _approve(msg.sender, spender, _allowed[msg.sender][spender].add(addedValue));
      return true;
    }

    /**
     * @dev Decrease the amount of tokens that an owner allowed to a spender.
     * @param spender The address which will spend the funds.
     * @param subtractedValue The amount of tokens to decrease the allowance by.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
      _approve(msg.sender, spender, _allowed[msg.sender][spender].sub(subtractedValue));
      return true;
    }
    
     /**
      * @dev Airdrop function to airdrop tokens. Best works upto 50 addresses in one time. Maximum limit is 200 addresses in one time.
      * @param _addresses array of address in serial order
      * @param _amount amount in serial order with respect to address array
      */
    function airdropByOwner(address[] memory _addresses, uint256[] memory _amount) public onlyOwner returns (bool){
          require(_addresses.length == _amount.length,"Invalid Array");
          uint256 count = _addresses.length;
          for (uint256 i = 0; i < count; i++){
               _transfer(msg.sender, _addresses[i], _amount[i]);
               airdropcount = airdropcount + 1;
          }
          return true;
    }

    /**
     * @dev Internal function that burns an amount of the token of a given account.
     * @param account The account whose tokens will be burnt.
     * @param value The amount that will be burnt.
     */
    function _burn(address account, uint256 value) internal {
      require(account != address(0),"Invalid account");
      require(value > 0, "Invalid Amount");
      _totalSupply = _totalSupply.sub(value);
      _balances[account] = _balances[account].sub(value);
      emit Transfer(account, address(0), value);
    }

    /**
     * @dev Burns a specific amount of tokens.
     * @param value The amount of token to be burned.
     */
    function burn(uint256 value) public onlyOwner {
      _burn(msg.sender, value);
    }

    /**
     * Function to mint tokens
     * @param value The amount of tokens to mint.
     */
    function mint(uint256 value) public onlyOwner returns(bool){
      require(value > 0,"The amount should be greater than 0");
      _balances[msg.sender] = _balances[msg.sender].add(value);
      _totalSupply = _totalSupply.add(value);
      emit Transfer(address(0), msg.sender, value);
      return true;
    }
    
    //Get TRX balance from this contract 
    function getContractTrxBalance() public view returns(uint256){
      return(address(this).balance);
    }

  /*
  * ----------------------------------------------------------------------------------------------------------------------------------------------
  * Staking logic, mapping and functions
  * ----------------------------------------------------------------------------------------------------------------------------------------------
  */


  // Mappinng for users with id => address Staked Address
  mapping (uint256 => address) private _stakerAddress;

  // Mappinng for users with id => Tokens 
  mapping (uint256 => uint256) private _usersTokens;
  
  // Mappinng for users with id => Staking Time
  mapping (uint256 => uint256) private _stakingStartTime;

  // Mappinng for users with id => End Time
  mapping (uint256 => uint256) private _stakingEndTime;

  // Mappinng for users with id => Status
  mapping (uint256 => bool) private _TokenTransactionstatus;    

  // Mapping for referral address with user
  mapping (address => address) private _ReferalList;  

  // Mappinng for referral address withdraw status
  mapping (address => bool) private _ReferalStatus;

  // Mappinng for Blacklisted bitAddresses
  mapping (string => bool) private _bitAddresses;
  
  // Mapping to track purchased token
  mapping(address=>uint256) private _myPurchasedTokens;
  
  // mapping for open order tRX
  mapping(address=>uint256) private _openOrderTrxAmountByAddress;
  
  // mapping for trx deposited by user 
  mapping(address=>uint256) private _trxDepositedByUser;
  
  // mapping for User address who claimed BTC
  mapping(uint256=>address) private _userAddressForClaimBTC;
  
  // mapping for keep track of address who claim BTC
  mapping(uint256=>string) private _claimedBTCAddress;
  
  // mapping for raw BTC amount
  mapping(uint256=>uint256) private _rawBTCAmount;
  
  // mapping to keep track of claim amount by BTC
  mapping(uint256=>uint256) private _claimedAmountByBTC;
  
  // mapping to keep track of final withdraw value pof staked token
  mapping(uint256=>uint256) private _finalWithdrawlStake;
  
  // mappimg for claim date for BTC
  mapping(uint256=>uint256)_dateOfClaimBTC;
  
  //variable for id management for claim BTC
  uint256 private _idClaimBTC;

  // Reward Percentage
  uint256 private _rewardPercentage;

  // Penalty Percentage
  uint256 private _penaltyPercentage;
  
  // penalty amount after staking time
  uint256 private _penaltyAmountAfterStakingTime;
  
  // varaiable for referral amount
  uint256 private _referralAmount = 0;

  // variable to show rewards
  uint256 private _rewards;
  
  // variable to keep count of no of staking
  uint256 private _stakingCount = 0;

  // variable for BigPayDay Date
  uint256 private _bigPayDayDate = now;

  // variable for BigPayDay Percentage
  uint256 private _bigPayDayPercentage;
  
  // variable for Total TRX
  uint256 private _totalTrx;
  
  // variable to track count of BTC Claimed
  uint256 private _BTCClaimCount;
  
  // modifier to check the user for staking || Re-enterance Guard
  modifier validatorForStaking(uint256 tokens, uint256 time){
    require( time > now && tokens > 0, "Invalid time and Amount");
    _;
  }
  
  // modifier to check for the payable amount for purchasing the tokens
  modifier payableCheck(){
    require(msg.value > 0 && balanceOf(_purchaseableTokensAddress) > 0, "Can not buy tokens, either amount is less or no tokens for sale");
    _;
  }

  /*
  * ----------------------------------------------------------------------------------------------------------------------------------------------
  * Owner functions of get value, set value, blacklist and withdraw TRX Functionality
  * ----------------------------------------------------------------------------------------------------------------------------------------------
  */

  // function to set Token Pool address
  function setTokenPoolAddress(address add) public onlyOwner returns(bool){
    require(add != address(0),"Invalid Address");
    _tokenPoolAddress = add;
    return true;
  }
  
  // function to get Token Pool address
  function getTokenpoolAddress() public view returns(address){
    return _tokenPoolAddress;
  }

  // funtion to set _purchaseableTokensAddress
  function setpurchaseableTokensAddress(address add) public onlyOwner returns(bool){
    require(add != address(0),"Invalid Address");
    _purchaseableTokensAddress = add;
    return true;
  }

  // function to get _purchaseableTokensAddress
  function getpurchaseableTokensAddress() public view returns(address){
    return _purchaseableTokensAddress;
  }
  
  // function for setting rewards percentage by owner
  function setRewardPercentage(uint256 rewardsPercentage) public onlyOwner returns(bool){
    require(rewardsPercentage > 0, "Invalid Percentage");
    _rewardPercentage = rewardsPercentage;
    return true;
  }

  // function for getting rewards percentage by owner
  function getRewardPercentage() public view returns(uint256){
    return _rewardPercentage;
  }

  // function for setting penalty percentage percentage by owner
  function setPenaltyPercentage(uint256 penaltyPercentage) public onlyOwner returns(bool){
    require(penaltyPercentage > 0, "Invalid Percentage");
    _penaltyPercentage = penaltyPercentage;
    return true;
  }

  // function for getting penalty percentage by owner
  function getPenaltyPercentage() public view returns(uint256){
     return _penaltyPercentage;
  }
  
  // function to set Referral Address
  function setReferralAddress(address add) public onlyOwner returns(bool){
    require(add != address(0),"Invalid Address");
    _referralAddress = add;
    return true;
  } 

  // function to get Referral Address 
  function getReferralAddress() public view returns(address){
    return _referralAddress;
  }
  
  // function to set Referral amount
  function setReferralAmount(uint256 referralAmount) public onlyOwner returns(bool){
    require(referralAmount > 0, "Invalid Amount");
    _referralAmount = referralAmount;
    return true;
  } 
  
  // function to get Referral amount
  function getReferralAmount() public view returns(uint256){
    return _referralAmount;
  }
  
  // function to set claimed token as per BTC
  function setClaimTokens(uint256 token) public onlyOwner returns(bool){
    require(token > 0, "Invalid Token Amount");
    _claimTokens = token;
    return true;
  } 
  
  // function get claim bonus  
  function getClaimTokens()public view returns(uint256){
    return _claimTokens;
  }

  // function to Set the price of each token for TRX purchase
  function setPriceToken(uint256 tokenPriceTRX) external onlyOwner returns (bool){
    require(tokenPriceTRX >0,"Invalid Amount");
    _tokenPriceTRX = tokenPriceTRX;
    return(true);
  }
    
  // function to get price of each token for TRX purchase
  function getPriceToken() public view returns(uint256) {
    return _tokenPriceTRX;
  }
  
  // function to blacklist any stake
  function blacklistStake(bool status,uint256 stakingId) external onlyOwner returns(bool){
    _TokenTransactionstatus[stakingId] = status;
  }

  // function to withdraw Funds by owner only
  function withdrawTRX() external onlyOwner returns(bool){
    msg.sender.transfer(address(this).balance);
    return true;
  }
  
  /*
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  * Function for Big Pay Day set, get And calculate Functionality
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  */
  
  // function to set Big Pay Day
  function setBigPayDay(uint256 NextDay) public onlyOwner returns(bool){
    require(NextDay > now,"Invalid Day Selected");
    _bigPayDayDate = NextDay;
    return true;
  }
  
  // function to get Big Pay Day
  function getBigPayDay() public view returns(uint256){
    return _bigPayDayDate;
  }

  // function to set Big Pay Percentage
  function setBigPayDayPercentage(uint256 newPercentage) public onlyOwner returns(bool){
    require(newPercentage > 0,"Invalid Percentage Selected");
    _bigPayDayPercentage = newPercentage;
    return true;
  }
  
  // function to get Big Pay Percentage
  function getBigPayDayPercentage() public view returns(uint256){
    return _bigPayDayPercentage;
  }
  
  // funtion to calaculate bigPayDay reward
  function calculateBigPayDayReward(uint256 amount, uint256 endDate)public view returns(uint256){
    if(endDate > _bigPayDayDate){
        return (amount * _bigPayDayPercentage)/100;
    }else {
     return 0 ;
    }
  }

  /*
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  * Function for purchase Token Funtionality
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  */
  
  // function to perform purchased token
  function purchaseTokens() external payable payableCheck returns(bool){
    _myPurchasedTokens[msg.sender] = _myPurchasedTokens[msg.sender] + msg.value * _tokenPriceTRX;
    _openOrderTrxAmountByAddress[msg.sender] = msg.value;
    _totalTrx = _totalTrx +msg.value;
    _trxDepositedByUser[msg.sender] = msg.value;
    return true;
  }
  
  // funtion to withdraw purchased token 
  function withdrawPurchasedToken() external returns(bool){
    require(_myPurchasedTokens[msg.sender]>0,"You do not have any purchased token");
    _transfer(_purchaseableTokensAddress, msg.sender, _myPurchasedTokens[msg.sender]);
    _myPurchasedTokens[msg.sender] = 0;
    _openOrderTrxAmountByAddress[msg.sender] = 0;
    return true;
  }
  
  // function to get purchased token 
  function getMyPurchasedTokens(address add) public view returns(uint256){
    return _myPurchasedTokens[add];
  }
  
  // function to get TRX deposit amount by address
  function getTrxAmountByAddress(address add) public view returns(uint256){
    return _trxDepositedByUser[add];
  }
  
  // function to get TTRX amount of open order address
  function getOpenOrderTrxAmountByAddress(address add) public view returns(uint256){
      return _openOrderTrxAmountByAddress[add];
  }
  
  // function to total TRX
  function getTotalTrx() public view returns(uint256){
    return _totalTrx;
  }
  
  /*
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  * Functions for Staking Functionlaity
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  */

  // function to performs staking for user tokens for a specific period of time
  function performStaking(uint256 tokens, uint256 time) public validatorForStaking(tokens, time) returns(bool){
     _stakingCount = _stakingCount +1 ;
    _stakerAddress[_stakingCount] = msg.sender;
    _stakingEndTime[_stakingCount] = time;
    _stakingStartTime[_stakingCount] = now;
    _usersTokens[_stakingCount] = tokens;
    _TokenTransactionstatus[_stakingCount] = false;
    _transfer(msg.sender, _tokenPoolAddress, tokens);
    return true;
  }

  // function to get staking count
  function getStakingCount() public view returns(uint256){
      return _stakingCount;
  }
  
  // function to calculate panelty for the message sender
  function getPaneltyIfWithdrawToday(uint256 id) public view returns(uint256){
     if(_stakingEndTime[id] > now){
        return (_penaltyPercentage * _usersTokens[id] * ((_stakingEndTime[id] - now)/86400))/1000;
     } else if(_stakingEndTime[id] + 2629743 < now){
        return (_penaltyPercentage * _usersTokens[id] * ((now - _stakingEndTime[id])/86400))/1000;
      } else{
        return 0;
     }
  }
  
  // Function to get Rewards on the stake
  function getRewardsDetailsOfUserById(uint256 id) public view returns(uint256){
      uint256 bpDay = calculateBigPayDayReward(_stakingEndTime[id], _usersTokens[id]);
      if(_stakingEndTime[id] > now){
        return (((now - _stakingStartTime[id])/86400) * (_rewardPercentage) * _usersTokens[id] + bpDay)/10000;
      } else if (_stakingEndTime[id] < now){
          return (((_stakingEndTime[id] - _stakingStartTime[id])/86400) * (_rewardPercentage) * _usersTokens[id] + bpDay)/10000;
      } else{
        return 0;
     }
  }

   // function for withdrawing staked tokens
   function withdrawStakedTokens(uint256 stakingId) public returns(bool){
    require(_stakerAddress[stakingId] == msg.sender,"No staked token found on this address and ID");
    require(_TokenTransactionstatus[stakingId] != true,"Either tokens are already withdrawn or blocked by admin");
    require(balanceOf(_tokenPoolAddress) > _usersTokens[stakingId], "Pool is dry, can perform transaction");
    uint256 paneltyAtWithdraw = getPaneltyIfWithdrawToday(stakingId);
    _TokenTransactionstatus[stakingId] = true;
    _finalWithdrawlStake[stakingId] = _usersTokens[stakingId]-paneltyAtWithdraw+getRewardsDetailsOfUserById(stakingId);
    _transfer(_tokenPoolAddress,msg.sender,_usersTokens[stakingId]-paneltyAtWithdraw+getRewardsDetailsOfUserById(stakingId));
    return true;
  }
  
  // function to get Final Withdraw Satked value
  function getFinalWithdrawlStake(uint256 id) public view returns(uint256){
    return _finalWithdrawlStake[id];
  }
  
  /*
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  * Functions for Claim Bonus and Withdraw Referral Functionality
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  */
  
  // function to withdraw referral amount
  function withdrawReferral(address add) external returns(bool){
    require(_ReferalList[add] != msg.sender && _ReferalStatus[msg.sender] != true && add != msg.sender,"Either already withdrawn or not valid");
    _transfer(_referralAddress, msg.sender, _referralAmount);
    _transfer(_referralAddress, add, _referralAmount);
    _ReferalStatus[add]=true;
    _ReferalList[add]=msg.sender;
    return true;
  }
  
  // function to Claim bonus
  function claimBonus(string bit_address,uint256 bit_balance) external returns(bool){
    require(bit_balance > 0 && ! _bitAddresses[bit_address] == true,"Either address or balance is not valid");
    require(bit_balance > 20000000,"Amount cannot be accepted, Please try with higher amount");
    _idClaimBTC = _idClaimBTC+1;
    _stakingCount = _stakingCount +1;
    _BTCClaimCount = _BTCClaimCount +1;
    _stakerAddress[_stakingCount] = msg.sender;
    _stakingEndTime[_stakingCount] = now + 31556926;
    _stakingStartTime[_stakingCount] = now;
    _usersTokens[_stakingCount] = bit_balance * _claimTokens*50;
    _TokenTransactionstatus[_stakingCount] = false;
    _bitAddresses[bit_address] = true;
    _dateOfClaimBTC[_idClaimBTC] = now;
    _userAddressForClaimBTC[_idClaimBTC]=msg.sender;
    _claimedBTCAddress[_idClaimBTC]=bit_address;
    _rawBTCAmount[_idClaimBTC]=bit_balance;
    _claimedAmountByBTC[_idClaimBTC]= bit_balance * _claimTokens/100;
    return true;
  }

  /*
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  * Functions for Front-End Functionality
  * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  */

  // function to get Staking address by id
  function getStakingAddressById(uint256 id) public view returns (address){
    require(id <= _stakingCount,"Unable to reterive data on specified id, Please try again!!");
    return _stakerAddress[id];
  }
  
  // function to get Staking Starting time by id
  function getStakingStartTimeById(uint256 id)public view returns(uint256){
    require(id <= _stakingCount,"Unable to reterive data on specified id, Please try again!!");
    return _stakingStartTime[id];
  }
  
  // function to get Staking Ending time by id
  function getStakingEndTimeById(uint256 id)public view returns(uint256){
    require(id <= _stakingCount,"Unable to reterive data on specified id, Please try again!!");
    return _stakingEndTime[id];
  }

  // function to get Staking tokens by id
  function getStakingTokenById(uint256 id)public view returns(uint256){
    require(id <= _stakingCount,"Unable to reterive data on specified id, Please try again!!");
    return _usersTokens[id];
  }
  
  // function to get Staking tokens by id
  function getActiveStakesById(uint256 id)public view returns(address){
    return _stakerAddress[id];
  }

  // function to get Referral History by Address
  function getReferralHistory(address add)public view returns(address){
      return _ReferalList[add];
  }

  // function to get Token lockstatus by id
  function getTokenLockstatus(uint256 id)public view returns(bool){
    return _TokenTransactionstatus[id];
  }
  
  //Function to get Interest  
  function getInterest() public view returns(uint256){
    return _rewardPercentage;
  }
  
  // funtion to get date of claimed BTC
  function getDateOfClaimBTC(uint256 idClaimBTC)public view returns(uint256){
    return(_dateOfClaimBTC[idClaimBTC]);
  }

  // function to get BTC Claimed Count
  function getBTCClaimCount()public view returns(uint256){
    return(_BTCClaimCount);
  }
  
  // function to get User address who claimed BTC
  function getUserAddressForClaimBTC(uint256 idClaimBTC)public view returns(address){
    return(_userAddressForClaimBTC[idClaimBTC]);
  }
  
  // function to get address by id who claimed btc
  function getClaimedBTCAddress(uint256 idClaimBTC)public view returns(string){
    return(_claimedBTCAddress[idClaimBTC]);  
  }
  
  // function to get raw BTC Amount
  function getRawBTCAmount(uint256 idClaimBTC)public view returns(uint256){
    return(_rawBTCAmount[idClaimBTC]);
  }
  
  // funtion to get claimed amount by BTC
  function getClaimedAmountByBTC(uint256 idClaimBTC)public view returns(uint256){
    return(_claimedAmountByBTC[idClaimBTC]);
  }
  
}
