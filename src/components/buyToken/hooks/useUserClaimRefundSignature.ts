import { useState, useEffect } from "react";
import axios from "../../../services/axios";
import { toast } from "react-toastify";

const MESSAGE_INVESTOR_SIGNATURE =
  process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE || "";

const useUserClaimRefundSignature = (
  connectedAccount: string | undefined | null,
  campaignId: number | undefined,
  authSignature: string | undefined,
  type: string | "refund",
  message?: any
) => {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState<string | undefined>(undefined);
  const [deadline, setDeadline] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>("");
  const [loadingRefund, setLoadingRefund] = useState<boolean | undefined>(
    false
  );

  useEffect(() => {
    const getUserSignature = async () => {
      setError("");
      setSignature("");
      setLoadingRefund(true);

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
          "/user/claim-refund",
          {
            campaign_id: campaignId,
            wallet_address: connectedAccount,
            signature: authSignature,
            type,
          },
          config
        );

        if (response.data && response.status && response.status === 200) {
          const { data, message, status } = response.data;
          if (data && status === 200) {
            setSignature(data.signature);
            setCurrency(data.currency);
            setDeadline(data.deadline);
          }

          if (message && status !== 200) {
            toast.error(message);
            setError(message);
            setSignature("");
            setCurrency("");
            setDeadline("");
          }
        }
        setLoadingRefund(false);
      } catch (err: any) {
        setError(err.message);
        setSignature("");
        setCurrency("");
        setDeadline("");
        setLoadingRefund(false);
      }
    };
    if (connectedAccount && campaignId && authSignature) {
      getUserSignature();
    }
  }, [connectedAccount, campaignId, authSignature]);

  return {
    signature,
    currency,
    deadline,
    setSignature,
    error,
    loadingRefund,
  };
};

export default useUserClaimRefundSignature;
