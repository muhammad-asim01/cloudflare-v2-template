"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { useTypedSelector } from '@/hooks/useTypedSelector';
import { getPoolContract } from '@/services/web3';
import { getProgressWithPools } from "@/utils/campaign";


const useTokenSoldProgress = (poolAddress: string | undefined, totalTokens: number | undefined, networkAvailable: string | undefined, poolDetails: any = {}) => {
  const [soldProgress, setSoldProgress] = useState<string>("0");
  const [tokenSold, setTokenSold] = useState<string>("0");

  const { appChainID } = useTypedSelector(state => state.appNetwork).data;
  const connector = useTypedSelector(state => state.connector).data;
  let soldProgressInterval = undefined as any;

  useEffect(() => {
    const calSoldProgress = async () => {
      if (poolAddress && networkAvailable && totalTokens && ethers.utils.isAddress(poolAddress)) {
        const poolContract = getPoolContract({ networkAvailable, poolHash: poolAddress });

        if (poolContract) {
          const tokensSold : any = await poolContract.methods.tokenSold().call();
          const tokensSoldCal = new BigNumber(tokensSold).div(new BigNumber(10).pow(poolDetails?.tokenDetails?.decimals || 18)).toFixed();
          const { progress, tokenSold } = getProgressWithPools({
            ...poolDetails,
            token_sold: tokensSoldCal,
            tokenSold: tokensSoldCal,
            total_sold_coin: totalTokens,
            totalSoldCoin: totalTokens,
            finish_time: poolDetails.finish_time || poolDetails.endBuyTime,
          });

          setTokenSold(new BigNumber(tokenSold).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
          setSoldProgress(new BigNumber(progress).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
        }
      }
    };

    if (!poolAddress) {
      const { progress, tokenSold } = getProgressWithPools({
        ...poolDetails,
        token_sold: 0,
        total_sold_coin: totalTokens,
        finish_time: poolDetails.finish_time || poolDetails.endBuyTime,
      });
      setTokenSold(new BigNumber(tokenSold).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
      setSoldProgress(new BigNumber(progress).decimalPlaces(2, BigNumber.ROUND_HALF_DOWN).toFixed(2, BigNumber.ROUND_HALF_DOWN));
    }

    if (poolAddress && networkAvailable) {
      calSoldProgress();
      soldProgressInterval = setInterval(() => calSoldProgress(), 20000);
    }

    return () => {
      if (soldProgressInterval) {
        clearInterval(soldProgressInterval);
      }
    };
  }, [poolDetails, poolAddress, appChainID, connector, networkAvailable, totalTokens]);

  return {
    tokenSold,
    soldProgress
  }
}


export default useTokenSoldProgress;
