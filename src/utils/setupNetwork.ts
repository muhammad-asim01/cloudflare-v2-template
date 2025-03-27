import { APP_NETWORKS_SUPPORT } from "../constants/network";
import { ConnectorNames } from "../constants/connectors";

export const requestSupportNetwork = async (
  chainId: string,
  walletName: string,
  connector?: any
) => {
  const provider =
    walletName === ConnectorNames.MetaMask
      ? (window as any).ethereum
      : walletName === ConnectorNames.BSC
      ? connector
      : (window as any).BinanceChain;
  if (provider) {
    try {
      const networkInfo = APP_NETWORKS_SUPPORT[+chainId];
      if (walletName === ConnectorNames.MetaMask && networkInfo) {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: networkInfo.details?.chainId }],
          });
        } catch (error: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (error.code === 4902) {
            try {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    ...(networkInfo.details || {}),
                  },
                ],
              });
            } catch (addError) {
              console.log("requestSupportNetwork", addError);
              console.error(addError);
              return false;
            }
          } else {
            return false;
          }
        }
      } 

      return true;
    } catch (error: any) {
      console.log("requestSupportNetwork", error.message);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};
