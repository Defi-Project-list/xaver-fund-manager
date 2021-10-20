
const math = require('mathjs')

const amount = 100_000
const buyJuniorTokenFee = 3 * 1e15
const EXPScale = 1e18
const totalSupply = 100_000_000 /// nog opzoeken
const underlyingLiquidatedJuniors = 0

// Balance compound Contract => cToken.balanceOf(this) measuring only deposits by users 
const compTokenBalance = 100_000 // Voorbeeld

// fees colected in underlying
const underlyingFees = 1_000 // Voorbeeld

const abondPrincipal = 0

// SMARTYIELD Buy TOKENS
fee = () => math.fraction(amount, buyJuniorTokenFee)

getTokens = () => (amount - fee()) * EXPScale / price


// HELPERS
price = () => underlyingJuniors() * EXPScale / totalSupply

underlyingJuniors = () => underlyingTotal() - abondPrincipal - abondPaid()

underlyingTotal = () => COMPProvider_UnderlyingBalance() - underlyingLiquidatedJuniors

// current total underlying balance, as measured by pool, without fees
COMPProvider_UnderlyingBalance = () => compTokenBalance * exchangeRateCurrent() / EXPScale - underlyingFees

// get exchangeRateCurrent from compound => exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
exchangeRateCurrent = () => { (100_000 + 1000 - 2000) / 1_000_000 }

abondPaid = () => { }


