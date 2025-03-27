import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import STAKING_POOL_ABI from "../../../abi/StakingPool.json";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { getContract } from "@/utils/contract";
import { useAppKitAccount } from "@reown/appkit/react";

const useLinearCompoundReward = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined
) => {
  const [rewardCompoundLoading, setRewardCompoundLoading] =
    useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { connector: library } = useAccount();
  const { address: account } = useAppKitAccount();

  const linearCompoundReward = useCallback(async () => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setRewardCompoundLoading(true);
        if (poolAddress && ethers.utils.isAddress(poolAddress)) {
          setRewardCompoundLoading(true);
          const contract = await getContract(
            poolAddress,
            STAKING_POOL_ABI,
            library,
            account as string
          );

          if (contract) {
            const transaction = await contract.linearCompoundReward(poolId);

            setTransactionHash(transaction.hash);

            await transaction.wait(1);

            toast.success("Compound Reward Successful!");
            setRewardCompoundLoading(false);
          }
          // const { transaction, result } = await writeContractAsync({
          //   abi: STAKING_POOL_ABI,
          //   address: poolAddress as `0x${string}`,
          //   functionName: "linearCompoundReward",
          //   args: [poolId],
          // });

          // setTransactionHash(transaction);

          // if (result === WRITE_CONTRACT_SUCCESS) {
          //   toast.success("Compound Reward Successful!");
          //   setRewardCompoundLoading(false);
          // }
        }
      }
    } catch (err: any) {
      console.log("useLinearCompoundReward:", err);
      toast.error(
        JSON.parse(JSON.stringify(err)).shortMessage || getErrorMessage(err)
      );
      setRewardCompoundLoading(false);
      throw new Error(err.message);
    }
  }, [poolAddress, poolId, library, account, dispatch]);

  return {
    rewardCompoundLoading,
    linearCompoundReward,
    setRewardCompoundLoading,
    transactionHash,
  };
};

export default useLinearCompoundReward;
