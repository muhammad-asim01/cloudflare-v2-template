"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { WalletModal } from "./WalletModal";

export function WalletConnect() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center">
        <button
          className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg
            shadow-lg opacity-50 cursor-not-allowed"
        >
          Loading...
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg
            shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all
            duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:ring-opacity-50"
        >
          {address
            ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
