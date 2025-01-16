import { parseUnits, formatUnits, parseEther } from "viem";

// 50000000000000000n >> 0.05
export const fromWei = (price) => formatUnits(price, 18);
// 0.05 >> 50000000000000000000000000000000000n
export const toWei = (price) =>
  parseEther(typeof price === "string" ? price : price.toString());

export function extractKeyValuePairs(allProps, contractsConfig) {
  const result = {};

  allProps?.forEach((prop, index) => {
    const config = contractsConfig[index];
    if (config) {
      const key = `${config?.contractKey}_${config?.functionName}`;
      result[key] = prop;
    }
  });

  return result;
}

export const SlicedData = (text) => {
  if (typeof text !== "string") return null;
  if (text.length <= 8) return text; // If the text is 8 characters or less, return it as is.

  const firstPart = text.slice(0, 4);
  const lastPart = text.slice(-4);

  return `${firstPart}...${lastPart}`;
};

export const uploadImagesToIPFS = async (images, client) => {
  const imageHashes = [];

  for (let [key, value] of images.entries()) {
    console.log("key>>> ", key, " - value: ", value);
    const imageCid = await uploadImage(new File([value], value.name), client);
    imageHashes.push(imageCid.toString());
  }

  return imageHashes;
};

export const uploadImage = async (file, client) => {
  try {
    const cid = await client.uploadFile(file);
    console.log("UPLOAD IMAGE................. ", cid);
    // toast.success(`Saved ${file?.name} successfully`, { icon: "👏" });
    return cid;
  } catch (error) {
    // toast.error("Failed to upload...");
    throw new Error("Failed to upload image");
  }
};
