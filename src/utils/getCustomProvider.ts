import {
  mainnet,
  sepolia,
  arbitrum,
  bsc,
  optimism,
  polygon,
  bscTestnet,
  avalanche,
} from 'wagmi/chains'

import { ethers } from "ethers"

export const getChainName = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
    case sepolia.id:
      return 'ethereum-chain'
    case bsc.id:
      return 'bsc-mainnet-chain'
    case bscTestnet.id:
      return 'bsc-testnet-chain'
    case polygon.id:
      return 'polygon-chain'
    case avalanche.id:
      return 'avalanche-chain'
    case optimism.id:
      return 'optimism-chain'
    case arbitrum.id:
      return 'arbitrum-chain'
    default:
      return 'ethereum-chain'
  }
}

export const getChainNameDapRaddar = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
    case sepolia.id:
      return 'ethereum'
    case bsc.id:
      return 'binance-smart-chain'
    case bscTestnet.id:
      return 'bsc-testnet-chain'
    case polygon.id:
      return 'polygon'
    case avalanche.id:
      return 'avalanche'
    case optimism.id:
      return 'optimism'
    case arbitrum.id:
      return 'arbitrum'
    default:
      return 'ethereum'
  }
}

export const getCustomProvider = async(connector: any) => {
  let provider;
  if(window.ethereum){
    provider = new ethers.providers.Web3Provider(window.ethereum);

  } else {
    const connectorProvider = await connector?.getProvider();
    provider = new ethers.providers.Web3Provider(connectorProvider);
  }

  return provider
}
