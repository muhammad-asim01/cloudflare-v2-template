import { useCallback } from "react";
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana";
import { useSignMessage } from "wagmi";
import bs58 from "bs58";
import { solana } from "@reown/appkit/networks";

export function useSignMessageHandler() {
  const { address } = useAppKitAccount();
  const { signMessageAsync: signEvmMessage } = useSignMessage();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { caipNetwork } = useAppKitNetwork();

  const signMessage = useCallback(
    async (message: string) => {
      try {
        if (!address) {
          throw new Error("User is disconnected");
        }

        let signature;
        if (caipNetwork?.id !== solana.id) {
          signature = await signEvmMessage({ message });
        } else if (caipNetwork.id === solana.id) {
          if (!walletProvider) {
            throw new Error("Solana provider is not available");
          }
          const encodedMessage = new TextEncoder().encode(message);
          const solanaSignature = await walletProvider.signMessage(
            encodedMessage
          );
          signature = bs58.encode(solanaSignature);
        } else {
          throw new Error("Unsupported wallet provider");
        }

        return signature;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    [address, walletProvider, signEvmMessage, caipNetwork]
  );

  return { signMessage };
}
