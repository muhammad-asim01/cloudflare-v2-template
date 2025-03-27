import { APP_NETWORKS_NAME } from "@/constants/network";

const METAMASK_DEEPLINK = process.env.NEXT_PUBLIC_METAMASK_DEEPLINK;

export interface WalletInfo {
  connector: any;
  name: string;
  // iconName: string
  description: string;
  href: string | null;
  // color: string
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
  disableIcon: string;
  icon: string;
  deepLink?: string;
}

export enum ConnectorNames {
  MetaMask = "MetaMask",
  BSC = "Binance",
  WalletConnect = "WalletConnect",
  WalletConnectBsc = "WalletConnectBsc",
  WalletConnectPolygon = "WalletConnectPolygon",
}

export type connectorNames = Extract<
  ConnectorNames,
  ConnectorNames.MetaMask | ConnectorNames.BSC | ConnectorNames.WalletConnect
>;

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: "",
    name: ConnectorNames.MetaMask,
    icon: "/assets/images/icons/24x24/metamask.svg",
    disableIcon: "/assets/images/icons/24x24/metamask-disable.svg",
    description: "Easy-to-use browser extension.",
    href: null,
    mobile: true,
    deepLink: METAMASK_DEEPLINK,
  },
  WALLET_CONNECT: {
    connector: "walletConnect",
    name: ConnectorNames.WalletConnect,
    icon: "/assets/images/icons/24x24/walletconnect.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    disableIcon: "/assets/images/icons/24x24/walletconnect-disable.svg",
    href: null,
    mobile: true,
  },
  BSC_WALLET: {
    connector: "BinanceW3W",
    name: ConnectorNames.BSC,
    icon: "/assets/images/injected-binance.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    disableIcon: "/assets/images/injected-binance-disabled.svg",
    href: null,
  },
};

export const SUPPORTED_WALLETS_BSC: { [key: string]: WalletInfo } = {
  METAMASK: SUPPORTED_WALLETS.METAMASK,
  BSC_WALLET: SUPPORTED_WALLETS.BSC_WALLET,
  WALLET_CONNECT: {
    connector: "walletConnect",
    name: ConnectorNames.WalletConnect,
    icon: "/assets/images/icons/24x24/walletconnect.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    disableIcon: "/assets/images/icons/24x24/walletconnect-disable.svg",
    mobile: true,
    href: null,
  },
};

export const SUPPORTED_WALLETS_POLYGON: { [key: string]: WalletInfo } = {
  METAMASK: SUPPORTED_WALLETS.METAMASK,
  WALLET_CONNECT: {
    connector: "walletConnect",
    name: ConnectorNames.WalletConnect,
    icon: "/assets/images/icons/24x24/walletconnect.svg",
    mobile: true,
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    disableIcon: "/assets/images/icons/24x24/walletconnect-disable.svg",
    href: null,
  },
};

export const SUPPORTED_WALLETS_AVALANCHE: { [key: string]: WalletInfo } = {
  METAMASK: SUPPORTED_WALLETS.METAMASK,
  WALLET_CONNECT: {
    connector: "walletConnect",
    name: ConnectorNames.WalletConnect,
    icon: "/assets/images/icons/24x24/walletconnect.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    disableIcon: "/assets/images/icons/24x24/walletconnect-disable.svg",
    href: null,
    mobile: true,
  },
};

export const SUPPORTED_WALLETS_ARBITRUM: { [key: string]: WalletInfo } = {
  METAMASK: SUPPORTED_WALLETS.METAMASK,
};
export const SUPPORTED_WALLETS_BERA: { [key: string]: WalletInfo } = {
  METAMASK: SUPPORTED_WALLETS.METAMASK,
};

export const connectorsByName: { [key in ConnectorNames]: any } = {
  [ConnectorNames.MetaMask]: "metaMask",
  [ConnectorNames.BSC]: "bscWallet",
  [ConnectorNames.WalletConnect]: "walletConnect",
  [ConnectorNames.WalletConnectBsc]: "walletConnect",
  [ConnectorNames.WalletConnectPolygon]: "walletConnect",
};

export const connectorsSupportByNetwork: {
  [key: string]: { [key: string]: WalletInfo };
} = {
  [APP_NETWORKS_NAME.METAMASK]: SUPPORTED_WALLETS,
  [APP_NETWORKS_NAME.BSC]: SUPPORTED_WALLETS_BSC,
  [APP_NETWORKS_NAME.POLYGON]: SUPPORTED_WALLETS_POLYGON,
  [APP_NETWORKS_NAME.AVALANCHE]: SUPPORTED_WALLETS_AVALANCHE,
  [APP_NETWORKS_NAME.ARBITRUM]: SUPPORTED_WALLETS_ARBITRUM,
  [APP_NETWORKS_NAME.BERA]: SUPPORTED_WALLETS_BERA,
};
