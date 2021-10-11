from brownie import accounts

def test_github_actions():
    assert accounts[0].balance() > 0
