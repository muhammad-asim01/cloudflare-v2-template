import React from 'react';
import {getPoolStatusByPoolDetail} from "@/utils/getPoolStatusByPoolDetail";
import BigNumber from "bignumber.js";
import moment from "moment";
import {getFirstClaimConfigTime} from "@/utils/getPoolCountDown";
import useTokenSoldProgress from '@/components/buyToken/hooks/useTokenSoldProgress';

function ClaimStatusTextCell(props: any) {
  const { poolDetails } = props;
  const { tokenSold } = useTokenSoldProgress(
    poolDetails?.poolAddress,
    poolDetails?.amount,
    poolDetails?.networkAvailable,
    poolDetails,
  );
  const poolStatus = getPoolStatusByPoolDetail(
    poolDetails,
    tokenSold
  );

  const nowTime = moment().unix();
  const userClaimInfo = poolDetails?.userClaimInfo || {};
  const userClaimed = userClaimInfo.user_claimed;
  const userPurchased = userClaimInfo.user_purchased;
  const firstClaimConfigTime = getFirstClaimConfigTime(poolDetails);
  if (new BigNumber(userClaimed).eq(userPurchased)) {
    if (firstClaimConfigTime && firstClaimConfigTime < nowTime) {
      return <div className="status_pool completed"><span>Completed</span></div>
    }
  }

  return (
    <div className="status_pool claimable"><span>{poolStatus}</span></div>
  );
}

export default ClaimStatusTextCell;
