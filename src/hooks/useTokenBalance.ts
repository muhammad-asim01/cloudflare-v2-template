import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { TokenType } from '../hooks/useTokenDetails';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { getContractInstance, getContractReadInstance, SmartContractMethod } from '../services/web3';

import ERC20_ABI from '../abi/Erc20.json';
import { useAccount } from 'wagmi';

const useTokenBalance = (token: TokenType | undefined, userAddress: string | null | undefined) => {
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState<boolean>(false);

  const { connector : provider } = useAccount();
  const { appChainID }  = useSelector((state: any) => state.appNetwork).data;
  const connector  = useTypedSelector(state => state.connector).data;

  const retrieveTokenBalance = useCallback(async (token: TokenType | undefined, userAddress: string, networkAvaiable?: string) => {
    if (token
    && userAddress
    && ethers.utils.isAddress(userAddress)
    && (ethers.utils.isAddress(token.address))) {
      setTokenBalanceLoading(true);
      try {
        const contract = await getContractReadInstance(ERC20_ABI, token.address, networkAvaiable || 'eth');
        // const contract = await getContractInstance(ERC20_ABI, token.address, connector, appChainID, SmartContractMethod.Read);

      if (contract) {
        const balance : any = await contract.methods.balanceOf(userAddress).call();
        const balanceReturn = new BigNumber(balance).div(new BigNumber(10).pow(token?.decimals as number)).toFixed(7);

        return balanceReturn;
      }
      } catch (error) {        
      console.log("🚀 ~ && ~ error:", error)
      }
    }

    if (token && token?.symbol === 'ETH') {
      try {
        // @ts-expect-error - provider is not defined in wagmi
        const balance = await provider.provider.request({ method: 'eth_getBalance', params: [userAddress, 'latest'] });
        const balanceReturn = new BigNumber(balance).div(new BigNumber(10).pow(token?.decimals as number)).toFixed(7);
        return balanceReturn;
      } catch (error) {        
      console.log("🚀 ~ retrieveTokenBalance ~ error:", error)
      }
    }

    return 0;
  }, [userAddress, token, appChainID, connector]);


  const retrieveTokenRawBalance = useCallback(async (token: TokenType | undefined, userAddress: string) => {
    if (token
    && userAddress
    && ethers.utils.isAddress(userAddress)
    && (ethers.utils.isAddress(token.address))) {
      setTokenBalanceLoading(true);
      try {
        const contract = await getContractInstance(ERC20_ABI, token.address, connector, appChainID, SmartContractMethod.Read);

      if (contract) {
        const balance : any = await contract.methods.balanceOf(userAddress).call();
        const balanceReturn = new BigNumber(balance).div(new BigNumber(10).pow(token?.decimals as number)).toString();

        return balanceReturn;
      }
      } catch (error) {        
      console.log("🚀 ~ && ~ error:", error)
      }
    }

    if (token && token?.symbol === 'ETH') {
        try {
          // @ts-expect-error - provider is not defined in wagmi
        const balance = await provider.provider.request({ method: 'eth_getBalance', params: [userAddress, 'latest'] });
        const balanceReturn = new BigNumber(balance).div(new BigNumber(10).pow(token?.decimals as number)).toString();
        return balanceReturn;
        } catch (error) {          
        console.log("🚀 ~ retrieveTokenRawBalance ~ error:", error)
        }
    }

    return 0;
  }, [userAddress, token, appChainID, connector]);

  return {
    retrieveTokenBalance,
    retrieveTokenRawBalance,
    tokenBalanceLoading
  }
}

export default useTokenBalance;
