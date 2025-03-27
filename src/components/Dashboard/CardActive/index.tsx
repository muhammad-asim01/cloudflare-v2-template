"use client";

// import { Tooltip } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import CountdownSort from "@/components/Base/CountdownSort";
import {
  NETWORK,
  NETWORK_SRC_ICON,
  NETWORK_TEXT_SHORT,
  POOL_IS_PRIVATE,
  CUSTOM_NETWORK,
} from "@/constants";
import {
  getProgressWithPools,
  getTokenSold,
  showTotalRaisePrice,
} from "@/utils/campaign";
import { numberWithCommas } from "@/utils/formatNumber";
import { getPoolCountDown } from "@/utils/getPoolCountDown";
import { PoolStatus } from "@/utils/getPoolStatus";
import { getPoolStatusByPoolDetail } from "@/utils/getPoolStatusByPoolDetail";
// import useTokenSoldProgress from "../../BuyToken/hooks/useTokenSoldProgress";
import usePoolDetails from "@/hooks/usePoolDetails";
import styles from "@/styles/cardActive.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import useTokenSoldProgress from "@/components/buyToken/hooks/useTokenSoldProgress";
import Image from "next/image";

const CardActive = (props: any) => {
  const { pool, autoFetch } = props;
  const history = useRouter();

  const { poolDetails } = usePoolDetails(pool.id);

  // const [progress, setProgress] = useState("0");
  // const [tokenSold, setTokenSold] = useState("0");
  const [totalSoldCoin, setTotalSoldCoin] = useState("0");
  useEffect(() => {
    const getTokenProgressInfoByPool = async () => {
      if (autoFetch) {
        pool.token_sold = await getTokenSold(pool);
      }
      const {
        totalSoldCoin: totalToken,
      } = getProgressWithPools(pool);

      // setProgress(progressPercent);
      // setTokenSold(totalTokenSold);
      setTotalSoldCoin(totalToken);
    };

    getTokenProgressInfoByPool();
    // if (autoFetch) {
    //   const intervalProgress = setInterval(() => {
    //     getTokenProgressInfoByPool();
    //   }, 10000);

    //   return () => {
    //     intervalProgress && clearInterval(intervalProgress);
    //   };
    // }
  }, [autoFetch, pool]);


  const { tokenSold, soldProgress } = useTokenSoldProgress(
    poolDetails?.poolAddress,
    poolDetails?.amount,
    poolDetails?.networkAvailable,
    poolDetails
  );
  const poolStatus = getPoolStatusByPoolDetail(pool, tokenSold);

  const isPrivate = pool?.is_private || 0;

  const joinTimeInDate = pool?.start_join_pool_time
    ? new Date(Number(pool?.start_join_pool_time) * 1000)
    : undefined;
  const endJoinTimeInDate = pool?.end_join_pool_time
    ? new Date(Number(pool?.end_join_pool_time) * 1000)
    : undefined;
  const startBuyTimeInDate = pool?.start_time
    ? new Date(Number(pool?.start_time) * 1000)
    : undefined;
  const endBuyTimeInDate = pool?.finish_time
    ? new Date(Number(pool?.finish_time) * 1000)
    : undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const releaseTimeInDate = pool?.release_time
    ? new Date(Number(pool?.release_time) * 1000)
    : undefined;

  const displayCountDownTime = useCallback(
    (
      method: string | undefined,
      startJoinTime: Date | undefined,
      endJoinTime: Date | undefined,
      startBuyTime: Date | undefined,
      endBuyTime: Date | undefined
    ) => {
      return getPoolCountDown(
        startJoinTime,
        endJoinTime,
        startBuyTime,
        endBuyTime,
        releaseTimeInDate,
        method,
        poolStatus,
        pool,
        soldProgress,
        isPrivate
      );
    },
    [pool, poolStatus, releaseTimeInDate, soldProgress]
  );

  const { date: countDownDate, displayShort } = displayCountDownTime(
    pool?.buy_type,
    joinTimeInDate,
    endJoinTimeInDate,
    startBuyTimeInDate,
    endBuyTimeInDate
  );

  const isCommunityPool = isPrivate === POOL_IS_PRIVATE.COMMUNITY;

  const goToPoolDetail = () => {
    history.push(pool?.network_available === NETWORK.SOLANA
      ? `/solana/buy-token/${pool.id}`
      : `/buy-token/${pool.id}`);
  };

  const renderCardActiveLeft = () => {
    return (
      <div className={styles.cardActiveLeft}>
        <Image width={32} height={32} src={pool?.banner || "./images/ido/Screenshot_3.svg"} alt="" />
        <div className={styles.listStatus}>
          {/* <div className={`${styles.poolStatusWarning}`}>
            {getAccessPoolText(pool)}
          </div> */}
          <div className={styles.poolStatusCountdown}>
            {pool.status === PoolStatus.Claimable ? (
              <div className={styles.countdown}>
                <span className={styles.endInTextClaimable}>CLAIMABLE</span>
              </div>
            ) : (
              <div className={styles.countdown}>
                <Image width={24} height={24} src="/images/icons/icon_btn_pool.svg" alt="" />
                <span>&nbsp;{displayShort}&nbsp;</span>
                <span className={styles.endInCountdown}>
                  <CountdownSort
                    startDate={countDownDate}
                    showLongTime={true}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCardActiveRight = () => {
    return (
      <div className={styles.cardActiveRight}>
        <div className="incubationTag">
          {pool?.relationship_type ? pool?.relationship_type : "None"}
        </div>
        <div className={`${styles.top}`}>
          <div className={styles.tokenImg}>
            <Image
            width={32} height={32}
              className={styles.iconToken}
              src={pool?.token_images || "./images/ido/warena.svg"}
              alt=""
            />

          </div>
          <div className="card-content__title">
            <div className="text-title">
              {/* <Tooltip
                classes={{ tooltip: styles.tooltip }}
                title={`${pool?.title} (${pool?.symbol})`}
                arrow
                placement="top"
              >
                <span>{pool?.title}</span>
              </Tooltip> */}
            </div>
            <span className={styles.poolSymbol}>{pool?.symbol}</span>
          </div>
        </div>
        <div className="card-content__content">
          <ul className={styles.flexRow}>
            <li>
              <span>Total Raise</span>
              <span className="total">{showTotalRaisePrice(pool)}</span>
            </li>
            <li>
              <span>{!!pool?.is_custom_network ? "Raise Network" : "Network"}</span>
              <div className={styles.network}>
                {pool?.network_available !== "tba" ? (
                  <>
                    <Image 
                    width={32} height={32}
                      src={
                        NETWORK_SRC_ICON[
                          pool?.network_available ?? NETWORK.ETHEREUM
                        ]
                      }
                      alt=""
                    />
                    <span className="total">
                      {
                        NETWORK_TEXT_SHORT[
                          pool?.network_available ?? NETWORK.ETHEREUM
                        ]
                      }
                    </span>
                  </>
                ) : (
                  <span className="total">TBA</span>
                )}
              </div>
            </li>
            {!!pool?.is_custom_network && CUSTOM_NETWORK && <li>
              <span>Claim Network</span>
              <div className={styles.network}>
              <>
                    <Image width={32} height={32}
                      src={pool?.custom_network_icon || '/images/ton_symbol.svg'}
                      alt=""
                    />
                    <span className="total">
                     {pool?.custom_network_title || ''}
                    </span>
                  </>
              </div>
            </li>}
            <li>
              {isCommunityPool && pool?.participant_number && (
                <div className={styles.flexCol}>
                  <span>Participant</span>
                  <span className="total">
                    {((pool?.participant_number || 0) * 1).toString()}
                  </span>
                </div>
              )}
            </li>
          </ul>
          <div className={styles.progress}>
            <span className={styles.titleProgressArea}>Progress</span>
            <div className={styles.progressBar}>
              <span
                className={`${styles.currentProgress} ${
                  parseFloat(soldProgress) > 0 ? "" : "inactive"
                }`}
                style={{
                  width: `${Math.round(parseFloat(soldProgress))}%`,
                }}
              >
                <Image
                width={24} height={24}
                  className={styles.iconCurrentProgress}
                  src="/images/icons/icon_progress_burn.svg"
                  alt=""
                />
              </span>
            </div>
          </div>
          <div className={styles.progressInfo}>
            <span>
              ({new BigNumber(soldProgress).toFixed(0)}
              %)&nbsp;
            </span>
            <span>
              {numberWithCommas(tokenSold, 0, true)}
              &nbsp;/&nbsp;
              {numberWithCommas(totalSoldCoin, 0, true)}
              &nbsp;
              {pool.symbol}
            </span>
          </div>
        </div>

        <div
          className={`${styles.groupBtnBottom} ${
            pool.status === PoolStatus.Progress ? ` ${styles.btnBuy}` : ""
          }`}
        >
          <Link
          prefetch
            href={pool?.network_available === NETWORK.SOLANA
              ? `/solana/buy-token/${pool.id}`
              : `/buy-token/${pool.id}`}
            onClick={() => {
              if (pool.status === PoolStatus.Progress) {
                
              }
            }}
            className={`${styles.btnSwapNow}${
              pool.status === PoolStatus.Filled ? ` ${styles.btnDetail}` : ""
            }${
              pool.status === PoolStatus.Claimable ? ` ${styles.btnClaim}` : ""
            }`}
          >
            {pool.status === PoolStatus.Progress && "Buy Allocation"}
            {pool.status === PoolStatus.Filled && "Detail"}
            {pool.status === PoolStatus.Claimable && "Claim Now"}
            {pool.status === PoolStatus.Closed && "Ended"}
  
      
          </Link>
        </div>
      </div>
    );
  };
  return (
    <div className={`${styles.cardAvtive} ${styles.layerContainer}`} onClick={goToPoolDetail}>
         {renderCardActiveLeft()}
         {renderCardActiveRight()}
    </div>
  );
};

export default CardActive;
