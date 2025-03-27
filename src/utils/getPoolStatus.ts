import BigNumber from 'bignumber.js';

export enum PoolStatus {
  Upcoming = "Upcoming",
  Closed = "Ended",
  Filled = "Filled",
  Progress = "Swap",
  Claimable = "Claimable",
  TBA = "TBA"
}

export enum PoolLabel {
  Upcoming = "Upcoming",
  Register = "Register Interest",
  Closed = "Ended",
  Filled = "Filled",
  Progress = "Swap",
  Guaranteed = "Guaranteed",
  Fcfs = "FCFS",
  Claimable = "Claimable",
  TBA = "TBA",
  PreOrder = "Pre-Order",
}

export type poolStatus = Extract<
  PoolStatus,
  PoolStatus.Progress |
  PoolStatus.Upcoming |
  PoolStatus.Filled |
  PoolStatus.Closed |
  PoolStatus.Claimable |
  PoolStatus.TBA
>

export const getPoolStatus = (
  startJoinTime: Date | undefined,
  endJoinTime: Date | undefined,
  startBuyTime: Date | undefined,
  endBuyTime: Date | undefined,
  releaseTime: Date | undefined,

  soldProgress: string | undefined,
  isClaimable: boolean | undefined,
  poolType: string | undefined
): poolStatus => {
  // WARNING: Don't use this function. Please use `getPoolStatusByPoolDetail` function
  const today = new Date().getTime();

  // const requiredReleaseTime = isClaimable ? !releaseTime: false;

  if ((!startJoinTime || !endJoinTime) && poolType === 'whitelist') {
    return PoolStatus.TBA;
  }

  if ((!startBuyTime || !endBuyTime) && poolType === 'fcfs') {
    return PoolStatus.TBA;
  }

  if (startJoinTime && today < startJoinTime.getTime()) {
    return PoolStatus.Upcoming;
  }

  if (endJoinTime && startBuyTime && today > endJoinTime.getTime() && today < startBuyTime.getTime()) {
    return PoolStatus.Upcoming;
  }

  if (
    startBuyTime
    && endBuyTime
    && today > startBuyTime.getTime()
    && today < endBuyTime.getTime()
  ) {
    return new BigNumber(soldProgress || 0).multipliedBy(100).gte(99) ?  PoolStatus.Filled: PoolStatus.Progress;
  }

  if (releaseTime && today > releaseTime.getTime() && isClaimable) {
    return PoolStatus.Claimable;
  }

  if (endBuyTime && today > endBuyTime?.getTime()) {
    return PoolStatus.Closed;
  }

  return PoolStatus.Upcoming;
}
