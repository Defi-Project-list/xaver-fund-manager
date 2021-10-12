from brownie import accounts, network
from brownie_tokens import MintableForkToken

# def test_balance_forked_account():
#     if network.show_active() == 'development': # on github
#         assert accounts[10].balance() > 1000000000000000000000 
#     assert accounts[0].balance() > 0 # also locally

def test_mintable_fork_token_dai():
    _dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

    dai = MintableForkToken(_dai)
    dai._mint_for_testing(accounts[0], 10000)

    assert dai.balanceOf(accounts[0]) == 10000
