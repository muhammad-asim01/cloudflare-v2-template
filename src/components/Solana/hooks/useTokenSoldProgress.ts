import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getProgressWithPools } from "@/utils/campaign";
import { getPoolMetadata } from "@/context/Solana/utils";
import useAuth from "@/hooks/useAuth";

const useTokenSoldProgress = (
  totalTokens: number | undefined,
  networkAvailable: string | undefined,
  poolDetails: any = {},
  id: number
) => {
  const [soldProgress, setSoldProgress] = useState<string>("0");
  const [tokenSold, setTokenSold] = useState<string>("0");

  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;
  const connector = useTypedSelector((state) => state.connector).data;
  let soldProgressInterval = undefined as any;

  const { connectedAccount } = useAuth();

  useEffect(() => {
    const calSoldProgress = async () => {
      try {
        if (networkAvailable && totalTokens) {

          const main_tx: any = await getPoolMetadata(connectedAccount, id);
          let tokensSoldCal = new BigNumber(parseInt(main_tx.tokenSold, 16))
            .div(new BigNumber(10).pow(poolDetails?.tokenDetails?.decimals || 9))
            .toFixed();
          let { progress, tokenSold } = getProgressWithPools({
            ...poolDetails,
            token_sold: tokensSoldCal,
            tokenSold: tokensSoldCal,
            total_sold_coin: totalTokens,
            totalSoldCoin: totalTokens,
            finish_time: poolDetails.finish_time || poolDetails.endBuyTime,
          });
  
          setTokenSold(
            new BigNumber(tokenSold)
              .decimalPlaces(2, BigNumber.ROUND_HALF_DOWN)
              .toFixed(2, BigNumber.ROUND_HALF_DOWN)
          );
          setSoldProgress(
            new BigNumber(progress)
              .decimalPlaces(2, BigNumber.ROUND_HALF_DOWN)
              .toFixed(2, BigNumber.ROUND_HALF_DOWN)
          );
        }
      } catch (error) {
        
      }
    };

    if (!poolDetails?.isDeployed) {
      let { progress, tokenSold } = getProgressWithPools({
        ...poolDetails,
        token_sold: 0,
        total_sold_coin: totalTokens,
        finish_time: poolDetails.finish_time || poolDetails.endBuyTime,
      });
      setTokenSold(
        new BigNumber(tokenSold)
          .decimalPlaces(2, BigNumber.ROUND_HALF_DOWN)
          .toFixed(2, BigNumber.ROUND_HALF_DOWN)
      );
      setSoldProgress(
        new BigNumber(progress)
          .decimalPlaces(2, BigNumber.ROUND_HALF_DOWN)
          .toFixed(2, BigNumber.ROUND_HALF_DOWN)
      );
    }

    if (networkAvailable) {
      calSoldProgress();
      soldProgressInterval = setInterval(() => calSoldProgress(), 20000);
    }

    return () => {
      soldProgressInterval && clearInterval(soldProgressInterval);
    };
  }, [poolDetails, appChainID, connector, networkAvailable, totalTokens]);

  return {
    tokenSold,
    soldProgress,
  };
};

export default useTokenSoldProgress;
