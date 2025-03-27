export const TRANSACTION_ERROR =
  "Transaction failed. Please check blockchain to know more error.";
export const API_URL_PREFIX = "user";
export const ADMIN_URL_PREFIX = "dashboard";
export const IMAGE_URL_PREFIX = "image";
export const MAX_BUY_CAMPAIGN = 1000;
export const WHITELIST_LINK = "https://forms.gle/HiQkhaRM8mujeryq8";
export const INSTRUCTION_WHITELIST_LINK =
  "https://medium.com/polkafoundry/nftify-whitelist-on-red-kite-launchpad-on-june-4-2021-26cd4b8ebc8d";
export const APPLY_TO_LAUNCH_URL = "https://url.chaingpt.org/Apply";
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const BASE_IMAGE_URL = "https://static.pad.chaingpt.org/s3-root"

export const POOL_STATUS = {
  TBA: 0,
  UPCOMING: 1,
  JOINING: 2,
  IN_PROGRESS: 3,
  FILLED: 4,
  CLOSED: 5,
  CLAIMABLE: 6,
};
export const POOL_STATUS_TEXT = {
  [POOL_STATUS.TBA]: "TBA",
  [POOL_STATUS.UPCOMING]: "Upcoming",
  [POOL_STATUS.FILLED]: "Filled",
  [POOL_STATUS.IN_PROGRESS]: "Swap",
  [POOL_STATUS.CLAIMABLE]: "Claimable",
  [POOL_STATUS.CLOSED]: "Ended",
};

// chain integration
export const NULL_AMOUNT = "N/A";
export const POOL_STATUS_JOINED = {
  // Pool Status for User Joined Pool (Version 3)
  NONE: "NONE",
  APPLIED_WHITELIST: "APPLIED_WHITELIST",
  WIN_WHITELIST: "WIN_WHITELIST",
  NOT_WIN_WHITELIST: "NOT_WIN_WHITELIST",
  CANCELED_WHITELIST: "CANCELED_WHITELIST",
  SWAPPING: "SWAPPING",
  CLAIMABLE: "CLAIMABLE",
  COMPLETED: "COMPLETED",
};

export const NETWORK = {
  ETHEREUM: "eth",
  BSC: "bsc",
  POLYGON: "polygon",
  SOLANA: "solana",
  TERRA: "terra",
  FANTOM: "fantom",
  AVALANCHE: "avalanche",
  ARBITRUM: "arbitrum",
  BASE: "base",
  DAO: "coredao",
  OKX: "xlayer",
  ZKSYNC: "zksync",
  LINEA: "linea",
  BLAST: "blast",
  BERA: "bera",
  SONIC: "sonic",
};
export const NETWORK_TEXT = {
  [NETWORK.ETHEREUM]: "Ethereum",
  [NETWORK.BSC]: "Binance Smart Chain",
  [NETWORK.POLYGON]: "Polygon",
  [NETWORK.SOLANA]: "Solana",
  [NETWORK.TERRA]: "Terra",
  [NETWORK.FANTOM]: "Fantom",
  [NETWORK.AVALANCHE]: "Avalanche",
  [NETWORK.ARBITRUM]: "Arbitrum",
  [NETWORK.BASE]: "Base",
  [NETWORK.DAO]: "Core Dao",
  [NETWORK.OKX]: "X Layer",
  [NETWORK.ZKSYNC]: "zkSync",
  [NETWORK.LINEA]: "LINEA",
  [NETWORK.BLAST]: "BLAST",
  [NETWORK.BERA]: "bera",
  [NETWORK.SONIC]: "sonic",
};
export const NETWORK_TEXT_SHORT = {
  [NETWORK.ETHEREUM]: "ETH",
  [NETWORK.BSC]: "BSC",
  [NETWORK.POLYGON]: "MATIC",
  [NETWORK.SOLANA]: "SOL",
  [NETWORK.TERRA]: "LUNA",
  [NETWORK.FANTOM]: "FTM",
  [NETWORK.AVALANCHE]: "AVAX",
  [NETWORK.ARBITRUM]: "ARBI",
  [NETWORK.BASE]: "BASE",
  [NETWORK.DAO]: "Dao",
  [NETWORK.OKX]: "X Layer",
  [NETWORK.ZKSYNC]: "zkSync",
  [NETWORK.LINEA]: "LINEA",
  [NETWORK.BLAST]: "BLAST",
  [NETWORK.BERA]: "bera",
  [NETWORK.SONIC]: "sonic",
};
export const NETWORK_SRC_ICON = {
  [NETWORK.ETHEREUM]: "/assets/images/network/ETH.svg",
  [NETWORK.BSC]: "/assets/images/network/BSC.svg",
  [NETWORK.POLYGON]: "/assets/images/network/polygon.svg",
  [NETWORK.SOLANA]: "/assets/images/network/solana.svg",
  [NETWORK.TERRA]: "/assets/images/network/terra.svg",
  [NETWORK.FANTOM]: "/assets/images/network/fantom.svg",
  [NETWORK.AVALANCHE]: "/assets/images/network/avalanche.svg",
  [NETWORK.ARBITRUM]: "/assets/images/network/arbitrum.svg",
  [NETWORK.BASE]: "/assets/images/network/base-logo-in-blue.svg",
  [NETWORK.DAO]: "/assets/images/core.svg",
  [NETWORK.OKX]: "/assets/images/okx.svg",
  [NETWORK.ZKSYNC]: "/assets/images/zksync.svg",
  [NETWORK.LINEA]: "/assets/images/linea.svg",
  [NETWORK.BLAST]: "/assets/images/linea.svg",
  [NETWORK.BERA]: "/assets/images/bera.png",
  [NETWORK.SONIC]: "/assets/images/sonic-disable.png"
};

export const ACCEPT_CURRENCY = {
  ETH: "eth",
  BUSD: "busd",
  USDT: "usdt",
  USDC: "usdc",
  HNY: "honey",

};

export const BUY_TYPE = {
  WHITELIST_LOTTERY: "whitelist",
  FCFS: "fcfs",
};

export const POOL_TYPE = {
  SWAP: "swap",
  CLAIMABLE: "claimable",
};
export const CLAIM_TYPE = {
  CLAIM_ON_LAUNCHPAD: "claim-on-launchpad",
  AIRDROP_TO_PARTICIPANTS_WALLETS: "airdrop-to-participants-wallet",
  CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD: "claim-a-part-of-tokens-on-launchpad",
  CLAIM_ON_THE_PROJECT_WEBSITE: "claim-on-the-project-website",
};
export const CLAIM_TYPE_TEXT = {
  [CLAIM_TYPE.CLAIM_ON_LAUNCHPAD]: "Claim on DegenPad",
  [CLAIM_TYPE.AIRDROP_TO_PARTICIPANTS_WALLETS]: `Airdrop to participants' wallets`,
  [CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD]:
    "Claim a part of tokens on DegenPad",
  [CLAIM_TYPE.CLAIM_ON_THE_PROJECT_WEBSITE]: "Claim on the project website",
};
export const CLAIM_TYPE_DESCRIPTION = {
  [CLAIM_TYPE.CLAIM_ON_LAUNCHPAD]:
    "You claim your purchased tokens via DegenPad Official Website.",
  [CLAIM_TYPE.AIRDROP_TO_PARTICIPANTS_WALLETS]: `The tokens will be airdropped straight to the wallet you used to swap tokens.`,
  [CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD]:
    "You can claim a portion of your tokens on DegenPad, and the rest will be claimed via the project website or vesting portal.",
  [CLAIM_TYPE.CLAIM_ON_THE_PROJECT_WEBSITE]:
    "Instead of the DegenPad website, 100% of tokens are claimed on the project website.",
};

export const PUBLIC_WINNER_STATUS = {
  PUBLIC: 1,
  PRIVATE: 0,
};
export const POOL_IS_PRIVATE = {
  PUBLIC: 0,
  PRIVATE: 1,
  SEED: 2,
  COMMUNITY: 3,
  EVENT: 4,
};

export const USER_STATUS = {
  UNVERIFIED: 0,
  ACTIVE: 1,
  BLOCKED: 2,
  DELETED: 3,
};

export const TOKEN_STAKE_SYMBOLS = {
  CGPT: "CGPT",
  LP_CGPT: "LP-CGPT",
};

export const TOKEN_STAKE_NAMES = {
  CGPT: "CGPT",
  LP_CGPT: "CGPT-ETH LP",
};

export const TIERS = [
  {
    name: "No tier",
    icon: "/assets/images/icons/no-tier.svg",
    bg: "/assets/images/icons/red-kite-bg.png",
    bgColor: "#d9d9d9",
  },
  {
    name: "Ape",
    bg: "/assets/images/icons/bronze-bg.png",
    bgColor: "#d9d9d9",
    icon: "/assets/images/icons/bronze.png",
  },
  {
    name: "Chad",
    bg: "/assets/images/icons/silver-bg.png",
    bgColor: "#d9d9d9",
    icon: "/assets/images/icons/silver.png",
  },
  {
    name: "Shark",
    bg: "/assets/images/icons/gold-bg.png",
    bgColor: "#d9d9d9",
    icon: "/assets/images/icons/gold.png",
  },
  {
    name: "Whale",
    bg: "/assets/images/icons/diamond-bg.png",
    bgColor: "",
    icon: "/assets/images/icons/diamond.png",
  },
];

export const TIER_LEVELS = {
  NONE: 0,
  BRONZE: 1,
  SLIVER: 2,
  GOLD: 3,
  DIAMOND: 4,
};

export const TIER_NAMES = {
  0: "--",
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Diamond",
};

export const KYC_STATUS = {
  INCOMPLETE: 0, // Blockpass verifications pending
  APPROVED: 1, // profile has been approved by Merchant
  RESUBMIT: 2, // Merchant has rejected one or more attributes
  WAITING: 3, // Merchant's review pending
  INREVIEW: 4, // in review by Merchant
};

export const GAS_LIMIT_CONFIGS = {
  APPROVE: "80000", // 46483
  DEPOSIT: "250000", // 195057
  CLAIM: "120000", // 81901
  APPROVE_SOTA_TOKEN: "200000",
  STAKE_SOTA_TIERS: "120000", // 79021
  UNSTAKE_SOTA_TIERS: "100000", // 72527
};

// chain integration
export const NETWORK_AVAILABLE = {
  ETH: "eth",
  BSC: "bsc",
  POLYGON: "polygon",
  AVALANCHE: "avalanche",
  ARBITRUM: "arbitrum",
  BASE: "base",
  DAO: "coredao",
  OKX: "xlayer",
  ZKSYNC: "zksync",
  LINEA: "linea",
  BLAST: "blast",
  BERA: "bera",
  SONIC: "sonic",
};

export const ETHERSCAN_BASE_URL: any = {
  "1": "https://etherscan.io",
  "4": "https://rinkeby.etherscan.io",
  "5": "https://goerli.etherscan.io",
  "56": "https://bscscan.com",
  "97": "https://testnet.bscscan.com",
  "137": "https://polygonscan.com",
  "80001": "https://mumbai.polygonscan.com/",
  "11155111": "https://sepolia.etherscan.io",
  "8453": "https://basescan.org",
  "84532": "https://sepolia.basescan.org/",
  "1115": "https://scan.test.btcs.network",
  "1116": "https://scan.test.btcs.network",
  "196": "https://www.okx.com/web3/explorer/xlayer",
  "195": "https://www.okx.com/web3/explorer/xlayer-test",
  "324": "https://explorer.zksync.io",
  "300": "https://sepolia.explorer.zksync.io",
  "59144":"https://lineascan.build",
  "59141":"https://sepolia.lineascan.build",
  "81457":"https://blastscan.io",
  "168587773":"https://sepolia.blastexplorer.io",
  "80084":"https://bartio.beratrail.io",
  "146":"https://sonicscan.org/",
  "57054":"https://testnet.sonicscan.org/",
};

export const REFUND_TOKEN_TYPE = {
  REFUND: "refund",
  CLAIM: "claim",
};

export const SOLANA_STEPS = {
  START: "start",
  CONNECT_METAMASK: "connect_metamask",
  CONNECT_PHANTOM: "connect_phantom",
  CONNECT_ACCOUNTS: "connect_accounts",
  COMPLETED: "completed",
  NONE: "none",
};

export const ENABLE_GIVEAWAY_FEATURE = false;
export const ENABLE_ALLOCATION_CALCULATOR = true

export const ENABLE_JSON = true
export const CUSTOM_NETWORK = true;
export const ENABLE_SOLANA_POOLS = true;
