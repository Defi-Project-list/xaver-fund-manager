from brownie import accounts, interface

def test_balance_forked_account():
    _dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    dai = interface.dai(_dai)

    assert accounts[10].address == "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549"
    assert accounts[10].balance() > 1000000000000000000000 
    assert dai.balanceOf(accounts[10]) > 100
