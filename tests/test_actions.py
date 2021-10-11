from brownie import accounts

def test_github_actions():
    assert accounts[0].balance() > 0
    assert accounts[0].address == '0x8486e1EC28Ca6cb008AFAf648675E599aA687110'
