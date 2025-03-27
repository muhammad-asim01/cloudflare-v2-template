import { useState, useCallback } from "react";
import { ethers } from "ethers";

import { MAX_INT } from "../services/web3";
import { TokenType } from "../hooks/useTokenDetails";

import ERC20_ABI from "../abi/Erc20.json";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { getContract } from "@/utils/contract";
import { useAppKitAccount } from "@reown/appkit/react";

const useTokenApprove = (
  token: TokenType | undefined,
  owner: string | null | undefined,
  spender: string | null | undefined,
  sotaABI: false,
  reload: boolean | null | undefined
) => {
  console.log("🚀 ~ sotaABI:", sotaABI, reload)
  const [tokenApproveLoading, setTokenApproveLoading] =
    useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const { connector: library } = useAccount();
  const { address } = useAppKitAccount();

  const approveToken = useCallback(
    async (input?: any) => {
      setTransactionHash("");

      try {
        if (
          token &&
          spender &&
          owner &&
          ethers.utils.isAddress(owner) &&
          ethers.utils.isAddress(spender) &&
          ethers.utils.isAddress(token.address)
        ) {
          setTokenApproveLoading(true);
          const contract = await getContract(
            token.address,
            ERC20_ABI,
            library,
            address as string
          );

          if (contract) {
            const transaction = await contract.approve(
              spender,
              input
                ? ethers.utils.parseUnits(input.toString(), token?.decimals)
                : MAX_INT
            );

            setTransactionHash(transaction.hash);

            await transaction.wait(1);

            toast.success("Token Approve Successful!");
            setTokenApproveLoading(false);
          }
        }
      } catch (err: any) {
        console.log("useTokenApprove", JSON.parse(JSON.stringify(err)));
        toast.error(
          JSON.parse(JSON.stringify(err)).shortMessage || getErrorMessage(err)
        );
        setTokenApproveLoading(false);
        throw new Error(err.message);
      }
    },
    [owner, spender, token]
  );

  return {
    tokenApproveLoading,
    approveToken,
    setTokenApproveLoading,
    transactionHash,
  };
};

export default useTokenApprove;
