import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { WalletContext } from "./WalletContext";

const GRID_SIZE = 5;

function createBoard(minesCount) {
  const totalTiles = GRID_SIZE * GRID_SIZE;
  let minesPositions = new Set();
  while (minesPositions.size < minesCount) {
    minesPositions.add(Math.floor(Math.random() * totalTiles));
  }
  const board = Array(totalTiles)
    .fill(null)
    .map((_, idx) => ({
      id: idx,
      isMine: minesPositions.has(idx),
      revealed: false,
    }));
  return board;
}

const tileVariants = {
  hidden: { scale: 1, backgroundColor: "#1e293b" },
  revealSafe: { scale: [1, 1.2, 1], backgroundColor: "#0f766e", transition: { duration: 0.3 } },
  revealMine: { scale: [1, 1.3, 1], backgroundColor: "#dc2626", transition: { duration: 0.4 } },
};

const shakeVariant = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.6 },
  },
};

export default function MinesGame() {
  const { balance, updateBalance } = useContext(WalletContext);

  const [minesCount, setMinesCount] = useState(5);
  const [board, setBoard] = useState(() => createBoard(minesCount));
  const [gameOver, setGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Place your bet and start revealing tiles!");
  const [bet, setBet] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);

  // Reset board/game state
  useEffect(() => {
    setBoard(createBoard(minesCount));
    setGameOver(false);
    setMultiplier(1);
    setRevealedCount(0);
    setStatusMessage("Place your bet and start revealing tiles!");
    setGameStarted(false);
    setShowConfetti(false);
    setShake(false);
  }, [minesCount]);

  // Start game only after bet is placed and tile clicked
  function revealTile(id) {
    if (gameOver) return;
    if (!gameStarted) {
      if (bet <= 0 || bet > balance) {
        setStatusMessage("Invalid bet amount or insufficient balance.");
        return;
      }
      updateBalance(-bet); // Deduct bet on first tile reveal
      setGameStarted(true);
      setStatusMessage("Good luck! Reveal safe tiles or cash out.");
    }

    setBoard((prev) =>
      prev.map((tile) => {
        if (tile.id === id && !tile.revealed) {
          if (tile.isMine) {
            setGameOver(true);
            setStatusMessage("💥 Boom! You hit a mine. You lost your bet.");
            setShake(true);
            setTimeout(() => setShake(false), 700);
            return { ...tile, revealed: true };
          } else {
            const newRevealedCount = revealedCount + 1;
            setRevealedCount(newRevealedCount);
            setMultiplier((prev) => prev + 0.2);
            if (newRevealedCount === GRID_SIZE * GRID_SIZE - minesCount) {
              setGameOver(true);
              setStatusMessage("🎉 You won! All safe tiles revealed.");
              setShowConfetti(true);
              // Add winnings
              updateBalance(bet * multiplier);
            }
            return { ...tile, revealed: true };
          }
        }
        return tile;
      })
    );
  }

  // Cashout current winnings (bet * multiplier)
  function cashout() {
    if (!gameStarted || gameOver) return;
    updateBalance(bet * multiplier);
    setStatusMessage(`💰 You cashed out ${ (bet * multiplier).toFixed(2) }!`);
    setGameOver(true);
    setShowConfetti(true);
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-cyan-400">Mines Game</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          Bet (Balance: <span className="text-green-400">{balance.toFixed(2)}</span>):
          <input
            type="number"
            min="1"
            max={balance}
            value={bet}
            disabled={gameStarted}
            onChange={(e) => setBet(Number(e.target.value))}
            className="w-20 px-2 py-1 rounded bg-gray-700 text-white text-center"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          Mines:
          <input
            type="number"
            min="1"
            max="15"
            value={minesCount}
            disabled={gameStarted}
            onChange={(e) => setMinesCount(Number(e.target.value))}
            className="w-16 px-2 py-1 rounded bg-gray-700 text-white text-center"
          />
        </label>

        <button
          onClick={() => setMinesCount(minesCount)}
          disabled={!gameStarted && revealedCount === 0}
          className="px-4 py-1 bg-cyan-600 hover:bg-cyan-700 rounded disabled:opacity-50"
        >
          Restart
        </button>
      </div>

      <motion.div
        className="grid grid-cols-5 gap-2 select-none"
        variants={shakeVariant}
        animate={shake ? "shake" : ""}
      >
        {board.map((tile) => (
          <motion.div
            key={tile.id}
            layout
            variants={tileVariants}
            initial="hidden"
            animate={tile.revealed ? (tile.isMine ? "revealMine" : "revealSafe") : "hidden"}
            onClick={() => revealTile(tile.id)}
            className={`aspect-square flex items-center justify-center rounded cursor-pointer select-none ${
              tile.revealed ? "shadow-lg" : "hover:bg-gray-800"
            }`}
          >
            {tile.revealed ? (
              tile.isMine ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )
            ) : null}
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-lg font-semibold gap-3">
        <div>
          Multiplier: <span className="text-cyan-400">{multiplier.toFixed(2)}x</span>
        </div>
        <div>{statusMessage}</div>
        <button
          onClick={cashout}
          disabled={!gameStarted || gameOver}
          className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
        >
          Cash Out
        </button>
      </div>

      <AnimatePresence>{showConfetti && <Confetti recycle={false} />}</AnimatePresence>
    </div>
  );
}
