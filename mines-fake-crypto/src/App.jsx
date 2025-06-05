import React from "react";
import { WalletProvider } from "./WalletContext";
import Wallet from "./Wallet";
import Marketplace from "./Marketplace";
import Inventory from "./Inventory";

export default function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4 text-center">
          Mines Fake Crypto Game UI
        </h1>
        <Wallet />
        <Marketplace />
        <Inventory />
      </div>
    </WalletProvider>
  );
}