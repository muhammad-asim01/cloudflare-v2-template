import {ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, BASE_CHAIN_ID, DAO_CHAIN_ID, OKX_CHAIN_ID, ZKSYNC_CHAIN_ID, ZKSYNCSCAN_URL, OKXSCAN_URL, DAOSCAN_URL, BASESCAN_URL, LINEA_CHAIN_ID, LINEASCAN_URL, BLAST_CHAIN_ID, BLASTSCAN_URL, BERA_CHAIN_ID} from '../constants/network';
import {NETWORK_AVAILABLE} from "../constants";

const ETHERSCAN_URL = process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL || "";
const BSCSCAN_URL = process.env.NEXT_PUBLIC_BSCSCAN_BASE_URL || "";
const POLSCAN_URL = process.env.NEXT_PUBLIC_POLSCAN_BASE_URL || "";
const BERA_SCAN_URL = process.env.NEXT_PUBLIC_BERA_SCAN_BASE_URL || "";


// chain integration
export const getEtherscanName = ({networkAvailable}: any) => {
  switch (networkAvailable) {
    case NETWORK_AVAILABLE.BSC:
      return 'Bscscan';

      case NETWORK_AVAILABLE.POLYGON:
      return 'Polygonscan';

      case NETWORK_AVAILABLE.BASE:
      return 'Basescan';

      case NETWORK_AVAILABLE.DAO:
      return 'Daoscan';

      case NETWORK_AVAILABLE.OKX:
      return 'xlayerscan';
      
      case NETWORK_AVAILABLE.ZKSYNC:
      return 'zkSync';

      case NETWORK_AVAILABLE.LINEA:
      return 'linea';

      case NETWORK_AVAILABLE.BLAST:
      return 'blast';

      case NETWORK_AVAILABLE.BERA:
        return "bera";

      case NETWORK_AVAILABLE.ETH:
    default:
      return 'Etherscan';
  }
};

export const getEtherscanTransactionLink = ({ appChainID, transactionHash }: any) => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return `${BSCSCAN_URL}/tx/${transactionHash}`;

    case POLYGON_CHAIN_ID:
      return `${POLSCAN_URL}/tx/${transactionHash}`;

      case BASE_CHAIN_ID:
        return `${BASESCAN_URL}/tx/${transactionHash}`;
  
      case DAO_CHAIN_ID:
        return `${DAOSCAN_URL}/tx/${transactionHash}`;
  
        case OKX_CHAIN_ID:
        return `${OKXSCAN_URL}/tx/${transactionHash}`;
        
      case ZKSYNC_CHAIN_ID:
        return `${ZKSYNCSCAN_URL}/tx/${transactionHash}`;

      case LINEA_CHAIN_ID:
        return `${LINEASCAN_URL}/tx/${transactionHash}`;

      case BLAST_CHAIN_ID:
        return `${BLASTSCAN_URL}/tx/${transactionHash}`;

        case BERA_CHAIN_ID:
          return `${BERA_SCAN_URL}/tx/${transactionHash}`;

    case ETH_CHAIN_ID:
    default:
      return `${ETHERSCAN_URL}/tx/${transactionHash}`;
  }
};

export const getEtherscanTransactionAddress = ({ appChainID, address }: any) => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return `${BSCSCAN_URL}/address/${address}`;

    case POLYGON_CHAIN_ID:
      return `${POLSCAN_URL}/address/${address}`;

      case BASE_CHAIN_ID:
      return `${BASESCAN_URL}/address/${address}`;

      case DAO_CHAIN_ID:
      return `${DAOSCAN_URL}/address/${address}`;

      case OKX_CHAIN_ID:
      return `${OKXSCAN_URL}/address/${address}`;
      
    case ZKSYNC_CHAIN_ID:
      return `${ZKSYNCSCAN_URL}/address/${address}`;

    case LINEA_CHAIN_ID:
      return `${LINEASCAN_URL}/address/${address}`;

    case BLAST_CHAIN_ID:
      return `${BLASTSCAN_URL}/address/${address}`;

      case BERA_CHAIN_ID:
      return `${BERA_SCAN_URL}/address/${address}`;

    case ETH_CHAIN_ID:
    default:
      return `${ETHERSCAN_URL}/address/${address}`;
  }
};

// chain integration
export const getAppNetWork = (appChainID: any) => {
  switch (appChainID) {
    case BSC_CHAIN_ID:
      return 'bsc';

    case POLYGON_CHAIN_ID:
      return 'polygon';

      case BASE_CHAIN_ID:
      return 'base';

      case DAO_CHAIN_ID:
      return 'coredao';

      case OKX_CHAIN_ID:
      return 'xlayer';

      case ZKSYNC_CHAIN_ID:
        return 'zksync';

      case LINEA_CHAIN_ID:
        return 'linea';

      case BLAST_CHAIN_ID:
        return 'blast';

    case ETH_CHAIN_ID:
      return 'eth';

      case BERA_CHAIN_ID:
        return 'bera';
  }
};
