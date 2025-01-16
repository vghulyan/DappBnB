// import PropertyManagement from "./PropertyManagement.json";
// import ReviewManagement from "./ReviewManagement.json";
// import AdminManagement from "./AdminManagement.json";
import EventHub from "./dappContracts/EventHub.json";
import DappBnB from "./dappContracts/DappBnB.json";
import CONTRACT_ADDRESS from "./dappContracts/address.json";

export const DEFAULT_IMAGE_URL = "/assets/logo.jpg";

// export const PROPERTY_MANAGEMENT = "propertyManagement";
// export const REVIEW_MANAGEMENT = "reviewManagement";
// export const ADMIN_MANAGEMENT = "adminManagement";
export const EVENT_HUB = "eventHub";
export const DAPP_BnB = "dappBnB";

// const wagmiContractConfig = {
//   address: CONTRACT_ADDRESS?.realEstate,
//   abi: RealEstateContract.abi,
// };

// const adminManagementConfig = {
//   address: CONTRACT_ADDRESS?.adminManagement,
//   abi: AdminManagement.abi,
// };

// const reviewManagementConfig = {
//   address: CONTRACT_ADDRESS?.reviewManagement,
//   abi: ReviewManagement.abi,
// };

// const propertyManagementConfig = {
//   address: CONTRACT_ADDRESS?.propertyManagement,
//   abi: PropertyManagement.abi,
// };

const eventHubConfig = {
  address: CONTRACT_ADDRESS?.eventHub,
  abi: EventHub.abi,
};

const dappBnBConfig = {
  address: CONTRACT_ADDRESS?.dappBnB,
  abi: DappBnB.abi,
};

const contractConfigs = {
  // realEstate: wagmiContractConfig, // Keeping the original configuration here
  // propertyManagement: propertyManagementConfig,
  // reviewManagement: reviewManagementConfig,
  // adminManagement: adminManagementConfig,
  eventHub: eventHubConfig,
  dappBnB: dappBnBConfig,
};

export const getAbi = (key = "realEstate") => {
  return contractConfigs[key]?.abi || null;
};

export const getAddress = (key = "realEstate") => {
  return contractConfigs[key]?.address || null;
};

export { contractConfigs };
// export default wagmiContractConfig;
