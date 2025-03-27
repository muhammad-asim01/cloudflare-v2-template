import { useState, useEffect } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";

type ReturnType = {
  isAuth: boolean;
  connectedAccount: string | null | undefined;
  wrongChain: boolean;
};

const useAuth = (): ReturnType => {
  const { isConnected: isActive, address: account } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const [isAuth, setIsAuth] = useState(false);
  const { appChainID } = useTypedSelector(
    (state: any) => state.appNetwork
  ).data;
  useEffect(() => {
    if (isActive) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [isActive]);

  return {
    isAuth,
    connectedAccount: account,
    wrongChain: appChainID != caipNetwork?.id,
  };
};

export default useAuth;
