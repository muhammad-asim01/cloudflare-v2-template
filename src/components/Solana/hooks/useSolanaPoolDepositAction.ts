import { useState, useEffect, useCallback } from "react";
import BigNumber from "bignumber.js";

import useUserPurchaseSignature from "../hooks/useUserPurchaseSignature";
import useWalletSignature from "@/hooks/useWalletConnectSignature";
import { TRANSACTION_ERROR_MESSAGE } from "@/constants/alert";
import axios from "@/services/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { base64Encode, termsMessage } from "@/utils";
import { PurchaseCurrency } from "@/constants/purchasableCurrency";
import {
  convertToTransaction,
  deriveTokenAccount,
  SendSolanaTransaction,
} from "@/context/Solana/utils";
import { PublicKey } from "@solana/web3.js";
import { useAccount } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

type PoolDepositActionParams = {
  poolId?: number;
  purchasableCurrency: string;
  amount: string;
  isClaimable: boolean;
  title?: any;
  poolDetails?: any;
  poolIndex?: any;
  token: any;
};

// chain integration
const usePoolDepositAction = ({
  poolIndex,
  poolId,
  purchasableCurrency,
  amount,
  isClaimable,
  poolDetails,
  token,
}: PoolDepositActionParams) => {

  const [depositError, setDepositError] = useState("");
  const [tokenDepositTransaction, setTokenDepositTransaction] =
    useState<string>("");
  const [tokenDepositLoading, setTokenDepositLoading] =
    useState<boolean>(false);
  const [tokenDepositSuccess, setTokenDepositSuccess] =
    useState<boolean>(false);

    const { address: connectedAccount } = useAppKitAccount();
    const { connector: library } = useAccount();
  const {
    error,
    signMessage,
    signature: authSignature,
    setSignature,
    message,
    setMessage,
  } = useWalletSignature();
  const {
    signature,
    minBuy,
    maxBuy,
    error: buyError,
    setSignature: setUserPurchasedSignature,
  } = useUserPurchaseSignature(
    connectedAccount,
    poolId,
    authSignature,
    message
  );

  useEffect(() => {
    poolIndex &&
      purchasableCurrency &&
      signature &&
      minBuy &&
      maxBuy &&
      !depositError &&
      depositWithSignature(
        purchasableCurrency,
        amount,
        signature,
        `${minBuy}`,
        maxBuy
      );
  }, [
    signature,
    poolIndex,
    purchasableCurrency,
    amount,
    minBuy,
    maxBuy,
    depositError,
  ]);

  useEffect(() => {
    if (error || buyError) {
      const errorMessage = error || buyError;
      setDepositError(errorMessage as string);
      setTokenDepositLoading(false);
      setSignature("");
      setUserPurchasedSignature("");
    }
  }, [error, buyError]);

  function isFCFSDataMatching() {
    const storedData = localStorage.getItem(`fcfsData-${poolDetails.id}`);

    if (!storedData) {
      return false;
    }

    try {
      const decodedData = JSON.parse(atob(storedData));

      return (
        decodedData?.user === connectedAccount &&
        decodedData?.poolAddress === poolIndex &&
        decodedData?.id === poolId &&
        new Date() >=
          new Date(
            Number(poolDetails?.freeBuyTimeSetting?.start_buy_time) * 1000
          )
      );
    } catch (error) {
      console.log("🚀 ~ isFCFSDataMatching ~ error:", error)
      return false;
    }
  }

  function getFcfsData() {
    const storedData = localStorage.getItem(`fcfsData-${poolDetails.id}`);

    if (!storedData) {
      return null;
    }

    try {
      const decodedData = JSON.parse(atob(storedData));

      return decodedData;
    } catch (error) {
      console.log("🚀 ~ getFcfsData ~ error:", error)
      return false;
    }
  }

  const depositWithSignature = useCallback(
    async (
      acceptCurrency: string,
      amount: any,
      signature: string,
      minBuy: string,
      maxBuy: string
    ) => {
      try {
        if (minBuy && maxBuy && signature && amount) {
          const buy_currency_: any =
            acceptCurrency === PurchaseCurrency.USDT
              ? process.env.NEXT_PUBLIC_SOLANA_USDT_ADDRESS
              : acceptCurrency === PurchaseCurrency.USDC
              ? process.env.NEXT_PUBLIC_SOLANA_USDC_ADDRESS
              : "";
          // const buy_token_account_: string = refundAccount;
          const buy_token_account_: string = deriveTokenAccount(
            window?.solana?.publicKey?.toBase58(),
            buy_currency_
          ).toBase58();

          const buy_currency = new PublicKey(buy_currency_);
          const buy_token_account = new PublicKey(buy_token_account_);

          const response: any = await axios.post(
            `/user/solana/buy-token-by-token`,
            {
              campaign_id: poolId,
              token: buy_currency,
              token_amount: amount,
              token_decimals: token.decimals,
              token_from_acount: buy_token_account,
              fee_payer: window?.solana?.publicKey,
              max_amount: maxBuy,
              min_amount: minBuy,
              signature: signature,
            },
            {
              headers: {
                Authorization:
                  "Bearer " +
                  localStorage.getItem(`access_token:${connectedAccount}`),
              },
            }
          );
          if (response?.message) {
            toast.error(response?.message);
            setUserPurchasedSignature("");
            setSignature("");
            setTokenDepositLoading(false);
            setTokenDepositSuccess(false);
            setDepositError(TRANSACTION_ERROR_MESSAGE);
            return;
          }
          const data = response?.data?.data;
          const main_tx = await convertToTransaction(data);

          const sig = await SendSolanaTransaction(
            main_tx,
            connectedAccount as string,
            undefined,
            { preflightCommitment: "confirmed", commitment: "confirmed" }
          );
          setUserPurchasedSignature("");
          setSignature("");
          setTokenDepositTransaction(sig?.signature);
          setTokenDepositLoading(false);
          setTokenDepositSuccess(true);
          localStorage.removeItem(`fcfsData-${poolDetails?.id}`);
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
        setDepositError(TRANSACTION_ERROR_MESSAGE);
        setTokenDepositLoading(false);
        setSignature("");
        setUserPurchasedSignature("");
      }
    },
    [minBuy, maxBuy, poolIndex, isClaimable]
  );

  const deposit = useCallback(async () => {
    if (amount && new BigNumber(amount).gt(0) && poolIndex) {
      try {
        setTokenDepositTransaction("");
        setDepositError("");
        setTokenDepositLoading(true);
        setTokenDepositSuccess(false);
        const encodedOriginalMessage = base64Encode(termsMessage);
        if (isFCFSDataMatching()) {
          const data = getFcfsData();
          setMessage(data.encodedOriginalMessage);
          setSignature(data.signature);
        } else {
          await signMessage(termsMessage, encodedOriginalMessage);
        }
      } catch (err) {
        console.log("deposit", err);
        toast.error(getErrorMessage(err));
        setDepositError(TRANSACTION_ERROR_MESSAGE);
        setSignature("");
        setTokenDepositLoading(false);
      }
    }
  }, [connectedAccount, library, poolIndex, amount]);

  return {
    tokenDepositSuccess,
    deposit,
    tokenDepositLoading,
    tokenDepositTransaction,
    setTokenDepositTransaction,
    setTokenDepositLoading,
    depositError,
  };
};

export default usePoolDepositAction;
