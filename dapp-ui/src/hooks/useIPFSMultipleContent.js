import { useState, useEffect } from "react";
import { DEFAULT_IMAGE_URL } from "../context/contracts";

const useIPFSMultipleContent = (hashes) => {
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    // if (!hashes || hashes.length === 0) {
    //   setImageURLs([DEFAULT_IMAGE_URL]);
    //   return;
    // }

    const fetchImages = async () => {
      const initialImageURLs = Array(hashes.length).fill(DEFAULT_IMAGE_URL);
      setImageURLs(initialImageURLs);

      const prefetchImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(url);
          img.onerror = () => reject(new Error("Image failed to load"));
        });
      };

      const getIPFSImage = async (hash, index) => {
        try {
          if (!hash) {
            throw new Error("CID is null");
          }
          const url = `https://${hash}.ipfs.dweb.link`;
          await prefetchImage(url);
          setImageURLs((prev) => {
            const newURLs = [...prev];
            newURLs[index] = url;
            return newURLs;
          });
        } catch (e) {
          setImageURLs((prev) => {
            const newURLs = [...prev];
            newURLs[index] = DEFAULT_IMAGE_URL;
            return newURLs;
          });
        }
      };

      await Promise.all(hashes.map((hash, index) => getIPFSImage(hash, index)));
    };

    fetchImages();
  }, [hashes]);

  return { imageURLs };
};

export default useIPFSMultipleContent;
