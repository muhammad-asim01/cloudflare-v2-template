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

const useLinearClaim = (
  poolAddress: string | null | undefined,
  poolId: number | null | undefined,
  poolDetail?: any
) => {
  const [tokenClaimLoading, setTokenClaimLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState("");
  const dispatch = useDispatch();

  const { connector: library } = useAccount();
  const { address: account } = useAppKitAccount();

  const linearClaimToken = useCallback(async () => {
    setTransactionHash("");

    try {
      if (poolAddress && ethers.utils.isAddress(poolAddress)) {
        setTokenClaimLoading(true);

        if (poolAddress && ethers.utils.isAddress(poolAddress)) {
          setTokenClaimLoading(true);
          const contract = await getContract(
            poolAddress,
            STAKING_POOL_ABI,
            library,
            account as string
          );

          if (contract) {
            const transaction = await contract.linearClaimReward(poolId);

            setTransactionHash(transaction.hash);

            await transaction.wait(1);
            gTagEvent({
              action: "claim_token",
              params: {
                staking_dApp: "pad",
                pool_name: poolDetail?.title,
                duration: poolDetail?.lockDuration,
                wallet_address: account || "",
                network: poolDetail?.network_available,
              },
            });
            toast.success("Token Claimed Successful!");
            setTokenClaimLoading(false);
          }

          // const { transaction, result } = await writeContractAsync({
          //   abi: STAKING_POOL_ABI,
          //   address: poolAddress as `0x${string}`,
          //   functionName: "linearClaimReward",
          //   args: [poolId],
          // });

          // setTransactionHash(transaction);

          // if (result === WRITE_CONTRACT_SUCCESS) {
          //   toast.success("Token Claimed Successful!");
          //   setTokenClaimLoading(false);
          //   gTagEvent({
          //     action: "claim_token",
          //     params: {
          //       staking_dApp: "pad",
          //       pool_name: poolDetail?.title,
          //       duration: poolDetail?.lockDuration,
          //       wallet_address: account || "",
          //       network: poolDetail?.network_available,
          //     },
          //   });
          // }
        }
      }
    } catch (err: any) {
      console.log("useLinearClaim:", err);
      toast.error(
        JSON.parse(JSON.stringify(err)).shortMessage || getErrorMessage(err)
      );
      setTokenClaimLoading(false);
      throw new Error(err.message);
    }
  }, [poolAddress, poolId, library, account, dispatch]);

  return {
    tokenClaimLoading,
    linearClaimToken,
    setTokenClaimLoading,
    transactionHash,
  };
};

export default useLinearClaim;
