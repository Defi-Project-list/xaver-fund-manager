// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.7.6;
pragma abicoder v2;

import "hardhat/console.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./../external-interfaces/compound-finance/ICToken.sol";
import "./../external-interfaces/compound-finance/IComptroller.sol";

import "./CompoundController.sol";

import "./ICompoundCumulator.sol";
import "./../IProvider.sol";

interface IYUSDC {
  function deposit(uint256 _amount) external;
  function withdraw(uint256 _amount) external;
  function balanceOf(address _address) external view returns(uint);
  function pricePerShare() external view returns(uint);
}

contract YearnProvider is IProvider {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 public constant MAX_UINT256 = uint256(-1);
    uint256 public constant EXP_SCALE = 1e18;

    address public override smartYield;

    address public override controller;

    // fees colected in underlying
    uint256 public override underlyingFees;

    // underlying token (ie. DAI)
    address public uToken; // IERC20

    // claim token (ie. yDAI)
    address public yToken;

    // yToken.balanceOf(this) measuring only deposits by users (excludes direct yToken transfers to pool)
    uint256 public yTokenBalance;

    uint256 public exchangeRateCurrentCached;
    uint256 public exchangeRateCurrentCachedAt;

    bool public _setup;

    event TransferFees(address indexed caller, address indexed feesOwner, uint256 fees);

    modifier onlySmartYield {
      require(
        msg.sender == smartYield,
        "PPC: only smartYield"
      );
      _;
    }

    modifier onlyController {
      require(
        msg.sender == controller,
        "PPC: only controller"
      );
      _;
    }

    modifier onlySmartYieldOrController {
      require(
        msg.sender == smartYield || msg.sender == controller,
        "PPC: only smartYield/controller"
      );
      _;
    }

    modifier onlyControllerOrDao {
      require(
        msg.sender == controller || msg.sender == CompoundController(controller).dao(),
        "PPC: only controller/DAO"
      );
      _;
    }

    constructor(address yToken_, address uToken_)
    {
        yToken = yToken_;
        uToken = uToken_;

        console.log("yToken %s", yToken);
        console.log("uToken %s", uToken);
    }

    function setup(
        address smartYield_,
        address controller_
    )
      external
    {
        require(
          false == _setup,
          "PPC: already setup"
        );

        smartYield = smartYield_;
        controller = controller_;

        // not necessary with yearn?
        // _enterMarket();

        // updateAllowances();

        _setup = true;
    }

    function setController(address newController_)
      external override
      onlyControllerOrDao
    {
      // remove allowance on old controller
      // IERC20 rewardToken = IERC20(IComptroller(ICToken(cToken).comptroller()).getCompAddress());
      // rewardToken.safeApprove(controller, 0);

      controller = newController_;

      // give allowance to new controler
      // updateAllowances();
    }

    // function updateAllowances()
    //   public
    // {   
        // IERC20 rewardToken = IERC20(IComptroller(ICToken(cToken).comptroller()).getCompAddress());

        // uint256 controllerRewardAllowance = rewardToken.allowance(address(this), controller);
        // rewardToken.safeIncreaseAllowance(controller, MAX_UINT256.sub(controllerRewardAllowance));
    // }

  // externals

    // take underlyingAmount_ from from_
    function _takeUnderlying(address from_, uint256 underlyingAmount_)
      external override
      onlySmartYieldOrController
    {
        uint256 balanceBefore = IERC20(uToken).balanceOf(address(this));
        IERC20(uToken).safeTransferFrom(from_, address(this), underlyingAmount_);
        uint256 balanceAfter = IERC20(uToken).balanceOf(address(this));
        require(
          0 == (balanceAfter - balanceBefore - underlyingAmount_),
          "PPC: _takeUnderlying amount"
        );
    }

    // transfer away underlyingAmount_ to to_
    function _sendUnderlying(address to_, uint256 underlyingAmount_)
      external override
      onlySmartYield
    {
        uint256 balanceBefore = IERC20(uToken).balanceOf(to_);
        IERC20(uToken).safeTransfer(to_, underlyingAmount_);
        uint256 balanceAfter = IERC20(uToken).balanceOf(to_);
        require(
          0 == (balanceAfter - balanceBefore - underlyingAmount_),
          "PPC: _sendUnderlying amount"
        );
    }

    // deposit underlyingAmount_ with the liquidity provider, callable by smartYield or controller
    function _depositProvider(uint256 underlyingAmount_, uint256 takeFees_)
      external override
      onlySmartYieldOrController
    {
        _depositProviderInternal(underlyingAmount_, takeFees_);
    }

    // deposit underlyingAmount_ with the liquidity provider, store resulting cToken balance in cTokenBalance
    function _depositProviderInternal(uint256 underlyingAmount_, uint256 takeFees_)
      internal
    {
        // underlyingFees += takeFees_
        underlyingFees = underlyingFees.add(takeFees_);

        // ICompoundCumulator(controller)._beforeCTokenBalanceChange();
        IERC20(uToken).safeApprove(address(yToken), underlyingAmount_);
        IYUSDC(yToken).deposit(underlyingAmount_);
        // require(0 == err, "PPC: _depositProvider mint");
        // ICompoundCumulator(controller)._afterCTokenBalanceChange(yTokenBalance);

        // cTokenBalance is used to compute the pool yield, make sure no one interferes with the computations between deposits/withdrawls
        yTokenBalance = IYUSDC(yToken).balanceOf(address(this));
    }

    // withdraw underlyingAmount_ from the liquidity provider, callable by smartYield
    function _withdrawProvider(uint256 underlyingAmount_, uint256 takeFees_)
      external override
      onlySmartYield
    {
      _withdrawProviderInternal(underlyingAmount_, takeFees_);
    }

    // withdraw underlyingAmount_ from the liquidity provider, store resulting cToken balance in cTokenBalance
    function _withdrawProviderInternal(uint256 underlyingAmount_, uint256 takeFees_)
      internal
    {
        // underlyingFees += takeFees_;
        underlyingFees = underlyingFees.add(takeFees_);

        uint256 price = IYUSDC(yToken).pricePerShare();
        uint256 numberOfSharesWithdraw = underlyingAmount_.div(price).mul(1e6); 

        console.log("number of shares to withdraw %s", numberOfSharesWithdraw);

        // ICompoundCumulator(controller)._beforeCTokenBalanceChange();
        IYUSDC(yToken).withdraw(numberOfSharesWithdraw);
        // console.log("withraw err %s", err);
        // require(0 == err, "PPC: _withdrawProvider");
        // ICompoundCumulator(controller)._afterCTokenBalanceChange(yTokenBalance);

        // cTokenBalance is used to compute the pool yield, make sure no one interferes with the computations between deposits/withdrawls
        yTokenBalance = IYUSDC(yToken).balanceOf(address(this));
    }

    function balance() external view returns(uint256) {
      uint256 price = IYUSDC(yToken).pricePerShare();
      console.log("price per share %s", price);

      uint256 balanceShares = IYUSDC(yToken).balanceOf(address(this));
      console.log("Number of shares in contract %s", balanceShares);

      return (balanceShares * price) / 1e6;
  }

    function transferFees()
      external
      override
    {
      _withdrawProviderInternal(underlyingFees, 0);
      underlyingFees = 0;

      uint256 fees = IERC20(uToken).balanceOf(address(this));
      address to = 0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8; // dummy
      // address to = YearnController(controller).feesOwner();

      IERC20(uToken).safeTransfer(to, fees);

      emit TransferFees(msg.sender, to, fees);
    }

    // current total underlying balance, as measured by pool, without fees
    function underlyingBalance()
      external virtual override
    returns (uint256)
    {
        // https://compound.finance/docs#protocol-math
        // (total balance in underlying) - underlyingFees
        // cTokenBalance * exchangeRateCurrent() / EXP_SCALE - underlyingFees;
        return yTokenBalance.mul(exchangeRateCurrent()).div(EXP_SCALE).sub(underlyingFees);
    }
  // /externals

  // public
    // get exchangeRateCurrent from compound and cache it for the current block
    function exchangeRateCurrent()
      public virtual
    returns (uint256)
    {
      // only once per block
      if (block.timestamp > exchangeRateCurrentCachedAt) {
        exchangeRateCurrentCachedAt = block.timestamp;
        exchangeRateCurrentCached = IYUSDC(yToken).pricePerShare();
      }
      return exchangeRateCurrentCached;
    }
  // /public

  // internals

    // call comptroller.enterMarkets()
    // needs to be called only once BUT before any interactions with the provider
    // function _enterMarket()
    //   internal
    // {
    //     address[] memory markets = new address[](1);
    //     markets[0] = cToken;
    //     uint256[] memory err = IComptroller(ICToken(cToken).comptroller()).enterMarkets(markets);
    //     require(err[0] == 0, "PPC: _enterMarket");
    // }

    // /internals

}
