import { ethers } from "ethers";
import {
  ARBITRUM_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  BASE_CHAIN_ID,
  BERA_CHAIN_ID,
  BERA_NETWORK_RPC_URL,
  BLAST_CHAIN_ID,
  BSC_CHAIN_ID,
  DAO_CHAIN_ID,
  ETH_CHAIN_ID,
  LINEA_CHAIN_ID,
  OKX_CHAIN_ID,
  POLYGON_CHAIN_ID,
  SONIC_CHAIN_ID,
  ZKSYNC_CHAIN_ID,
} from "../constants/network";

const ETH_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC_URL || "";
const BSC_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL || "";
const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "";
const AVALANCHE_RPC_URL = process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL || "";
const ARBITRUM_RPC_URL = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "";
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || "";
const DAO_RPC_URL = process.env.NEXT_PUBLIC_DAO_RPC_URL || "";
const OKX_RPC_URL = process.env.NEXT_PUBLIC_OKX_RPC_URL || "";
const ZKSYNC_RPC_URL = process.env.NEXT_PUBLIC_ZKSYNC_RPC_URL || "";
const LINEA_RPC_URL = process.env.NEXT_PUBLIC_LINEA_RPC_URL || "";
const BLAST_RPC_URL = process.env.NEXT_PUBLIC_BLAST_RPC_URL || "";
const SONIC_RPC_URL = process.env.NEXT_PUBLIC_SONIC_RPC_URL || "";

// chain integration
const getAccountBalance = async (
  appChainID: string,
  walletChainID: any,
  connectedAccount: any,
  connector?: string
) => {
  if (appChainID && connectedAccount && connector) {
    const exactNetwork = appChainID === walletChainID;

    const provider = (() => {
      switch (appChainID) {
        case BSC_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
        case POLYGON_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(POLYGON_RPC_URL);
        case AVALANCHE_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(AVALANCHE_RPC_URL);
        case ARBITRUM_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(ARBITRUM_RPC_URL);
          case BASE_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(BASE_RPC_URL);
        case DAO_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(DAO_RPC_URL);
        case OKX_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(OKX_RPC_URL);
        case ZKSYNC_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(ZKSYNC_RPC_URL);
        case LINEA_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(LINEA_RPC_URL);
        case BLAST_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(BLAST_RPC_URL);
          case BERA_CHAIN_ID:
            return new ethers.providers.JsonRpcProvider(BERA_NETWORK_RPC_URL);
        case SONIC_CHAIN_ID:
          return new ethers.providers.JsonRpcProvider(SONIC_RPC_URL);
        case ETH_CHAIN_ID:
        default:
          return new ethers.providers.JsonRpcProvider(ETH_RPC_URL);
      }
    })();

    const accountBalance = exactNetwork
      ? await provider.getBalance(connectedAccount)
      : { _hex: "0x00" };

    return accountBalance;
  }

  return { _hex: "0x00" };
};

export default getAccountBalance;
