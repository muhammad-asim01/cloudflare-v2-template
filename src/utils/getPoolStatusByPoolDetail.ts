import BigNumber from 'bignumber.js';
import {PoolStatus} from "./getPoolStatus";
import {BUY_TYPE, POOL_TYPE} from "../constants";
import {getProgressWithPools} from "./campaign";

export const getPoolStatusByPoolDetail = (
  // startJoinTime: Date | undefined,
  // endJoinTime: Date | undefined,
  // startBuyTime: Date | undefined,
  // endBuyTime: Date | undefined,
  // releaseTime: Date | undefined,
  // soldProgress: string | undefined,
  // isClaimable: boolean | undefined,
  // poolType: string | undefined
  poolDetails: any,
  tokenSold: any,
) => {

  if (!poolDetails) {
    return PoolStatus.TBA;
  }

  const firstClaimConfig = () => {
    if (poolDetails?.campaignClaimConfig && poolDetails?.campaignClaimConfig.length > 0) {
      const firstClaim = poolDetails.campaignClaimConfig[0];
      return firstClaim;
    }
    return null;
  };

  const lastClaimConfig = () => {
    if (poolDetails?.campaignClaimConfig && poolDetails?.campaignClaimConfig.length > 0) {
      const lastClaim = poolDetails.campaignClaimConfig[poolDetails.campaignClaimConfig.length - 1];
      return lastClaim;
    }
    return null;
  };
  const lastClaimConfigTime = () => {
    const lastClaim = lastClaimConfig();
    if (lastClaim) {
      const startClaim = parseInt(lastClaim.start_time) + (7*24*3600); // +1week
      return startClaim;
    }
    return null;
  };

  const startBuyTimeField = () => {
    return poolDetails?.startBuyTime || poolDetails?.start_time;
  };
  const endBuyTimeField = () => {
    return poolDetails?.endBuyTime || poolDetails?.finish_time;
  };
  const startJoinTimeField = () => {
    return poolDetails?.joinTime || poolDetails?.start_join_pool_time;
  };
  const endJoinTimeField = () => {
    return poolDetails?.endJoinTime || poolDetails?.end_join_pool_time;
  };
  const releaseTimeField = () => {
    let releaseTime = poolDetails?.releaseTime || poolDetails?.release_time;
    const firstClaim = firstClaimConfig();
    if (firstClaim) {
      releaseTime = firstClaim.start_time;
    }
    return releaseTime;
  };
  const poolTypeField = () => {
    return poolDetails?.type || poolDetails?.pool_type;
  };
  const buyTypeField = () => {
    return poolDetails?.method || poolDetails?.buy_type;
  };



  const startBuyTime = startBuyTimeField() ? new Date(Number(startBuyTimeField()) * 1000): undefined;
  const endBuyTime = endBuyTimeField() ? new Date(Number(endBuyTimeField()) * 1000): undefined;
  const startJoinTime = startJoinTimeField() ? new Date(Number(startJoinTimeField()) * 1000): undefined;
  const endJoinTime = endJoinTimeField() ? new Date(Number(endJoinTimeField()) * 1000): undefined;
  const releaseTime = releaseTimeField() ? new Date(Number(releaseTimeField()) * 1000): undefined;
  const isClaimable = poolTypeField() !== POOL_TYPE.SWAP;
  const buyType = buyTypeField();

  // const soldProgress = new BigNumber(tokenSold).div(amountField() || 1).toFixed();
  // const soldProgress = new BigNumber(tokenSold).div(amountField() || 1).multipliedBy(100).toFixed();
  let { progress: soldProgress } = getProgressWithPools({...poolDetails});
  const today = new Date().getTime();

  // Check TBA Status
  if ((!startJoinTime || !endJoinTime) && buyType === BUY_TYPE.WHITELIST_LOTTERY) {
    return PoolStatus.TBA;
  }

  if ((!startBuyTime || !endBuyTime) && buyType === BUY_TYPE.FCFS) {
    return PoolStatus.TBA;
  }

  // Check Upcoming Status
  if (startJoinTime && today < startJoinTime.getTime()) {
    return PoolStatus.Upcoming;
  }

  // exist start_join_time
  // but don't exist start_buy_time
  if (startJoinTime && !startBuyTime) {
    return PoolStatus.Upcoming;
  }

  // or current time < start buy time
  if (startBuyTime && today < startBuyTime.getTime()) {
    return PoolStatus.Upcoming;
  }
  if (startJoinTime && endJoinTime && today > startJoinTime.getTime() && today < endJoinTime.getTime()) {
    return PoolStatus.Upcoming;
  }
  if (endJoinTime && startBuyTime && today > endJoinTime.getTime() && today < startBuyTime.getTime()) {
    return PoolStatus.Upcoming;
  }

  // Check Claimable Status
  const lastClaimTime = lastClaimConfigTime();
  if (
    isClaimable &&
    releaseTime && lastClaimTime &&
    releaseTime.getTime() <= today && today < (lastClaimTime * 1000)
  ) {
    return PoolStatus.Claimable;
  }

  if (
    isClaimable &&
    endBuyTime &&
    lastClaimTime &&
    today >= (lastClaimTime * 1000)
  ) {
    return PoolStatus.Closed;
  }
  
  if (
    endBuyTime && today < endBuyTime.getTime()
    && new BigNumber(soldProgress || 0).lt(99.9)
  ) {
    return PoolStatus.Progress;
  }

  if (
    (endBuyTime && endBuyTime.getTime() <= today && releaseTime && today < releaseTime.getTime()) ||
    new BigNumber(soldProgress || 0).gte(99.9)
  ) {
    return PoolStatus.Filled;
  }

  return PoolStatus.Closed;
}
