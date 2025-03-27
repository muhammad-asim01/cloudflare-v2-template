import { useState, useEffect, useCallback } from "react";

import useUserClaimSignature from "@/components/buyToken/hooks/useUserClaimSignature";
import useWalletSignature from "../../../hooks/useWalletConnectSignature";
import PreSale_ABI from "../../../abi/PreSalePool.json";
import BigNumber from "bignumber.js";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { gTagEvent } from "@/services/gtag";
import { getContract } from "@/utils/contract";
import { generateRandomString } from "@/utils";
import { useAppKitAccount } from "@reown/appkit/react";

const useTokenClaim = (
  poolAddress: string | undefined,
  poolId: number | undefined,
  title?: string
) => {
  const { address: account } = useAppKitAccount();
  const { connector: library } = useAccount();

  const [claimTokenSuccess, setClaimTokenSuccess] = useState<boolean>(false);
  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);
  const [claimError, setClaimError] = useState<string>("");

  const {
    error,
    signMessage,
    signature: authSignature,
    setSignature,
    message,
  } = useWalletSignature();
  const {
    signature,
    amount,
    error: claimSignError,
    setSignature: setUserClaimSignature,
    loadingClaim,
  } = useUserClaimSignature(account, poolId, authSignature, message);

  useEffect(() => {
    if (poolAddress && signature && amount && !claimError && !loadingClaim) {
      claimTokenWithSignature(signature, amount);
    }
  }, [signature, poolAddress, amount, claimError, loadingClaim]);

  useEffect(() => {
    if (error || claimSignError) {
      const errorMessage = error || claimSignError;
      setClaimError(errorMessage as string);
      setClaimTokenLoading(false);
      setSignature("");
      setUserClaimSignature("");
    }
  }, [error, claimSignError]);

  const claimTokenWithSignature = useCallback(
    async (signature: string, amount: string) => {
      if (poolAddress && signature && amount && account) {
        if (amount && new BigNumber(amount).lte(0)) {
          const msg =
            "Please wait until the next milestone to claim the tokens.";
          toast.error(msg);
          setClaimTokenLoading(false);
          setClaimError(msg);
          setSignature("");
          setUserClaimSignature("");
          return;
        }

        try {
          const contract = await getContract(
            poolAddress,
            PreSale_ABI,
            library,
            account as string
          );
          if (contract) {
            // let overrides = fixGasLimitWithProvider(library, 'claim');
            // const transaction = await contract.claimTokens(account, amount, signature, overrides);
            const transaction = await contract.claimTokens(
              account,
              amount,
              signature
            );

            setSignature("");
            setUserClaimSignature("");
            setClaimTransactionHash(transaction.hash);

            await transaction.wait(1);

            setClaimTokenSuccess(true);

            toast.success("Token Claim Successful");

            // Data Sync Call
            setClaimTokenLoading(false);
            gTagEvent({
              action: "claimed_token",
              params: {
                wallet_address: account || "",
                ido_name: title,
                value: amount,
              },
            });
          }
        } catch (err: any) {
          if (err?.message === "Claim Amount not saved") {
            toast.error("Claim Amount not saved");
          } else {
            toast.error(
              JSON.parse(JSON.stringify(err)).shortMessage ||
                "Transaction Failed"
            );
          }
          setClaimTokenLoading(false);
          setClaimError(err.message);
          setSignature("");
          setUserClaimSignature("");
        }
      }
    },
    [poolAddress, library, account, amount, signature]
  );

  const claimToken = useCallback(async () => {
    if (poolAddress) {
      try {
        const randomString = generateRandomString() || "";
        const message =
          process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE +
            "_" +
            randomString || "";
        setClaimTransactionHash("");
        setClaimError("");
        setClaimTokenLoading(true);
        setClaimTokenSuccess(false);
        await signMessage(message);
      } catch (err: any) {
        toast.error(err.message);
        setClaimTokenLoading(false);
        setClaimError(err.message);
        setSignature("");
      }
    }
  }, [poolAddress, library, account]);

  return {
    claimToken,
    transactionHash: claimTransactionHash,
    loading: claimTokenLoading,
    setClaimTokenLoading,
    setClaimTransactionHash,
    claimTokenSuccess,
    error: claimError,
  };
};

export default useTokenClaim;
