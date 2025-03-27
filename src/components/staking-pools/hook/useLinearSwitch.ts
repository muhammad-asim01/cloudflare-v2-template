import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { getContract } from "../../../utils/contract";

import STAKING_POOL_ABI from "../../../abi/StakingPool.json";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { useAppKitAccount } from "@reown/appkit/react";

const useLinearSwitch = (
  poolAddress: string | null | undefined,
  currentPoolId: number | null | undefined,
  targetPoolId: number | null | undefined
) => {
  const [switchPoolLoading, setSwitchPoolLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const dispatch = useDispatch();

  const { connector: library } = useAccount();
  const { address: account } = useAppKitAccount();

  const linearSwitchPool = useCallback(async () => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setSwitchPoolLoading(true);

        const contract: any = await getContract(
          poolAddress,
          STAKING_POOL_ABI,
          library as any,
          account as string
        );
        if (contract && targetPoolId && currentPoolId) {
          const transaction = await contract.linearSwitch(
            currentPoolId,
            targetPoolId
          );

          setTransactionHash(transaction.hash);

          await transaction.wait(1);

          toast.success(
            "Your staking amount and rewards have been successfully switched!"
          );

          setSwitchPoolLoading(false);
        }
      }
    } catch (err: any) {
      console.log("useLinearSwitch:", err);
      toast.error(getErrorMessage(err));
      setSwitchPoolLoading(false);
      throw new Error(err.message);
    }
  }, [poolAddress, currentPoolId, targetPoolId, library, account, dispatch]);

  return {
    switchPoolLoading,
    linearSwitchPool,
    setSwitchPoolLoading,
    transactionHash,
  };
};

export default useLinearSwitch;
