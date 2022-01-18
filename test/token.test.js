// test/Box.test.js
// Load dependencies
// const { expect } = require('chai');

// Start test block
describe('KKMAToken', function () {
  before(async function () {
    this.KKMAToken = await ethers.getContractFactory('KKMAToken');
  });

  beforeEach(async function () {
    this.box = await this.KKMAToken.deploy();
    await this.box.deployed();
  });

});