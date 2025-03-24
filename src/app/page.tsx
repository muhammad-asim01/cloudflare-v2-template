import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const WalletConnect = dynamic(
  () => import("@/components/WalletConnect").then((mod) => mod.WalletConnect),
  { ssr: true }
);

export const metadata: Metadata = {
  title: "Connect Your Wallet", // This will be combined with the template: "Connect Your Wallet | Web3 DApp"
  description:
    "Connect your Web3 wallet to interact with our decentralized application",
  openGraph: {
    title: "Connect Your Web3 Wallet",
    description:
      "Connect your Web3 wallet to interact with our decentralized application",
  },
  twitter: {
    title: "Connect Your Web3 Wallet",
    description:
      "Connect your Web3 wallet to interact with our decentralized application",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <Suspense fallback={<div>Loading...</div>}>
        <WalletConnect />
      </Suspense>
    </main>
  );
}
