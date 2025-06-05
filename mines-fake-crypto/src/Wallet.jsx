import React, { useContext, useState } from "react";
import { WalletContext } from "./WalletContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Wallet() {
  const { balance, updateBalance } = useContext(WalletContext);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [error, setError] = useState("");

  function openModal() {
    setDepositAmount("");
    setError("");
    setShowDeposit(true);
  }

  function closeModal() {
    setShowDeposit(false);
    setError("");
  }

  function handleDeposit() {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }
    updateBalance(amount);
    closeModal();
  }

  return (
    <>
      <div className="flex items-center gap-4 bg-gray-800 rounded-lg px-5 py-3 max-w-sm mx-auto shadow-lg">
        <div className="text-white font-semibold text-lg">
          Balance:{" "}
          <span className="text-green-400">{balance.toFixed(2)} coins</span>
        </div>
        <button
          onClick={openModal}
          className="ml-auto bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-white font-semibold transition"
        >
          Add Funds
        </button>
      </div>

      <AnimatePresence>
        {showDeposit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
                Add Funds
              </h3>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount to add"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-cyan-500 mb-2"
              />
              {error && (
                <p className="text-red-500 mb-2 text-sm font-semibold">{error}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
                >
                  Deposit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}