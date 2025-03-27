import { useState, useCallback, useEffect } from "react";

import axios from "@/services/axios";
import useWalletSignature from "@/hooks/useWalletSignature";
import { useAccount } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

type PoolDepositActionParams = {
  poolId?: number;
  connectedAccount?: string;
  poolDetails?: any;
  airdropSignature?: any;
  claimable_token_account?: any;
  refundable_token_account?: any;
  setClaimToken?: any;
  setRefundToken?: any;
  refetchToken?: any;
};

const useLinkSolanaAccounts = ({
  poolId,
  claimable_token_account,
  refundable_token_account,
  setRefundToken,
  setClaimToken,
  refetchToken
}: PoolDepositActionParams) => {
  const { address: account } = useAppKitAccount();
  const { connector: library } = useAccount();
  const [linkAccountSuccess, setLinkAccountSuccess] = useState<boolean>(false);
  const [linkAccountLoading, setLinkAccountLoading] = useState<boolean>(false);
  const { signature, signMessage, setSignature, error } = useWalletSignature();

  const linkAccount = useCallback(async () => {
    if (!claimable_token_account || !refundable_token_account) {
      toast.error("Please enter Claim Token Account and Refund Token Account")
      return;
    }
    if (account && poolId && library) {
      try {
        setLinkAccountLoading(true);

        await signMessage();
      } catch (err: any) {
        setLinkAccountLoading(false);
        console.log("joinPool", err.message);
      }
    }
  }, [
    poolId,
    account,
    library,
    signMessage,
    claimable_token_account,
    refundable_token_account,
  ]);

  useEffect(() => {
    if (error && linkAccountLoading) {
      setLinkAccountLoading(false);
    }
  }, [error, linkAccountLoading]);

  useEffect(() => {
    const linkAccountRequestWithSignature = async () => {
      if (signature && linkAccountLoading) {
        const config = {
          headers: {
            msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
          },
        };

        const response = (await axios.post(
          `/user/link-token-accounts`,
          {
            signature,
            wallet_address: account,
            campaign_id: poolId,
            claimable_token_account,
            refundable_token_account,
          },
          config as any
        )) as any;

        if(response?.status === 500) {
          toast.error(response?.message);
        }

        else if (response.data) {
          if (response.data.status === 200) {
            setLinkAccountSuccess(true);
            toast.success("Accounts connected Successfully!");
            refetchToken( `/user/get-token-accounts/${poolId}`)
          }

          if (response.data.status !== 200) {
            toast.error(response?.data?.message);
          }
        }
        else if (response?.status === 401) {
          toast.error("Invalid Token Accounts");
        }

        setRefundToken("");
        setClaimToken("");
        setSignature("");
        setLinkAccountLoading(false);
      }
    };

    linkAccountRequestWithSignature();
  }, [signature, linkAccountLoading]);

  return {
    linkAccount,
    linkAccountLoading,
    linkAccountSuccess,
  };
};

export default useLinkSolanaAccounts;
