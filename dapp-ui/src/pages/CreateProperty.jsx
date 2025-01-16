import React, { useState, useEffect } from "react";
import { formatEther, parseEther } from "viem";
import CreatePropertyForm from "../components/organisms/CreatePropertyForm";
import {
  useStateContext,
  useWatchContractEventFunction,
  useWriteContractHook,
} from "../context/StateContextProvider";
import { Box, CircularProgress } from "@mui/material";
import { uploadImage, uploadImagesToIPFS } from "../utils/utils";
import { useIPFSLogin } from "../context/IPFSContextProvider";
import { useNavigate } from "react-router-dom";
import { DAPP_BnB, EVENT_HUB } from "../context/contracts";

const CreateProperty = () => {
  const {
    useAccount,
    notify,
    saveTransactionReceipt,
    transactionReceipt,
    isReceiptLoading,
    isReceiptError,
  } = useStateContext();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { client } = useIPFSLogin();
  useWatchContractEventFunction(EVENT_HUB, "PropertyListed");
  useWatchContractEventFunction(DAPP_BnB, "DebugAddress");
  useWatchContractEventFunction(DAPP_BnB, "DebugDetails");

  const [loading, setLoading] = useState(false);
  // const [hashResult, setHashResult] = useState(null);

  const initialValues = {
    price: "0.06",
    propertyTitle: "Ocean view",
    category: "",
    // images: "",
    propertyAddress: "Ocean view address",
    description: "This idealisting property has a nice ocean view",
    rooms: 4,
  };

  const { handleWrite, data, error, isWriting, hash } = useWriteContractHook();
  const handleFormSubmit = async (values) => {
    if (isConnected) {
      notify("Step 1. Uploading images. Please wait...");
      setLoading(true);

      // Step 1: Upload images to IPFS
      const imageHashes = await uploadImagesToIPFS(
        values?.imagesFormData,
        client
      );

      notify("Step 2. Saving the data. Please wait...");
      try {
        const priceInWei = parseEther(values.price.toString());

        const propertyDetails = {
          // owner: address,
          price: priceInWei, // 1 ETH in wei
          propertyTitle: values.propertyTitle,
          category: values.category,
          imageHashes: imageHashes,
          propertyAddress: values.propertyAddress,
          description: values.description,
          rooms: values.rooms,
        };

        const _hashResult = await handleWrite(DAPP_BnB, "createProperty", [
          address,
          propertyDetails,
        ]);

        saveTransactionReceipt(_hashResult);
        console.log("transaction receipt ********************* ", _hashResult);

        notify("Record saved successfully!", "success");
        navigate(`/`);
        // onSubmit(values);
      } catch (error) {
        notify("Error writing to contract", "error");
        console.error("Error writing to contract:", error);
      } finally {
        setLoading(false);
      }
    } else {
      notify("Please connect your wallet", "error");
    }
  };

  useEffect(() => {
    if (transactionReceipt) {
      notify("Transaction receipt obtained successfully!", "success");
    }
  }, [transactionReceipt, notify]);

  return (
    <Box sx={{ position: "relative" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <CreatePropertyForm
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </Box>
  );
};

export default CreateProperty;
