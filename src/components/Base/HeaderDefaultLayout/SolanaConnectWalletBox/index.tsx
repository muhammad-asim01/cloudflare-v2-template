import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { WalletInfo } from "../../../../constants/connectors";
import { NetworkInfo } from "../../../../constants/network";
import { HeaderContext, HeaderContextType } from "../context/HeaderContext";
// import { MetaMask } from "@web3-react/metamask";
// import { WalletConnect } from "@web3-react/walletconnect-v2";
// import { BscWallet } from "../../../../connectors/BinanceWallet";

interface ConnectWalletBoxPropsType {
  appNetwork?: NetworkInfo;
  wallet?: WalletInfo;
  isAppNetwork?: boolean;
  handleProviderChosen?: (
    name: string,
    // connector: MetaMask | WalletConnect | BscWallet
  ) => void;
  connectWalletLoading?: boolean;
  walletName?: (string | undefined)[];
  forceEnable?: boolean;
  handleClose?: () => void;
  isSwitchNetwork?: boolean;
}

import styles from '@/styles/commonmodal.module.scss'
import Image from "next/image";

const SolanaConnectWalletBox: React.FC<ConnectWalletBoxPropsType> = (
  props: ConnectWalletBoxPropsType
) => {

  const {
    appNetwork,
    wallet,
    walletName,
    connectWalletLoading,
    forceEnable,
    isSwitchNetwork = false,
  } = props;
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const { agreedTerms } = useContext<HeaderContextType>(HeaderContext);

  const pointerStyle = {
    cursor: `${agreedTerms || forceEnable ? "pointer" : "initial"}`,
  };

  const render = () => {
    if (appNetwork) {
      const { name, id, disableIcon } = appNetwork;

      return (
        <div
          className={`${
            isSwitchNetwork ? styles.walletBox : styles.networkBox
          }`}
          style={pointerStyle}
        >
          <div className={styles.walletBoxIconWrap}>
            {<Image width={28} height={28} src={disableIcon} alt={name} />}
            {appChainID === id && isSwitchNetwork && (
              <Image width={24}
              height={24}
                alt=""
                src={`/assets/images/icons/checked.svg`}
                style={{ color: "#212a3b" }}
                className={styles.walletBoxCheck}
              />
            )}
          </div>
          <p className={styles.walletBoxText}>{name}</p>
        </div>
      );
    }

    if (wallet) {
      const { name, disableIcon } = wallet;
      const selectingWallet = walletName && walletName.indexOf(name) >= 0;

      return (
        <div className={`${styles.walletBox}`} style={pointerStyle}>
          <div className={styles.walletBoxIconWrap}>
            {connectWalletLoading && selectingWallet && agreedTerms ? (
              <Image
                className={styles.loadingAnimation}
                src="/assets/images/loading-v3.svg"
                alt=""
                width={24}
                height={24}
              />
            ) : (
              <Image src={disableIcon} alt={name} width={24}
              height={24} />
            )}
          </div>
          <p className={styles.walletBoxText}>{name}</p>
        </div>
      );
    }

    return null;
  };

  return render();
};

export default SolanaConnectWalletBox;
