'use client'
import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/solanaWallet.module.scss";
import { FormatStringWalletAddress } from "@/utils/solana";
import useWalletSignature from "@/hooks/useWalletSignature";
import useAuth from "@/hooks/useAuth";
import axios from "@/services/axios";
import { useDispatch } from "react-redux";
import SolanaConnectWallet from "@/components/Solana/ConnectWallet";
import SolanaConfirmModal from "@/components/staking-pools/ModalConfirm/SolanaModalConfirm";
import { toast } from "react-toastify";
import Image from "next/image";
// import SolanaConfirmModal from "@/components/staking-pools/ModalConfirm/SolanaModalConfirm";

interface SolanaWalletProps {
  onEditProfile: boolean;
  handleDisconnectDialogOpen: any;
  setWalletAddress: any;
  walletAddress: any;
}

export default function SolanaWallet({
  onEditProfile,
  handleDisconnectDialogOpen,
  walletAddress,
  setWalletAddress
}: SolanaWalletProps) {
  const { connectedAccount } = useAuth();
  const { signature, signMessage, setSignature } = useWalletSignature();
  const dispatch = useDispatch();
  const [solanaWalletAddress, setSolanaWalletAddress] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSolanaAddress = useCallback(async () => {
    if (connectedAccount && localStorage.getItem(`access_token:${connectedAccount}`)) {
      const response = await axios.get("user/get-solana-address", {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem(`access_token:${connectedAccount}`),
        },
      });
      return response?.data?.data?.solana_address || "";
    }
  }, [connectedAccount]);

  const updateSolanaWallet = useCallback(async () => {
    const config = {
      headers: {
        msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
        Authorization:
          "Bearer " + localStorage.getItem(`access_token:${connectedAccount}`),
      },
    };
    if (signature && window?.solana?.publicKey && connectedAccount) {
      try {
        const response: any = await axios.post(
          "user/link-solana-address",
          {
            signature: signature,
            wallet_address: connectedAccount,
            solana_address: window?.solana?.publicKey,
          },
          config as any
        );
        if (response?.data?.message && response?.data?.status === 400) {
          toast.error(response?.data?.message);
        } else {
          toast.success("Solana Wallet Updated Successfully");
        }
        setSignature("");
        setShowConfirmModal(false);
      } catch (error : any) {
        console.error("Error updating solana wallet:", error);
        toast.error("An Unexpected Error occurred");
        setSignature("");
        setShowConfirmModal(false);
      }
    }
    setLoading(false);
  }, [
    connectedAccount,
    dispatch,
    setSignature,
    signature,
  ]);

  const getSigner = useCallback(async () => {
    setLoading(true);
    setSignature("");
    const solanaAddress = await getSolanaAddress();
    if (
      solanaAddress &&
      solanaAddress !== window?.solana?.publicKey?.toBase58()
    ) {
      await signMessage();
    }
    if (!solanaAddress) {
      await signMessage();
    }
  }, [getSolanaAddress, setSignature, signMessage]);

  useEffect(() => {
    const getConfirmation = async () => {
      const solanaAddress = await getSolanaAddress();
      if (
        (solanaAddress &&
        solanaWalletAddress &&
        solanaAddress !== solanaWalletAddress &&
        solanaAddress !== "Token expired") || solanaAddress === ""
      ) {
        setShowConfirmModal(true);
      } else {
        setShowConfirmModal(false);
      }
    };

    if (window?.solana?.isConnected && window?.solana?.publicKey) {
      getConfirmation();
    }
  }, [
    getSigner,
    solanaWalletAddress,
    getSolanaAddress,
    walletAddress
  ]);

  useEffect(() => {
    if (signature && window?.solana?.publicKey && connectedAccount) {
      updateSolanaWallet();
    }
  }, [
    signature,
    connectedAccount,
    updateSolanaWallet,
  ]);

  useEffect(() => {
    const handleAccountChange = (newPublicKey: any) => {
      setSolanaWalletAddress(newPublicKey.toBase58());
    };

    if (window?.solana) {
      window.solana.on("accountChanged", handleAccountChange);
      window.solana.on("connect", handleAccountChange);
      window.solana.on("disconnect", () => {
        setWalletAddress("");
      });
    }

    return () => {
      if (window?.solana) {
        window.solana.off("accountChanged", handleAccountChange);
      }
    };
  }, [getSigner]);

  return (
    <div>
      {window?.solana?.publicKey ? (
        <div className={styles.walletForm}>
          <Image width={23} height={23} src={"/assets/images/solana/phantom.png"} alt="" />
          <div className="wallet-address">
            <span>Solana Wallet Address</span>
            <span>
              {window?.solana?.publicKey &&
                FormatStringWalletAddress(
                  window?.solana?.publicKey?.toBase58(),
                  8
                )}
            </span>
          </div>
          {onEditProfile && (
            <button
              style={{ color: "#0066FF" }}
              onClick={() => handleDisconnectDialogOpen()}
            >
              Disconnect
            </button>
          )}
        </div>
      ) : (
        <SolanaConnectWallet setWalletAddress = {setWalletAddress} />
      )}

      <SolanaConfirmModal
        open={showConfirmModal}
        onConfirm={() => getSigner()}
        onClose={() => setShowConfirmModal(false)}
        newSolanaAddress={solanaWalletAddress}
        loading = {loading}
      />
    </div>
  );
}
