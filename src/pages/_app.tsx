import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Provider } from "react-redux";
import store from "../store/store";
// import store from "./store/store.js";

// 1. Get projectId
const projectId = "4446e3aff2b3b5575f512ef4af790549";

// 2. Set chains
// const mainnet = {
//   chainId: 1,
//   name: "Ethereum",
//   currency: "ETH",
//   explorerUrl: "https://etherscan.io",
//   rpcUrl: "https://cloudflare-eth.com",
// };
const polygon = {
  chainId: 137,
  name: "Polygon",
  currency: "MATIC",
  explorerUrl: "https://polygonscan.com",
  rpcUrl: "https://polygon-rpc.com",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [polygon],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="402757163916-1upt7ms49vggd6kcr976krsarcgo5cqh.apps.googleusercontent.com">
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          style={{ zIndex: 1 }}
        />
      </Provider>
    </GoogleOAuthProvider>
  );
}
