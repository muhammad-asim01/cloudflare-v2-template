import { useState, useCallback } from "react";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

import { getETHBalance, getContractReadInstance } from "@/services/web3";
import ERC20_ABI from "@/abi/Erc20.json";

// chain integration
const usePoolBalance = (
  currency: string,
  poolAddress: string | undefined,
  networkAvaiable: string | undefined
) => {
  const [poolBalance, setPoolBalance] = useState<number>();
  const [loadingPoolBalance, setLoadingPoolBalance] = useState<boolean>(false);

  const retrievePoolBalance = useCallback(async () => {
    try {
      // console.log('retrievePoolBalance')
      // console.log(poolAddress && currency
      //     && ethers.utils.isAddress(poolAddress))
      if (poolAddress && currency && ethers.utils.isAddress(poolAddress)) {
        setLoadingPoolBalance(true);
        if (currency == "eth") {
          const ethBalance = await getETHBalance(poolAddress);

          setPoolBalance(new BigNumber(ethBalance).toNumber());
          return ethBalance;
        } else {
          const currencyAddress: any = {
            eth: {
              usdt: process.env.NEXT_PUBLIC_USDT_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_SMART_CONTRACT,
            },
            bsc: {
              usdt: process.env.NEXT_PUBLIC_USDT_BSC_SMART_CONTRACT,
              busd: process.env.NEXT_PUBLIC_BUSD_BSC_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_BSC_SMART_CONTRACT,
            },
            polygon: {
              usdt: process.env.NEXT_PUBLIC_USDT_POLYGON_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_POLYGON_SMART_CONTRACT,
            },
            avalanche: {
              usdt: process.env.NEXT_PUBLIC_USDT_AVALANCHE_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_AVALANCHE_SMART_CONTRACT,
            },
            arbitrum: {
              usdt: process.env.NEXT_PUBLIC_USDT_ARBITRUM_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_ARBITRUM_SMART_CONTRACT,
            },
            base: {
              usdt: process.env.NEXT_PUBLIC_USDT_BASE_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_BASE_SMART_CONTRACT,
            },
            coredao: {
              usdt: process.env.NEXT_PUBLIC_USDT_DAO_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_DAO_SMART_CONTRACT,
            },
            xlayer: {
              usdt: process.env.NEXT_PUBLIC_USDT_OKX_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_OKX_SMART_CONTRACT,
            },
            zksync: {
              usdc: process.env.NEXT_PUBLIC_USDC_ZKSYNC_SMART_CONTRACT,
            },
            linea: {
              usdt: process.env.NEXT_PUBLIC_USDT_LINEA_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_LINEA_SMART_CONTRACT,
            },
            blast: {
              weth: process.env.NEXT_PUBLIC_WETH_BLAST_SMART_CONTRACT,
            },
            bera: {
              honey: process.env.NEXT_PUBLIC_HNY_SMART_CONTRACT,
            },
            sonic: {
              usdt: process.env.NEXT_PUBLIC_USDT_SONIC_SMART_CONTRACT,
              usdc: process.env.NEXT_PUBLIC_USDC_SONIC_SMART_CONTRACT,
            },
          };

          const contract = getContractReadInstance(
            ERC20_ABI,
            currencyAddress[networkAvaiable || "eth"][currency],
            networkAvaiable || "eth"
          );

          const [balance, decimals]: any = await Promise.all([
            contract?.methods.balanceOf(poolAddress).call(),
            contract?.methods.decimals().call(),
          ]);
          setPoolBalance(
            new BigNumber(balance.toString()).div(Math.pow(10, Number(decimals))).toNumber()
          );
        }

        setLoadingPoolBalance(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, [currency, poolAddress, networkAvaiable]);

  return {
    loadingPoolBalance,
    poolBalance,
    retrievePoolBalance,
  };
};

export default usePoolBalance;
