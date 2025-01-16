const { ethers, upgrades } = require("hardhat");
const addresses = require("../address.json");

console.log("addresses::::: ", addresses);

// ============================================================
// EventHub
// ============================================================
async function upgradeEventHubContract(proxyAddress) {
  const EventHub = await ethers.getContractFactory("EventHub");
  console.log("Preparing to upgrade EventHub...", EventHub);

  const eventHub = await upgrades.upgradeProxy(proxyAddress, EventHub);
  console.log("AFTER UPGRADING EventHub... ", eventHub.target);
  return eventHub.target;
}

// ============================================================
// AdminManagement
// ============================================================
async function upgradeAdminManagementContract(proxyAddress) {
  const AdminManagement = await ethers.getContractFactory("AdminManagement");
  console.log("Preparing to upgrade AdminManagement...", AdminManagement);

  const adminManagement = await upgrades.upgradeProxy(
    proxyAddress,
    AdminManagement
  );
  console.log("AFTER UPGRADING AdminManagement... ", adminManagement.target);
  return adminManagement.target;
}

// ============================================================
// ReviewManagement
// ============================================================
async function upgradeReviewManagementContract(proxyAddress) {
  const ReviewManagement = await ethers.getContractFactory("ReviewManagement");
  console.log("Preparing to upgrade ReviewManagement...", ReviewManagement);

  const reviewManagement = await upgrades.upgradeProxy(
    proxyAddress,
    ReviewManagement
  );
  console.log("AFTER UPGRADING ReviewManagement... ", reviewManagement.target);
  return reviewManagement.target;
}

// ============================================================
// PropertyManagement
// ============================================================
async function upgradePropertyManagementContract(proxyAddress) {
  const PropertyManagement = await ethers.getContractFactory(
    "PropertyManagement"
  );
  console.log("Preparing to upgrade PropertyManagement...", PropertyManagement);

  const propertyManagement = await upgrades.upgradeProxy(
    proxyAddress,
    PropertyManagement
  );
  console.log(
    "AFTER UPGRADING PropertyManagement... ",
    propertyManagement.target
  );
  return propertyManagement.target;
}

// ============================================================
// DappBnB
// ============================================================
async function upgradeDappBnBContract(proxyAddress) {
  const DappBnB = await ethers.getContractFactory("DappBnB");
  console.log("Preparing to upgrade DappBnB...", DappBnB);

  const dappBnB = await upgrades.upgradeProxy(proxyAddress, DappBnB);
  console.log("AFTER UPGRADING DappBnB... ", dappBnB.target);
  return dappBnB.target;
}

async function main() {
  const contractToUpgrade = process.env.CONTRACT_NAME;
  console.log("\nContract to upgrade: --------> ", contractToUpgrade);

  try {
    if (contractToUpgrade === "EventHub") {
      console.log(
        "STARTING TO UPGRADE upgradeEventHubContract........................................... ",
        addresses?.eventHub
      );
      const eventHub = await upgradeEventHubContract(addresses?.eventHub);
      console.log("EventHub upgraded to:", eventHub);
    }
    if (contractToUpgrade === "AdminManagement") {
      console.log(
        "STARTING TO UPGRADE AdminManagement........................................... ",
        addresses?.adminManagement
      );
      const adminManagement = await upgradeAdminManagementContract(
        addresses?.adminManagement
      );
      console.log("AdminManagement upgraded to:", adminManagement);
    }
    if (contractToUpgrade === "PropertyManagement") {
      console.log(
        "STARTING TO UPGRADE PropertyManagement........................................... ",
        addresses?.propertyManagement
      );

      const propertyManagement = await upgradePropertyManagementContract(
        addresses?.propertyManagement
      );
      console.log("PropertyManagement upgraded to:", propertyManagement);
    }

    if (contractToUpgrade === "ReviewManagement") {
      console.log(
        "STARTING TO UPGRADE ReviewManagement........................................... ",
        addresses?.reviewManagement
      );
      const reviewManagement = await upgradeReviewManagementContract(
        addresses?.reviewManagement
      );
      console.log("ReviewManagement upgraded to:", reviewManagement);
    }
    if (contractToUpgrade === "DappBnB") {
      console.log(
        "STARTING TO UPGRADE DappBnB........................................... ",
        addresses?.dappBnB
      );
      const dappBnB = await upgradeDappBnBContract(addresses?.dappBnB);
      console.log("DappBnB upgraded to:", dappBnB);
    } else {
      console.error("Invalid contract specified. Use one of the following:");
      console.log("contractToUpgrade", contractToUpgrade);
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error("Upgrade failed:", error);
    process.exit(1);
  }
}

main();
