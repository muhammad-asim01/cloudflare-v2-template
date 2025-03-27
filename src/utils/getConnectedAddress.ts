import { WalletConnectionState } from "@/store/slices/walletSlice";
import configureStore from "../store/configureStore";

export const getConnectedAddress = () => {
  const currentWallet = configureStore().store.getState().wallet.walletAddress;
  return currentWallet;

  // let currentWallet : any = null;
  // const walletsInfo = configureStore().store.getState().wallet.entities;

  // if (walletsInfo) {
  //   let isFound = false;

  //   Object.keys(walletsInfo).forEach((key) => {
  //     const wallet = walletsInfo[key];
  //     console.log({wallet})

  //     if (
  //       wallet.addresses.length > 0 &&
  //       wallet.connectionState === WalletConnectionState.CONNECTED &&
  //       !isFound
  //     ) {
  //       isFound = true;
  //       currentWallet = wallet.addresses[0];
  //     }
  //   });
  // }
};
