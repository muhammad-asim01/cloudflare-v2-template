'use client'

import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import useAuth from "@/hooks/useAuth";
import { getUserInfo } from "@/store/slices/sota-tierSlice";
import NoStakeUser, { LearnMoreTier } from "../NoStakeUser";
import TierInfomation from "../TierInfomation";
import styles from '@/styles/manageTier.module.scss'
import { useRouter } from "next/navigation";
const ManageTier = (props: any) => {
  const history = useRouter();
  const dispatch = useDispatch();
  const configData: any = useSelector((store: any) => store?.config?.data);
  const { showTierInfo } = props;
  const { connectedAccount } = useAuth();

  useEffect(() => {
    connectedAccount && dispatch(getUserInfo(connectedAccount));
  }, [connectedAccount, dispatch]);
 
  return (
    <div className={styles.content}>
      {showTierInfo ? (
        <div className={styles.stakingContent}>
          <p className={styles.title}>
            {configData?.myTiers?.StakingInfo[0]?.title}
          </p>
          <p className={styles.contentUnderTitle}>
            {configData?.myTiers?.StakingInfo[0]?.description}
          </p>

          <div className={styles.stakingInfo}>
            <TierInfomation
              title="Stake Now"
              action={() => history.push("/staking-pools?benefit=ido-only")}
            />
          </div>
        </div>
      ) : (
        <NoStakeUser isOverview={true} />
      )}

      <div className={styles.lineLearMore}></div>

      <LearnMoreTier />
    </div>
  );
};

export default ManageTier;
