import Web3 from 'web3';
import { ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, AVALANCHE_CHAIN_ID, ARBITRUM_CHAIN_ID, BASE_CHAIN_ID, ZKSYNC_CHAIN_ID, BASE_NETWORK_RPC_URL, ZKSYNC_NETWORK_RPC_URL, DAO_CHAIN_ID, OKX_CHAIN_ID, DAO_NETWORK_RPC_URL, OKX_NETWORK_RPC_URL, LINEA_CHAIN_ID, LINEA_NETWORK_RPC_URL, BLAST_CHAIN_ID, BLAST_NETWORK_RPC_URL, BERA_CHAIN_ID, BERA_NETWORK_RPC_URL, SONIC_CHAIN_ID, SONIC_NETWORK_RPC_URL } from '@/constants/network';
import {NETWORK_AVAILABLE} from "@/constants";
import {
  ETH_NETWORK_RPC_URL,
  BSC_NETWORK_RPC_URL,
  POLYGON_NETWORK_RPC_URL,
  AVALANCHE_NETWORK_RPC_URL,
  ARBITRUM_NETWORK_RPC_URL
} from "@/constants/network";
import { ConnectorNames, connectorNames, connectorsByName } from '@/constants/connectors';
import POOL_ABI from '../abi/Pool.json';

const DEFAULT_NETWORK_URL = BSC_NETWORK_RPC_URL;

export const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export enum SmartContractMethod {
  Write = "Write",
  Read = "Read"
}

type smartContractMethod = Extract<SmartContractMethod, SmartContractMethod.Write | SmartContractMethod.Read>

export const getWeb3Instance = () => {
  const windowObj = window as any;
  const { ethereum, web3 } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    return new Web3(ethereum);
  }
  if (web3) {
    return new Web3(web3.currentProvider);
  }
  return null;
};

export const isMetaMaskInstalled = () => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  return ethereum && ethereum.isMetaMask;
};


export const getProviderByNetwork = (
  connector: ConnectorNames,
  chainId: string,
  typeMethod: smartContractMethod
) => {
  if (chainId && typeMethod === SmartContractMethod.Read) {
    switch (chainId) {
      case BSC_CHAIN_ID:
        return new Web3.providers.HttpProvider(BSC_NETWORK_RPC_URL);
      case POLYGON_CHAIN_ID:
        return new Web3.providers.HttpProvider(POLYGON_NETWORK_RPC_URL);
      case AVALANCHE_CHAIN_ID:
        return new Web3.providers.HttpProvider(AVALANCHE_NETWORK_RPC_URL);
      case ARBITRUM_CHAIN_ID:
        return new Web3.providers.HttpProvider(ARBITRUM_NETWORK_RPC_URL);
      case ETH_CHAIN_ID:
        return new Web3.providers.HttpProvider(ETH_NETWORK_RPC_URL);
      case BASE_CHAIN_ID:
        return new Web3.providers.HttpProvider(BASE_NETWORK_RPC_URL);
      case ZKSYNC_CHAIN_ID:
        return new Web3.providers.HttpProvider(ZKSYNC_NETWORK_RPC_URL);
      case DAO_CHAIN_ID:
        return new Web3.providers.HttpProvider(DAO_NETWORK_RPC_URL);
      case OKX_CHAIN_ID:
        return new Web3.providers.HttpProvider(OKX_NETWORK_RPC_URL);
      case LINEA_CHAIN_ID:
        return new Web3.providers.HttpProvider(LINEA_NETWORK_RPC_URL);
      case BLAST_CHAIN_ID:
        return new Web3.providers.HttpProvider(BLAST_NETWORK_RPC_URL);
      case BERA_CHAIN_ID:
        return new Web3.providers.HttpProvider(BERA_NETWORK_RPC_URL);
      case SONIC_CHAIN_ID:
        return new Web3.providers.HttpProvider(SONIC_NETWORK_RPC_URL);
      default:
        return new Web3.providers.HttpProvider(DEFAULT_NETWORK_URL);
    }
  }

  const provider = (connectorsByName[connector] as any);
  return provider;
}

export const getContractInstance =
  (ABIContract: any,
   contractAddress: string,
   connector: any,
   chainId: string = BSC_CHAIN_ID as string,
   typeMethod: smartContractMethod = SmartContractMethod.Read,
  ) => {
  const provider = getProviderByNetwork(connector as connectorNames, chainId, typeMethod);

  if (provider) {
    const web3Instance = new Web3(provider);

    return new web3Instance.eth.Contract(
      ABIContract,
      contractAddress,
    );
  }

  return;
};

export const getContractReadInstance = (ABIContract: any, contractAddress: string, networkAvailable : string ) => {
  let provider;
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      provider = new Web3.providers.HttpProvider(BSC_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.POLYGON:
      provider = new Web3.providers.HttpProvider(POLYGON_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.ETH:
      provider = new Web3.providers.HttpProvider(ETH_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.AVALANCHE:
      provider = new Web3.providers.HttpProvider(AVALANCHE_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.ARBITRUM:
      provider = new Web3.providers.HttpProvider(ARBITRUM_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.BASE:
      provider = new Web3.providers.HttpProvider(BASE_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.ZKSYNC:
      provider = new Web3.providers.HttpProvider(ZKSYNC_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.DAO:
        provider = new Web3.providers.HttpProvider(DAO_NETWORK_RPC_URL);
        break;
    
    case NETWORK_AVAILABLE.OKX:
      provider = new Web3.providers.HttpProvider(OKX_NETWORK_RPC_URL);
      break;

    case NETWORK_AVAILABLE.LINEA:
      provider = new Web3.providers.HttpProvider(LINEA_NETWORK_RPC_URL);
      break;
      
    case NETWORK_AVAILABLE.BLAST:
      provider = new Web3.providers.HttpProvider(BLAST_NETWORK_RPC_URL);
      break;
    case NETWORK_AVAILABLE.BERA:
      provider = new Web3.providers.HttpProvider(BERA_NETWORK_RPC_URL);
      break;
    case NETWORK_AVAILABLE.SONIC:
      provider = new Web3.providers.HttpProvider(SONIC_NETWORK_RPC_URL);
      break;
  }
  if (!provider) {
    return
  }

  const web3Instance = new Web3(provider);

  return new web3Instance.eth.Contract(
    ABIContract,
    contractAddress,
  );
};

export const getContractInstanceWeb3 = (networkAvailable : string ) => {
  let provider;
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      provider = new Web3.providers.HttpProvider(BSC_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.POLYGON:
      provider = new Web3.providers.HttpProvider(POLYGON_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.ETH:
      provider = new Web3.providers.HttpProvider(ETH_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.AVALANCHE:
        provider = new Web3.providers.HttpProvider(AVALANCHE_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.ARBITRUM:
        provider = new Web3.providers.HttpProvider(ARBITRUM_NETWORK_RPC_URL);
        return new Web3(provider);

    case NETWORK_AVAILABLE.BASE:
      provider = new Web3.providers.HttpProvider(BASE_NETWORK_RPC_URL);
      return new Web3(provider);
        
    case NETWORK_AVAILABLE.ZKSYNC:
      provider = new Web3.providers.HttpProvider(ZKSYNC_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.DAO:
      provider = new Web3.providers.HttpProvider(DAO_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.OKX:
      provider = new Web3.providers.HttpProvider(OKX_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.LINEA:
      provider = new Web3.providers.HttpProvider(LINEA_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.BLAST:
      provider = new Web3.providers.HttpProvider(BLAST_NETWORK_RPC_URL);
      return new Web3(provider);
    case NETWORK_AVAILABLE.BERA:
      provider = new Web3.providers.HttpProvider(BERA_NETWORK_RPC_URL);
      return new Web3(provider);

    case NETWORK_AVAILABLE.SONIC:
      provider = new Web3.providers.HttpProvider(SONIC_NETWORK_RPC_URL);
      return new Web3(provider);
      
    default:
      return null;
  }
};

export const getPoolContract = ({ networkAvailable, poolHash }: any) => {
  const web3Instance = getContractInstanceWeb3(networkAvailable);
  if (!web3Instance) {
    return null;
  }

  return new web3Instance.eth.Contract(POOL_ABI, poolHash);
};

export const getContractInstanceWithEthereum = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  if (ethereum && ethereum.isMetaMask) {
    const web3Instance = new Web3(ethereum);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else if (windowObj.web3) {
    const web3Instance = new Web3(windowObj.web3.currentProvider);
    return new web3Instance.eth.Contract(ABIContract, contractAddress);
  } else {
    return null;
  }
};

export const getContractInstanceWithBSC = (ABIContract: any, contractAddress: string) => {
  const windowObj = window as any;
  const { ethereum } = windowObj;
  const web3Instance = new Web3(ethereum);
  return new web3Instance.eth.Contract(ABIContract, contractAddress);
};

export const convertFromWei = (value: any) => {
  return Web3.utils.fromWei(value, "ether");
};

export const convertToWei = (value: any) => {
  // const webInstance = getWeb3Instance();
  // // @ts-ignore
  // return webInstance.utils.toWei(value, unit);
  return Web3.utils.toWei(value, "ether");
};

export const isValidAddress = (address: string) => {
  return Web3.utils.isAddress(address);
}

export const getETHBalance = async (loginUser: string) => {
  const web3 = getWeb3Instance() as any;
  if (web3) {
    const balance = await web3.eth.getBalance(loginUser);

    return web3.utils.fromWei(balance);
  };

  return 0;
}

export const convertToBN = (number: string) => {
    const web3 = getWeb3Instance() as any;
  if (web3) {
    return web3.utils.toBN(number)
  }
  return 0
}
