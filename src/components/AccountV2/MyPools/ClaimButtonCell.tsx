import React from 'react';
import {getPoolStatusByPoolDetail} from "../../../utils/getPoolStatusByPoolDetail";
// import useTokenSoldProgress from "../../BuyToken/hooks/useTokenSoldProgress";
import {PoolStatus} from "../../../utils/getPoolStatus";
import {Button} from "@mui/material";
import styles from '@/styles/modalWhitelistCancel.module.scss'
import moment from "moment";
import BigNumber from "bignumber.js";
import { NETWORK } from '../../../constants';
import { useRouter } from 'next/router';
import useTokenSoldProgress from '@/components/buyToken/hooks/useTokenSoldProgress';
import { toast } from 'react-toastify';

function ClaimButtonCell(props: any) {
  const history = useRouter();
  const { poolDetails, notEth } = props;
  const nowTime = moment().unix();

  const handleClickClaim = () => {
    toast.error('Please wait until the next milestone to claim the tokens.');
  }

  const { tokenSold } = useTokenSoldProgress(
    poolDetails?.campaign_hash,
    poolDetails?.total_sold_coin,
    poolDetails?.network_available,
    poolDetails,
  );
  const poolStatus = getPoolStatusByPoolDetail(
    poolDetails,
    tokenSold
  );

  if (poolStatus == PoolStatus.Filled) {
    return <></>
  }

  const claimPhaseInfo = poolDetails?.claimPhaseInfo;
  const userClaimInfo = poolDetails?.userClaimInfo || {};
  const userClaimed = userClaimInfo.user_claimed;
  const userPurchased = userClaimInfo.user_purchased;
  const maximumTokenClaimUtilNow = new BigNumber(userClaimInfo?.maximum_token_claim_util_now).toFixed();

  if (new BigNumber(userClaimed).eq(userPurchased)) {
    return <></>;
  }

  if (claimPhaseInfo) {
    const nextClaim = claimPhaseInfo.nextClaim;
    if (
      nextClaim && nowTime < nextClaim.start_time &&  // Not reached Next Claim Time yet
      new BigNumber(maximumTokenClaimUtilNow).lte(0)  // User Claimed all availabel token
    ) {
      return (
        <Button
          disabled={notEth}
          onClick={handleClickClaim}
          className={`${styles.btnAction} btnClaimToken`}
        >Claim Token
        </Button>
      );
    }
  }

  if (!userClaimInfo?.show_claim_button) {
    return null;
  }

  return (
    <Button
      disabled={notEth}
      onClick={() => history.push(poolDetails?.network_available === NETWORK.SOLANA
        ? `/solana/buy-token/${poolDetails.id}`
        : `/buy-token/${poolDetails.id}`)}
      className={`${styles.btnAction} btnClaimToken`}>
      Claim Token
    </Button>
  );
}

export default ClaimButtonCell;
