import { useState, useCallback, useEffect } from "react";

import axios from "../../../services/axios";
import { toast } from "react-toastify";
import useWalletConnectSignature from "@/hooks/useWalletConnectSignature";
import { gTagEvent } from "@/services/gtag";
import { base64Encode, termsMessage } from "@/utils";
import { useAppKitAccount } from "@reown/appkit/react";

type PoolDepositActionParams = {
  poolId?: number;
  connectedAccount?: string;
  poolDetails?: any;
  airdropSignature?: any;
};

const usePoolJoinAction = ({
  poolId,
  poolDetails,
}: PoolDepositActionParams) => {
  const { address: account } = useAppKitAccount();
  const [joinPoolSuccess, setJoinPoolSuccess] = useState<boolean>(false);
  const [airdropAddress, setAirdropAddress] = useState({
    publicKey: "",
    signature: "",
  });
  const [poolJoinLoading, setPoolJoinLoading] = useState<boolean>(false);
  const { signature, signMessage, setSignature, error, message } =
    useWalletConnectSignature();

  const joinPool = useCallback(
    async (airdropWallet: any) => {
      if (account && poolId) {
        try {
          const encodedOriginalMessage = base64Encode(termsMessage);
          setPoolJoinLoading(true);
          setAirdropAddress(airdropWallet);
          await signMessage(termsMessage, encodedOriginalMessage);
        } catch (err: any) {
          setPoolJoinLoading(false);
          console.log("joinPool", err.message);
        }
      }
    },
    [poolId, account, signMessage]
  );

  useEffect(() => {
    if (error && poolJoinLoading) {
      setPoolJoinLoading(false);
    }
  }, [error]);

  useEffect(() => {
    const poolJoinRequestWithSignature = async () => {
      if (signature && poolJoinLoading) {
        const config = {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem(`access_token:${account}`),
          },
        };

        const response = (await axios.post(
          `/user/join-campaign`,
          {
            signature,
            wallet_address: account,
            campaign_id: poolId,
            airdrop_address: airdropAddress,
            message: message,
          },
          config as any
        )) as any;

        if (response?.data) {
          if (response.data.status === 200) {
            setJoinPoolSuccess(true);
            gTagEvent({
              action: "registered_interest",
              params: {
                wallet_address: account || "",
                ido_name: poolDetails?.title,
              },
            });
          }

          if (response.data.status !== 200) {
            toast.error(response.data.message);
          }
        }

        setSignature("");
        setPoolJoinLoading(false);
      }
    };

    poolJoinRequestWithSignature();
  }, [signature, poolJoinLoading]);

  return {
    joinPool,
    poolJoinLoading,
    joinPoolSuccess,
  };
};

export default usePoolJoinAction;
