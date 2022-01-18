// scripts/index.js
async function main () {
    const address = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const KKMAToken = await ethers.getContractFactory('KKMAToken');
    const token = await KKMAToken.attach(address);
    const value = await token.retrieve();
    console.log('Box value is', value.toString());
  }
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});