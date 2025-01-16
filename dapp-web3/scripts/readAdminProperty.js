const { ethers } = require("hardhat");

async function main() {
  const RealEstate = await ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.attach(
    "0x143D348801D1dD9a17838a02F2D7207A835dA396"
  );

  const adminProperty = await realEstate.getAdminProperty();
  console.log("Admin Property:", adminProperty);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
