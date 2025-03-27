import { useState, useEffect } from "react";
import axios from "../../../services/axios";
import { toast } from "react-toastify";

const MESSAGE_INVESTOR_SIGNATURE =
  process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE || "";

const useUserClaimSignature = (
  connectedAccount: string | undefined | null,
  campaignId: number | undefined,
  authSignature: string | undefined,
  message?: any
) => {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [loadingClaim, setLoadingClaim] = useState<boolean | undefined>(false);

  useEffect(() => {
    const getUserSignature = async () => {
      setError("");
      setSignature("");
      setLoadingClaim(true);

      try {
        const config = {
          headers: {
            msgSignature: message ? message : MESSAGE_INVESTOR_SIGNATURE,
            Authorization:
              "Bearer " +
              localStorage.getItem(`access_token:${connectedAccount}`),
          },
        };
        const response = await axios.post(
          "/user/claim",
          {
            campaign_id: campaignId,
            wallet_address: connectedAccount,
            signature: authSignature,
          },
          config
        );

        if (response.data && response.status && response.status === 200) {
          const { data, message, status } = response.data;
          if (data && status === 200) {
            setSignature(data.signature);
            setAmount(data.amount);
          }

          if (message && status !== 200) {
            if (
              message?.includes(
                "We have noticed that you have changed your staking points after snapshot"
              )
            ) {
              toast.info(message, { autoClose: 20000 });
            } else {
              toast.error(message);
            }
            setError(message);
            setSignature("");
          }
        }
        setLoadingClaim(false);
      } catch (err: any) {
        setError(err.message);
        setSignature("");
        setLoadingClaim(false);
      }
    };
    if (connectedAccount && campaignId && authSignature) {
      getUserSignature();
    }
  }, [connectedAccount, campaignId, authSignature]);

  return {
    signature,
    setSignature,
    amount,
    error,
    loadingClaim,
  };
};

export default useUserClaimSignature;
