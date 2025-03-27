'use client'
import { Hidden } from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import ManageTier from "./ManageTier";
import styles from '@/styles/myTiers.module.scss'
import TierBenefits from "./TierBenefits";
import TierList from "./TierList";

const tabMenu = ["Overview", "Tier Benefits"];

const MyTiers = (props: any) => {
  const [loading, setLoading] = useState(true);
  const { isAuth, connectedAccount, wrongChain } = useAuth();

  const [tabMyTier] = useState(tabMenu);
  const [acitveTab, setAcitveTab] = useState<number>(0);

  const {
    showMoreInfomation = false,
    tiersBuyLimit,
    total,
    hideStatistics,
  
    userInfo,
    userTier,
    tiers,
    totalRedKitePoints,
    pointsLeftToNextTier,
  } = props;

  const [currentProcess, setCurrentProcess] = useState(undefined) as any;

  const calculateProcess = (ListData: any, current: any) => {
    let tierA = 0;
    let tierB = 0;
    let overTier = true;
    for (let i = 0; i < ListData.length; i++) {
      if (ListData[i] > parseFloat(current) && overTier) {
        if (i === 0) {
          tierA = 0;
          tierB = ListData[0];
        } else {
          tierA = ListData[i - 1];
          tierB = ListData[i];
        }
        overTier = false;
      }
    }
    if (overTier) {
      return 100;
    }
    let process = ((parseFloat(current) - tierA) * 100) / (tierB - tierA);
    if (process > 100) process = 100;
    return process;
  };

  useEffect(() => {
    if (!_.isEmpty(tiers)) {
      setLoading(false);
    }
    if (showMoreInfomation && userTier) {
      setCurrentProcess(0);
      return;
    }
    if (!showMoreInfomation && userInfo?.totalStaked) {
      let process = calculateProcess(tiers, userInfo?.totalStaked);
      setCurrentProcess(process);
    }
  }, [
    tiers,
    userTier,
    userInfo,
    tiersBuyLimit,
    showMoreInfomation,
    connectedAccount,
    isAuth,
    wrongChain,
    total,
  ]);

  useEffect(() => {
    if (currentProcess !== undefined) setLoading(false);
  }, [currentProcess, userTier]);



  const viewTiers = () => {
    setAcitveTab(1);
  };

  return (
    <div
      className={
        styles.tierComponent +
        (!loading ? " active" : " inactive") +
        (showMoreInfomation ? " bg-none" : "")
      }
    >
      <div className={styles.tierTitle}>My Tier</div>

      <nav className={styles.menuTier}>
        {tabMyTier.map((item, index) => {
          return (
            <li
              className={`${styles.itemTabMyTier} ${
                index === acitveTab ? "active" : ""
              }`}
              key={index}
              onClick={() => setAcitveTab(index)}
            >
              <Hidden smDown>{item}</Hidden>
              <Hidden mdUp>{item}</Hidden>
            </li>
          );
        })}
      </nav>

      <div className={styles.bodyPage}>
        {acitveTab === 0 && (
          <>
            <TierList
              tiersBuyLimit={tiersBuyLimit}
              tiers={tiers}
              userTier={userTier}
              loading={loading}
              currentProcess={currentProcess}
              showMoreInfomation={showMoreInfomation}
              hideStatistics={hideStatistics}
              totalRedKitePoints={totalRedKitePoints}
              pointsLeftToNextTier={pointsLeftToNextTier}
              viewTiers={() => viewTiers()}
            />

            <ManageTier showTierInfo={true} />
          </>
        )}

        {acitveTab === 1 && <TierBenefits />}
      </div>
    </div>
  );
};

export default MyTiers;
