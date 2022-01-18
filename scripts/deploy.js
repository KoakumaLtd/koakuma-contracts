async function main () {
    // We get the contract to deploy
    const KKMAToken = await ethers.getContractFactory('KKMAToken');
    const token = await KKMAToken.deploy();
    await token.deployed();
    console.log('Box deployed to:', token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });