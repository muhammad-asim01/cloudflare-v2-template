import React, { useCallback, useContext, useEffect} from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  NetworkUpdateType,
  settingAppNetwork,
} from "@/store/slices/appNetworkSlice";
import {
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
} from "@reown/appkit/react";
import { useSignMessageHandler } from "@/hooks/useSignMessageHandler";
import { AppContext } from "@/AppContext";
import { modal } from "@/context";
import { setAccessToken, setUserData } from "@/store/slices/userDataSlice";
import { refreshToken } from "@/utils/refreshToken";
import { termsData } from "@/constants/term";
import { getCookie, setCookie } from "@/utils";
import axios from "axios";
import { solana } from "@reown/appkit/networks";
import { tokenActions } from "@/store/constants/token";
import getAccountBalance from "@/utils/getAccountBalance";
import BigNumber from "bignumber.js";
import { getAppNetworkName } from "@/utils/network/getAppNetworkName";
import { ChainIdNameMapping } from "@/constants/network";
import { setUserBalance } from "@/store/slices/userBalanceSlice";
import { disconnectWalletSuccess, storeWalletAddress } from "@/store/slices/walletSlice";
import { fetchConfigData } from "@/store/slices/landingConfigSlice";

import responseData from './../../config/response.json';

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RoutesConfigProvider = ({ children,initialConfigData }: { children: React.ReactNode,initialConfigData:any }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (initialConfigData) {
      dispatch(fetchConfigData(responseData)); 
    }
  }, []);

  const { caipNetwork: chain } = useAppKitNetwork();
  const { signMessage } = useSignMessageHandler();
  const { caipNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();
  const { setLoginError } = useContext(AppContext);
  const { address, isConnected, status } = useAppKitAccount();
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const accessToken = useSelector((state: any) => state?.userData?.accessToken);



  const logout = () => {
    modal.subscribeAccount((event) => {
      if (event.status === "disconnected" && status === "disconnected") {
        localStorage.clear();
        sessionStorage.clear();
        if (setLoginError) {
          setLoginError("");
        }
        dispatch(setUserData(null));
        dispatch(setAccessToken(null));
        // dispatch(tokenRefreshSuccess());
        dispatch(disconnectWalletSuccess());
      }
    });
    modal.subscribeCaipNetworkChange((event) => {
      dispatch(
        settingAppNetwork({
          networkType: NetworkUpdateType.App,
          updatedVal: String(event?.id),
        })
      );
    });
  };
  useEffect(() => {
    logout();
  }, [status]);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleChainChanged = (chainId: string) => {
        const id = parseInt(chainId, 16);
        dispatch(
          settingAppNetwork({
            networkType: NetworkUpdateType.App,
            updatedVal: String(id),
          })
        );
      };

      (window.ethereum as any)?.on("chainChanged", handleChainChanged);

      return () => {
        (window.ethereum as any)?.removeListener(
          "chainChanged",
          handleChainChanged
        );
      };
    }
  }, []);

  const acccessToken =
    typeof window !== "undefined"
      ? localStorage.getItem(`access_token:${address}`)
      : null;

  useEffect(() => {
    if (!acccessToken && isConnected) {
      if (address) {
        refreshToken();
        dispatch(storeWalletAddress(address))
      }
    }
  }, [address, acccessToken]);

  const { refreshing: isRefreshing } = useSelector(
    (state: any) => state.tokensByUser
  );

  useEffect(() => {
    document.onreadystatechange = function () {
      if (document.readyState === "complete") {
        // setBinanceAvailable(true);
      }
    };
  }, []);

  const termsMessage = termsData
    .map((term) => `\n${term.heading}\n\n${term.paragraph}`)
    .join("\n");

  function base64Encode(data: any) {
    return btoa(unescape(encodeURIComponent(data)));
  }

  const handleLogin = useCallback(async () => {
    try {
      if (address) {
        dispatch(
          settingAppNetwork({
            networkType: NetworkUpdateType.App,
            updatedVal: String(caipNetwork?.id),
          })
        );
        const encodedOriginalMessage = base64Encode(termsMessage);
        const sig = await signMessage(termsMessage);

        const terms_status = Number(getCookie("terms_status")) || undefined;
        const response = await axios.post(
          `${BASE_URL}/user/login`,
          {
            signature: sig,
            ...(caipNetwork?.id === solana.id && { solana_address: address }),
            ...(caipNetwork?.id !== solana.id && { wallet_address: address }),
            terms_status,
            message: encodedOriginalMessage,
          },
          {
            headers:
              caipNetwork?.id === solana.id
                ? {
                    is_solana: true,
                  }
                : {},
          }
        );

        const resObj = await response.data;

        if (resObj.status && resObj.status === 200 && resObj.data) {
          const { token, user } = resObj.data;
          localStorage.setItem(`access_token:${address}`, token.token);
          // dispatch(tokenRefreshSuccess);
          // dispatch({ type: tokenActions.TOKEN_REFRESH_SUCCESS });

          dispatch(setUserData(user));
          dispatch(setAccessToken(token.token));
          setCookie("firstWalletConnected", JSON.stringify(true), 365);
         
        }
      } else {
        dispatch({ type: tokenActions.TOKEN_REFRESH_FAIL });
      }
    } catch (err: any) {
      console.log(err);
      if (err?.response?.data?.message !== "WALLET_NOT_LINKED") {
        // toast.error(err?.response?.data?.message || "Can't Connect");
        disconnect();
      } else {
        const errorMessage = `Please pair your Solana wallet with your EVM wallet. First, connect with your EVM wallet, then go to <a style="display: contents;" href="/profile">‘My Profile’</a> to link your Solana wallet.`;
        if (setLoginError) {
          setLoginError(errorMessage);
        }
        // toast.info("Please pair your Solana wallet with your EVM wallet. First, connect with your EVM wallet, then go to ‘My Profile’ to link your Solana wallet.", { autoClose: 10000 });
      }
      localStorage.clear();
      console.log("useWalletSignature", err);
      dispatch({ type: tokenActions.TOKEN_REFRESH_FAIL });
    }
  }, [address, dispatch, disconnect, chain, appChainID]);

  useEffect(() => {
    if (!isRefreshing) return;
    handleLogin();
  }, [isRefreshing]);

  const getUserBalance = useCallback(async () => {
    const accountBalance = await getAccountBalance(
      appChainID,
      chain?.id,
      address as string
    );
    const formattedBalance = new BigNumber(accountBalance._hex)
      .div(new BigNumber(10).pow(18))
      .toFixed(5);
    dispatch(setUserBalance(formattedBalance));
  }, [address, appChainID, chain, dispatch]);

  useEffect(() => {
    if (appChainID && address && chain?.id) {
      getUserBalance();
    }
  }, [appChainID, address, chain, getUserBalance]);

  const loginErrorFunc = useCallback(
    (appChainID: string, walletChainID: any) => {
      if (appChainID && walletChainID && setLoginError) {
        if (Number(appChainID) !== Number(walletChainID)) {
          setLoginError(
            `App network (${getAppNetworkName(
              appChainID
            )}) doesn't match to network selected in wallet: ${
              ChainIdNameMapping[walletChainID]
            }.`
          );
        } else {
          setLoginError("");
        }
      }

      return;
    },
    [setLoginError]
  );

  useEffect(() => {
    if (appChainID && chain && accessToken) {
      loginErrorFunc(appChainID, chain?.id as any);
    }
  }, [appChainID, chain, loginErrorFunc, address, accessToken]);

  //   return <AppContext.Provider value={{
  //     binanceAvailable,
  //     handleProviderChosen,
  //     connectWalletLoading,
  //     walletName,
  //     setWalletName,
  //     loginError,
  //     appNetworkLoading,
  //     handleConnectorDisconnect,
  //     currentConnector,
  //     logout,
  //     setCurrentConnectedWallet,
  //     openConnectWallet,
  //     setOpenConnectWallet,
  //     currentConnectedWallet,
  //     openEnterRefCode,
  //     setOpenEnterRefCode,
  //   }}
  // >{children}</AppContext.Provider>;
  return <>{children}</>;
};

export default RoutesConfigProvider;
