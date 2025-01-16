const fs = require("fs");
const { ethers, upgrades } = require("hardhat");

// 1. EventHub
// 2. AdminManagement
// 3. ReviewManagement
// 4. PropertyManagement
// 5. DappBnB

async function deployContract() {
  const [deployer] = await ethers.getSigners();

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("*** Starting deployment ***");
  console.log(
    "\tMy Address: ",
    deployer.address,
    " - Balance: ",
    balance.toString()
  );

  console.time("Deployment Time");

  const contracts = {};

  console.log("\n*********** DEPLOYING ************* ");

  // ============================================================
  // Deploy PropertyLibrary
  // ============================================================
  const PropertyLibrary = await ethers.getContractFactory("PropertyLibrary");
  const propertyLibrary = await upgrades.deployProxy(PropertyLibrary, [], {});
  contracts.propertyLibrary = propertyLibrary.target;
  console.log("PropertyLibrary deployed to:", propertyLibrary.target);

  // ============================================================
  // EventHub
  // ============================================================
  console.log("\n----------- Event Hub ----------");
  const EventHub = await ethers.getContractFactory("EventHub");
  const eventHub = await upgrades.deployProxy(EventHub, [], {
    initializer: "initialize",
  });
  contracts.eventHub = eventHub.target;
  console.log("EventHub  has deployed to: ", eventHub.target);

  // ============================================================
  // AdminManagement
  // ============================================================
  console.log("\n----------- Admin Management ----------");
  const maxImages = 10;
  const pageSize = 10;

  const initialSettings = {
    pageSize,
    maxImages,
  };
  console.log("initialSettings ", initialSettings);
  const AdminManagement = await ethers.getContractFactory("AdminManagement");
  const adminManagement = await upgrades.deployProxy(
    AdminManagement,
    [contracts.eventHub, initialSettings],
    {
      initializer: "initialize",
    }
  );
  contracts.adminManagement = adminManagement.target;
  console.log(
    "\tAdmin Management has been deployed to: ",
    adminManagement.target
  );

  // ============================================================
  // ReviewManagement
  // ============================================================
  console.log("\n----------- Review Management ----------");
  const ReviewManagement = await ethers.getContractFactory("ReviewManagement");
  const reviewManagement = await upgrades.deployProxy(
    ReviewManagement,
    [contracts.eventHub],
    {
      initializer: "initialize",
    }
  );
  contracts.reviewManagement = reviewManagement.target;
  console.log("\tReview Management has deployed to: ", reviewManagement.target);

  // ============================================================
  // PropertyManagement
  // ============================================================
  console.log("\n----------- Property Management ----------");
  const PropertyManagement = await ethers.getContractFactory(
    "PropertyManagement",
    {
      libraries: {
        PropertyLibrary: contracts.propertyLibrary,
      },
    }
  );
  const propertyManagement = await upgrades.deployProxy(
    PropertyManagement,
    [contracts.adminManagement, contracts.eventHub],
    {
      initializer: "initialize",
      unsafeAllowLinkedLibraries: true,
    }
  );

  contracts.propertyManagement = propertyManagement.target;
  console.log(
    "\tProperty Management has been deployed to: ",
    propertyManagement.target
  );

  // ============================================================
  // DappBnB
  // ============================================================
  console.log("\n----------- DappBnB ----------");
  const DappBnB = await ethers.getContractFactory("DappBnB");
  const dappBnB = await upgrades.deployProxy(
    DappBnB,
    [
      contracts.propertyManagement,
      contracts.reviewManagement,
      contracts.eventHub,
      contracts.adminManagement,
    ],
    {
      initializer: "initialize",
    }
  );
  contracts.dappBnB = dappBnB.target;
  console.log("\tDappBmB has been deployed to: ", dappBnB.target);

  return contracts;
}

function saveContractAddress(_addresses) {
  const address = JSON.stringify(_addresses, null, 4);
  console.log("\n\n===>>> ADDRESS: ", address);

  try {
    fs.writeFileSync("./address.json", address, "utf8");
    console.log("\n\n===>>>File written successfully");
  } catch (error) {
    console.error("\n\n===>>>Failed to write file:", error);
  }
}

async function main() {
  try {
    const addresses = await deployContract();
    console.log("Deployed Address(s): ", addresses);
    if (addresses) {
      saveContractAddress(addresses);
      console.log("Contract deployment completed successfully.");
    } else {
      console.log("Failed to deploy the project...");
    }
  } catch (error) {
    console.error("Unhandled error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
