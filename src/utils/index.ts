import BigNumber from 'bignumber.js';
import _ from 'lodash';
import {ADMIN_URL_PREFIX, API_URL_PREFIX, ETHERSCAN_BASE_URL, IMAGE_URL_PREFIX, NETWORK_AVAILABLE} from "../constants";
import axios from "axios";
import { termsData } from '../constants/term';
import { CLAIM_NETWORK_NAME_MAPPINGS, CLAIM_TEST_NETWORK_NAME_MAPPINGS } from '../constants/network';
import { v4 as uuidv4 } from "uuid";


export function formatPrecisionAmount(amount: any, precision: number = 18): string {
  const rawValue = new BigNumber(`${amount}`).toFixed(precision);
  return (amount && parseFloat(amount) !== Infinity) ? new BigNumber(rawValue).toFormat() : '0';
}

export const routeWithPrefix = (prefix = ADMIN_URL_PREFIX, url = '') => {
  const truncateUrl = _.trim(url, '/');
  return `/${prefix}/${truncateUrl}`;
};

export const adminRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${ADMIN_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const publicRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${truncateUrl}`;
  return resUrl;
};

export const checkIsAdminRoute = (pathname: string) => {
  return (pathname.indexOf(`/${ADMIN_URL_PREFIX}`) !== -1) || (pathname === '/dashboard/login');
};

export const checkIsLoginRoute = (pathname: string) => {
  return pathname.indexOf(`/login`) !== -1;
};

export const checkIsInvestorRoute = (pathname: string) => {
  return (pathname.indexOf(`/buy-token`) !== -1) ||  (pathname === '/login');
};

export const apiRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${API_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const imageRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/${IMAGE_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const etherscanRoute = (address = '', poolDetail: any = null) => {
  let network = '';
  if (poolDetail) {
    switch (poolDetail.network_available) {
      case NETWORK_AVAILABLE.BSC:
        network = process.env.NEXT_PUBLIC_BSC_CHAIN_ID + '';
        break;

      case NETWORK_AVAILABLE.POLYGON:
        network = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID + '';
        break;

      case NETWORK_AVAILABLE.ETH:
        network = process.env.NEXT_PUBLIC_ETH_CHAIN_ID + '';
        break;
    }
  }

  const networkId = network || localStorage.getItem('NETWORK_ID') || process.env.NEXT_PUBLIC_ETH_CHAIN_ID || '1';
  const baseUrl = ETHERSCAN_BASE_URL[networkId];
  const truncateUrl = _.trim(address, '/');
  const resUrl = `${baseUrl}/${truncateUrl}`;
  return resUrl;
};

export const etherscanAddressRoute = (address = '', poolDetail: any = null) => {
  return etherscanRoute(`address/${address}`, poolDetail);
};

export const etherscanTransactionRoute = (address = '', poolDetail: any = null) => {
  return etherscanRoute(`tx/${address}`, poolDetail);
};

export const getTransactionRowType = (transaction: any) => {
  if (transaction?.type === 'Refund') {
    return 'Refund';
  }
  if (transaction?.type === 'TokenClaimed') {
    return 'Claim';
  }
  return 'Buy';
};

export const fixGasLimit = (type = 'deposit') => {
  let overrides = {};
  if (process.env.NODE_ENV !== 'production') {
    if (type == 'deposit') {
      overrides = {
        gasLimit: 200000,
        gasPrice: 10000000000,
      };
    } else if (type == 'approve') {
      overrides = {
        gasLimit: 500000,
        gasPrice: 50000000000,
      };
    } else if (type == 'claim') {
      overrides = {
        gasLimit: 200000,
        gasPrice: 10000000000,
      };
    } else if (type == 'buy') {
      overrides = {
        gasLimit: 500000,
        gasPrice: 10000000000,
      };
    }
  }

  return overrides;
};

export const fixGasLimitWithProvider = () => {
  const overrides = {};
  return overrides;
};

export const paginationArray = (array: any, page_number: any, page_size: any) => {
  const newData = JSON.parse(JSON.stringify(array));
  const pageData = newData.slice((page_number - 1) * page_size, page_number * page_size);
  const dataLength = newData.length;
  return {
    data: pageData,
    total: dataLength,
    perPage: page_size,
    lastPage: Math.ceil(dataLength / page_size),
    page: page_number,
  };
};

export const shortenAddress = (address: string, digits: number = 4) => {
  return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`
};

export function formatDecimal(num: BigNumber, tokenDecimal: number) {
  const decimalCount = new BigNumber(num).isInteger()
    ? 0
    : new BigNumber(num).toString().split(".")[1].length;
  const precision = decimalCount > tokenDecimal ? tokenDecimal : decimalCount;
  return new BigNumber(num).toFixed(precision).replace(/\.0+$/, "");
}

export function isValidTonAddress(source: string): boolean {
  if (source.length !== 48) {
    return false;
  }

  if (!/[A-Za-z0-9+/_-]+/.test(source)) {
    return false;
  }

  return true;
}

export async function getUserCountryCode() {
  const apikey = process.env.NEXT_PUBLIC_GEO_LOCATION_API_KEY || "";
  try {
    const data = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${apikey}`
    );
    return data.data?.country_code3;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function isVpn() {
  const apikey = process.env.NEXT_PUBLIC_GEO_LOCATION_API_KEY || "";
  try {
    const data = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${apikey}&include=security`
    );
    return data?.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const validateJson = (input: any) => {
  try {
    JSON.parse(input);
    return true;
  } catch (error) {
    console.log("🚀 ~ validateJson ~ error:", error)
    return false;
  }
};

export function base64Encode(data: any) {
  return btoa(unescape(encodeURIComponent(data)));
}

export const termsMessage = termsData
  .map((term) => `\n${term.heading}\n\n${term.paragraph}`)
  .join("\n");

  export function getCookie(name: any) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
    return null;
  }
  
  export const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  };

  export const clearSpecificCookies = (cookieNames: string[]) => {
    cookieNames.forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };
  
  export const clearAllCookies = () => {
      const cookies = document.cookie.split(";");
  
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
  };

  export function getChainIDByName(chainName: string): string | null {
    const chainID = process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? Object.keys(CLAIM_TEST_NETWORK_NAME_MAPPINGS).find(
      (key) => CLAIM_TEST_NETWORK_NAME_MAPPINGS[key] === chainName
    ) : Object.keys(CLAIM_NETWORK_NAME_MAPPINGS).find(
      (key) => CLAIM_NETWORK_NAME_MAPPINGS[key] === chainName
    );
    return chainID || null;
  }

  export function formatDecimalNumber(value : any) {
    const stringValue = value.toString();
    const decimalIndex = stringValue.indexOf('.');
    
    if (decimalIndex === -1) {
      return value;
    }
  
    const decimalPlaces = stringValue.length - decimalIndex - 1;
  
    if (decimalPlaces > 3) {
      return stringValue.substring(0, decimalIndex + 4);
    }
  
    return value;
  }

  export const generateRandomString = () => {
    const randomBytes = uuidv4();
    return randomBytes;
  };

  export const isValidImageUrl = (url: string): boolean => {
    // Check if the url is a string
    if (typeof url !== 'string') {
      return false;
    }
  
    // Check if the url starts with any of the specified prefixes
    return (
      url.startsWith('/') ||
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('/_next/static/media/')
    );
  };

  export const formatImageUrl = (url) => {
  
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/_next/static/media/")
    ) {
      return url;
    }
  
    return url.startsWith("/") ? url : `/${url}`;
  };
  