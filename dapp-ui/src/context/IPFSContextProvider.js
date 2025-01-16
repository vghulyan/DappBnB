import React, { createContext, useContext, useState, useEffect } from "react";
import { create } from "@web3-storage/w3up-client";

const IPFSContext = createContext();

export const useIPFSLogin = () => useContext(IPFSContext);

const IPFS_SPACE = process.env.REACT_APP_NEXT_IPFS_STORAGE_SPACE ?? "DappBnB";
const IPFS_STORAGE_ACCOUNT = process.env.REACT_APP_IPFS_STORAGE_ACCOUNT;

export const IPFSContextProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const login = async () => {
      try {
        const client = await create();
        const space = await client.createSpace(IPFS_SPACE); // DappBnB
        const myAccount = await client.login(IPFS_STORAGE_ACCOUNT);

        while (true) {
          const res = await myAccount.plan.get();
          if (res.ok) break;
          console.log("Waiting for payment plan to be selected...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        await myAccount.provision(space.did());
        await space.save();

        setClient(client);
        setSpace(space);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    login();
  }, []);

  return (
    <IPFSContext.Provider value={{ client, space, loading, error }}>
      {children}
    </IPFSContext.Provider>
  );
};
