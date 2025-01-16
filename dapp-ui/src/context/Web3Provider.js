import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains"; // mainnet
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ColorModeContextProvider } from "./ColorModeContextProvider";
import { MAIN_BACKGROUND_COLOR } from "../themes";
import { StateProvider } from "./StateContextProvider";
import { IPFSContextProvider } from "./IPFSContextProvider";

const MyCustomAvatar = ({ address, ensImage, ensName, size, radius }) => {
  console.log("\n\naddress: ", address);
  console.log("ens image: ", ensImage);
  console.log("ens name: ", ensName);
  console.log("size: ", size);
  console.log("radius: ", radius);
  const ensImageHolder = ensImage ? ensImage : "/assets/avatar.png";
  return (
    <div
      style={{
        overflow: "hidden",
        borderRadius: radius,
        height: size,
        width: size,
        background: "#eee",
      }}
    >
      {ensImageHolder && (
        <img
          src={ensImageHolder}
          alt={ensName ?? address}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia], // [mainnet]
    transports: {
      // RPC URL for each chain
      //   [mainnet.id]: http(
      //     `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      //   ),
      [sepolia.id]: http(`https://eth-sepolia.public.blastapi.io`),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "DappBnB",

    // Optional App Info
    appDescription: "Decentralise BnB",
    appUrl: "https://swiftfixers.com", // your app's url
    appIcon: "https://swiftfixers/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

export const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="nouns"
          customTheme={{
            "--ck-accent-color": MAIN_BACKGROUND_COLOR,
            "--ck-accent-text-color": "#ffffff",
          }}
          options={{
            customAvatar: MyCustomAvatar,
          }}
        >
          <ColorModeContextProvider>
            <StateProvider>
              <IPFSContextProvider>{children}</IPFSContextProvider>
            </StateProvider>
          </ColorModeContextProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
