import { POOL_IS_PRIVATE } from './../constants';
import BigNumber from 'bignumber.js';
import {PoolStatus} from "./getPoolStatus";

export const getFirstClaimConfigRecord = (campaignClaimConfig: Array<any>) => {
  if (!campaignClaimConfig || (campaignClaimConfig.length == 0)) {
    return null;
  }
  return campaignClaimConfig[0];
};
export const getLastClaimConfigRecord = (campaignClaimConfig: Array<any>) => {
  if (!campaignClaimConfig || (campaignClaimConfig.length == 0)) {
    return null;
  }
  return campaignClaimConfig[campaignClaimConfig.length - 1];
};


export const firstClaimConfig = (poolDetails: any) => {
  if (poolDetails?.campaignClaimConfig && poolDetails?.campaignClaimConfig.length > 0) {
    const firstClaim = poolDetails.campaignClaimConfig[0];
    return firstClaim;
  }
  return null;
};

export const lastClaimConfig = (poolDetails: any) => {
  if (poolDetails?.campaignClaimConfig && poolDetails?.campaignClaimConfig.length > 0) {
    const lastClaim = poolDetails.campaignClaimConfig[poolDetails.campaignClaimConfig.length - 1];
    return lastClaim;
  }
  return null;
};

export const getFirstClaimConfigTime = (poolDetails: any) => {
  const firstClaim = firstClaimConfig(poolDetails);
  if (firstClaim) {
    const startClaim = parseInt(firstClaim.start_time);
    return startClaim;
  }
  return null;
};

export const getLastClaimConfigTime = (poolDetails: any) => {
  const lastClaim = lastClaimConfig(poolDetails);
  if (lastClaim) {
    const startClaim = parseInt(lastClaim.start_time) + (7*24*3600); // +1week
    return startClaim;
  }
  return null;
};

export const getPoolCountDownPreOrder = (params: any): any => {
  const { endBuyTime } = params;
  const date = endBuyTime;
  const display = 'Token Swap starts in';
  const displayShort = "Launch in";

  return { date, display, displayShort };
}

export const getPoolCountDown = (
  startJoinTime: Date | undefined,
  endJoinTime: Date | undefined,
  startBuyTime: Date | undefined,
  endBuyTime: Date | undefined,
  releaseTimeInDate: Date | undefined,
  method: string | undefined,
  poolStatus: any | undefined,
  poolDetails: any | undefined,
  soldProgress: any | undefined,
  poolPrivate: any | undefined
): { date: Date | undefined, display: string | undefined,  displayShort: string | undefined} => {
  const today = new Date().getTime();
  let date;
  let display;
  let displayShort;

  const isCommunityPool = poolPrivate === POOL_IS_PRIVATE.COMMUNITY;

  const isTBA = poolStatus == PoolStatus.TBA;
  const isUpcoming = poolStatus == PoolStatus.Upcoming;
  const isSwaping = poolStatus == PoolStatus.Progress;
  const isFilled = poolStatus == PoolStatus.Filled;
  const isClaimable = poolStatus == PoolStatus.Claimable;
  const isEnded = poolStatus == PoolStatus.Closed;
  const haveFreeBuy = !!poolDetails?.freeBuyTimeSetting?.start_buy_time

  const firstClaimRecord = getFirstClaimConfigRecord(poolDetails?.campaignClaimConfig);
  // const lastClaimRecord = getLastClaimConfigRecord(poolDetails?.campaignClaimConfig);
  const startTimeFirstClaim = firstClaimRecord && ((firstClaimRecord.start_time || 0) * 1000);
  const startDateFirstClaim = startTimeFirstClaim ? new Date(Number(startTimeFirstClaim)) : undefined;
  // const endTimeFirstClaim = lastClaimRecord && ((lastClaimRecord.end_time || 0) * 1000);
  // const endDateFirstClaim = endTimeFirstClaim ? new Date(Number(endTimeFirstClaim)) : undefined;
  const freeBuyTimeStart = haveFreeBuy ? new Date(poolDetails?.freeBuyTimeSetting?.start_buy_time * 1000) : new Date();

  if (method && method === "whitelist") {
    if (isUpcoming) {
      if (startJoinTime && today < startJoinTime.getTime()) {
        date = startJoinTime;
        if (isCommunityPool) {
          display = "Start to join Competition in";
          displayShort = "Competition starts in";
        } else {
        display = 'You can register Interest in';
          displayShort = "Registration starts in";
        }
        return { date, display, displayShort };
      } else if (startJoinTime && endJoinTime && startJoinTime.getTime() < today && today < endJoinTime.getTime()) {
        date = endJoinTime;
        if (isCommunityPool) {
          display = "End to join the competition in";
          displayShort = "Competition ends in";
        } else {
          display = 'End to register for the Interest in';
          displayShort = "Registration ends in";
        }
        return { date, display, displayShort };
      } else if (endJoinTime && startBuyTime && endJoinTime.getTime() < today && today < startBuyTime.getTime()) {
        date = startBuyTime;
        display = 'Token Swap starts in';
        displayShort="Launch in";
        return { date, display, displayShort };
      }
    } else if (isSwaping) {
      if (startBuyTime && endBuyTime && haveFreeBuy && today > freeBuyTimeStart.getTime() && today < endBuyTime.getTime()) {
        date = endBuyTime;
        display = 'Token Swap ends in (phase 2)';
        displayShort="End in";
        return { date, display, displayShort };
      }
      if (startBuyTime && endBuyTime && startBuyTime.getTime() < today && today < endBuyTime.getTime()) {
        date = haveFreeBuy ? freeBuyTimeStart : endBuyTime;
        display = haveFreeBuy ? 'Token Swap ends in (phase 1)' : 'Token Swap ends in';
        displayShort="End in";
        return { date, display, displayShort };
      }

    } else if (isFilled) {
      if (
        new BigNumber(soldProgress).gt(99) ||
        (endBuyTime && startTimeFirstClaim && endBuyTime.getTime() < today && today < startTimeFirstClaim)
      ) {
        date = startDateFirstClaim;
        display = 'You can claim your token in';
        displayShort="Claim in";
        return { date, display, displayShort };
      }
    } else if (isClaimable) {
      if (releaseTimeInDate && releaseTimeInDate.getTime() < today) {
        date = undefined;
        display = 'Pool is claimable';
        displayShort="Claimable";
        return { date, display, displayShort };
      }
    } else if (isTBA) {
      return { date, display, displayShort };
    } else if (isEnded) {
      display = 'Pool is over';
      return { date, display, displayShort };
    }
  }

  if (method && method === "fcfs" && startBuyTime && endBuyTime) {
    if (today < startBuyTime.getTime()) {
      date = startBuyTime;
      // display = "Start buy in";
      display = "Token Swap ends in";
      displayShort = "End in";
    }

    if (today > startBuyTime.getTime() && today < endBuyTime.getTime()) {
      date = endBuyTime;
      // display = "End buy in";
      display = "You can claim your token in";
      displayShort = "You can claim your token in";
    }
  }

  return {
    date,
    display,
    displayShort
  }
}

