"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/poolsList.module.scss";
import moment from "moment";
import { ACCEPT_CURRENCY, NETWORK } from "@/constants";
import { numberWithCommas } from "@/utils/formatNumber";
import commonStyle from "@/styles/commonstyle.module.scss";

import { getIconCurrencyUsdt } from "@/utils/usdt";
import { PoolLabel } from "@/utils/getPoolStatus";
import { getProgressWithPools, getTokenSold } from "@/utils/campaign";
import { TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";

import CustomImage from "../Base/Image";

const IdoPoolCard = (props: any) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const { pool } = props;

  useEffect(() => {
    const getTokenSoldByPool = async () => {
      let resTokenSold = "0";
      if (pool.is_deploy) {
        const tokenSold = await getTokenSold(pool);
        resTokenSold = tokenSold;
      }

      let { progress: progressPercent } = getProgressWithPools({
        ...pool,
        tokenSold: resTokenSold,
      });
      setProgress(parseFloat(progressPercent));
    };

    getTokenSoldByPool();
    const intervalProgress = setInterval(() => {
      getTokenSoldByPool();
    }, 20000);

    return () => {
      intervalProgress && clearInterval(intervalProgress);
    };
  }, [pool]);

  useEffect(() => {
    const currentTime = moment().unix();
    let diffTime = parseInt(pool.start_time) - currentTime;
    let intervalCount: any;
    if (diffTime > 0) {
      let timeLeftToStart = diffTime * 1000;
      const interval = 1000;

      intervalCount = setInterval(() => {
        timeLeftToStart -= interval;
        const timeLeftDuration = moment.duration(
          timeLeftToStart,
          "milliseconds"
        );
        let timeLeftString = "";
        if (timeLeftToStart >= 86400000) {
          timeLeftString = "In " + timeLeftDuration.days() + " days";
        } else {
          timeLeftString =
            "In " +
            timeLeftDuration.hours() +
            ":" +
            timeLeftDuration.minutes() +
            ":" +
            timeLeftDuration.seconds();
        }
        setTimeLeft(timeLeftString);
      }, interval);
    }

    return () => clearInterval(intervalCount);
  }, []);

  const { currencyName } = getIconCurrencyUsdt({
    purchasableCurrency: pool?.accept_currency,
    networkAvailable: pool?.network_available,
  });

  const renderStatusColumn = () => {
    switch (pool.label) {
      case PoolLabel.TBA:
        return <span className={`${PoolLabel.TBA}`}>{PoolLabel.TBA}</span>;
      case PoolLabel.Upcoming:
      case PoolLabel.Register:
        return <span className={`${PoolLabel.Upcoming}`}>{pool.label}</span>;
      case PoolLabel.Progress:
      case PoolLabel.Guaranteed:
      case PoolLabel.Fcfs:
      case PoolLabel.PreOrder:
        return <span className={`${PoolLabel.Progress}`}>{pool.label}</span>;
      case PoolLabel.Filled:
        return (
          <span className={`${PoolLabel.Filled}`}>{PoolLabel.Filled}</span>
        );
      case PoolLabel.Closed:
        return (
          <span className={`${PoolLabel.Closed}`}>{PoolLabel.Closed}</span>
        );
      case PoolLabel.Claimable:
        return (
          <span className={`${PoolLabel.Claimable}`}>
            {PoolLabel.Claimable}
          </span>
        );
      default:
        return <span className={`none`}> {pool.label}</span>;
    }
  };

  return (
    <TableRow
      className={styles.tableRow}
      key={pool.id}
      onClick={() => {
        router.push(
          pool?.network_available === NETWORK.SOLANA
            ? `/solana/buy-token/${pool.id}`
            : `/buy-token/${pool?.id}`
        );
      }}
    >
      <TableCell component="th" scope="row">
        <span className="pool-name">
          <CustomImage
            width={32}
            height={32}
            src={pool.token_images}
            alt=""
            onError={(event: any) => {
              event.target.src = "/assets/images/default-pool.svg";
            }}
            defaultImage={"/assets/images/default-pool.svg"}
          />

          <span className={commonStyle.nnb16424i}>{pool.title}</span>
          <span className="token-symbol">{pool.symbol}</span>
        </span>
      </TableCell>
      {/* <TableCell component="th" scope="row">
        {getAccessPoolText(pool)}
      </TableCell> */}
      <TableCell component="th" scope="row">
        <div className="tdata">
          <div className="tname">IDO Price</div>

          {!pool?.display_token_price &&
          pool.relationship_type !== "Giveaway" ? (
            "TBA"
          ) : (
            <>
              {pool.accept_currency === ACCEPT_CURRENCY.ETH && (
                <>{`${numberWithCommas(pool?.price_usdt, 4)} USD`}</>
              )}
              {pool.accept_currency !== ACCEPT_CURRENCY.ETH && (
                <>
                  {numberWithCommas(pool?.token_conversion_rate, 4)}{" "}
                  {currencyName}
                </>
              )}
            </>
          )}
        </div>
      </TableCell>
      <TableCell component="th" scope="row">
        <div className="tdata">
          <div className="tname">Current Price</div>

          <span>
            {pool?.current_price && typeof pool?.current_price == "number"
              ? pool?.current_price.toFixed(4).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              : "TBA"}
          </span>
        </div>
      </TableCell>
      <TableCell component="th" scope="row">
        {/* {pool?.ath_roi ? `${pool?.ath_roi.toFixed(2)}x` : "TBA"} */}
        {/* Static AthRoi value added */}
        <div className="tdata">
          <div className="tname">ATH ROI</div>

          {pool?.static_ath_roi ? pool?.static_ath_roi : "TBA"}
        </div>
      </TableCell>
      {/* Todo: remove this for temparery request */}
      {/* <TableCell component="th" scope="row">
        <div className="tdata">
          <div className="tname">Current ROI</div>

          {pool?.current_roi ? `${customRound(pool?.current_roi)}x` : "TBA"}
        </div>
      </TableCell> */}
      <TableCell component="th" scope="row">
        <div className="tdata">
          <div className="tname">Type</div>

          {pool?.relationship_type ? pool?.relationship_type : "None"}
        </div>
      </TableCell>
      <TableCell component="th" scope="row">
        <div className="tdata">
          <div className="tname">Market Maker</div>
          {pool?.market_maker ? (
            <span>
              <CustomImage
                width={23}
                height={23}
                className="mm-icon"
                alt="maker"
                src={pool?.market_maker_icon}
                onError={(event: any) => {
                  event.target.src =
                    "/assets/images/defaultImages/image-placeholder.png";
                }}
                defaultImage={
                  "/assets/images/defaultImages/image-placeholder.png"
                }
              />
       
              {pool?.market_maker}
            </span>
          ) : (
            "None"
          )}
        </div>
      </TableCell>

      {pool?.relationship_type === "Giveaway" ? (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Original Value</div>

            {pool?.orignal_usd_value
              ? "$" +
                numberWithCommas(
                  Math.floor(Number(pool?.orignal_usd_value)).toString()
                )
              : "TBA"}
          </div>
        </TableCell>
      ) : (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Original Value</div>-
          </div>
        </TableCell>
      )}

      {pool?.relationship_type === "Giveaway" ? (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Current Value</div>

            {pool?.current_usd_value
              ? "$" +
                numberWithCommas(
                  Math.floor(Number(pool?.current_usd_value)).toString()
                )
              : "TBA"}
          </div>
        </TableCell>
      ) : (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Current Value</div>-
          </div>
        </TableCell>
      )}

      {pool?.relationship_type === "Giveaway" ? (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Total Tokens</div>

            {pool?.total_sold_coin
              ? numberWithCommas(pool?.total_sold_coin)
              : "TBA"}
          </div>
        </TableCell>
      ) : (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Total Tokens</div>-
          </div>
        </TableCell>
      )}

      {pool?.relationship_type === "Giveaway" ? (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Winners</div>

            {pool?.winners ? pool?.winners : "TBA"}
          </div>
        </TableCell>
      ) : (
        <TableCell component="th" scope="row">
          <div className="tdata">
            <div className="tname">Winners</div>-
          </div>
        </TableCell>
      )}
      <TableCell component="th" scope="row" className={styles.poolStatus}>
        <div className="tdata">
          <div className="tname">Status</div>

          {renderStatusColumn()}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default IdoPoolCard;
