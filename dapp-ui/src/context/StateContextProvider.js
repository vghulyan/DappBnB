import React, { useEffect, createContext, useContext, useState } from "react";

import {
  useAccount,
  useBalance,
  useBlockNumber,
  useChainId,
  useConnect,
  useConnections,
  useConnectorClient, // chain,account,type,contracts{ensRegistry,...},feescontract.name=Sepolia,nativeCurrency, rpcURls
  useDisconnect,
  useEnsName,
  useReadContract,
  useReadContracts,
  useSendTransaction,
  useSignMessage,
  useSwitchAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  useWatchContractEvent,
  useSimulateContract,
} from "wagmi";

import { DAPP_BnB, contractConfigs, getAbi, getAddress } from "./contracts";

import { useToast } from "../components/helper/Toast";
import { extractKeyValuePairs } from "../utils/utils";

export const useWatchContractEventFunction = (contractKey, eventName) => {
  const contractConfig = contractConfigs[contractKey];

  if (!contractConfig) {
    throw new Error(`Invalid contract key: ${contractKey}`);
  }

  const { notify } = useStateContext();
  useWatchContractEvent({
    address: contractConfig.address,
    abi: contractConfig.abi,
    eventName: eventName,
    onLogs: (logs) => {
      notify(`${logs[0].eventName}`, "success");
      console.log(`Event Received>>> `, logs);
    },
    onError: (error) => {
      //notify(`Error listening for ${eventName}`, "error");
      console.log(`Error listening for ${eventName}`, error);
    },
  });
};

export const useGetReadContract = (contractKey, functionName, args) => {
  const contractConfig = contractConfigs[contractKey];

  if (!contractConfig) {
    throw new Error(`Invalid contract key: ${contractKey}`);
  }

  return useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName,
    args: args || [],
  });
};

export const useGetReadContractOnlySender = (
  contractKey,
  functionName,
  args
) => {
  const contractConfig = contractConfigs[contractKey];

  if (!contractConfig) {
    throw new Error(`Invalid contract key: ${contractKey}`);
  }

  return useSimulateContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName,
    args: args || [],
  });
};

/**
 * 
 * const contractsConfig = [
    { contractKey: "adminManagement", functionName: "isAdmin", args: [] },
    { contractKey: "reviewManagement", functionName: "getReviewCount", args: [] },
    { contractKey: "propertyManagement", functionName: "getPropertyCount", args: [] },
  ];
  const { data, isLoading, error } = useGetReadContracts(contractsConfig);
 * @param {*} contractKey 
 * @param {*} contractsConfig 
 * @returns 
 */
export const useGetReadContracts = (contractsConfig) => {
  return useReadContracts({
    allowFailure: false,
    contracts: contractsConfig.map((config) => ({
      address: getAddress(config.contractKey),
      abi: getAbi(config.contractKey),
      functionName: config.functionName,
      args: config.args,
    })),
  });
};

export const useWriteContractHook = () => {
  const [hash, setHash] = useState(null);
  const [error, setError] = useState(null);

  const { data, isLoading: isWriting, writeContractAsync } = useWriteContract(); //useSimulateContract(); //useWriteContract();

  const handleWrite = async (contractKey, functionName, args) => {
    const contractConfig = contractConfigs[contractKey];

    if (!contractConfig) {
      throw new Error(`Invalid contract key: ${contractKey}`);
    }
    console.log(
      "address: ",
      contractConfig.address,
      " - abi: ",
      contractConfig.abi,
      " - function name: ",
      functionName,
      " - args: ",
      args
    );
    try {
      const result = await writeContractAsync({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName,
        args: args,
      });
      console.log("------------------- AFTER SAVING RESULT: ", result);
      setHash(result);
      return result;
    } catch (err) {
      console.error("Error occurred: ", err);
      setError(err);
      throw err;
    }
  };

  return {
    handleWrite,
    data,
    error,
    isWriting,
    hash,
  };
};

// Create the context
const StateContext = createContext();

// Custom hook to use the StateContext
export const useStateContext = () => {
  return useContext(StateContext);
};

// Provider component
export const StateProvider = ({ children }) => {
  const wagmiAccount = useAccount();
  const { isConnected: wagmiIsConnected, address } = useAccount(); // address, chainId, isConnected, isConnecting, isDisconnected, isReconnecting, status

  const contractsConfig = [
    { contractKey: DAPP_BnB, functionName: "getAdminSettings" },
    { contractKey: DAPP_BnB, functionName: "isAdmin", args: [address] },
  ];

  const { data: allProps } = useGetReadContracts(contractsConfig);
  const globalVars = React.useMemo(() => {
    if (allProps) {
      return extractKeyValuePairs(allProps, contractsConfig);
    }
    return {};
  }, [allProps]);

  //   const { data: adminSettings } = useGetReadContract(
  //     DAPP_BnB,
  //     "getAdminSettings"
  //   );

  const disconnect = useDisconnect();

  const { data: ensName } = useEnsName({
    address: wagmiAccount.address,
  });
  const { data: balance } = useBalance({ address: wagmiAccount?.address });
  const { data: block } = useBlockNumber({ watch: true });
  const connections = useConnections();

  const { notify } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const saveTransactionReceipt = (hash) => {
    setTransactionHash(hash);
    setNotificationCount((prevCount) => prevCount + 1);
  };
  const markNotificationsAsRead = () => {
    setNotificationCount(0);
  };

  // // ==============================
  return (
    <StateContext.Provider
      value={{
        isAdmin,
        globalVars,
        useAccount,
        disconnect,
        useConnect,

        useDisconnect,
        balance,
        ensName,
        block,
        connections,

        useWaitForTransactionReceipt,

        useGetReadContract,

        useGetReadContractOnlySender,

        useGetReadContracts,

        useWriteContractHook,

        notify,
        useWatchContractEventFunction,

        saveTransactionReceipt,
        transactionHash,
        notificationCount,
        markNotificationsAsRead,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
