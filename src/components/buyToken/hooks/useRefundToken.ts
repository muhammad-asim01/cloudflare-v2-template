import { useState, useEffect, useCallback } from "react";
import useUserRefundSignature from "./useUserRefundSignature";
import useWalletSignature from "../../../hooks/useWalletConnectSignature";
import PreSale_ABI from "../../../abi/PreSalePool.json";
import { REFUND_TOKEN_TYPE } from "../../../constants";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getContract } from "@/utils/contract";
import { generateRandomString } from "@/utils";
import { useAppKitAccount } from "@reown/appkit/react";

const useRefundToken = (
  poolAddress: string | undefined,
  poolId: number | undefined
) => {
  const { address: account } = useAppKitAccount();
  const { connector: library } = useAccount();

  const [refundTokenSuccess, setRefundTokenSuccess] = useState<boolean>(false);
  const [refundTransactionHash, setRefundTransactionHash] = useState("");
  const [refundTokenLoading, setRefundTokenLoading] = useState<boolean>(false);
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
    deadline,
    error: refundSignError,
    setSignature: setUserRefundSignature,
    loadingRefund,
  } = useUserRefundSignature(
    account,
    poolId,
    authSignature,
    REFUND_TOKEN_TYPE.REFUND,
    message
  );

  useEffect(() => {
    if (
      poolAddress &&
      signature &&
      currency &&
      deadline &&
      !refundError &&
      !loadingRefund
    ) {
      refundTokenWithSignature(signature, currency, deadline);
    }
  }, [signature, poolAddress, refundError, loadingRefund]);

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
      if (poolAddress && signature && account && deadline) {
        try {
          const contract = await getContract(
            poolAddress,
            PreSale_ABI,
            library,
            account as string
          );
          if (contract) {
            console.log({ account, currency, deadline, signature });
            const transaction = await contract.refundTokens(
              account,
              currency,
              deadline,
              signature
            );

            setSignature("");
            setUserRefundSignature("");
            setRefundTransactionHash(transaction.hash);

            await transaction.wait(1);

            setRefundTokenSuccess(true);
            setRefundTokenLoading(false);
            toast.success("Token Request Refund Successful");
          }
          // const {transaction, result} = await writeContractAsync({
          //   abi: PreSale_ABI,
          //   address: poolAddress as `0x${string}`,
          //   functionName: "refundTokens",
          //   args: [account, currency, deadline, signature],
          // });

          // setSignature("");
          // setUserRefundSignature("");
          // setRefundTransactionHash(transaction);

          // if (result === WRITE_CONTRACT_SUCCESS) {
          //   setRefundTokenSuccess(true);
          //   setRefundTokenLoading(false);
          //   toast.success("Token Request Refund Successful");
          // }
          // else {
          //   toast.error("Transaction failed.");
          //   setRefundTokenSuccess(false);
          //   setRefundTokenLoading(false);
          // }
        } catch (err: any) {
          toast.error(
            JSON.parse(JSON.stringify(err)).shortMessage || getErrorMessage(err)
          );
          setRefundTokenLoading(false);
          setRefundError(err.message);
          setSignature("");
          setUserRefundSignature("");
        }
      }
    },
    [poolAddress, library, account, signature]
  );

  const refundToken = useCallback(async () => {
    if (poolAddress) {
      try {
        const randomString = generateRandomString() || "";
        const message =
          process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE +
            "_" +
            randomString || "";
        setRefundTransactionHash("");
        setRefundError("");
        setRefundTokenLoading(true);
        setRefundTokenSuccess(false);
        await signMessage(message);
      } catch (err: any) {
        toast.error(err.message);
        setRefundTokenLoading(false);
        setRefundError(err.message);
        setSignature("");
      }
    }
  }, [poolAddress, library, account]);

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

export default useRefundToken;
