import React, { createContext, useState, useEffect } from "react";

export const WalletContext = createContext();

const BALANCE_KEY = "fakeCryptoBalance";
const INVENTORY_KEY = "fakeCryptoInventory";

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const savedBalance = parseFloat(localStorage.getItem(BALANCE_KEY));
    setBalance(!isNaN(savedBalance) ? savedBalance : 1000);

    const savedInventory = JSON.parse(localStorage.getItem(INVENTORY_KEY));
    setInventory(Array.isArray(savedInventory) ? savedInventory : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(BALANCE_KEY, balance.toFixed(2));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  }, [inventory]);

  function updateBalance(amount) {
    setBalance((prev) => Math.max(prev + amount, 0));
  }

  function addItem(item) {
    setInventory((prev) => [...prev, item]);
  }

  function removeItem(itemId) {
    setInventory((prev) => prev.filter((item) => item.id !== itemId));
  }

  return (
    <WalletContext.Provider
      value={{ balance, updateBalance, inventory, addItem, removeItem }}
    >
      {children}
    </WalletContext.Provider>
  );
}