// import {createContext} from "react";

// const Web3Context = createContext();

// export default Web3Context;


import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      setProvider(provider);
      setSelectedAccount(account);
      setIsWalletConnected(true); // Update wallet connection status
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  return (
    <Web3Context.Provider
      value={{ provider, selectedAccount, connectWallet, isWalletConnected }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
