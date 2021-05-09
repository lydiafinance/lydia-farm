pragma solidity 0.6.12;

import '@lydiafinance/lydia-finance-lib/contracts/math/SafeMath.sol';
import '@lydiafinance/lydia-finance-lib/contracts/token/ERC20/IERC20.sol';
import '@lydiafinance/lydia-finance-lib/contracts/token/ERC20/SafeERC20.sol';
import '@lydiafinance/lydia-finance-lib/contracts/access/Ownable.sol';

// import "@nomiclabs/buidler/console.sol";

// Herodotus is a wise man. Knows a lot about Lydians and he is a fair guy as well as Croesus.

contract Herodotus is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. LYDs to distribute per second.
        uint256 lastRewardTimestamp;  // Last block number that LYDs distribution occurs.
        uint256 accLydPerShare; // Accumulated LYDs per share, times 1e12. See below.
    }

    // The LYD TOKEN!
    IERC20 public syrup;
    IERC20 public rewardToken;

    // uint256 public maxStaking;

    // LYD tokens created per second.
    uint256 public rewardPerSec;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (address => UserInfo) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 private totalAllocPoint = 0;
    // The timestamp when LYD mining starts.
    uint256 public startTimestamp;
    // The timestamp when LYD mining ends.
    uint256 public bonusEndTimestamp;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    constructor(
        IERC20 _syrup,
        IERC20 _rewardToken,
        uint256 _rewardPerSec,
        uint256 _startTimestamp,
        uint256 _bonusEndTimestamp
    ) public {
        syrup = _syrup;
        rewardToken = _rewardToken;
        rewardPerSec = _rewardPerSec;
        startTimestamp = _startTimestamp;
        bonusEndTimestamp = _bonusEndTimestamp;

        // staking pool
        poolInfo.push(PoolInfo({
        lpToken: _syrup,
        allocPoint: 1000,
        lastRewardTimestamp: startTimestamp,
        accLydPerShare: 0
        }));

        totalAllocPoint = 1000;
        // maxStaking = 50000000000000000000;

    }

    function stopReward() public onlyOwner {
        bonusEndTimestamp = block.timestamp;
    }


    // Return reward multiplier over the given _from to _to timestamp.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        if (_to <= bonusEndTimestamp) {
            return _to.sub(_from);
        } else if (_from >= bonusEndTimestamp) {
            return 0;
        } else {
            return bonusEndTimestamp.sub(_from);
        }
    }

    // View function to see pending Reward on frontend.
    function pendingReward(address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[_user];
        uint256 accLydPerShare = pool.accLydPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.timestamp > pool.lastRewardTimestamp && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardTimestamp, block.timestamp);
            uint256 lydReward = multiplier.mul(rewardPerSec).mul(pool.allocPoint).div(totalAllocPoint);
            accLydPerShare = accLydPerShare.add(lydReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(accLydPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.timestamp <= pool.lastRewardTimestamp) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardTimestamp = block.timestamp;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardTimestamp, block.timestamp);
        uint256 lydReward = multiplier.mul(rewardPerSec).mul(pool.allocPoint).div(totalAllocPoint);
        pool.accLydPerShare = pool.accLydPerShare.add(lydReward.mul(1e12).div(lpSupply));
        pool.lastRewardTimestamp = block.timestamp;
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }


    // Stake SYRUP tokens to SmartChef
    function deposit(uint256 _amount) public {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[msg.sender];

        // require (_amount.add(user.amount) <= maxStaking, 'exceed max stake');

        updatePool(0);
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accLydPerShare).div(1e12).sub(user.rewardDebt);
            if(pending > 0) {
                rewardToken.safeTransfer(address(msg.sender), pending);
            }
        }
        if(_amount > 0) {
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount.add(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accLydPerShare).div(1e12);

        emit Deposit(msg.sender, _amount);
    }

    // Withdraw SYRUP tokens from STAKING.
    function withdraw(uint256 _amount) public {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(0);
        uint256 pending = user.amount.mul(pool.accLydPerShare).div(1e12).sub(user.rewardDebt);
        if(pending > 0) {
            rewardToken.safeTransfer(address(msg.sender), pending);
        }
        if(_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accLydPerShare).div(1e12);

        emit Withdraw(msg.sender, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw() public {
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
        emit EmergencyWithdraw(msg.sender, user.amount);
    }

    // Withdraw reward. EMERGENCY ONLY.
    function emergencyRewardWithdraw(uint256 _amount) public onlyOwner {
        require(_amount < rewardToken.balanceOf(address(this)), 'not enough token');
        rewardToken.safeTransfer(address(msg.sender), _amount);
    }

}
