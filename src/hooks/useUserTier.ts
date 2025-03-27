import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber } from 'bignumber.js';

export type UserTier = {
  currentTier: number;
  totalStaked: string;
  totalUnstaked: string;
  total: string
}

const useUserTier = (address: string, networkAvailable: string): UserTier => {
  const [ currentUserTier, setCurrentUserTier ] = useState<number>(0);
  const { data: userInfo, loading: userInfoLoading } = useSelector((state: any) => state.userInfo);
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const [ loading, setLoading] = useState<boolean>(true);
  const { data: tiers, loading: tiersLoading } = useSelector((state: any) => state.tiers);
  const [ totalUnstaked, setTotalUnstaked ] = useState<string>('0');
  const [ total, setTotal ] = useState<string>('0');


  const calculateUserTier = (totalStaked: BigNumber) => {
    let currentTier = 0;
    for(let i = 0; i < tiers.length; i++) {
      const tier = new BigNumber(tiers[i])
      if(tier.lte(totalStaked)) {
        currentTier = i + 1
      }
    }
    setCurrentUserTier(currentTier);
  }

  useEffect(() => {
    (!userInfoLoading && !tiersLoading && userInfo.totalStaked) ? setLoading(false) : setLoading(true);
  }, [userInfoLoading, tiersLoading, userInfo]);

  useEffect(() => {
    const getTotalUnstaked = async () => {
      if(address) {
        try {
          const totalUnstaked = 0;
          const totalStaked = new BigNumber(userInfo.totalStaked);
          let balance = new BigNumber(0); // await contract?.methods.balanceOf(address).call();
          balance = (new BigNumber(balance).div(Math.pow(10, 18)))

          const total = totalStaked.plus(totalUnstaked).plus(balance);
          setTotalUnstaked(totalUnstaked.toString());
          setTotal(total.toString());
          calculateUserTier(total);
        } catch (err) {
          console.log('getTotalUnstaked', err)
        }
      }
    }

    !loading && getTotalUnstaked();
  }, [loading, address, userInfo]);

  useEffect(() => {
    setTotalUnstaked('0')
    setTotal('0')
    setCurrentUserTier(0)
  }, [address, appChainID])

  return  {
    currentTier: currentUserTier,
    totalStaked: userInfo.totalStaked,
    totalUnstaked,
    total
  }
}

export default useUserTier;
