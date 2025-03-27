import { useState, useCallback } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAccount } from "wagmi";
import { getCustomProvider } from "@/utils/getCustomProvider";
import { toast } from "react-toastify";
import { useAppKitAccount } from "@reown/appkit/react";

const MESSAGE_INVESTOR_SIGNATURE =
  process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE || "";

export const getParamsWithConnector = (connectedAccount: string) => ({
  WalletConnect: {
    method: "eth_sign",
    params: [connectedAccount, MESSAGE_INVESTOR_SIGNATURE],
  },
  MetaMask: {
    method: "personal_sign",
    params: [MESSAGE_INVESTOR_SIGNATURE, connectedAccount],
  },
});

const useWalletSignature = () => {
  const { connector: library } = useAccount();
  const { address: connectedAccount } = useAppKitAccount();
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");

  const signMessage = useCallback(async () => {
    try {
      if (connectedAccount && library) {
        const provider = await getCustomProvider(library);

        setError("");

        const signer = await provider.getSigner();
        const signature: any = await signer.signMessage(
          MESSAGE_INVESTOR_SIGNATURE
        );
        if(signature) {
          setSignature(signature)
        }
      }
    } catch (err: any) {
      console.log("useWalletSignature", err);
      toast.error(getErrorMessage(err));
      setError(err.message);
    }
  }, [library, connectedAccount]);

  return {
    signMessage,
    signature,
    setSignature,
    error,
  };
};

export default useWalletSignature;
