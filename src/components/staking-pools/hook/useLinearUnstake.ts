import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import STAKING_POOL_ABI from "../../../abi/StakingPool.json";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { gTagEvent } from "@/services/gtag";
import { getContract } from "@/utils/contract";
import { useAppKitAccount } from "@reown/appkit/react";

const useLinearUnstake = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined,
  amount: string | null | undefined,
  poolDetail?: any
) => {
  const [tokenUnstakeLoading, setTokenUnstakeLoading] =
    useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { connector: library } = useAccount();
  const { address: account } = useAppKitAccount();

  const linearUnstakeToken = useCallback(async () => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setTokenUnstakeLoading(true);

        if (amount) {
          if (poolAddress && ethers.utils.isAddress(poolAddress)) {
            setTokenUnstakeLoading(true);
            const contract = await getContract(
              poolAddress,
              STAKING_POOL_ABI,
              library,
              account as string
            );

            if (contract && amount) {
              // const transaction = await contract.linearWithdraw(poolId, ethers.utils.parseEther(amount));
              const transaction = await contract.linearWithdraw(poolId, amount);

              setTransactionHash(transaction.hash);

              await transaction.wait(1);

              toast.success("Token Unstaked Successful!");
              setTokenUnstakeLoading(false);
              gTagEvent({
                action: "unstaked",
                params: {
                  staking_dApp: "pad",
                  value: amount,
                  pool_name: poolDetail?.title,
                  duration: poolDetail?.lockDuration,
                  wallet_address: account || "",
                  network: poolDetail?.network_available,
                },
              });
            }

            // if (amount) {
            //   const { transaction, result } = await writeContractAsync({
            //     abi: STAKING_POOL_ABI,
            //     address: poolAddress as `0x${string}`,
            //     functionName: "linearWithdraw",
            //     args: [poolId, amount],
            //   });
            //   setTransactionHash(transaction);

            //   if (result === WRITE_CONTRACT_SUCCESS) {
            //     toast.success("Token Unstaked Successful!");
            //     setTokenUnstakeLoading(false);
            //     gTagEvent({
            //       action: "unstaked",
            //       params: {
            //         staking_dApp: "pad",
            //         value: amount,
            //         pool_name: poolDetail?.title,
            //         duration: poolDetail?.lockDuration,
            //         wallet_address: account || "",
            //         network: poolDetail?.network_available,
            //       },
            //     });
            //   } else {
            //     toast.error("Transaction failed.");
            //     setTokenUnstakeLoading(false);
            //   }
            // }
          }
        }
      }
    } catch (err: any) {
      console.log("useLinearUnstake:", err);
      toast.error(
        JSON.parse(JSON.stringify(err)).shortMessage || getErrorMessage(err)
      );
      setTokenUnstakeLoading(false);
      throw new Error(err.message);
    }
  }, [poolAddress, poolId, amount, library, account, dispatch]);

  return {
    tokenUnstakeLoading,
    linearUnstakeToken,
    setTokenUnstakeLoading,
    transactionHash,
  };
};

export default useLinearUnstake;
