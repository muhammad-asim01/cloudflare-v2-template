import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { TokenType } from '@/hooks/useTokenDetails';
import{ getContractReadInstance } from '@/services/web3';
import Pool_ABI from '@/abi/PreSalePool.json';

const useUserRemainTokensClaim = (
  tokenDetails: TokenType | undefined,
  poolAddress: string | undefined,
  networkAvaiable: string | undefined
) => {
  const [userPurchasedLoading, setUserPurchasedLoading] = useState<boolean>(false);

  const retrieveClaimableTokens = useCallback(async (userAddress: string) => {
    try {
      if (userAddress && poolAddress && tokenDetails
          && ethers.utils.isAddress(userAddress)
          && ethers.utils.isAddress(poolAddress)
      ) {
        setUserPurchasedLoading(true);
        const contract = getContractReadInstance(Pool_ABI, poolAddress, networkAvaiable || 'eth');
        if (contract) {
          const userPurchased : any = await contract.methods.userPurchased(userAddress).call();
          const userClaimed : any = await contract.methods.userClaimed(userAddress).call();
          const userPurchasedReturn = new BigNumber(userPurchased).minus(new BigNumber(userClaimed)).div(new BigNumber(10).pow(tokenDetails.decimals)).toFixed();

          return {
            userPurchased: new BigNumber(userPurchased).div(new BigNumber(10).pow(tokenDetails.decimals)).toFixed(),
            userClaimed: new BigNumber(userClaimed).div(new BigNumber(10).pow(tokenDetails.decimals)).toFixed(),
            userPurchasedReturn,
          }
        }
        return {
          userPurchased: 0,
          userClaimed: 0,
          userPurchasedReturn: 0,
          tokenDecimals: tokenDetails.decimals,
        }
      }
    } catch (err) {
      console.log('retrieveClaimableTokens', err);
    }
  }, [tokenDetails, poolAddress, networkAvaiable]);

  return {
    userPurchasedLoading,
    retrieveClaimableTokens
  }
}

export default useUserRemainTokensClaim;
