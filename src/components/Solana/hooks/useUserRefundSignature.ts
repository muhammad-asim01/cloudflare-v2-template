import { useState, useEffect } from 'react';
import axios from '@/services/axios';
import { getConfigAuthHeader } from '@/utils/configHeader';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';


const useUserRefundSignature = (connectedAccount: string | undefined | null, campaignId: number | undefined, authSignature: string | undefined, type: string | 'refund', solanaAddrress?: any) => {
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState<string | undefined>(undefined);
  const [deadline, setDeadline] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>("");
  const [loadingRefund, setLoadingRefund] = useState<boolean | undefined>(false);
  const [privateKey, setPrivateKey] = useState<string>("");
  const { address: account } = useAppKitAccount();

  useEffect(() => {
      const getUserSignature = async () => {
        setError("");
        setSignature("");
        setLoadingRefund(true);

        try {
          const authConfig = getConfigAuthHeader(account, false)
          const response = await axios.post('/user/refund', {
            campaign_id: campaignId,
            wallet_address: connectedAccount,
            signature: authSignature,
            type,
            solana_address: solanaAddrress
          }, authConfig);

          if (response.data && response.status && response.status === 200) {
            const { data, message, status } = response.data;
            if (data && status === 200) {
              console.log('data refund: ', {data})
              setSignature(data.signature);
              setCurrency(data.currency);
              setDeadline(data.deadline);
              setPrivateKey(data.privateKey);
            }

            if (message && status !== 200) {
              toast.error(message);
              setError(message);
              setSignature("");
              setCurrency("");
            }
          }
          setLoadingRefund(false);
        } catch (err: any) {
          setError(err.message);
          setSignature("");
          setCurrency("");
          setLoadingRefund(false);
        }
      }
    connectedAccount && campaignId && authSignature && getUserSignature();
  }, [connectedAccount, campaignId, authSignature]);

  return {
    signature,
    currency,
    deadline,
    setSignature,
    error,
    loadingRefund,
    privateKey
  }
}

export default useUserRefundSignature;

