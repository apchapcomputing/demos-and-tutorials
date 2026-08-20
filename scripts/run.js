const main = async () => {
  // hre = Hardhat Runtime Environment
  const nftContractFactory = await hre.ethers.getContractFactory('FalconNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log('Contract deployed to: ', nftContract.address);

  let txn = await nftContract.makeFalconNFT(); // call function
  await txn.wait();
  console.log('Minted NFT 0');
  txn = await nftContract.makeFalconNFT(); // call function
  await txn.wait();
  console.log('Minted NFT 1');
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
