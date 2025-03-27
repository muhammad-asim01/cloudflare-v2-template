import { useState, useEffect, useCallback } from "react";
import useUserClaimRefundSignature from "./useUserClaimRefundSignature";
import useWalletSignature from "@/hooks/useWalletConnectSignature";
import { REFUND_TOKEN_TYPE } from "@/constants";
import { PublicKey } from "@solana/web3.js";
import { PurchaseCurrency } from "@/constants/purchasableCurrency";
import { convertToTransaction, deriveTokenAccount, SendSolanaTransaction } from "@/context/Solana/utils";
import axios from '@/services/axios';
import { useAppKitAccount } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

const useSolanaClaimRefundToken = (
  poolId: number | undefined,
  poolIndex: any,
  purchasableCurrency: string,
  setOpenTransactionSubmitModal?: any,
) => {
  const { address: account } = useAppKitAccount();
    const { connector: library } = useAccount();

  const [claimRefundTokenSuccess, setClaimRefundTokenSuccess] =
    useState<boolean>(false);
  const [claimRefundTransactionHash, setClaimRefundTransactionHash] =
    useState("");
  const [loadingClaimRefundToken, setLoadingClaimRefundToken] =
    useState<boolean>(false);
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
    error: refundSignError,
    setSignature: setUserRefundSignature,
    loadingRefund,
  } = useUserClaimRefundSignature(
    account,
    poolId,
    authSignature,
    REFUND_TOKEN_TYPE.CLAIM,
    window?.solana?.publicKey?.toBase58()
  );

  useEffect(() => {
    signature &&
      currency &&
      !refundError &&
      !loadingRefund &&
      claimRefundTokenWithSignature(signature, currency);
  }, [signature, refundError, loadingRefund]);

  useEffect(() => {
    if (error || refundSignError) {
      const errorMessage = error || refundSignError;
      setRefundError(errorMessage as string);
      setLoadingClaimRefundToken(false);
      setSignature("");
      setUserRefundSignature("");
    }
  }, [error, refundSignError]);

  const claimRefundTokenWithSignature = useCallback(
    async (signature: string, currency: string) => {
      if (signature && account) {
        try {
          const buy_currency_ : string =
            purchasableCurrency === PurchaseCurrency.USDT
              ? process.env.NEXT_PUBLIC_SOLANA_USDT_ADDRESS || ""
              : PurchaseCurrency.USDC ? process.env.NEXT_PUBLIC_SOLANA_USDC_ADDRESS || "" : "";
          const buy_currency = new PublicKey(buy_currency_);
          const buy_token_account_: string = deriveTokenAccount(window?.solana?.publicKey.toBase58(), buy_currency_).toBase58();
          const response : any = await axios.post(`/user/solana/claim-refund-tokens`, {
            campaign_id: poolId,
            currency: buy_currency,
            token_account: buy_token_account_,
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
            setLoadingClaimRefundToken(false);
            setRefundError(response.message);
            setSignature("");
            setUserRefundSignature("");
            setOpenTransactionSubmitModal(false)
            return;
          }
          const data = response.data.data;
          const main_tx = await convertToTransaction(data);
          const sig = await SendSolanaTransaction(main_tx, account);

          setSignature("");
          setUserRefundSignature("");
          setClaimRefundTransactionHash(sig);

          console.log({ claimRefundTokenSuccess });
          setClaimRefundTokenSuccess(true);
          console.log({ claimRefundTokenSuccess });
          setLoadingClaimRefundToken(false);
        } catch (err: any) {
          console.log("🚀 ~ err:", err)
          toast.error(err.message);
          console.log({ claimRefundTokenSuccess });
          setLoadingClaimRefundToken(false);
          setRefundError(err.message);
          setSignature("");
          setUserRefundSignature("");
        }
      }
    },
    [library, account, signature]
  );

  const claimRefundToken = useCallback(async () => {
    try {
      setClaimRefundTransactionHash("");
      setRefundError("");
      setLoadingClaimRefundToken(true);
      console.log({ claimRefundTokenSuccess });
      setClaimRefundTokenSuccess(false);

      await signMessage();
    } catch (err: any) {
      toast.error(err.message);
      console.log({ claimRefundTokenSuccess });
      setLoadingClaimRefundToken(false);
      setRefundError(err.message);
      setSignature("");
    }
  }, [library, account]);

  return {
    claimRefundToken,
    transactionHashClaimRefundToken: claimRefundTransactionHash,
    loadingClaimRefund: loadingClaimRefundToken,
    setLoadingClaimRefundToken,
    setClaimRefundTransactionHash,
    claimRefundTokenSuccess,
    claimRefundError: refundError,
  };
};

export default useSolanaClaimRefundToken;
