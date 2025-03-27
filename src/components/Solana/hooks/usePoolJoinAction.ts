import { useState, useCallback, useEffect } from 'react';

import axios from '@/services/axios';
import useWalletSignature from '@/hooks/useWalletConnectSignature';
import { gTagEvent } from '@/services/gtag';
import { getConfigAuthHeader } from '@/utils/configHeader';
import { base64Encode, termsMessage } from '@/utils';
import { useAccount } from 'wagmi';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';

type PoolDepositActionParams = {
  poolId?: number;
  connectedAccount?: string;
  poolDetails?: any;
  airdropSignature?: any;
}

const usePoolJoinAction = ({ poolId, poolDetails }: PoolDepositActionParams) => {
  const { address: account } = useAppKitAccount();
  const { connector: library } = useAccount();
  const [joinPoolSuccess, setJoinPoolSuccess] = useState<boolean>(false);
  const [airdropAddress, setAirdropAddress] = useState({publicKey: '', signature: ''})
  const [poolJoinLoading, setPoolJoinLoading] = useState<boolean>(false);
  const { signature, signMessage, setSignature, error, message } = useWalletSignature();

  const joinPool = useCallback(async (airdropWallet:any) => {
    if (account && poolId && library) {
      try {
        setPoolJoinLoading(true);
        setAirdropAddress(airdropWallet)
        const encodedOriginalMessage = base64Encode(termsMessage);
        await signMessage(termsMessage, encodedOriginalMessage);
      } catch (err: any) {
        setPoolJoinLoading(false);
        console.log('joinPool', err.message);
      }
    }
  }, [poolId, account, library, signMessage]);

  useEffect(() => {
    if (error && poolJoinLoading) {
      setPoolJoinLoading(false);
    }
  }, [error]);

  useEffect(() => {
    const poolJoinRequestWithSignature = async () => {
      if (signature && poolJoinLoading) {

        const authConfig = getConfigAuthHeader(account, true)

        const response = await axios.post(`/user/join-campaign`, {
          signature,
          wallet_address: account,
          campaign_id: poolId,
          airdrop_address: airdropAddress,
          message
        }, authConfig as any) as any;

        if (response.data) {
          if (response.data.status === 200) {
            setJoinPoolSuccess(true);
            gTagEvent({ 
              action: "registered_interest",
              params : {
                wallet_address: account || "",
                ido_name: poolDetails?.title
              }
            })
          }

          if (response.data.status !== 200) {
            toast.error(response.data.message);
          }
        }

        setSignature("");
        setPoolJoinLoading(false);
      }
    }

    poolJoinRequestWithSignature();
  }, [signature, poolJoinLoading]);

  return {
    joinPool,
    poolJoinLoading,
    joinPoolSuccess
  }
}

export default usePoolJoinAction;
