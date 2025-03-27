import { 
  USDT_ADDRESS, USDT_BSC_ADDRESS, USDT_POLYGON_ADDRESS, USDT_AVALANCHE_ADDRESS,
  USDC_ADDRESS, USDC_BSC_ADDRESS, USDC_POLYGON_ADDRESS,
  BUSD_BSC_ADDRESS, 
  ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, AVALANCHE_CHAIN_ID, ARBITRUM_CHAIN_ID, USDT_ARBITRUM_ADDRESS,
  BASE_CHAIN_ID,
  USDT_BASE_ADDRESS,
  DAO_CHAIN_ID,
  USDT_DAO_ADDRESS,
  OKX_CHAIN_ID,
  USDT_OKX_ADDRESS,
  ZKSYNC_CHAIN_ID,
  USDT_ZKSYNC_ADDRESS,
  USDC_BASE_ADDRESS,
  USDC_DAO_ADDRESS,
  USDC_ZKSYNC_ADDRESS,
  USDC_OKX_ADDRESS,
  LINEA_CHAIN_ID,
  USDT_LINEA_ADDRESS,
  USDC_LINEA_ADDRESS,
  BLAST_CHAIN_ID,
  WETH_BLAST_ADDRESS,
  USDC_AVALANCHE_ADDRESS,
  USDC_ARBITRUM_ADDRESS,
  BERA_CHAIN_ID,
  HNY_BERA_ADDRESS,
  SONIC_CHAIN_ID,
  USDT_SONIC_ADDRESS,
  USDC_SONIC_ADDRESS,
} from '../../constants/network';

// chain integration
export const getUSDTAddress = (appChainID: string): string => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return USDT_BSC_ADDRESS as string;

    case POLYGON_CHAIN_ID:
      return USDT_POLYGON_ADDRESS as string;

    case AVALANCHE_CHAIN_ID:
      return USDT_AVALANCHE_ADDRESS as string;

    case ARBITRUM_CHAIN_ID:
      return USDT_ARBITRUM_ADDRESS as string;

      case BASE_CHAIN_ID:
      return USDT_BASE_ADDRESS as string;

    case DAO_CHAIN_ID:
      return USDT_DAO_ADDRESS as string;

    case OKX_CHAIN_ID:
      return USDT_OKX_ADDRESS as string;

    case ZKSYNC_CHAIN_ID:
      return USDT_ZKSYNC_ADDRESS as string;

    case LINEA_CHAIN_ID:
      return USDT_LINEA_ADDRESS as string;

    case SONIC_CHAIN_ID:
      return USDT_SONIC_ADDRESS as string;

    case ETH_CHAIN_ID:
    default:
      return USDT_ADDRESS as string;
  }
  // return (appChainID === ETH_CHAIN_ID ? USDT_ADDRESS: USDT_BSC_ADDRESS) as string;
}

export const getBUSDAddress = (): string => {
  return BUSD_BSC_ADDRESS as string;
}

export const getUSDCAddress = (appChainID: string) => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return USDC_BSC_ADDRESS as string;
      
    case POLYGON_CHAIN_ID:
      return USDC_POLYGON_ADDRESS as string;

      case AVALANCHE_CHAIN_ID:
      return USDC_AVALANCHE_ADDRESS as string;

      case ARBITRUM_CHAIN_ID:
      return USDC_ARBITRUM_ADDRESS as string;

      case BASE_CHAIN_ID:
      return USDC_BASE_ADDRESS as string;

    case DAO_CHAIN_ID:
      return USDC_DAO_ADDRESS as string;
      
    case ZKSYNC_CHAIN_ID:
        return USDC_ZKSYNC_ADDRESS as string;

    case LINEA_CHAIN_ID:
        return USDC_LINEA_ADDRESS as string;

    case OKX_CHAIN_ID:
      return USDC_OKX_ADDRESS as string;

    case SONIC_CHAIN_ID:
      return USDC_SONIC_ADDRESS as string;

    case ETH_CHAIN_ID:
    default:
      return USDC_ADDRESS as string;
  }
  // return (appChainID === ETH_CHAIN_ID ? USDC_ADDRESS: USDC_BSC_ADDRESS) as string;
}

export const getWETHAddress = (appChainID: string) => {
  switch (appChainID) {
    case BLAST_CHAIN_ID:
      return WETH_BLAST_ADDRESS as string;
    default:
      return WETH_BLAST_ADDRESS as string;
  }
};

export const getHNYAddress = (appChainID: string) => {
  switch (appChainID) {
    case BERA_CHAIN_ID:
      return HNY_BERA_ADDRESS as string;

    default:
      return HNY_BERA_ADDRESS as string;
  }
};

