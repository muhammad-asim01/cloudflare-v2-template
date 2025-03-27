import { useState, useEffect, useCallback } from "react";
import BigNumber from "bignumber.js";

import useUserPurchaseSignature from "../hooks/useUserPurchaseSignature";
import useWalletSignature from "../../../hooks/useWalletConnectSignature";
import Pool_ABI from "../../../abi/Pool.json";
import PreSalePool from "../../../abi/PreSalePool.json";
import { TRANSACTION_ERROR_MESSAGE } from "../../../constants/alert";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { getCurrencyDetails } from "@/utils/getCurrencyDetails";
import { gTagEvent } from "@/services/gtag";
import { getContract } from "@/utils/contract";
import { base64Encode, termsMessage } from "@/utils";
import { useAppKitAccount } from "@reown/appkit/react";

type PoolDepositActionParams = {
  poolAddress?: string;
  poolId?: number;
  purchasableCurrency: string;
  amount: string;
  isClaimable: boolean;
  networkAvailable: string;
  isInPreOrderTime: boolean;
  title?: string;
  poolDetails?: any;
};

const usePoolDepositAction = ({
  poolAddress,
  poolId,
  purchasableCurrency,
  amount,
  isClaimable,
  networkAvailable,
  title,
  poolDetails,
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
    if (
      poolAddress &&
      purchasableCurrency &&
      signature &&
      minBuy &&
      maxBuy &&
      !depositError
    ) {
      depositWithSignature(
        poolAddress,
        purchasableCurrency,
        amount,
        signature,
        `${minBuy}`,
        maxBuy
      );
    }
  }, [
    signature,
    poolAddress,
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
        decodedData.user === connectedAccount &&
        decodedData.poolAddress === poolAddress &&
        decodedData.id === poolId &&
        new Date() >=
          new Date(
            Number(poolDetails?.freeBuyTimeSetting?.start_buy_time) * 1000
          )
      );
    } catch (error) {
      console.log("🚀 ~ isFCFSDataMatching ~ error:", error);
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
      console.log("🚀 ~ getFcfsData ~ error:", error);
      return false;
    }
  }

  const depositWithSignature = useCallback(
    async (
      poolAddress: string,
      acceptCurrency: string,
      amount: string,
      signature: string,
      minBuy: string,
      maxBuy: string
    ) => {
      try {
        if (minBuy && maxBuy && signature && amount) {
          const abi = isClaimable ? PreSalePool : Pool_ABI;

          const method =
            acceptCurrency === "ETH"
              ? "buyTokenByEtherWithPermission"
              : "buyTokenByTokenWithPermission";
          const { decimals, buyCurr } = getCurrencyDetails(
            networkAvailable,
            acceptCurrency
          );

          const params =
            acceptCurrency === "ETH"
              ? [
                  connectedAccount,
                  maxBuy,
                  minBuy,
                  signature,
                  {
                    value: new BigNumber(amount)
                      .multipliedBy(10 ** 18)
                      .toFixed(),
                  },
                ]
              : [
                  buyCurr,
                  new BigNumber(amount).multipliedBy(10 ** decimals).toFixed(),
                  connectedAccount,
                  maxBuy,
                  minBuy,
                  signature,
                ];
          const poolContract = await getContract(
            poolAddress,
            abi,
            library,
            connectedAccount as string
          );
          const transaction = await poolContract[method](...params);
          setUserPurchasedSignature("");
          setSignature("");
          setTokenDepositTransaction(transaction.hash);

          await transaction.wait(1);

          toast.success("Token Deposit Successful!");

          localStorage.removeItem(`fcfsData-${poolDetails?.id}`);

          setTokenDepositSuccess(true);

          setTokenDepositLoading(false);

          gTagEvent({
            action: "token_swapped",
            params: {
              wallet_address: connectedAccount || "",
              ido_name: title,
              value: amount,
            },
          });
        }
      } catch (err: any) {
        if (err?.message === "Swapped Amount not saved") {
          toast.error("Swapped Amount not saved");
        } else {
          toast.error(
            JSON.parse(JSON.stringify(err)).reason || getErrorMessage(err)
          );
        }
        console.log(JSON.parse(JSON.stringify(err)));
        setDepositError(TRANSACTION_ERROR_MESSAGE);
        setTokenDepositLoading(false);
        setSignature("");
        setUserPurchasedSignature("");
      }
    },
    [minBuy, maxBuy, poolAddress, isClaimable]
  );

  const deposit = useCallback(async () => {
    if (amount && new BigNumber(amount).gt(0) && poolAddress) {
      try {
        const encodedOriginalMessage = base64Encode(termsMessage);
        setTokenDepositTransaction("");
        setDepositError("");
        setTokenDepositLoading(true);
        setTokenDepositSuccess(false);
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
  }, [connectedAccount, library, poolAddress, amount]);

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
