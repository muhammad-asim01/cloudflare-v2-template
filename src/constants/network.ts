export const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID as string;
export const BSC_CHAIN_ID = process.env.NEXT_PUBLIC_BSC_CHAIN_ID as string;
export const POLYGON_CHAIN_ID = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID as string;
export const AVALANCHE_CHAIN_ID = process.env.NEXT_PUBLIC_AVALANCHE_CHAIN_ID as string;
export const ARBITRUM_CHAIN_ID = process.env.NEXT_PUBLIC_ARBITRUM_CHAIN_ID as string;
export const BASE_CHAIN_ID = process.env.NEXT_PUBLIC_BASE_CHAIN_ID as string;
export const DAO_CHAIN_ID = process.env.NEXT_PUBLIC_DAO_CHAIN_ID as string;
export const OKX_CHAIN_ID = process.env.NEXT_PUBLIC_OKX_CHAIN_ID as string;
export const ZKSYNC_CHAIN_ID = process.env.NEXT_PUBLIC_ZKSYNC_CHAIN_ID as string;
export const LINEA_CHAIN_ID = process.env.NEXT_PUBLIC_LINEA_CHAIN_ID as string;
export const BLAST_CHAIN_ID = process.env.NEXT_PUBLIC_BLAST_CHAIN_ID as string;
export const BERA_CHAIN_ID = process.env.NEXT_PUBLIC_BERA_CHAIN_ID as string;
export const SONIC_CHAIN_ID = process.env.NEXT_PUBLIC_SONIC_CHAIN_ID as string;

export const OKXL2_CHAIN_ID = "OKXL2";

export const DEFAULT_CHAIN_ID = BSC_CHAIN_ID

export const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_SMART_CONTRACT;
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_SMART_CONTRACT;

export const USDC_POLYGON_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_POLYGON_SMART_CONTRACT;
export const USDT_POLYGON_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_POLYGON_SMART_CONTRACT;
export const USDT_AVALANCHE_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_AVALANCHE_SMART_CONTRACT;
export const USDC_AVALANCHE_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_AVALANCHE_SMART_CONTRACT;
export const USDT_ARBITRUM_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_ARBITRUM_SMART_CONTRACT;
  export const USDC_ARBITRUM_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_ARBITRUM_SMART_CONTRACT;
  export const USDT_BASE_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_BASE_SMART_CONTRACT;
export const USDC_BASE_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_BASE_SMART_CONTRACT;
export const USDT_DAO_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_DAO_SMART_CONTRACT;
export const USDC_DAO_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_DAO_SMART_CONTRACT;
export const USDT_OKX_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_OKX_SMART_CONTRACT;
export const USDC_OKX_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_OKX_SMART_CONTRACT;
export const USDT_ZKSYNC_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_ZKSYNC_SMART_CONTRACT;
export const USDC_ZKSYNC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_ZKSYNC_SMART_CONTRACT;
  export const USDT_LINEA_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_LINEA_SMART_CONTRACT;
export const USDC_LINEA_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_LINEA_SMART_CONTRACT;
  export const WETH_BLAST_ADDRESS =
  process.env.NEXT_PUBLIC_WETH_BLAST_SMART_CONTRACT;
  export const HNY_BERA_ADDRESS =
  process.env.NEXT_PUBLIC_HNY_SMART_CONTRACT;
  export const USDT_SONIC_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_SONIC_SMART_CONTRACT;
export const USDC_SONIC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_SONIC_SMART_CONTRACT;
  
// chain integration 
export const USDC_BSC_ADDRESS = process.env.NEXT_PUBLIC_USDC_BSC_SMART_CONTRACT;
export const USDT_BSC_ADDRESS = process.env.NEXT_PUBLIC_USDT_BSC_SMART_CONTRACT;
export const BUSD_BSC_ADDRESS = process.env.NEXT_PUBLIC_BUSD_BSC_SMART_CONTRACT;

export const ETHERSCAN_URL = process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL || "";
export const BCSSCAN_URL = process.env.NEXT_PUBLIC_BSCSCAN_BASE_URL || "";
export const POLYGONSCAN_URL = process.env.NEXT_PUBLIC_POLSCAN_BASE_URL || "";
export const AVALANCHESCAN_URL = process.env.NEXT_PUBLIC_AVALANCHE_SCAN_BASE_URL || "";
export const ARBITRUMSCAN_URL = process.env.NEXT_PUBLIC_ARBITRUMSCAN_BASE_URL || "";
export const BASESCAN_URL = process.env.NEXT_PUBLIC_BASESCAN_BASE_URL || "";
export const DAOSCAN_URL = process.env.NEXT_PUBLIC_BASESCAN_DAO_URL || "";
export const OKXSCAN_URL = process.env.NEXT_PUBLIC_OKXSCAN_BASE_URL || "";
export const ZKSYNCSCAN_URL = process.env.NEXT_PUBLIC_ZKSYNCSCAN_BASE_URL || "";
export const LINEASCAN_URL = process.env.NEXT_PUBLIC_LINEASCAN_BASE_URL || "";
export const BLASTSCAN_URL = process.env.NEXT_PUBLIC_BLASTSCAN_BASE_URL || "";
export const BERA_SCAN_URL = process.env.NEXT_PUBLIC_BERA_SCAN_BASE_URL || "";
export const SONICSCAN_URL = process.env.NEXT_PUBLIC_SONICSCAN_BASE_URL || "";

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  BSC_TESTNET = 97,
  BSC_MAINNET = 56,
  POLYGON_MAINNET = 137,
  MUMBAI_POLYGON_TESTNET = 80001,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  ARBITRUM = 42161,
  ARBITRUM_TESNET = 421613,
  BASE_MAINET = 8453,
  BASE_TESTNET = 84532,
  DAO_MAINET = 1116,
  DAO_TESTNET = 1115,
  OKX_MAINET = 196,
  OKX_TESTNET = 195,
  ZKSYNC_MAINET = 324,
  ZKSYNC_TESTNET = 300,
  LINEA_MAINET = 59144,
  LINEA_TESTNET = 59141,
  BLAST_MAINET = 81457,
  BLAST_TESTNET = 168587773,
  // BERA_TESTNET = 80084,
  BERA_MAINET = 80094,
  SONIC_MAINET = 146,
  SONIC_TESTNET = 57054

}

export type chainId = Extract<
  ChainId,
  | ChainId.MAINNET
  | ChainId.ROPSTEN
  | ChainId.RINKEBY
  | ChainId.GOERLI
  | ChainId.KOVAN
  | ChainId.BSC_MAINNET
  | ChainId.BSC_TESTNET
  | ChainId.POLYGON_MAINNET
  | ChainId.MUMBAI_POLYGON_TESTNET
  | ChainId.AVALANCHE
  | ChainId.AVALANCHE_TESTNET
  | ChainId.ARBITRUM
  | ChainId.ARBITRUM_TESNET
  | ChainId.BASE_MAINET
  | ChainId.BASE_TESTNET
  | ChainId.DAO_MAINET
  | ChainId.DAO_TESTNET
  | ChainId.OKX_MAINET
  | ChainId.OKX_TESTNET
  | ChainId.ZKSYNC_MAINET
  | ChainId.ZKSYNC_TESTNET
  | ChainId.LINEA_MAINET
  | ChainId.LINEA_TESTNET
  | ChainId.BLAST_MAINET
  | ChainId.BLAST_TESTNET
  // | ChainId.BERA_TESTNET
  | ChainId.BERA_MAINET
  | ChainId.SONIC_MAINET
  | ChainId.SONIC_TESTNET
>;

export const ChainIdNameMapping: { [key in ChainId]: string } = {
  [ChainId.MAINNET]: "Mainnet",
  [ChainId.ROPSTEN]: "Ropsten",
  [ChainId.GOERLI]: "Goerli",
  [ChainId.KOVAN]: "Kovan",
  [ChainId.RINKEBY]: "Rinkeby",
  [ChainId.BSC_MAINNET]: "BSC Mainnet",
  [ChainId.BSC_TESTNET]: "BSC Testnet",
  [ChainId.POLYGON_MAINNET]: "Polygon Mainnet",
  [ChainId.MUMBAI_POLYGON_TESTNET]: "Mumbai Testnet",
  [ChainId.AVALANCHE]: "Avalanche Network",
  [ChainId.AVALANCHE_TESTNET]: "Avalanche FUJI C-Chain",
  [ChainId.ARBITRUM]: "Arbitrum Mainnet",
  [ChainId.ARBITRUM_TESNET]: "Arbitrum Testnet",
  [ChainId.BASE_MAINET]: "Base Mainnet",
  [ChainId.BASE_TESTNET]: "Base Testnet",
  [ChainId.DAO_MAINET]: "Dao Mainnet",
  [ChainId.DAO_TESTNET]: "Dao Testnet",
  [ChainId.OKX_MAINET]: "X Layer Mainnet",
  [ChainId.OKX_TESTNET]: "X Layer Testnet",
  [ChainId.ZKSYNC_MAINET]: "zkSync Mainnet",
  [ChainId.ZKSYNC_TESTNET]: "zkSync Sepolia Testnet",
  [ChainId.LINEA_MAINET]: "LINEA Mainnet",
  [ChainId.LINEA_TESTNET]: "LINEA Sepolia Testnet",
  [ChainId.BLAST_MAINET]: "BLAST",
  [ChainId.BLAST_TESTNET]: "BLAST Sepolia Testnet",
  // [ChainId.BERA_TESTNET]: "Berachain bArtio",
  [ChainId.BERA_MAINET]: "Berachain",
  [ChainId.SONIC_MAINET]: "Sonic",
  [ChainId.SONIC_TESTNET]: "Sonic Blaze Testnet",

};

export const NETWORK_NAME_MAPPINGS: { [key : string] : string} = {
  "1": "Mainnet",
  "3": "Ropsten",
  "5": "Goerli",
  "42": "Kovan",
  "4": "Rinkeby",
  "56": "BSC Mainnet",
  "97": "BSC Testnet",
  "137": "Polygon Mainnet",
  "80001": "Mumbai Testnet",
  "80002": "Amoy",
  "43114": "Avalanche Network",
  "43113": "Avalanche FUJI C-Chain",
  "42161": "Arbitrum Mainnet",
  "421613": "Arbitrum Goerli Testnet",
  "421614": "Arbitrum Sepolia",
  "8453": "Base Mainnet",
  "84532": "Base Sepolia (Test Network)",
  "1116": "Core Mainnet",
  "1115": "Core Blockchain Testnet",
  "196": "X Layer Mainnet",
  "195": "X Layer Testnet",
  "324": "zkSync Mainnet",
  "300": "zkSync Sepolia Testnet",
  "59144": "Linea Mainnet",
  "59141": "Linea Sepolia Testnet",
  "81457": "Blast",
  "168587773": "Blast Sepolia Testnet",
  // "80084": "Berachain bArtio",
  "80094": "Berachain",
  "146": "Sonic",
  "57054": "Sonic Blaze Testnet",

};

export const CLAIM_NETWORK_NAME_MAPPINGS: { [key: string]: string } = {
  "1": "eth",
  "3": "eth",
  "5": "eth",
  "11155111": "eth",
  "56": "bsc",
  "97": "bsc",
  "137": "polygon",
  "80002": "polygon",
  "43114": "avalanche",
  "43113": "avalanche",
  "42161": "arbitrum",
  "421614": "arbitrum",
  "8453": "base",
  "84532": "base",
  "324": "zksync",
  "300": "zksync",
  "1116": "coredao",
  "1115": "coredao",
  "196": "xlayer",
  "195": "xlayer",
  "59144": "linea",
  "59141": "linea",
  "168587773":"blast",
  "81457":"blast",
  // "80084":"bera",
  "80094":"bera",
  "146":"sonic",
  "57054":"sonic"

};

export const CLAIM_TEST_NETWORK_NAME_MAPPINGS: { [key: string]: string } = {
  "3": "eth",
  "5": "eth",
  "11155111": "eth",
  "97": "bsc",
  "80002": "polygon",
  "43113": "avalanche",
  "421614": "arbitrum",
  "84532": "base",
  "300": "zksync",
  "1115": "coredao",
  "195": "xlayer",
  "59141": "linea",
  "81457":"blast",
  // "80084":"bera",
  "80094":"bera",
  "57054":"sonic"

};

export interface NetworkInfo {
  name: string;
  id?: string | undefined;
  icon: string;
  disableIcon: string;
  currency?: string;
  [k: string]: any;
}

export enum APP_NETWORKS_NAME {
  METAMASK = "METAMASK",
  BSC = "BSC",
  POLYGON = "POLYGON",
  AVALANCHE = "AVALANCHE",
  ARBITRUM = "ARBITRUM",
  BASE = "BASE",
  ZKSYNC = "ZKSYNC",
  // OKXL2 = "OKXL-2",
  DAO = "DAO",
  OKX = "X Layer",
  // LINEA = "LINEA",
  BLAST = "BLAST",
  BERA = "Berachain",
  SONIC = "Sonic",
}

export type appNetworkType = Extract<
  APP_NETWORKS_NAME,
  | APP_NETWORKS_NAME.METAMASK
  | APP_NETWORKS_NAME.BSC
  | APP_NETWORKS_NAME.POLYGON
  | APP_NETWORKS_NAME.AVALANCHE
  | APP_NETWORKS_NAME.ARBITRUM
  | APP_NETWORKS_NAME.BASE
  | APP_NETWORKS_NAME.ZKSYNC
  // | APP_NETWORKS_NAME.OKXL2
  | APP_NETWORKS_NAME.DAO
  | APP_NETWORKS_NAME.OKX
  // | APP_NETWORKS_NAME.LINEA
  | APP_NETWORKS_NAME.BLAST
  | APP_NETWORKS_NAME.BERA
  | APP_NETWORKS_NAME.SONIC
>;

export const APP_NETWORKS: { [key in APP_NETWORKS_NAME]: NetworkInfo } = {
  [APP_NETWORKS_NAME.METAMASK]: {
    name: "Ethereum",
    id: ETH_CHAIN_ID,
    icon: "/assets/images/ethereum.svg",
    disableIcon: "/assets/images/eth-disable.svg",
  },
  [APP_NETWORKS_NAME.BSC]: {
    name: "BSC",
    id: BSC_CHAIN_ID,
    icon: "/assets/images/bsc.svg",
    disableIcon: "/assets/images/bsc-disable.svg",
  },
  [APP_NETWORKS_NAME.POLYGON]: {
    name: "Polygon",
    id: POLYGON_CHAIN_ID,
    icon: "/assets/images/polygon-matic.svg",
    disableIcon: "/assets/images/polygon-disable.svg",
  },
  [APP_NETWORKS_NAME.AVALANCHE]: {
    name: "Avalanche",
    id: AVALANCHE_CHAIN_ID,
    icon: "/assets/images/avalanche.svg",
    disableIcon: "/assets/images/avalanche-disabled.svg",
  },
  [APP_NETWORKS_NAME.ARBITRUM]: {
    name: "Arbitrum",
    id: ARBITRUM_CHAIN_ID,
    icon: "/assets/images/arbitrum.svg",
    disableIcon: "/assets/images/arbitrum-disabled.svg",
  },
  [APP_NETWORKS_NAME.BASE]: {
    name: "Base",
    id: BASE_CHAIN_ID,
    icon: "/assets/images/base-logo-in-blue.svg",
    disableIcon: "/assets/images/Base.svg",
  },
  [APP_NETWORKS_NAME.DAO]: {
    name: "Core",
    id: DAO_CHAIN_ID,
    icon: "/assets/images/core.svg",
    disableIcon: "/assets/images/core-disabled.svg",
  },
  [APP_NETWORKS_NAME.OKX]: {
    name: "X Layer",
    id: OKX_CHAIN_ID,
    icon: "/assets/images/okx.svg",
    disableIcon: "/assets/images/okxl-disable.svg",
  },
  [APP_NETWORKS_NAME.ZKSYNC]: {
    name: "zkSync",
    id: ZKSYNC_CHAIN_ID,
    icon: "/assets/images/zksync.svg",
    disableIcon: "/assets/images/zksync-disabled.svg",
  },
  // [APP_NETWORKS_NAME.LINEA]: {
  //   name: "linea",
  //   id: LINEA_CHAIN_ID,
  //   icon: "/assets/images/icons/24x24/linea.svg",
  //   disableIcon: "/assets/images/icons/24x24/linea-disable.svg",
  // },
  [APP_NETWORKS_NAME.BLAST]: {
    name: "blast",
    id: BLAST_CHAIN_ID,
    icon: "/assets/images/blast.svg",
    disableIcon: "/assets/images/blast_disabled.svg",
  },
  [APP_NETWORKS_NAME.BERA]: {
    name: "Berachain",
    id: BERA_CHAIN_ID,
    icon: "/assets/images/bera.png",
    disableIcon: "/assets/images/bera-disable.png",
  },
  [APP_NETWORKS_NAME.SONIC]: {
    name: "Sonic",
    id: SONIC_CHAIN_ID,
    icon: "/assets/images/sonic.png",
    disableIcon: "/assets/images/sonic-disable.png",
  },
};

export const APP_NETWORKS_ID: (string | undefined)[] = [
  ETH_CHAIN_ID,
  BSC_CHAIN_ID,
  POLYGON_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  BASE_CHAIN_ID,
  DAO_CHAIN_ID,
  OKX_CHAIN_ID,
  ZKSYNC_CHAIN_ID,
  LINEA_CHAIN_ID,
  BLAST_CHAIN_ID,
  BERA_CHAIN_ID,
  SONIC_CHAIN_ID
];

export const ETH_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC_URL || "";
export const BSC_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_BSC_RPC_URL || "";
export const POLYGON_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL|| "";
export const AVALANCHE_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL || "";
export const ARBITRUM_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || "";
export const BASE_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || "";
export const DAO_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_DAO_RPC_URL || "";
export const OKX_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_OKX_RPC_URL || "";
export const ZKSYNC_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_ZKSYNC_RPC_URL || "";
export const LINEA_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_LINEA_RPC_URL || "";
export const BLAST_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_BLAST_RPC_URL || "";
export const BERA_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_BERA_RPC_URL || "";
export const SONIC_NETWORK_RPC_URL = process.env.NEXT_PUBLIC_SONIC_RPC_URL || "";


export const NETWORK_ETH_NAME = process.env.NEXT_PUBLIC_NETWORK_ETH_NAME;
export const NETWORK_BSC_NAME = process.env.NEXT_PUBLIC_NETWORK_BSC_NAME;
export const NETWORK_POLYGON_NAME = process.env.NEXT_PUBLIC_NETWORK_POLYGON_NAME;
export const NETWORK_ARBITRUM_NAME = process.env.NEXT_PUBLIC_NETWORK_ARBITRUM_NAME;
export const NETWORK_AVALANCHE_NAME = process.env.NEXT_PUBLIC_NETWORK_AVALANCHE_NAME;
export const NETWORK_BASE_NAME = process.env.NEXT_PUBLIC_NETWORK_BASE_NAME;
export const NETWORK_DAO_NAME = process.env.NEXT_PUBLIC_NETWORK_DAO_NAME;
export const NETWORK_OKX_NAME = process.env.NEXT_PUBLIC_NETWORK_OKX_NAME;
export const NETWORK_ZKSYNC_NAME = process.env.NEXT_PUBLIC_NETWORK_ZKSYNC_NAME;
export const NETWORK_LINEA_NAME = process.env.NEXT_PUBLIC_NETWORK_LINEA_NAME;
export const NETWORK_BLAST_NAME = process.env.NEXT_PUBLIC_NETWORK_BLAST_NAME;
export const NETWORK_BERA_NAME = process.env.NEXT_PUBLIC_NETWORK_BERA_NAME;
export const NETWORK_SONIC_NAME = process.env.NEXT_PUBLIC_NETWORK_SONIC_NAME;


export const appNetwork: { [key: string]: string } = {
  [ETH_CHAIN_ID]: NETWORK_ETH_NAME as string,
  [BSC_CHAIN_ID]: NETWORK_BSC_NAME as string,
  [POLYGON_CHAIN_ID]: NETWORK_POLYGON_NAME as string,
  [ARBITRUM_CHAIN_ID]: NETWORK_ARBITRUM_NAME as string,
  [AVALANCHE_CHAIN_ID]: NETWORK_AVALANCHE_NAME as string,
  [BASE_CHAIN_ID]: NETWORK_BASE_NAME as string,
  [DAO_CHAIN_ID]: NETWORK_DAO_NAME as string,
  [OKX_CHAIN_ID]: NETWORK_OKX_NAME as string,
  [ZKSYNC_CHAIN_ID]: NETWORK_ZKSYNC_NAME as string,
  [LINEA_CHAIN_ID]: NETWORK_LINEA_NAME as string,
  [BLAST_CHAIN_ID]: NETWORK_BLAST_NAME as string,
  [BERA_CHAIN_ID]: NETWORK_BERA_NAME as string,
  [SONIC_CHAIN_ID]: NETWORK_SONIC_NAME as string,
};

export const APP_NETWORKS_SUPPORT: { [key: number]: NetworkInfo } = {
  [ETH_CHAIN_ID]: {
    name: "Ethereum",
    id: ETH_CHAIN_ID,
    icon: "/assets/images/ethereum.svg",
    disableIcon: "/assets/images/ethereum-disabled.png",
    currency: "ETH",
    networkName: NETWORK_NAME_MAPPINGS[ETH_CHAIN_ID],
    details: {
      chainId: `0x${(+ETH_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[ETH_CHAIN_ID],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [ETH_NETWORK_RPC_URL],
      blockExplorerUrls: [ETHERSCAN_URL],
    },
  },
  [BSC_CHAIN_ID]: {
    name: "BSC Mainnet",
    id: BSC_CHAIN_ID,
    icon: "/assets/images/bsc.svg",
    disableIcon: "/assets/images/binance-disabled.png",
    currency: "BNB",
    networkName: NETWORK_NAME_MAPPINGS[BSC_CHAIN_ID],
    details: {
      chainId: `0x${(+BSC_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[BSC_CHAIN_ID],
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: [BSC_NETWORK_RPC_URL],
      blockExplorerUrls: [BCSSCAN_URL],
    },
  },
  [POLYGON_CHAIN_ID]: {
    name: "Polygon",
    id: POLYGON_CHAIN_ID,
    icon: "/assets/images/polygon-matic.svg",
    disableIcon: "/assets/images/polygon-matic-disabled.svg",
    currency: "MATIC",
    networkName: NETWORK_NAME_MAPPINGS[POLYGON_CHAIN_ID],
    details: {
      chainId: `0x${(+POLYGON_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[POLYGON_CHAIN_ID],
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: [POLYGON_NETWORK_RPC_URL],
      blockExplorerUrls: [POLYGONSCAN_URL],
    },
  },
  [AVALANCHE_CHAIN_ID]: {
    name: "Avalanche",
    id: AVALANCHE_CHAIN_ID,
    icon: "/assets/images/avalanche.svg",
    disableIcon: "/assets/images/avalanche-disabled.svg",
    currency: "AVAX",
    networkName: NETWORK_NAME_MAPPINGS[AVALANCHE_CHAIN_ID],
    details: {
      chainId: `0x${(+AVALANCHE_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[AVALANCHE_CHAIN_ID],
      nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18,
      },
      rpcUrls: [AVALANCHE_NETWORK_RPC_URL],
      blockExplorerUrls: [AVALANCHESCAN_URL],
    },
  },
  [ARBITRUM_CHAIN_ID]: {
    name: "Arbitrum",
    id: ARBITRUM_CHAIN_ID,
    icon: "/assets/images/arbitrum.svg",
    disableIcon: "/assets/images/arbitrum-disabled.svg",
    currency: "ETH",
    networkName: NETWORK_NAME_MAPPINGS[ARBITRUM_CHAIN_ID],
    details: {
      chainId: `0x${(+ARBITRUM_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[ARBITRUM_CHAIN_ID],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [ARBITRUM_NETWORK_RPC_URL],
      blockExplorerUrls: [ARBITRUMSCAN_URL],
    },
  },
  [BASE_CHAIN_ID]: {
    name: "Base",
    id: BASE_CHAIN_ID,
    icon: "/assets/images/base-logo-in-blue.svg",
    disableIcon: "/assets/images/base-logo.svg",
    currency: "ETH",
    networkName: NETWORK_NAME_MAPPINGS[BASE_CHAIN_ID],
    details: {
      chainId: `0x${(+BASE_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[BASE_CHAIN_ID],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [BASE_NETWORK_RPC_URL],
      blockExplorerUrls: [BASESCAN_URL],
    },
  },
  [DAO_CHAIN_ID]: {
    name: "Core Dao",
    id: DAO_CHAIN_ID,
    icon: "/assets/images/core.svg",
    disableIcon: "/assets/images/core_disabled.svg",
    currency: "CORE",
    networkName: NETWORK_NAME_MAPPINGS[DAO_CHAIN_ID],
    details: {
      chainId: `0x${(+DAO_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[DAO_CHAIN_ID],
      nativeCurrency: {
        name: "CORE",
        symbol: "CORE",
        decimals: 18,
      },
      rpcUrls: [DAO_NETWORK_RPC_URL],
      blockExplorerUrls: [DAOSCAN_URL],
    },
  },
  [OKX_CHAIN_ID]: {
    name: "X Layer",
    id: OKX_CHAIN_ID,
    icon: "/assets/images/okx.svg",
    disableIcon: "/assets/images/okx.svg",
    currency: "OKB",
    networkName: NETWORK_NAME_MAPPINGS[OKX_CHAIN_ID],
    details: {
      chainId: `0x${(+OKX_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[OKX_CHAIN_ID],
      nativeCurrency: {
        name: "OKB",
        symbol: "OKB",
        decimals: 18,
      },
      rpcUrls: [OKX_NETWORK_RPC_URL],
      blockExplorerUrls: [OKXSCAN_URL],
    },
  },
  [ZKSYNC_CHAIN_ID]: {
    name: "zkSync",
    id: ZKSYNC_CHAIN_ID,
    icon: "/assets/images/zksync.svg",
    disableIcon: "/assets/images/zksync.svg",
    currency: "ETH",
    networkName: NETWORK_NAME_MAPPINGS[ZKSYNC_CHAIN_ID],
    details: {
      chainId: `0x${(+ZKSYNC_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[ZKSYNC_CHAIN_ID],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [ZKSYNC_NETWORK_RPC_URL],
      blockExplorerUrls: [ZKSYNCSCAN_URL],
    },
  },
  [LINEA_CHAIN_ID]: {
    name: "linea",
    id: LINEA_CHAIN_ID,
    icon: "/assets/images/linea.svg",
    disableIcon: "/assets/images/linea.svg",
    currency: "ETH",
    networkName: NETWORK_NAME_MAPPINGS[LINEA_CHAIN_ID],
    details: {
      chainId: `0x${(+LINEA_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[LINEA_CHAIN_ID],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [LINEA_NETWORK_RPC_URL],
      blockExplorerUrls: [LINEASCAN_URL],
    },
  },
  [BLAST_CHAIN_ID]: {
    name: "blast",
    id: BLAST_CHAIN_ID,
    icon: "/assets/images/blast.svg",
    disableIcon: "/assets/images/blast.svg",
    currency: "ETH",
    networkName: NETWORK_NAME_MAPPINGS[BLAST_CHAIN_ID],
    details: {
      chainId: `0x${(+BLAST_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[BLAST_CHAIN_ID],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [BLAST_NETWORK_RPC_URL],
      blockExplorerUrls: [BLASTSCAN_URL],
    },
  },
  [BERA_CHAIN_ID]: {
    name: "Berachain",
    id: BERA_CHAIN_ID,
    icon: "/assets/images/bera.png",
    disableIcon: "/assets/images/bera-disable.png",
    currency: "HNY",
    networkName: NETWORK_NAME_MAPPINGS[BERA_CHAIN_ID],
    details: {
      chainId: `0x${(+BERA_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[BERA_CHAIN_ID],
      nativeCurrency: {
        name: "Honey",
        symbol: "HNY",
        decimals: 18,
      },
      rpcUrls: [BERA_NETWORK_RPC_URL],
      blockExplorerUrls: [BERA_SCAN_URL],
    },
  },
  [SONIC_CHAIN_ID]: {
    name: "sonic",
    id: SONIC_CHAIN_ID,
    icon: "/assets/images/sonic-disable.svg",
    disableIcon: "/assets/images/sonic.svg",
    currency: "S",
    networkName: NETWORK_NAME_MAPPINGS[SONIC_CHAIN_ID],
    details: {
      chainId: `0x${(+SONIC_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[SONIC_CHAIN_ID],
      nativeCurrency: {
        name: "S",
        symbol: "S",
        decimals: 18,
      },
      rpcUrls: [SONIC_NETWORK_RPC_URL],
      blockExplorerUrls: [SONICSCAN_URL],
    },
  },
};

interface BasicChainInformation {
  urls: string[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: any['nativeCurrency']
  blockExplorerUrls: any['blockExplorerUrls']
}

type ChainConfig = { [chainId: string]: BasicChainInformation | ExtendedChainInformation }

export const MAINNET_CHAINS: ChainConfig = {
  [ETH_CHAIN_ID]: {
    name: "Ethereum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    urls: [ETH_NETWORK_RPC_URL],
    blockExplorerUrls: [ETHERSCAN_URL],
  },
  [BSC_CHAIN_ID]: {
    name: "BSC Mainnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    urls: [BSC_NETWORK_RPC_URL],
    blockExplorerUrls: [BCSSCAN_URL],
  },
  [POLYGON_CHAIN_ID]: {
    name: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    urls: [POLYGON_NETWORK_RPC_URL],
    blockExplorerUrls: [POLYGONSCAN_URL],
  },
  [AVALANCHE_CHAIN_ID]: {
    name: "Avalanche",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    urls: [AVALANCHE_NETWORK_RPC_URL],
    blockExplorerUrls: [AVALANCHESCAN_URL],
  },
  [ARBITRUM_CHAIN_ID]: {
    name: "Arbitrum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    urls: [ARBITRUM_NETWORK_RPC_URL],
    blockExplorerUrls: [ARBITRUMSCAN_URL],
  },
  [BASE_CHAIN_ID]: {
    name: "Base",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    urls: [BASE_NETWORK_RPC_URL],
    blockExplorerUrls: [BASESCAN_URL],
  },
  [DAO_CHAIN_ID]: {
    name: "Dao",
    nativeCurrency: {
      name: "CORE",
      symbol: "CORE",
      decimals: 18,
    },
    urls: [DAO_NETWORK_RPC_URL],
    blockExplorerUrls: [DAOSCAN_URL],
  },
  [OKX_CHAIN_ID]: {
    name: "X Layer",
    nativeCurrency: {
      name: "OKB",
      symbol: "OKB",
      decimals: 18,
    },
    urls: [OKX_NETWORK_RPC_URL],
    blockExplorerUrls: [OKXSCAN_URL],
  },
  [ZKSYNC_CHAIN_ID]: {
    name: "zkSync",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    urls: [ZKSYNC_NETWORK_RPC_URL],
    blockExplorerUrls: [ZKSYNCSCAN_URL],
  },
  [LINEA_CHAIN_ID]: {
    name: "linea",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    urls: [LINEA_NETWORK_RPC_URL],
    blockExplorerUrls: [LINEASCAN_URL],
  },
  [BLAST_CHAIN_ID]: {
    name: "blast",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    urls: [BLAST_NETWORK_RPC_URL],
    blockExplorerUrls: [BLASTSCAN_URL],
  },
  [BERA_CHAIN_ID]: {
    name: "Berachain",
    nativeCurrency: {
      name: "HONEY",
      symbol: "HNY",
      decimals: 18,
    },
    urls: [BERA_NETWORK_RPC_URL],
    blockExplorerUrls: [BERA_SCAN_URL],
  },
  [SONIC_CHAIN_ID]: {
    name: "sonic",
    nativeCurrency: {
      name: "S",
      symbol: "S",
      decimals: 18,
    },
    urls: [SONIC_NETWORK_RPC_URL],
    blockExplorerUrls: [SONICSCAN_URL],
  },
}
