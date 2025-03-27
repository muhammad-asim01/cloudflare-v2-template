import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  settingAppNetwork,
  NetworkUpdateType,
} from "@/store/slices/appNetworkSlice";
import { WalletInfo } from "../../../../constants/connectors";
import { NetworkInfo } from "../../../../constants/network";
import { HeaderContext, HeaderContextType } from "../context/HeaderContext";


interface ConnectWalletBoxPropsType {
  appNetwork?: NetworkInfo;
  wallet?: WalletInfo;
  isAppNetwork?: boolean;
  handleProviderChosen?:any;
  connectWalletLoading?: boolean;
  walletName?: (string | undefined)[];
  forceEnable?: boolean;
  handleClose?: () => void;
  isSwitchNetwork?: boolean;
}
import styleDialog from '@/styles/commonmodal.module.scss'
import Image from "next/image";

const ConnectWalletBox: React.FC<ConnectWalletBoxPropsType> = (
  props: ConnectWalletBoxPropsType
) => {
  const dispatch = useDispatch();

  const {
    appNetwork,
    isAppNetwork = false,
    // handleProviderChosen,
    wallet,
    walletName,
    connectWalletLoading,
    forceEnable,
    handleClose,
    isSwitchNetwork = false,
  } = props;
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const { agreedTerms } = useContext<HeaderContextType>(HeaderContext);

  const handleNetworkChange = (
    appNetwork: boolean,
    updatedVal: string,
    agreedTerms: boolean = false
  ) => {
    if (agreedTerms || forceEnable) {
      if (appNetwork) {
        dispatch(settingAppNetwork({
          networkType:
          NetworkUpdateType.App, updatedVal}));
        handleClose && handleClose();
        return;
      }

      // wallet &&
      //   handleProviderChosen &&
      //   handleProviderChosen(
      //     wallet.name,
      //     wallet.connector
      //   );
    }
  };

  const pointerStyle = {
    cursor: `${agreedTerms || forceEnable ? "pointer" : "initial"}`,
  };

  const render = () => {
    if (appNetwork) {
      const { name, icon, id, disableIcon } = appNetwork;
      const temporaryDisable = name === "OKXL-2 (Coming Soon)";//name === APP_NETWORKS_NAME.BSC;

      return (
        <div
          className={`${appChainID === id && styleDialog.activeNetwork} ${
            isSwitchNetwork ? styleDialog.walletBox : styleDialog.networkBox
          }`}
          onClick={() => {
            !temporaryDisable &&
              handleNetworkChange(isAppNetwork, id as string, agreedTerms);
          }}
          style={pointerStyle}
        >
          <div className={styleDialog.walletBoxIconWrap}>
            {
              <Image
              width={28}
              height={28}
                src={`${
                  (agreedTerms || forceEnable) && !temporaryDisable
                    ? icon
                    : disableIcon
                }`}
                alt={name}
              />
            }
            {appChainID === id && isSwitchNetwork && (
              <Image
              width={24}
              height={24}
                alt=""
                src={`/assets/images/icons/checked.svg`}
                style={{ color: "#212a3b" }}
                className={styleDialog.walletBoxCheck}
              />
            )}
          </div>
          <p className={styleDialog.walletBoxText}>{name}</p>
        </div>
      );
    }

    if (wallet) {
      const { name, icon, disableIcon } = wallet;
      const selectingWallet = walletName && walletName.indexOf(name) >= 0;

      return (
        <div
          className={`${styleDialog.walletBox} ${
            selectingWallet && styleDialog.activeNetwork
          }`}
          onClick={() => {
            const ua = navigator.userAgent
            const isIOS = /iphone|ipad|ipod|ios|Mac/i.test(ua)
            const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua)
            const isMobile = isIOS || isAndroid
            if (isMobile && wallet?.deepLink && !window.ethereum) {
              window.open(wallet.deepLink);
              return;
            }
            handleNetworkChange(isAppNetwork, name, agreedTerms);
          }}
          style={pointerStyle}
        >
          <div className={styleDialog.walletBoxIconWrap}>
            {connectWalletLoading && selectingWallet && agreedTerms ? (
              <Image
              alt=""
              width={24}
              height={24}
                className={styleDialog.loadingAnimation}
                src="/assets/images/loading-v3.svg"
              />
            ) : (
              <Image
              width={24}
              height={24}
               src={`${agreedTerms ? icon : disableIcon}`} alt={name} />
            )}
          </div>
          <p className={styleDialog.walletBoxText}>{name}</p>
        </div>
      );
    }

    return null;
  };

  return render();
};

export default ConnectWalletBox;
