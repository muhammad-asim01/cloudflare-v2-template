"use client";

import React, { useEffect } from "react";
// import { Tooltip } from "@mui/material";
import styles from "@/styles/cardCompletedSales.module.scss";
// import { getIconCurrencyUsdt } from "@/utils/usdt";
import { PoolLabel } from "@/utils/getPoolStatus";
import {
  getAccessPoolText,
  getTokenSold,
  showTotalRaisePrice,
} from "@/utils/campaign";
import { numberWithCommas } from "@/utils/formatNumber";
import { NETWORK } from "@/constants";
import Link from "next/link";
import CustomImage from "@/components/Base/Image";

const CardCompletedSales = (props: any) => {
  const { pool, autoFetch } = props;

  useEffect(() => {
    const getTokenProgressInfoByPool = async () => {
      if (autoFetch) {
        pool.tokenSold = await getTokenSold(pool);
      }
    };

    getTokenProgressInfoByPool();
    if (autoFetch) {
      const intervalProgress = setInterval(() => {
        getTokenProgressInfoByPool();
      }, 10000);

      return () => {
        if (intervalProgress) {
          clearInterval(intervalProgress);
        }
      };
    }
  }, [autoFetch, pool]);

  const getTextPoolStatus = (status: any) => {
    let className = "",
      text = "";
    switch (status) {
      case PoolLabel.Closed:
        className = "ended";
        text = PoolLabel.Closed;
        break;
      case PoolLabel.TBA:
        className = "tba";
        text = PoolLabel.TBA;
        break;
      case PoolLabel.Filled:
        className = "time";
        text = PoolLabel.Filled;
        break;
      case PoolLabel.Progress:
      case PoolLabel.Fcfs:
      case PoolLabel.Guaranteed:
        className = "in-progress";
        text = status;
        break;
      case PoolLabel.Upcoming:
      case PoolLabel.Register:
        className = "joining";
        text = status;
        break;
      case PoolLabel.Claimable:
        className = "claimable";
        text = PoolLabel.Claimable;
        break;
      default:
        break;
    }
    return (
      <div className={`${styles.poolStatus} ${className}`}>
        <span>{text}</span>
      </div>
    );
  };

  return (
    <Link
      prefetch
      href={
        pool?.network_available === NETWORK.SOLANA
          ? `/solana/buy-token/${pool.id}`
          : `/buy-token/${pool.id}`
      }
    >
      <div className={styles.cardCompletedSales}>
        <div className={styles.leftCard}>
          {pool.token_images && (
            <CustomImage
              alt="token images"
              unoptimized={false}
              width={32}
              height={32}
              src={pool.token_images}
              className={styles.icon}
              defaultImage={
                "/assets/images/defaultImages/image-placeholder.png"
              }
            />
          )}

          <div className={styles.introCard}>
            <div className={styles.listStatus}>
              <span className={`${styles.poolStatusWarning}`}>
                {getAccessPoolText(pool)}
              </span>
              <span>{getTextPoolStatus(pool?.label)}</span>
            </div>
            {/* <Tooltip
              classes={{ tooltip: styles.tooltip }}
              title={pool?.title || ""}
              arrow
              placement="top"
            >
              <span className={styles.title}>{pool?.title || ""}</span>
            </Tooltip> */}
          </div>
        </div>

        <div className={styles.midCard}>
          <ul className={styles.listInfo}>
            {pool.relationship_type !== "Giveaway" ? (
              <li className={styles.itemInfo}>
                <span className={styles.nameInfo}>Total Raise</span>
                <span className={styles.valueInfo}>
                  {showTotalRaisePrice(pool)}
                </span>
              </li>
            ) : (
              <li className={styles.itemInfo}>
                <span className={styles.nameInfo}>Original Value</span>
                <span className={styles.valueInfo}>
                  {pool?.orignal_usd_value
                    ? "$" +
                      numberWithCommas(
                        Math.floor(Number(pool?.orignal_usd_value)).toString()
                      )
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.relationship_type === "Giveaway" && (
              <li className={`${styles.itemInfo} ${styles.alignLeftMobile}`}>
                <span className={styles.nameInfo}>Current Value</span>
                <span className={styles.valueInfo}>
                  {pool?.current_usd_value
                    ? "$" +
                      numberWithCommas(
                        Math.floor(Number(pool?.current_usd_value)).toString()
                      )
                    : "TBA"}
                </span>
              </li>
            )}
            <li
              className={`${
                pool.relationship_type === "Giveaway"
                  ? `${styles.itemInfo}`
                  : `${styles.itemInfo} ${styles.alignLeftMobile}`
              }`}
            >
              <span className={styles.nameInfo}>Participants</span>
              <span className={styles.valueInfo}>
                {numberWithCommas(pool?.participant_number || 0)}
              </span>
            </li>
            {pool.relationship_type !== "Giveaway" ? (
              <li className={styles.itemInfo}>
                <span className={styles.nameInfo}>Current Price</span>
                <span className={styles.valueInfo}>
                  {pool?.current_price
                    ? "$" +
                      numberWithCommas(Number(pool.current_price)?.toString())
                    : "TBA"}
                </span>
              </li>
            ) : (
              <li className={`${styles.itemInfo} ${styles.alignLeftMobile}`}>
                <span className={styles.nameInfo}>Total Tokens</span>
                <span className={styles.valueInfo}>
                  {pool?.total_sold_coin
                    ? numberWithCommas(pool?.total_sold_coin)
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.relationship_type !== "Giveaway" ? (
              <li className={`${styles.itemInfo} ${styles.alignLeftMobile}`}>
                <span className={styles.nameInfo}>ATH ROI</span>
                <span className={styles.valueInfo}>
                  {/* {pool?.ath_roi ? `${parseFloat(pool?.ath_roi).toFixed(2)}x` : "TBA"} */}
                  {/* Static AthRoi value added */}
                  {pool?.static_ath_roi ? pool?.static_ath_roi : "TBA"}
                </span>
              </li>
            ) : (
              <li className={styles.itemInfo}>
                <span className={styles.nameInfo}>Winners</span>
                <span className={styles.valueInfo}>
                  {pool?.winners ? pool?.winners : "TBA"}
                </span>
              </li>
            )}
            {/* Todo: remove this for temparery request */}
            {/* {pool.relationship_type !== "Giveaway" && (
              <li className={`${styles.itemInfo}`}>
                <span className={styles.nameInfo}>Current ROI</span>
                <span className={styles.valueInfo}>
                  {pool?.current_price && pool?.ido_price
                    ? `${customRound(
                        Number(pool?.current_price) / Number(pool?.ido_price)
                      )}x`
                    : "TBA"}
                </span>
              </li>
            )}
           */}
            <li
              className={`${
                pool.relationship_type === "Giveaway"
                  ? `${styles.itemInfo} ${styles.alignLeftMobile}`
                  : `${styles.itemInfo} ${styles.alignLeftMobile}`
              }`}
            >
              <span className={styles.nameInfo}>Type</span>
              <span className={styles.valueInfo}>
                {pool?.relationship_type ? pool?.relationship_type : "None"}
              </span>
            </li>
            <li className={`${styles.itemInfo}`}>
              <span className={styles.nameInfo}>Market Maker</span>
              <span className={styles.valueInfo}>
                {pool?.market_maker ? (
                  <span>
                    {pool?.market_maker_icon && (
                       <CustomImage
                       height={16}
                       width={16}
                       alt="maker"
                       src={pool?.market_maker_icon}
                       onError={(event: any) => {
                         event.target.src = "/assets/images/icons/staking.svg";
                       }}
                       defaultImage={
                         "/assets/images/icons/staking.svg"
                       }
                     />
                  
                    )}
                    {pool?.market_maker}
                  </span>
                ) : (
                  "None"
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default CardCompletedSales;
