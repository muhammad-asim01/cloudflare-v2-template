import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import useUserClaimSignature from "../hooks/useUserClaimSignature";
import useWalletSignature from "@/hooks/useWalletSignature";
import BigNumber from "bignumber.js";
import { PublicKey } from "@solana/web3.js";
import { convertToTransaction, deriveTokenAccount, SendSolanaTransaction } from "@/context/Solana/utils";
import axios from '@/services/axios';
import { useAccount } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

const useSolanaTokenClaim = (
  poolId: number | undefined,
  pool_index: any,
  decimals : any,
  token : any
) => {
  const { address: account } = useAppKitAccount();
    const { connector: library } = useAccount();
  const dispatch = useDispatch();

  const [claimTokenSuccess, setClaimTokenSuccess] = useState<boolean>(false);
  const [claimTransactionHash, setClaimTransactionHash] = useState("");
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);
  const [claimError, setClaimError] = useState<string>("");

  const {
    error,
    signMessage,
    signature: authSignature,
    setSignature,
  } = useWalletSignature();
  const {
    signature,
    amount,
    error: claimSignError,
    setSignature: setUserClaimSignature,
    loadingClaim,
  } = useUserClaimSignature(account, poolId, authSignature, window?.solana?.publicKey?.toBase58());

  useEffect(() => {
    signature &&
      amount &&
      !claimError &&
      !loadingClaim &&
      claimTokenWithSignature(signature, amount);
  }, [signature, amount, claimError, loadingClaim]);

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
    async (signature: string, amount: any) => {
      if (signature && amount && account) {
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

          // const buy_currency = new PublicKey(claimableTokenAccount.claimable_token_account);
          const buy_currency = new PublicKey(
            deriveTokenAccount(window?.solana?.publicKey.toBase58(), token));

          const response : any = await axios.post(`/user/solana/claim-tokens`, {
            campaign_id: poolId,
            token_amount: amount,
            token_decimals: decimals,
            token_account: buy_currency,
            fee_payer: window?.solana?.publicKey,
            signature: signature,
          }, {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem(`access_token:${account}`),
            },
          });
          if(response?.message) {
            toast.error(response?.message);
            return;
          }
          const data = response?.data?.data;
          const main_tx = await convertToTransaction(data);

          const sig = await SendSolanaTransaction(main_tx, account);
          setSignature("");
          setUserClaimSignature("");
          setClaimTransactionHash(sig?.signature);

          setClaimTokenSuccess(true);
          setClaimTokenLoading(false);
        } catch (err: any) {
          toast.error(err.message);
          setClaimTokenLoading(false);
          setClaimError(err.message);
          setSignature("");
          setUserClaimSignature("");
        }
      }
    },
    [library, account, amount, signature]
  );

  const claimToken = useCallback(async () => {
    try {
      setClaimTransactionHash("");
      setClaimError("");
      setClaimTokenLoading(true);
      setClaimTokenSuccess(false);

      await signMessage();
    } catch (err: any) {
      toast.error(err.message);
      setClaimTokenLoading(false);
      setClaimError(err.message);
      setSignature("");
    }
  }, [library, account]);

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

export default useSolanaTokenClaim;
