"use client";

// import { Tooltip } from "@mui/material";
import { ONE_DAY_IN_SECONDS } from "@/components/staking-pools/Pool/LinearPool";
import React from "react";
import { useRouter } from "next/navigation";
import common from '@/styles/commonstyle.module.scss'


const nextIcon = "/assets/images/icons/next.svg";
import styles from '@/styles/landingcomponentstakingcard.module.scss'
import Image from "next/image";

export const StakingCard = (props: any) => {
  const { cardInfo = {} } = props;
  const history = useRouter();

  const goToPoolDetail = () => {
    history.push(`/staking-pools?poolId=${cardInfo?.pool_id}`);
  };
  return (
    <div className={styles.cardContainer} onClick={goToPoolDetail}>
        <div className={`${styles.layerContainer}`}>
            <div className={styles.layer1}>
                <div className={styles.layer2}>
                  {/* <Tooltip
                    classes={{ tooltip: styles.tooltip }}
                    title={`${cardInfo.title}`}
                    arrow
                    placement="top"
                  >
                    <p className={`${common.nnb2428i} ${styles.cardTitle}`}>
                      {cardInfo.title}
                    </p>
                  </Tooltip> */}
                  {cardInfo?.point_rate > 0 ? (
                    <span className={`${common.nnn1424h} sub-title`}>{cardInfo?.point_rate}x Multiplier</span>
                  ) : (
                    <span
                      className={`${common.nnn1424h} sub-title`}
                      style={{ color: "#D0AA4D" }}
                    >
                      Without IDO
                    </span>
                  )}
                  <div className={styles.subInfo}>
                    <span className="sub-title">APR</span>
                    <span>{cardInfo?.APR}%</span>
                  </div>
                  <div className={styles.subInfo}>
                    <span className="sub-title">Lock-up term</span>
                    <span>
                      {Number(cardInfo?.lockDuration) > 0
                        ? `${(Number(cardInfo?.lockDuration) / ONE_DAY_IN_SECONDS).toFixed(
                            0
                          )} days`
                        : "None"}
                    </span>
                  </div> 
                  <div className={styles.subInfo}>
                    <span className="sub-title">Withdrawal delay time</span>
                    <span>
                      {Number(cardInfo?.delayDuration) > 0
                        ? `${(Number(cardInfo?.delayDuration) / ONE_DAY_IN_SECONDS).toFixed(
                            0
                          )} days`
                        : "None"}
                    </span>
                  </div> 
                  <a href="/staking-pools" className={styles.btn}>
                    Discover
                    <Image alt="" width={24} height={24} style={{ marginLeft: 8 }} src={nextIcon} />
                  </a>
                </div>
            </div>
        </div>
    </div>
  );
};
