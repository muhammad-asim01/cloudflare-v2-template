import { useState, useEffect, useCallback } from "react";
import useUserClaimRefundSignature from "@/components/buyToken/hooks/useUserClaimRefundSignature";
import useWalletSignature from "../../../hooks/useWalletConnectSignature";
import PreSale_ABI from "../../../abi/PreSalePool.json";
import { REFUND_TOKEN_TYPE } from "../../../constants";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getContract } from "@/utils/contract";
import { generateRandomString } from "@/utils";
import { useAppKitAccount } from "@reown/appkit/react";

const useClaimRefundToken = (
  poolAddress: string | undefined,
  poolId: number | undefined
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
    message,
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
    message
  );

  useEffect(() => {
    if (
      poolAddress &&
      signature &&
      currency &&
      !refundError &&
      !loadingRefund
    ) {
      claimRefundTokenWithSignature(signature, currency);
    }
  }, [signature, poolAddress, refundError, loadingRefund]);

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
      if (poolAddress && signature && account) {
        try {
          const contract = await getContract(
            poolAddress,
            PreSale_ABI,
            library,
            account as string
          );
          if (contract) {
            const transaction = await contract.claimRefundTokens(
              account,
              currency,
              signature
            );

            setSignature("");
            setUserRefundSignature("");
            setClaimRefundTransactionHash(transaction.hash);

            await transaction.wait(1);
            console.log({ claimRefundTokenSuccess });
            setClaimRefundTokenSuccess(true);
            console.log({ claimRefundTokenSuccess });
            toast.success("Token Refund Successful");
            // Data Sync Call
            setLoadingClaimRefundToken(false);
          }
        } catch (err: any) {
          if (err?.message === "Refund Amount not saved") {
            toast.error("Refund Amount not saved");
          } else {
            toast.error(
              JSON.parse(JSON.stringify(err)).shortMessage ||
                getErrorMessage(err)
            );
          }
          setLoadingClaimRefundToken(false);
          setRefundError(err.message);
          setSignature("");
          setUserRefundSignature("");
        }
      }
    },
    [poolAddress, library, account, signature]
  );

  const claimRefundToken = useCallback(async () => {
    if (poolAddress) {
      try {
        const randomString = generateRandomString() || "";
        const message =
          process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE +
            "_" +
            randomString || "";
        setClaimRefundTransactionHash("");
        setRefundError("");
        setLoadingClaimRefundToken(true);
        setClaimRefundTokenSuccess(false);
        await signMessage(message);
      } catch (err: any) {
        toast.error(err.message);
        setLoadingClaimRefundToken(false);
        setRefundError(err.message);
        setSignature("");
      }
    }
  }, [poolAddress, library, account]);

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

export default useClaimRefundToken;
