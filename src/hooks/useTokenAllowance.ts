import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { TokenType } from '../hooks/useTokenDetails';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { getContractReadInstance } from '../services/web3';

import ERC20_ABI from '../abi/Erc20.json';

const useTokenAllowance = () => {
  const [tokenAllowanceLoading, setTokenAllowanceLoading] = useState<boolean>(false);

  const { appChainID }  = useSelector((state: any) => state.appNetwork).data;
  const connector  = useTypedSelector(state => state.connector).data;

  const retrieveTokenAllowance = useCallback(async (token: TokenType | undefined, owner: string, spender: string, networkAvaiable: string) => {
      if (token && spender && owner   
          && ethers.utils.isAddress(owner) 
          && ethers.utils.isAddress(spender) 
          && ethers.utils.isAddress(token.address) 
      ) {
      setTokenAllowanceLoading(true);

      // const contract = getContractInstance(ERC20_ABI, token.address, connector, appChainID, SmartContractMethod.Read);
      const contract = await getContractReadInstance(ERC20_ABI, token.address, networkAvaiable || 'eth');

      if (contract) {
        const balance : any = await contract.methods.allowance(owner, spender).call();
        const allowanceReturn = new BigNumber(balance).div(new BigNumber(10).pow(token?.decimals as number)).toString();

        return allowanceReturn;
      }

      return "0";
    }
  }, [appChainID, connector]);

  return {
    retrieveTokenAllowance,
    tokenAllowanceLoading
  }
}

export default useTokenAllowance;
