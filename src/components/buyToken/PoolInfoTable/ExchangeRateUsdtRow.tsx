import React, {useState} from 'react';
import styles from '@/styles/poolinfoabout.module.scss'
import Tooltip from "@mui/material/Tooltip";
import {ACCEPT_CURRENCY} from "@/constants";
import BigNumber from "bignumber.js";
import {getIconCurrencyUsdt} from "@/utils/usdt";
import Image from 'next/image';

function ExchangeRateUsdtRow(props: any) {
  const {
    poolDetail, poolDetails, key, label, force,
  } = props;
  const [showRateReserveUSDT, setShowRateReverseUSDT] = useState<boolean>(false);

  const { currencyName } = getIconCurrencyUsdt(poolDetails);
  const tokenDetails = poolDetails?.tokenDetails;

  let reverseRate = `1 ${tokenDetails.symbol} = ${poolDetails?.ethRate} ${currencyName}`;
  let displayRate = `1 ${currencyName} = ${new BigNumber(1).div(poolDetails?.ethRate).toNumber()} ${tokenDetails?.symbol}`;

  if (force) {
    reverseRate = `1 ${tokenDetails.symbol} = ${poolDetails.priceUsdt} USD`;
    displayRate = `1 USD = ${new BigNumber(1).div(poolDetails.priceUsdt).toNumber()} ${tokenDetails?.symbol}`;
  }

  return (
    <>
      <div className={styles.poolDetailBasic} key={key}>
        <span className={styles.poolDetailBasicLabel}>{poolDetail.label || label}</span>
        <p className={styles.poolsDetailBasicText}>
          <Tooltip title={<p style={{ fontSize: 15 }}>{displayRate}</p>}>
            <span>
              {poolDetails?.purchasableCurrency != ACCEPT_CURRENCY.ETH &&
                <>
                  {/*NOTETH--USDT--*/}
                  {/*{poolDetails?.purchasableCurrency}--{key}-{displayRate}---*/}

                  {showRateReserveUSDT ? reverseRate : displayRate}
                </>
              }

              {poolDetails?.purchasableCurrency === ACCEPT_CURRENCY.ETH &&
                <>
                  {showRateReserveUSDT ? reverseRate : displayRate}
                </>
              }

            </span>
          </Tooltip>
          {poolDetail.utilIcon && <Image width={30} height={30} alt=''
            src={poolDetail.utilIcon}
            className={styles.poolDetailUtil}
            onClick={() => {
              setShowRateReverseUSDT(!showRateReserveUSDT);
            }}
            key={key}
          /> }
        </p>
      </div>
    </>
  );
}

export default ExchangeRateUsdtRow;
