import { NETWORK } from "@/constants";

// chain integration
export const getCurrencyDetails = (
  networkAvailable: string,
  acceptCurrency: string
) => {
  let decimals = 6;
  const isBSC = networkAvailable === NETWORK.BSC;
  const isBase = networkAvailable === NETWORK.BASE;

  if (isBSC) {
    if (
      acceptCurrency === "ETH" ||
      acceptCurrency === "BUSD" ||
      acceptCurrency === "USDT" ||
      acceptCurrency === "USDC"
    ) {
      decimals = 18;
    }
  }  else if (isBase) {
      if (acceptCurrency === "USDT") {
        decimals = 18;
      } else if (acceptCurrency === "USDC") {
        decimals = 6;
      }
    } else {
    if (acceptCurrency === "ETH") {
      decimals = 18;
    } else if (acceptCurrency === "USDT" || acceptCurrency === "USDC") {
      decimals = 6;
    } else if (acceptCurrency === "WETH") {
      decimals = 18;
    }
    else if (acceptCurrency === "HONEY") {
      decimals = 18;
    }
  }

  let buyCurr = "ETH"; 

  switch (networkAvailable) {
    case NETWORK.BSC:
      if (acceptCurrency === "BUSD") {
        buyCurr = process.env.NEXT_PUBLIC_BUSD_BSC_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_BSC_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_BSC_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.POLYGON:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_POLYGON_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_POLYGON_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.AVALANCHE:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_AVALANCHE_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_AVALANCHE_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.ARBITRUM:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_ARBITRUM_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_ARBITRUM_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.ETHEREUM:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.ZKSYNC:
      if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_ZKSYNC_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.BASE:
      if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_BASE_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.DAO:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_DAO_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_DAO_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.OKX:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_OKX_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_OKX_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.LINEA:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_LINEA_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_LINEA_SMART_CONTRACT || "";
      }
      break;

    case NETWORK.BLAST:
      if (acceptCurrency === "WETH") {
        buyCurr = process.env.NEXT_PUBLIC_WETH_BLAST_SMART_CONTRACT || "";
      }
      break;
      case NETWORK.BERA:
      if (acceptCurrency === "HONEY") {
        buyCurr = process.env.NEXT_PUBLIC_HNY_SMART_CONTRACT || "";
      }
      break;

      case NETWORK.SONIC:
      if (acceptCurrency === "USDT") {
        buyCurr = process.env.NEXT_PUBLIC_USDT_SONIC_SMART_CONTRACT || "";
      } else if (acceptCurrency === "USDC") {
        buyCurr = process.env.NEXT_PUBLIC_USDC_SONIC_SMART_CONTRACT || "";
      }
      break;

    default:
      break;
  }

  return { decimals, buyCurr };
};
