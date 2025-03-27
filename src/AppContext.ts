"use client";

import { createContext, Dispatch, SetStateAction } from 'react';

export type AppContextType = {
  binanceAvailable: boolean,
  handleProviderChosen?: (name: string, connector: any) => void,
  connectWalletLoading?: boolean,
  currentConnector?: any | undefined,
  walletName?: (string | undefined)[],
  setWalletName?: Dispatch<SetStateAction<(string | undefined)[]>>,
  setLoginError?: (name: string) => void,
  loginError?: string,
  appNetworkLoading?: boolean,
  handleConnectorDisconnect?: () => void,
  logout?: () => void,
  setCurrentConnectedWallet?: Dispatch<SetStateAction<any>>,
  currentConnectedWallet?: any,
  openConnectWallet?: boolean
  setOpenConnectWallet?: Dispatch<SetStateAction<boolean>>,
  openEnterRefCode?: boolean
  setOpenEnterRefCode?: Dispatch<SetStateAction<boolean>>,
}

export const AppContext = createContext<AppContextType>({
  binanceAvailable: false,
})
