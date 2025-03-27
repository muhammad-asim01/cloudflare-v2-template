import { SOLANA_CONNECT_WALLET, SOLANA_DISCONNECT_WALLET, SOLANA_SET_WALLET_ADDRESS, SOLANA_LOGOUT } from '../constants/solana-wallet';

export const solanaConnectWallet = () => ({
  type: SOLANA_CONNECT_WALLET,
});

export const solanaDisconnectWallet = () => ({
  type: SOLANA_DISCONNECT_WALLET,
});

export const solanaSetWalletAddress = (address : string) => ({
  type: SOLANA_SET_WALLET_ADDRESS,
  payload: address,
});

export const solanaLogout = () => ({
  type: SOLANA_LOGOUT,
});