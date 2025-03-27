import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import STAKING_POOL_ABI from "../../../abi/StakingPool.json";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { getContract } from "@/utils/contract";
import { useAppKitAccount } from "@reown/appkit/react";

const useLinearClaimPendingWithdraw = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { connector: library } = useAccount();
  const { address: account } = useAppKitAccount();

  const linearClaimPendingWithdraw = useCallback(async () => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setLoading(true);
        if (poolAddress && ethers.utils.isAddress(poolAddress)) {
          setLoading(true);
          const contract = await getContract(
            poolAddress,
            STAKING_POOL_ABI,
            library,
            account as string
          );

          if (contract) {
            const transaction = await contract.linearClaimPendingWithdraw(
              poolId
            );

            setTransactionHash(transaction.hash);

            await transaction.wait(1);

            toast.success("Claim Pending Withdraw Successful!");
            setLoading(false);
          }
          // const { transaction, result } = await writeContractAsync({
          //   abi: STAKING_POOL_ABI,
          //   address: poolAddress as `0x${string}`,
          //   functionName: "linearClaimPendingWithdraw",
          //   args: [poolId],
          // });

          // setTransactionHash(transaction);

          // if (result === WRITE_CONTRACT_SUCCESS) {
          //   toast.success("Claim Pending Withdraw Successful!");
          //   setLoading(false);
          // }
        }
      }
    } catch (err: any) {
      console.log("linearClaimPendingWithdraw:", err);
      toast.error(
        JSON.parse(JSON.stringify(err)).shortMessage || getErrorMessage(err)
      );
      setLoading(false);
      throw new Error(err.message);
    }
  }, [poolAddress, poolId, library, account, dispatch]);

  return {
    loading,
    linearClaimPendingWithdraw,
    setLoading,
    transactionHash,
  };
};

export default useLinearClaimPendingWithdraw;
