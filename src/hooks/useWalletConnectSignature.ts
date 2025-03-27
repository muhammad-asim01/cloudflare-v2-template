import { useState, useCallback } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import { useAppKitAccount } from "@reown/appkit/react";

const MESSAGE_INVESTOR_SIGNATURE =
  process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE || "";

const useWalletConnectSignature = () => {
  const { address } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");

  const signMessage = useCallback(async (message?: any, encodedMessage? : any) => {
    setMessage(encodedMessage ? encodedMessage : message ? message : null)
    try {
      if (address) {
        setError("");
        const signature: any = await signMessageAsync({
          message: message ? message : MESSAGE_INVESTOR_SIGNATURE,
        });
        if(signature) {
            setSignature(signature)
        }
      }
    } catch (err: any) {
      console.log("useWalletSignature", JSON.parse(JSON.stringify(err)));
      const error = JSON.parse(JSON.stringify(err));
      if (error.details) {
        toast.error(error.details);
        setError(error.details);
        throw new Error(error.details);
      } else {
        toast.error(getErrorMessage(err));
        setError(err.message);
      }
    }
  }, [address, signMessageAsync]);

  return {
    signMessage,
    signature,
    setSignature,
    error,
    message,
    setMessage
  };
};

export default useWalletConnectSignature;
