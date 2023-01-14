""
const { expect } = require("chai");

describe("Koakuma Token", function () {
    let owner;
    let addr1;
    let addr2;
    let hardhatToken;

    this.beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Koakuma");
        hardhatToken = await Token.deploy();
    });

    describe("Tax", function () {
        it("Owner can set tax", async function () {
            expect(await hardhatToken.getTax()).to.equal(0);
            await hardhatToken.setTax(3800);
            expect(await hardhatToken.getTax()).to.equal(3800);
        });

        it("Others can't set tax", async function () {
            expect(await hardhatToken.getTax()).to.equal(0);
            await expect(hardhatToken.connect(addr1).setTax(3800)).to.be.revertedWith("Ownable: caller is not the owner");
            expect(await hardhatToken.getTax()).to.equal(0);
        });

        it("Tax can not be set greater than 10000", async function () {
            expect(await hardhatToken.getTax()).to.equal(0);
            expect(await hardhatToken.setTax(3800));
            expect(await hardhatToken.getTax()).to.equal(3800);
            expect(await hardhatToken.setTax(9999));
            expect(await hardhatToken.getTax()).to.equal(9999);
            expect(await hardhatToken.setTax(10000));
            expect(await hardhatToken.getTax()).to.equal(10000);
            await expect(hardhatToken.setTax(10001)).to.be.revertedWith("Koakuma: tax exceeds 100%");
        });

        it("Transfer when no tax", async function () {
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("1000000000000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("0");
            await hardhatToken.transfer(addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999900000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("100000000000000000000");

            await expect(hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
            await hardhatToken.approve(owner.address, "100000000000000000000");
            expect(await hardhatToken.allowance(owner.address, owner.address)).to.equal("100000000000000000000");
            await hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999800000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("200000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("0");
        });

        it("Transfer when no tax", async function () {
            await hardhatToken.setTax("3800");
            expect(await hardhatToken.getTax()).to.equal("3800");

            expect(await hardhatToken.balanceOf(owner.address)).to.equal("1000000000000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("0");
            await hardhatToken.transfer(addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999900000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("100000000000000000000");

            await expect(hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
            await hardhatToken.approve(owner.address, "100000000000000000000");
            expect(await hardhatToken.allowance(owner.address, owner.address)).to.equal("100000000000000000000");
            await hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999800000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("162000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("38000000000000000000");
        });

        it("Set tax back to zero", async function () {
            await hardhatToken.setTax("3800");
            expect(await hardhatToken.getTax()).to.equal("3800");

            expect(await hardhatToken.balanceOf(owner.address)).to.equal("1000000000000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("0");
            await hardhatToken.transfer(addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999900000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("100000000000000000000");

            await expect(hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
            await hardhatToken.approve(owner.address, "100000000000000000000");
            expect(await hardhatToken.allowance(owner.address, owner.address)).to.equal("100000000000000000000");
            await hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999800000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("162000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("38000000000000000000");

            await hardhatToken.setTax("0");
            expect(await hardhatToken.getTax()).to.equal("0");

            await hardhatToken.transfer(addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999700000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("262000000000000000000");

            await expect(hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
            await hardhatToken.approve(owner.address, "100000000000000000000");
            expect(await hardhatToken.allowance(owner.address, owner.address)).to.equal("100000000000000000000");
            await hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999600000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("362000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("38000000000000000000");
        });

        it("Withdraw Tax", async function () {
            await hardhatToken.setTax("3800");
            expect(await hardhatToken.getTax()).to.equal("3800");

            expect(await hardhatToken.balanceOf(owner.address)).to.equal("1000000000000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("0");
            await hardhatToken.transfer(addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999900000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("100000000000000000000");

            await expect(hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
            await hardhatToken.approve(owner.address, "100000000000000000000");
            expect(await hardhatToken.allowance(owner.address, owner.address)).to.equal("100000000000000000000");
            await hardhatToken.transferFrom(owner.address, addr1.address, "100000000000000000000");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal("999999800000000000000000000");
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal("162000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("38000000000000000000");

            expect(await hardhatToken.balanceOf(addr2.address)).to.equal("0");
            await expect(hardhatToken.connect(addr1).withdrawTax(addr2.address, "8000000000000000000")).to.be.revertedWith("Ownable: caller is not the owner");
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal("0");

            await hardhatToken.withdrawTax(addr2.address, "8000000000000000000");
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal("8000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("30000000000000000000");

            await expect(hardhatToken.withdrawTax(addr2.address, "31000000000000000000")).to.be.revertedWith("ERC20: transfer amount exceeds balance");
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal("8000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("30000000000000000000");

            await hardhatToken.withdrawTax(addr2.address, "30000000000000000000");
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal("38000000000000000000");
            expect(await hardhatToken.balanceOf(hardhatToken.address)).to.equal("0");
        });
    });
});