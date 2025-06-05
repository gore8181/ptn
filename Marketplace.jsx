import React, { useContext, useState } from "react";
import { WalletContext } from "./WalletContext";
import { motion } from "framer-motion";

const ITEMS = [
  {
    id: "skin1",
    name: "Cyan Glow",
    price: 200,
    description: "A cool cyan mine skin.",
  },
  {
    id: "skin2",
    name: "Red Blaze",
    price: 300,
    description: "A fiery red mine skin.",
  },
  {
    id: "skin3",
    name: "Gold Sparkle",
    price: 500,
    description: "A premium gold mine skin.",
  },
];

export default function Marketplace() {
  const { balance, updateBalance, inventory, addItem } = useContext(WalletContext);
  const [buyingId, setBuyingId] = useState(null);

  function buyItem(item) {
    if (balance < item.price) return alert("Insufficient balance!");
    if (inventory.some((invItem) => invItem.id === item.id))
      return alert("You already own this item!");

    setBuyingId(item.id);
    setTimeout(() => {
      updateBalance(-item.price);
      addItem(item);
      setBuyingId(null);
      alert(`Purchased ${item.name}!`);
    }, 800);
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Marketplace</h2>
      <div className="mb-4 text-sm">
        Balance: <span className="text-green-400">{balance.toFixed(2)}</span> coins
      </div>
      <div className="flex flex-col gap-4">
        {ITEMS.map((item) => {
          const owned = inventory.some((invItem) => invItem.id === item.id);
          const canBuy = balance >= item.price && !owned;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center p-4 bg-gray-800 rounded"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="mb-1 font-semibold">{item.price} coins</div>
                <button
                  disabled={!canBuy || buyingId === item.id}
                  onClick={() => buyItem(item)}
                  className={\`px-3 py-1 rounded \${canBuy
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-gray-600 cursor-not-allowed"}\`}
                >
                  {owned ? "Owned" : buyingId === item.id ? "Buying..." : "Buy"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}