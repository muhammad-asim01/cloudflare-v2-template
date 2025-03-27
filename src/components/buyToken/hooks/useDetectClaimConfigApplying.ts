import { useState, useEffect } from 'react';
import moment from "moment";
import BigNumber from "bignumber.js";
import {formatRoundDown} from "@/utils/formatNumber";



const useDetectClaimConfigApplying = (
  poolDetails: any,
  userPurchased: any,
  userClaimed: any,
) => {
  const [currentClaim, setCurrentClaim] = useState<any>();
  const [currentClaimIndex, setCurrentClaimIndex] = useState(0);
  const [nextClaim, setNextClaim] = useState<any>();
  const [nextClaimIndex, setNextClaimIndex] = useState(0);
  const [maximumTokenClaimUtilNow, setMaximumTokenClaimUtilNow] = useState<any>(0);
  let detechCurrentPhaseInterval = undefined as any;

  useEffect(() => {
    const detechCurrentPhase = () => {
      const now = moment();
      const nowUnix = now.unix();
      let validRow: any = null;
      let validIndex = -1;
      for (let i = 0; i < poolDetails.campaignClaimConfig.length; i++) {
        const row = poolDetails.campaignClaimConfig[i];
        if (nowUnix < row.start_time) {
          break;
        } else {
          validRow = row;
          validIndex = i;
        }
      }
      if (validRow) {
        setCurrentClaim(validRow);
        setCurrentClaimIndex(validIndex);

        const next = poolDetails.campaignClaimConfig[validIndex + 1];
        if (next) {
          setNextClaim(next);
          setNextClaimIndex(validIndex + 1);
        }

        if (validIndex >= 0 && userPurchased && userClaimed) {
          let maximum: any = (new BigNumber(validRow?.max_percent_claim || 0).dividedBy(100).multipliedBy(userPurchased || 0)).minus(userClaimed);
          maximum = new BigNumber(formatRoundDown(maximum));
          if (maximum.lt(0)) {
            setMaximumTokenClaimUtilNow(0);
          } else {
            setMaximumTokenClaimUtilNow(maximum);
          }
        }
      }
    };

    if (poolDetails && poolDetails.campaignClaimConfig && poolDetails.campaignClaimConfig.length > 0) {
      detechCurrentPhase();
      detechCurrentPhaseInterval = setInterval(() => {
        detechCurrentPhase();
      }, 10000);
    }

    return () => {
      if (detechCurrentPhaseInterval) {
        clearInterval(detechCurrentPhaseInterval);
      }
    };
  }, [poolDetails, userPurchased, userClaimed]);

  return {
    currentClaim,
    currentClaimIndex,
    nextClaim,
    nextClaimIndex,
    maximumTokenClaimUtilNow,
  }
};

export default useDetectClaimConfigApplying;
