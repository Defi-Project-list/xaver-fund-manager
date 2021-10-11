from brownie import accounts

def test_github_actions():
    assert accounts[10].balance() > 1000000000000000000000

