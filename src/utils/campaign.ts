import _ from "lodash";
import moment from "moment";
import BigNumber from "bignumber.js";
import {
  ACCEPT_CURRENCY,
} from "../constants";
import { convertFromWei, getPoolContract } from "../services/web3";
import axiosWithBaseUrl from "../services/axios";
import {numberWithCommas, roundOff} from "./formatNumber";
import { getConfigHeader } from "./configHeader";

export const checkIsFinishTime = (campaignDetail: any): boolean => {
  const closeTime = _.get(campaignDetail, "closeTime", "");
  let isFinish = false;
  if (closeTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const currentDate = new Date();
    if (currentDate >= closeTimeDate) {
      isFinish = true;
    }
  }
  
  return isFinish;
};

export const getTokenRemainingCanBuy = (campaignDetail: any): string => {
  if (!campaignDetail) return "0";
  const tokenLeft = _.get(campaignDetail, "tokenLeft", 0);
  const tokenClaimed = _.get(campaignDetail, "tokenClaimed", 0);
  const remainTokenAvailable = new BigNumber(tokenLeft).plus(tokenClaimed);
  
  return remainTokenAvailable.toFixed();
};

export const checkIsBetweenCloseTimeAndReleaseTime = (
  campaignDetail: any
): boolean => {
  const closeTime = _.get(campaignDetail, "closeTime", "");
  const releaseTime = _.get(campaignDetail, "releaseTime", "");
  
  let isBetween = false;
  if (closeTime && releaseTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const releaseTimeDate = moment.unix(parseInt(releaseTime)).toDate();
    const currentDate = new Date();
    if (closeTimeDate <= currentDate && currentDate < releaseTimeDate) {
      isBetween = true;
    }
  }
  
  return isBetween;
};

export const getAccessPoolText = (pool: any) => {
  if (!pool) return "";
  // const buyType = pool?.buy_type || pool?.buyType || pool?.method;
  let text = "";
  // switch (isPrivate) {
  //   case POOL_IS_PRIVATE.PRIVATE:
  //     text = "Private"
  //     break;
  //   case POOL_IS_PRIVATE.SEED:
  //     text = "Seed"
  //     break;
  //   case POOL_IS_PRIVATE.COMMUNITY:
  //     text = "Community"
  //     break;
  //   case POOL_IS_PRIVATE.EVENT:
  //     text = "Event"
  //     break;
  //   default:
  text = pool?.relationship_type ? pool?.relationship_type : "TBA";
  //     break;
  // }
  return text;
  // return ((buyType + '').toLowerCase() == BUY_TYPE.WHITELIST_LOTTERY ? "Whitelist/Lottery" : BUY_TYPE.FCFS.toUpperCase());
};

export const calculateTokenSoldWhenFinish = (
  totalSoldCoin: string | number
) => {
  const result = new BigNumber(totalSoldCoin)
    .minus(new BigNumber(totalSoldCoin).div(10000))
    .toFixed();
  return result;
};

export const getProgressWithPools = (pool: any) => {
  if (!pool) {
    return {
      progress: "0",
      tokenSold: "0",
      totalSoldCoin: "0",
    };
  }
  
  let tokenSold = pool.tokenSold || pool.token_sold || "0";
  const totalSoldCoin = pool.totalSoldCoin || pool.total_sold_coin || "0";
  const tokenSoldDisplay =
    pool.tokenSoldDisplay || pool.token_sold_display || "0";
  let progress = "0";
  
  const isFinish = checkPoolIsFinish(pool);
  if (isFinish && new BigNumber(tokenSold).multipliedBy(100).gt(new BigNumber(totalSoldCoin).multipliedBy(99))) {
    return {
      progress: "100",
      tokenSold: totalSoldCoin,
      totalSoldCoin: totalSoldCoin,
    };
  }
  
  tokenSold = new BigNumber(tokenSold).plus(tokenSoldDisplay).toFixed();
  
  // Normal Case
  if (new BigNumber(tokenSold).gt(totalSoldCoin)) {
    // If tokenSold > totalSoldCoin ==> tokenSold = totalSoldCoin
    tokenSold = totalSoldCoin;
  }
  
  // Merge config display with real
  const totalSoldCoinDiv = totalSoldCoin > 0 ? totalSoldCoin : 1;
  
  progress = new BigNumber(tokenSold)
    .div(totalSoldCoinDiv)
    .multipliedBy(100)
    .toFixed();
  
  if (new BigNumber(progress).lte(0)) {
    progress = "0";
  }
  
  return {
    progress,
    tokenSold,
    totalSoldCoin,
  };
};

export const checkPoolIsFinish = (pool: any) => {
  const currentTime = moment().unix();
  return pool.finish_time && currentTime > pool.finish_time;
};

export const getTokenSold = async (pool: any) => {
  let result = "0";
  try {
    const networkAvailable = pool.network_available || pool.networkAvailable;
    const poolHash = pool.campaign_hash || pool.campaignHash;
    if (poolHash == "Token contract not available yet." || !poolHash) {
      return "0";
    }
    
    const contract = getPoolContract({ networkAvailable, poolHash });
    if (contract) {
      result = await contract.methods.tokenSold().call();
      result = new BigNumber(result).div(new BigNumber(10).pow(pool?.tokenDetails?.decimals || pool?.decimals || 18)).toFixed();
    }
  } catch (err) {
    console.log('getTokenSold', err);
  }
  return result;
};

export const getTokenStakeAPIInfo = async (address: string) => {
  let result = {};
  const configHeader = getConfigHeader(address);
  const response = await axiosWithBaseUrl.get(`/user/tier-info`, configHeader) as any;
  
  let stakedInfo;
  let userTier = 0;
  if (response?.status && response?.status === 200 && response?.data) {
    stakedInfo = response?.data?.data?.stakedInfo || {};
    userTier = response?.data?.data?.tier || 0;
  }
  
  result = {
    ...result,
  };
  
  const totalStaked = convertFromWei(stakedInfo?.totalPoints);
  
  result = {
    ...result,
    totalStaked: totalStaked,
  };
  
  return {
    tokenStakes: result,
    userTier: userTier
  };
};


/**
 * Functions: Total Raise
 */
export const getTotalRaiseByPool = (pool: any) => {
  let totalRaise = "0";
  const currencySymbol = "$";
  if (!pool) {
    return { totalRaise, currencySymbol }
  }
  
  const poolStatus = pool?.poolStatus || pool?.campaign_status;
  if (poolStatus === "TBA" || poolStatus === "Upcoming" || poolStatus === "Swap") {
    const rateUsdPrice = (pool.purchasableCurrency || pool.accept_currency) === ACCEPT_CURRENCY.ETH
      ? pool.priceUsdt || pool.price_usdt || 0
      : pool.ethRate || pool.token_conversion_rate || 0;
    
    totalRaise = new BigNumber(pool?.amount || pool?.total_sold_coin || 0)
      .multipliedBy(rateUsdPrice)
      .toFixed();
    
    totalRaise = roundOff(totalRaise); // Round up with 0 decimal place
    
  } else if (poolStatus === "Filled" || poolStatus === "Claimable" || poolStatus === "Ended") {
    const totalSoldCoin = pool?.totalSoldCoin || pool?.total_sold_coin || 0;
    
    totalRaise = roundOff( (new BigNumber(totalSoldCoin).multipliedBy(pool.ethRate || pool.token_conversion_rate || 0)).toString());
    // When finished, fake to all tokens sold out
    // totalRaise = calculateTokenSoldWhenFinish(totalRaise);
    totalRaise = roundOff(totalRaise);
  }
  
  return {
    totalRaise,
    currencySymbol,
  };
};

export const showTotalRaisePrice = (pool: any) => {
  const { totalRaise, currencySymbol } = getTotalRaiseByPool(pool);
  // return `${numberWithCommas(totalRaise)} ${currencySymbol}`;
  return `${currencySymbol}${numberWithCommas(totalRaise,0)}`;
};

export const showStartTime = (pool: any) => {
  if (!pool?.start_time) {
    return 'TBA'
  }
  const startTime = new Date(parseInt(pool?.start_time) * 1000)
  return `${ startTime.toLocaleDateString()} ${startTime.getHours() === 0 ? '00' : startTime.getHours()}:${startTime.getMinutes() === 0 ? '00' : startTime.getMinutes()}`;
};

export const showStartTimeGiveAway = (pool: any) => {
  if (!pool?.start_time) {
    return "TBA";
  }
  
  const startTime = new Date(parseInt(pool?.start_time) * 1000);
  
  // Format date
  const formattedDate = startTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  // Format time
  const hours = startTime.getHours().toString().padStart(2, "0");
  const minutes = startTime.getMinutes().toString().padStart(2, "0");
  const ampm = startTime.getHours() >= 12 ? "PM" : "AM";
  
  const formattedTime = `${hours}:${minutes} ${ampm} UTC`;
  
  return `${formattedDate}, ${formattedTime}`;
};

export const showRefundTime = (pool: any) => {
  if (!pool?.start_refund_time || !pool?.end_refund_time) {
    return 'TBA'
  }
  const startTime = new Date(parseInt(pool?.start_refund_time) * 1000)
  const lengthSecond = parseInt(pool?.end_refund_time) - parseInt(pool?.start_refund_time)
  let refundTimePeriod = Math.floor(lengthSecond / 60)
  let refundTimeUnit = "m"
  if (refundTimePeriod >= 60) {
    refundTimePeriod = Math.floor(refundTimePeriod / 60)
    refundTimeUnit = "h"
  }
  if (refundTimePeriod >= 24) {
    refundTimePeriod = Math.floor(refundTimePeriod / 24)
    refundTimeUnit = "d"
  }
  return `Refund within ${refundTimePeriod}${refundTimeUnit} from ${ startTime.toLocaleDateString()} ${startTime.getHours() === 0 ? '00' : startTime.getHours()}:${startTime.getMinutes() === 0 ? '00' : startTime.getMinutes()}`;
};
