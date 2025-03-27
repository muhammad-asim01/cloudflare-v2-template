
import { useState, useEffect } from 'react';
import axios from '@/services/axios';
import { getConfigAuthHeader } from '@/utils/configHeader';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';

const useUserClaimSignature = (connectedAccount: string | undefined | null, campaignId: number | undefined, authSignature: string | undefined, solanaAddrress?: any) => {
  const { address: account } = useAppKitAccount();
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string| undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [loadingClaim, setLoadingClaim] = useState<boolean | undefined>(false);

  useEffect(() => {
      const getUserSignature = async () => {
        setError("");
        setSignature("");
        setLoadingClaim(true);

        try {
          const authConfig = getConfigAuthHeader(account, false)
          const response = await axios.post('/user/claim', {
            campaign_id: campaignId,
            wallet_address: connectedAccount,
            signature: authSignature,
            solana_address: solanaAddrress
          }, authConfig);

          if (response.data && response.status && response.status === 200) {
            const { data, message, status } = response.data;
            if (data && status === 200) {
              setSignature(data.signature);
              setAmount(data.amount);
            }

            if (message && status !== 200) {
              toast.error(message);
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
      }
    connectedAccount && campaignId && authSignature && getUserSignature();
  }, [connectedAccount, campaignId, authSignature]);

  return {
    signature,
    setSignature,
    amount,
    error,
    loadingClaim,
  }
}

export default useUserClaimSignature;

