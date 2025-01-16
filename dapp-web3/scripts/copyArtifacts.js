// scripts/copyArtifacts.js
const fs = require("fs");
const path = require("path");

// List of files to copy
const filesToCopy = [
  "./address.json",
  "./artifacts/contracts/EventHub.sol/EventHub.json",
  "./artifacts/contracts/DappBnB.sol/DappBnB.json",
];

// Destination directory
const destDir = path.resolve(
  __dirname,
  "../../dapp-ui/src/context/contracts/dappContracts/"
);
console.log("DEST DIR>>> ", destDir);

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Copy each file to the destination directory
filesToCopy.forEach((file) => {
  const fileName = path.basename(file);
  const destPath = path.join(destDir, fileName);

  fs.copyFile(file, destPath, (err) => {
    if (err) {
      console.error(`Error copying ${fileName}:`, err);
    } else {
      console.log(`Copied ${fileName} to ${destPath}`);
    }
  });
});
