import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import STAKING_POOL_ABI from "../../../abi/StakingPool.json";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { getContract } from "@/utils/contract";
import { useAppKitAccount } from "@reown/appkit/react";

const useLinearReStake = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined
) => {
  const [tokenStakeLoading, setTokenStakeLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { connector: library } = useAccount();
  const { address: account } = useAppKitAccount();

  const linearReStakeToken = useCallback(async () => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setTokenStakeLoading(true);

        if (poolAddress && ethers.utils.isAddress(poolAddress)) {
          setTokenStakeLoading(true);
          const contract = await getContract(
            poolAddress,
            STAKING_POOL_ABI,
            library,
            account as string
          );

          if (contract) {
            const transaction = await contract.linearDeposit(
              poolId,
              ethers.utils.parseEther("0")
            );

            setTransactionHash(transaction.hash);

            await transaction.wait(1);

            toast.success("Token Staked Successful!");
            setTokenStakeLoading(false);
          }
        }
      }
    } catch (err: any) {
      console.log("useLinearStake:", err);
      toast.error(
        JSON.parse(JSON.stringify(err)).shortMessage || getErrorMessage(err)
      );
      setTokenStakeLoading(false);
      throw new Error(err.message);
    }
  }, [poolAddress, poolId, library, account, dispatch]);

  return {
    tokenStakeLoading,
    linearReStakeToken,
    setTokenStakeLoading,
    transactionHash,
  };
};

export default useLinearReStake;
