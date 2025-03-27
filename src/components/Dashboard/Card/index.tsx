"use client";

// import { Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CountdownSort from "@/components/Base/CountdownSort";
import { NETWORK, NETWORK_SRC_ICON, CUSTOM_NETWORK } from "@/constants";
// import { getIconCurrencyUsdt } from "@/utils/usdt";
import {
  getAccessPoolText,
  getProgressWithPools,
  getTokenSold,
  showRefundTime,
  showStartTime,
  showTotalRaisePrice,
} from "@/utils/campaign";
import { getPoolCountDown } from "@/utils/getPoolCountDown";
import { PoolStatus } from "@/utils/getPoolStatus";
import { getPoolStatusByPoolDetail } from "@/utils/getPoolStatusByPoolDetail";

import styles from "@/styles/card.module.scss";
import { numberWithCommas } from "@/utils/formatNumber";
import axios from "@/services/axios";
import useTokenSoldProgress from "@/components/buyToken/hooks/useTokenSoldProgress";
import Image from "next/image";
import CustomImage from "@/components/Base/Image";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Card = (props: any) => {
  const { pool, autoFetch } = props;
  const [tokenSold, setTokenSold] = useState("0");
  const [showUpcomingPoolsV3Display, setShowUpcomingPoolsV3Display] =
    useState<any>("");

  async function getPoolsUpcomingTokenPrice() {
    // Directly work with the pool object, no need to create a copy or map it
    let poolWithTokenPrice = { ...pool }; // Create a shallow copy if mutation is a concern
    const symbolList = pool.symbol ? [pool.symbol] : []; // Work with a single symbol directly
    const searchParams = symbolList.length > 0 ? symbolList.join(",") : ""; // This will effectively be just the one symbol or empty
    await axios
      .get(`${baseUrl}/token-price?page=0&search=${searchParams}`)
      .then((response) => {
        // No need to map, directly find the token price for the single pool
        const tokenPrice = response.data.data.data.find(
          (dt: any) => dt.token_symbol === pool.symbol.toUpperCase()
        );
        // Update poolWithTokenPrice directly
        poolWithTokenPrice = {
          current_price: tokenPrice && Number(tokenPrice.current_price),
          current_roi:
            tokenPrice &&
            Number(tokenPrice.current_price / tokenPrice.ido_price),
          current_usd_value:
            tokenPrice &&
            Number(tokenPrice.current_price * pool.total_sold_coin),
          original_usd_value: Number(pool.total_sold_coin * pool.token_price),
          ath_roi:
            +pool.ath_roi !== 0
              ? +pool.ath_roi
              : tokenPrice && Number(tokenPrice.ath_roi),
        };
      })
      .catch((e) => {
        console.log("ERROR analytic", e);
      });
    setShowUpcomingPoolsV3Display(poolWithTokenPrice); // Assuming this function exists to update the UI
    return poolWithTokenPrice;
  }

  useEffect(() => {
    getPoolsUpcomingTokenPrice();
  }, [pool]);

  useEffect(() => {
    const getTokenProgressInfoByPool = async () => {
      if (autoFetch) {
        pool.tokenSold = await getTokenSold(pool);
      }
      const {
        tokenSold: totalTokenSold,
      } = getProgressWithPools(pool);

      setTokenSold(totalTokenSold);
    };

    getTokenProgressInfoByPool();
    if (autoFetch) {
      const intervalProgress = setInterval(() => {
        getTokenProgressInfoByPool();
      }, 10000);

      return () => {
        if(intervalProgress) {
          clearInterval(intervalProgress)
        }
      };
    }
  }, [pool]);

  const poolStatus = getPoolStatusByPoolDetail(pool, tokenSold);

  const { soldProgress } = useTokenSoldProgress(
    pool?.poolAddress,
    pool?.amount,
    pool?.networkAvailable,
    pool
  );

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
  const releaseTimeInDate = pool?.releaseTime
    ? new Date(Number(pool?.releaseTime) * 1000)
    : undefined;

  const isPrivate = pool?.is_private || 0;
  const campaignStatus = pool?.campaign_status || PoolStatus.TBA;

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
    []
  );

  const { date: countDownDate, displayShort } = displayCountDownTime(
    pool?.buy_type,
    joinTimeInDate,
    endJoinTimeInDate,
    startBuyTimeInDate,
    endBuyTimeInDate
  );
  const goToPoolDetail = () => {
    if (pool.isTBAPool) {
      window.open(pool.website);
      return;
    }
    // history.push(pool?.network_available === NETWORK.SOLANA
    //   ? `/solana/buy-token/${pool.id}`
    //   : `/buy-token/${pool.id}`);
  };

  return (
    <div className={`${styles.boxCard}`} onClick={goToPoolDetail}>
      <div className={`${styles.card} ${styles.layerContainer}`}>
        <div className={styles.cardHeader}>
        <CustomImage
              className="pooimg"
              src={pool?.banner}
              alt="Pool Banner"
              unoptimized={false}
              width={400}
              height={250}
              defaultImage={
                "/assets/images/defaultImages/image-placeholder.png"
              }
            />

          <div className={styles.listStatus}>
            <div className={`${styles.poolStatusWarning}`}>
              {getAccessPoolText(pool)}
            </div>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardBodyHead}>
            <div className="card-content__title">
              {/* <Tooltip
                classes={{ tooltip: styles.tooltip }}
                title={`${pool.title} (${pool.symbol})`}
                arrow
                placement="top"
              >
                <p>{pool.title}</p>
              </Tooltip> */}
            </div>
            <div className={styles.network_ton}>
              {pool?.network_available !== "tba" && (
                <Image width={32} height={32}
                  src={
                    NETWORK_SRC_ICON[
                      pool?.network_available ?? NETWORK.ETHEREUM
                    ]
                  }
                  alt=""
                />
              )}
              {CUSTOM_NETWORK && !!pool?.is_custom_network ? (
                <Image 
                width={32} height={32}
                src={ pool?.custom_network_icon ||  "/assets/images/ton_symbol.svg"} alt="" />
              ) : (
                <></>
              )}
            </div>
          </div>
          <ul className="card-content__content">
            {pool.relationship_type !== "Giveaway" && (
              <li>
                <span>Total Raise</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {pool.isTBAPool
                    ? "-"
                    : Number(showTotalRaisePrice(pool)) < 100
                    ? "Free Tokens"
                    : Number(pool?.token_conversion_rate) > 0
                    ? showTotalRaisePrice(pool)
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.relationship_type === "Giveaway" && (
              <li>
                <span>Total Tokens</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {pool?.total_sold_coin
                    ? numberWithCommas(pool?.total_sold_coin)
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.relationship_type === "Giveaway" && (
              <li>
                <span>Original USD Value</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {showUpcomingPoolsV3Display?.original_usd_value
                    ? "$" +
                      numberWithCommas(
                        Math.floor(
                          Number(showUpcomingPoolsV3Display?.original_usd_value)
                        ).toString()
                      )
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.relationship_type === "Giveaway" && (
              <li>
                <span>Current USD Value</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {showUpcomingPoolsV3Display?.current_usd_value
                    ? "$" +
                      numberWithCommas(
                        Math.floor(
                          Number(showUpcomingPoolsV3Display?.current_usd_value)
                        ).toString()
                      )
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.relationship_type === "Giveaway" && (
              <li>
                <span>Original Token Price</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {pool.token_price
                    ? numberWithCommas(pool.token_price)
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.relationship_type === "Giveaway" && (
              <li>
                <span>Current Token Price</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {showUpcomingPoolsV3Display.current_price
                    ? showUpcomingPoolsV3Display.current_price.toFixed(2)
                    : "TBA"}
                </span>
              </li>
            )}
            {pool.isTBAPool ||
            (pool?.participant_number || 0) * 1 < 1000 ? null : (
              <li>
                <span>Registrations</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {numberWithCommas(
                    String((pool?.participant_number || 0) * 1)
                  )}
                </span>
              </li>
            )}
            {pool.relationship_type !== "Giveaway" && (
              <li>
                <span>Token Price</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {!pool?.display_token_price ? (
                    "TBA"
                  ) : (
                    <>
                      {pool.isTBAPool
                        ? "-"
                        : Number(pool?.token_conversion_rate) > 0
                        ? `$${numberWithCommas(pool?.token_conversion_rate, 4)}`
                        : "TBA"}
                    </>
                  )}
                </span>
              </li>
            )}
            <li>
              <span>Start date</span>
              <span
                className="total"
                style={{ fontSize: 13, fontWeight: "normal" }}
              >
                {pool.isTBAPool ? "-" : showStartTime(pool)}
              </span>
            </li>
            {pool.relationship_type !== "Giveaway" && (
              <li>
                <span>Refund Term</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {pool?.refund_terms ? (
                    <span>{pool?.refund_terms}</span>
                  ) : (
                    "TBA"
                  )}
                </span>
              </li>
            )}
            {!pool.isTBAPool && showRefundTime(pool) != "TBA" && (
              <li>
                <span>Refund Period</span>
                <span
                  className="total"
                  style={{
                    fontSize: 13,
                    fontWeight: "normal",
                    width: "60%",
                    textAlign: "right",
                    lineHeight: 1.5,
                  }}
                >
                  {pool.isTBAPool ? "-" : showRefundTime(pool)}
                </span>
              </li>
            )}
            <li>
              <span>Type</span>
              <span
                className="total"
                style={{ fontSize: 13, fontWeight: "normal" }}
              >
                {pool?.relationship_type ? pool?.relationship_type : "None"}
              </span>
            </li>
            {pool.relationship_type !== "Giveaway" && (
              <li>
                <span>Market Maker</span>
                <span
                  className="total"
                  style={{ fontSize: 13, fontWeight: "normal" }}
                >
                  {pool?.market_maker ? (
                    <span>{pool?.market_maker}</span>
                  ) : (
                    "None"
                  )}
                </span>
              </li>
            )}
            {/* <li>
              <span>Rate</span>
              <span className="total">
                1&nbsp;{tokenDetails?.symbol}
                &nbsp;=&nbsp;
                {pool?.ether_conversion_rate} &nbsp;{currencyName}
              </span>
            </li>
            <li>
              <span>Supported</span>
              <span className="total">{currencyName}</span>
            </li> */}
          </ul>

          {displayShort ? (
            <div className={styles.btnApplied}>
              {displayShort}&nbsp;
              <CountdownSort startDate={countDownDate} />
            </div>
          ) : (
            <div
              className={styles.btnApplied}
              style={{
                backgroundColor:
                  campaignStatus === PoolStatus.Progress
                    ? "#D01F36"
                    : "transparent",
              }}
            >
              {[PoolStatus.Progress, PoolStatus.Filled].includes(campaignStatus)
                ? campaignStatus === PoolStatus.Progress
                  ? "Swap now"
                  : "Detail"
                : "TBA"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
