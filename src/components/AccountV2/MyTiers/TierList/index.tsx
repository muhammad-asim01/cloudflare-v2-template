'use client'

import { isNumber } from "lodash";
import { TIERS } from "../../../../constants";
import useAuth from "../../../../hooks/useAuth";
import { numberWithCommas } from "../../../../utils/formatNumber"
;import styles from '@/styles/tierList.module.scss'

const arrowRight = "/assets/images/arrowRightWhite.svg";

import common from '@/styles/commonstyle.module.scss'
import useResponsive from "@/hooks/useResponsive";

import Image from "next/image";
import CustomImage from "@/components/Base/Image";
import { useSelector } from "react-redux";



const TierList = (props: any) => {
  const {isMobile,isMobileUp} = useResponsive()
  
  const { connectedAccount } = useAuth();

  const {
    tiersBuyLimit,
    tiers,
    userTier,
    loading,
    currentProcess,
    showMoreInfomation,
    hideStatistics,
    totalRedKitePoints,
    pointsLeftToNextTier,
    viewTiers,
  } = props;

  const tiersValue = userTier ? TIERS[userTier] : TIERS[0];
  const configData: any = useSelector((store: any) => store?.config?.data);


  return (
    <div className={styles.tierListComponent}>
      <div className={common.nnn1424h}>Your current tier:</div>
      <div className={styles.currentTier}>
      {tiersValue?.icon &&
      
      <CustomImage
      width={20} height={20} src={tiersValue?.icon} 
      alt=""
      onError={(event: any) => {
        event.target.src =   "/assets/images/defaultImages/image-placeholder.png";
      }}
      defaultImage={
         "/assets/images/defaultImages/image-placeholder.png"
      }
    />
      }
        {tiersValue?.name}
        <span>{totalRedKitePoints} CGPTsp</span>
      </div>

      <ul className={styles.tierList}>
        {tiers.length > 0 &&
          tiers.map((tier: any, idx: any) => {
            if (tier !== 0) {
              const tierOverviewItem = configData?.myTiers?.TierOverview[idx]
              return (
                <li
                  key={idx}
                  style={{
                    color: userTier > idx ? TIERS[idx + 1].bgColor : "#d9d9d9"
                  }}
                  className={
                    styles.tierInfo +
                    (userTier > idx ? " active " : " ") +
                    TIERS[idx].name +
                    (hideStatistics ? " hide-statistics" : "")
                  }
                >
                  {+userTier > idx + 1 && connectedAccount && (
                    <span
                      className={
                        "progress-bar" + (loading ? " inactive" : " active")
                      }
                      style={{
                        backgroundColor: TIERS[idx + 1].bgColor,
                        transition: `all 1s ease ${idx + 1}s`,
                      }}
                    />
                  )}
                  {+userTier === idx + 1 &&
                    connectedAccount &&
                    !showMoreInfomation &&
                    isMobileUp && (
                      <span
                        className={
                          "progress-bar" + (loading ? " inactive" : " active")
                        }
                        style={{
                          backgroundColor: TIERS[idx + 1].bgColor,
                          width: `${currentProcess}%`,
                        }}
                      />
                    )}
                  {+userTier === idx + 1 &&
                    connectedAccount &&
                    !showMoreInfomation &&
                    isMobile && (
                      <span
                        className={
                          "progress-bar" + (loading ? " inactive" : " active")
                        }
                        style={{
                          backgroundColor: TIERS[idx + 1].bgColor,
                          height: `${currentProcess}%`,
                        }}
                      />
                    )}
                  <div>
                    <div
                      className={`icon ${
                        userTier === idx + 1 && "current-tier"
                      }`}
                    >
                      <div className="icon-inner">
                      {tierOverviewItem?.icon_url && 
                      
                      <CustomImage
                      height={30}
                      width={30}
                    
                      src={tierOverviewItem?.icon_url} alt="" 
                 
                      onError={(event: any) => {
                        event.target.src =   "/assets/images/defaultImages/image-placeholder.png";
                      }}
                      defaultImage={
                         "/assets/images/defaultImages/image-placeholder.png"
                      }
                    />
                      }
                      </div>
                    </div>
                    <div className="info">
                      <span
                        className={
                          userTier > idx
                            ? "tier-name tier-completed"
                            : "tier-name"
                        }
                      >
                        {tierOverviewItem?.title} 
                      </span>
                      {!showMoreInfomation && (
                        <span> {numberWithCommas(tierOverviewItem?.title === "Ape" ? tiers[0] : tierOverviewItem?.title === "Chad" ? tiers[1] : tierOverviewItem?.title === "Shark" ? tiers[2] : tierOverviewItem?.title === "Whale" ? tiers[3] : null)} CGPTsp</span>
                      )}
                      {showMoreInfomation && !hideStatistics && (
                        <span>
                          {numberWithCommas(tiersBuyLimit[idx + 1])} CGPTsp
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            }
          })}
      </ul>

      {isNumber(+pointsLeftToNextTier) && +pointsLeftToNextTier > 0 ? (
        <div className={styles.pointsLeft}>
          Get <span>{numberWithCommas(pointsLeftToNextTier)}</span> more
          Degen Staking Points to achieve {TIERS[userTier + 1].name} Tier
          <button className={styles.buttonViewTier} onClick={() => viewTiers()}>
            View DegenPad Tiers
            <Image width={20} height={20} src={arrowRight} alt="" />
          </button>
        </div>
      ) : (
        <div className={styles.pointsLeft}>
          You achieve Whale tier
          <button className={styles.buttonViewTier} onClick={() => viewTiers()}>
            View DegenPad Tiers
            <Image width={20} height={20} src={arrowRight} alt="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TierList;
