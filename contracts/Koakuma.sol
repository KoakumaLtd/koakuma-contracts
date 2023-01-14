// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @custom:security-contact admin@koakuma.io
contract Koakuma is ERC20, ERC20Burnable, Pausable, Ownable {
    using SafeMath for uint256;
    uint256 private _tax;

    constructor() ERC20("Koakuma", "KKMA") {
        _mint(msg.sender, 1000000000 * 10**decimals());
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function setTax(uint256 tax_) public onlyOwner {
        require(tax_ <= 10000, "Koakuma: tax exceeds 100%");
        _tax = tax_;
    }

    function getTax() public view returns (uint256) {
        return _tax;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        uint256 taxFee = (amount.mul(_tax)).div(10000);

        if (taxFee > 0) {
            _transfer(sender, address(this), taxFee);
        }
        _transfer(sender, recipient, amount.sub(taxFee));

        uint256 currentAllowance = allowance(sender, _msgSender());
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

    function withdrawTax(address recipient_, uint256 amount_) public onlyOwner {
        IERC20 tokenContract = IERC20(this);
        tokenContract.transfer(recipient_, amount_);
    }
}
