"use client";

import { useConnect } from "wagmi";
import Image from "next/image";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, connectors } = useConnect();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                onClose();
              }}
              className="w-full p-4 flex items-center justify-between border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">
                {connector.name === "Injected" ? "MetaMask" : connector.name}
              </span>
              {/* You can add wallet icons here if needed */}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
