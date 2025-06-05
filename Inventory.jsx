import React, { useContext } from "react";
import { WalletContext } from "./WalletContext";
import { motion } from "framer-motion";

export default function Inventory() {
  const { inventory } = useContext(WalletContext);

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Your Inventory</h2>
      {inventory.length === 0 ? (
        <p className="text-gray-400">You haven't bought any items yet.</p>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="flex flex-col gap-3"
        >
          {inventory.map((item) => (
            <motion.li
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="p-4 bg-gray-800 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}