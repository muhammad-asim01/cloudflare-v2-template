import { getConnectedAddress } from "./getConnectedAddress";

export const getConfigHeader = (walletAddress: string | null = null) => {
  if(!walletAddress) walletAddress = getConnectedAddress();

  return {
    headers: {
      Authorization:
        "Bearer " + localStorage.getItem(`access_token:${walletAddress}`),
    },
  };
};


export const getConfigAuthHeader = (walletAddress: string | null = null, message?: any) => {
  if(!walletAddress) walletAddress = getConnectedAddress();

  return {
    headers: {
      Authorization:
        "Bearer " + localStorage.getItem(`access_token:${walletAddress}`),
        ...(message ? {} : {msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,})
    },
  };
};

