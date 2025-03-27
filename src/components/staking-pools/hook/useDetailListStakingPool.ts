import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { DEFAULT_CHAIN_ID } from "../../../constants/network";
import {
  getContractInstance,
  SmartContractMethod,
} from "../../../services/web3";

import STAKING_POOL_ABI from "../../../abi/StakingPool.json";
import { useAccount } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";

const useDetailListStakingPool = (
  poolsList: Array<any> | null | undefined,
  isStackedDataCache: boolean = false
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allocPools, setAllocPools] = useState({});
  const [linearPools, setLinearPools] = useState({});
  const connector = useAccount();
  const { address: account } = useAppKitAccount();

  const fetchDetailList = useCallback(async () => {
    try {
      if (!poolsList || !poolsList?.length) {
        return;
      }

      setLoading(true);

      let allocs = {};
      let linears = {};

      if (isStackedDataCache) {
        linears = poolsList
          .filter((pool: any) => pool.staking?.staking_type === "linear")
          ?.map((pool: any) => pool?.staking);

        allocs = poolsList
          .filter((pool: any) => pool.staking?.staking_type === "alloc")
          ?.map((pool: any) => pool?.staking);

        setAllocPools(allocs);
        setLinearPools(linears);
        setLoading(false);
      } else {
        for (const pool of poolsList) {
          if (
            !pool?.pool_address ||
            !ethers.utils.isAddress(pool?.pool_address)
          ) {
            continue;
          }

          const contract = await getContractInstance(
            STAKING_POOL_ABI,
            pool.pool_address,
            connector.connector?.name,
            DEFAULT_CHAIN_ID,
            SmartContractMethod.Read
          );
          if (!contract) {
            continue;
          }

          const promises = [
            contract.methods.allocEndBlockNumber().call(),
            contract.methods.allocRewardPerBlock().call(),
            contract.methods.allocRewardToken().call(),
            contract.methods.totalAllocPoint().call(),
            contract.methods.linearAcceptedToken().call(),
          ];

          const [
            allocEndBlockNumber,
            allocRewardPerBlock,
            allocRewardToken,
            totalAllocPoint,
            linearAcceptedToken,
          ] = await Promise.all(
            promises.map((p) => p.catch(() => undefined))
          );

          switch (pool.staking_type) {
            case "alloc":
              const allocData: any = await contract.methods
                .allocPoolInfo(pool.pool_id)
                .call();
              let allocPendingReward: any = "0";
              let allocPendingWithdrawals: any, allocUserInfo: any;
              if (account) {
                [allocUserInfo, allocPendingReward, allocPendingWithdrawals] =
                  await Promise.all([
                    contract.methods
                      .allocUserInfo(pool.pool_id, account)
                      .call(),
                    contract.methods
                      .allocPendingReward(pool.pool_id, account)
                      .call(),
                    contract.methods
                      .allocPendingWithdrawals(pool.pool_id, account)
                      .call(),
                  ]);
              }

              allocs = {
                ...allocs,
                [pool.id]: {
                  ...pool,
                  rewardToken: allocRewardToken?.toString(),
                  rewardPerBlock: allocRewardPerBlock?.toString(),
                  endBlockNumber: allocEndBlockNumber?.toString(),
                  lpToken: String(allocData.lpToken),
                  lpSupply: String(allocData.lpSupply),
                  allocPoint: String(allocData.allocPoint),
                  totalAllocPoint: totalAllocPoint?.toString(),
                  lastRewardBlock: String(allocData.lastRewardBlock),
                  accRewardPerShare: String(allocData.accRewardPerShare),
                  delayDuration: String(allocData.delayDuration),
                  stakingAmount: String(allocUserInfo?.amount) || "0",
                  pendingReward: String(allocPendingReward) || "0",
                  pendingWithdrawal: {
                    amount: String(allocPendingWithdrawals?.amount) || "0",
                    applicableAt: allocPendingWithdrawals?.applicableAt || "0",
                  },
                },
              };
              break;

            case "linear":
              const linearData: any = await contract.methods
                .linearPoolInfo(pool.pool_id)
                .call();
              let linearPendingReward: any = "0";
              let linearPendingWithdrawal: any, linearUserInfo: any;
              if (account) {
                [linearUserInfo, linearPendingReward, linearPendingWithdrawal] =
                  await Promise.all([
                    contract.methods
                      .linearStakingData(pool.pool_id, account)
                      .call(),
                    contract.methods
                      .linearPendingReward(pool.pool_id, account)
                      .call(),
                    contract.methods
                      .linearPendingWithdrawals(pool.pool_id, account)
                      .call(),
                  ]);
              }
              linears = {
                ...linears,
                [pool.id]: {
                  ...pool,
                  acceptedToken: linearAcceptedToken,
                  cap: String(linearData.cap),
                  totalStaked: String(linearData.totalStaked),
                  minInvestment: String(linearData.minInvestment),
                  maxInvestment: String(linearData.maxInvestment),
                  APR: String(linearData.APR),
                  lockDuration: String(linearData.lockDuration),
                  delayDuration: String(linearData.delayDuration),
                  startJoinTime: String(linearData.startJoinTime),
                  endJoinTime: String(linearData.endJoinTime),
                  stakingAmount: linearUserInfo?.balance || "0",
                  stakingJoinedTime: linearUserInfo?.joinTime || "0",
                  pendingReward: String(linearPendingReward) || "0",
                  pendingWithdrawal: {
                    amount: linearPendingWithdrawal?.amount || "0",
                    applicableAt: linearPendingWithdrawal?.applicableAt || "0",
                  },
                },
              };
              break;
          }
        }
        setAllocPools(allocs);
        setLinearPools(linears);
        setLoading(false);
      }
    } catch (err: any) {
      console.log("useDetailListStakingPool:", err);
      setLoading(false);
      //throw new Error(err.message);
    }
  }, [poolsList, account, isStackedDataCache]);

  useEffect(() => {
    fetchDetailList();
  }, [fetchDetailList, isStackedDataCache]);

  return {
    loading,
    fetchDetailList,
    allocPools,
    linearPools,
    isStackedDataCache,
  };
};

export default useDetailListStakingPool;
