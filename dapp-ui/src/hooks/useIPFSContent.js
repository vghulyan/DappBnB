import { useState, useEffect } from "react";
import { DEFAULT_IMAGE_URL } from "../context/contracts";

const useIPFSContent = (previewImage /*, summary*/) => {
  const [imageURL, setImageURL] = useState(DEFAULT_IMAGE_URL);
  //   const [description, setDescription] = useState("Loading...");

  useEffect(() => {
    const prefetchImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error("Image failed to load"));
      });
    };

    const getIPFSImage = async (cid) => {
      try {
        if (!cid) {
          throw new Error("CID is null");
        }
        const url = `https://${cid}.ipfs.dweb.link`; // Use a gateway known to support CORS
        await prefetchImage(url);
        setImageURL(url);
      } catch (e) {
        setImageURL(DEFAULT_IMAGE_URL);
      }
    };

    getIPFSImage(previewImage);
  }, [previewImage]);

  //   useEffect(() => {
  //     const getIPFSDescription = async (cid) => {
  //       try {
  //         const url = `https://ipfs.io/ipfs/${cid}`;
  //         const response = await fetch(url);
  //         if (!response.ok) {
  //           return { description: "No Description" };
  //         }

  //         const contentType = response.headers.get("content-type");
  //         if (!contentType || !contentType.includes("application/json")) {
  //           return { description: "No Description" };
  //         }

  //         const json = await response.json();
  //         return json;
  //       } catch (e) {
  //         return { description: "No Description" };
  //       }
  //     };

  //     const fetchDescription = async () => {
  //       const desc = await getIPFSDescription(summary);
  //       if (desc && desc.description) {
  //         setDescription(desc.description);
  //       } else {
  //         setDescription("No Description");
  //       }
  //     };

  //     fetchDescription();
  //   }, [summary]);

  return { imageURL /*, description*/ };
};

export default useIPFSContent;
