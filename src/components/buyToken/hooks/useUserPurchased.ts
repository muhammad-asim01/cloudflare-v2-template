import { useState, useCallback } from "react";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

import { TokenType } from "@/hooks/useTokenDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getContractReadInstance } from "@/services/web3";
import Pool_ABI from "@/abi/Pool.json";

const useUserPurchased = (
  tokenDetails: TokenType | undefined,
  poolAddress: string | undefined,
  ableToFetchFromBlockchain: boolean | undefined,
  networkAvaiable: any
) => {
  const [userPurchasedLoading, setUserPurchasedLoading] =
    useState<boolean>(false);

  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;
  const connector = useTypedSelector((state) => state.connector).data;

  const retrieveUserPurchased = useCallback(
    async (userAddress: string, poolAddress: string) => {
      try {
        if (
          userAddress &&
          poolAddress &&
          tokenDetails &&
          ethers.utils.isAddress(userAddress) &&
          ethers.utils.isAddress(poolAddress)
        ) {
          setUserPurchasedLoading(true);

          //  const contract = getContractInstance(Pool_ABI, poolAddress, connector, appChainID, SmartContractMethod.Read);
          const contract = await getContractReadInstance(
            Pool_ABI,
            poolAddress,
            networkAvaiable || "eth"
          );
          if (contract) {
            const userPurchased: any = await contract.methods
              .userPurchased(userAddress)
              .call();
            const userPurchasedReturn = new BigNumber(userPurchased)
              .div(new BigNumber(10).pow(tokenDetails.decimals))
              .toFixed();

            return userPurchasedReturn;
          }

          return 0;
        }
      } catch (err: any) {
        console.log("retrieveUserPurchased", err.message);
      }
    },
    [appChainID, connector, poolAddress, ableToFetchFromBlockchain]
  );

  return {
    userPurchasedLoading,
    retrieveUserPurchased,
  };
};

export default useUserPurchased;
