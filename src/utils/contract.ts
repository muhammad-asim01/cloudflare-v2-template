import { ethers } from 'ethers';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { getCustomProvider } from './getCustomProvider';

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export const getContract = async(contractAddress: string, ABI: any, library:any, account?: string) => {
  console.log("🚀 ~ getContract ~ account:", account)
  const provider = await getCustomProvider(library);
  const signer = await provider.getSigner();
  const ERC20TokenContract = new ethers.Contract(contractAddress, ABI, signer);
  return ERC20TokenContract;
}
