import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import useUserRefundSignature from "./useUserRefundSignature";
import useWalletSignature from "@/hooks/useWalletSignature";
import { REFUND_TOKEN_TYPE } from "@/constants";
import { PublicKey } from "@solana/web3.js";
import { convertToTransaction, SendSolanaTransaction } from "@/context/Solana/utils";
import { PurchaseCurrency } from "@/constants/purchasableCurrency";
import axios from '@/services/axios';
import { useAccount } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

const useSolanaRefundToken = (poolId: number | undefined, poolIndex: any, purchasableCurrency: any) => {
  const { address: account } = useAppKitAccount();
  const { connector: library } = useAccount();
  const dispatch = useDispatch();

  const [refundTokenSuccess, setRefundTokenSuccess] = useState<boolean>(false);
  const [refundTransactionHash, setRefundTransactionHash] = useState("");
  const [refundTokenLoading, setRefundTokenLoading] = useState<boolean>(false);
  const [refundError, setRefundError] = useState<string>("");

  const {
    error,
    signMessage,
    signature: authSignature,
    setSignature,
  } = useWalletSignature();
  const {
    signature,
    currency,
    deadline,
    error: refundSignError,
    setSignature: setUserRefundSignature,
    loadingRefund,
  } = useUserRefundSignature(
    account,
    poolId,
    authSignature,
    REFUND_TOKEN_TYPE.REFUND,
    window?.solana?.publicKey?.toBase58()
  );

  useEffect(() => {
    signature &&
      currency &&
      deadline &&
      !refundError &&
      !loadingRefund &&
      refundTokenWithSignature(signature, currency, deadline);
  }, [signature, refundError, loadingRefund]);

  useEffect(() => {
    if (error || refundSignError) {
      const errorMessage = error || refundSignError;
      setRefundError(errorMessage as string);
      setRefundTokenLoading(false);
      setSignature("");
      setUserRefundSignature("");
    }
  }, [error, refundSignError]);

  const refundTokenWithSignature = useCallback(
    async (signature: string, currency: string, deadline: string) => {
      if (signature && account && deadline) {
        try {

          const buy_currency = new PublicKey(
            purchasableCurrency === PurchaseCurrency.USDT ? process.env.NEXT_PUBLIC_SOLANA_USDT_ADDRESS || "" : process.env.NEXT_PUBLIC_SOLANA_USDC_ADDRESS || ""
          );

          const response : any = await axios.post(`/user/solana/refund-tokens`, {
            campaign_id: poolId,
            currency: buy_currency,
            deadline: deadline,
            fee_payer: window?.solana?.publicKey,
            signature: signature,
          }, {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem(`access_token:${account}`),
            },
          });
          if (response?.message) {
            toast.error(response?.message);
            return;
          }
          const data = response.data.data;
          const main_tx = await convertToTransaction(data);
          const sig = await SendSolanaTransaction(main_tx, account);
          setSignature("");
          setUserRefundSignature("");
          setRefundTransactionHash(sig.signature);

          setRefundTokenSuccess(true);
          setRefundTokenLoading(false);
        } catch (err: any) {
          console.log("🚀 ~ err:", err);
          toast.error(err.message);
          setRefundTokenLoading(false);
          setRefundError(err.message);
          setSignature("");
          setUserRefundSignature("");
        }
      }
    },
    [library, account, signature]
  );

  const refundToken = useCallback(async () => {
    try {
      setRefundTransactionHash("");
      setRefundError("");
      setRefundTokenLoading(true);
      setRefundTokenSuccess(false);

      await signMessage();
    } catch (err: any) {
      toast.error(err.message);
      setRefundTokenLoading(false);
      setRefundError(err.message);
      setSignature("");
    }
  }, [library, account]);

  return {
    refundToken,
    transactionHashRefundToken: refundTransactionHash,
    loadingRefund: refundTokenLoading,
    setRefundTokenLoading,
    setRefundTransactionHash,
    refundTokenSuccess,
    refundError: refundError,
  };
};

export default useSolanaRefundToken;
