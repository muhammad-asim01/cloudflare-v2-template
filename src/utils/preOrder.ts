import {unixTimeNow} from "./convertDate";

export const checkIsInPreOrderTime = (params: any) => {
  const { poolDetails, currentUserTierLevel } = params;
  if (!poolDetails) return false;
  if (!checkIsEnoughTierPreOrder({ poolDetails, currentUserTierLevel})) return false;

  // Check whether is in PreOrder Time
  const startPreOrderTime = poolDetails.startPreOrderTime || poolDetails.start_pre_order_time;
  const startBuyTime = poolDetails.startBuyTime || poolDetails.start_time;
  if (!startPreOrderTime || !startBuyTime) return false;  // Not set PreOrder Time in Admin

  const now = unixTimeNow();
  if (startPreOrderTime <= now && now < startBuyTime) {
    return true;
  }
  return false;
};

export const checkIsEnoughTierPreOrder = (params: any) => {
  const { poolDetails, currentUserTierLevel } = params;
  if (!poolDetails) return false;
  if ((currentUserTierLevel || 0) < (poolDetails.pre_order_min_tier || poolDetails.preOrderMinTier || 0)) return false; // User must is Phoenix Tier
  return true;
}

export const checkIsPoolPreOrder = (params: any) => {
  const { poolDetails } = params;
  if (!poolDetails) return false;

  const startPreOrderTime = poolDetails.startPreOrderTime || poolDetails.start_pre_order_time;
  return !!startPreOrderTime;
}

export const checkAllowUserBuyPreOrder = (params: any) => {
  const {
    poolDetails
  } = params;

  if (!poolDetails) return false;
  // if (!checkIsEnoughTierPreOrder({ poolDetails, currentUserTierLevel})) return false; // User must is Phoenix Tier
  // if (!userJoined) return false;  // User must join pool
  // if (!userIsWinner) return false;  // User must in Winner List

  const startPreOrderTime = poolDetails.startPreOrderTime || poolDetails.start_pre_order_time;
  const startBuyTime = poolDetails.startBuyTime || poolDetails.start_time;
  if (!startPreOrderTime || !startBuyTime) return false;  // Not set PreOrder Time in Admin

  const now = unixTimeNow();
  if (!(startPreOrderTime <= now && now < startBuyTime)) {
    return false;
  }

  return true;
};

export const getPreOrderPoolInfo = () => {

};

