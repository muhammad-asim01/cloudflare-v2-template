import React, {useState} from 'react';
import Tooltip from "@mui/material/Tooltip";
import {ACCEPT_CURRENCY} from "@/constants";
import styles from '@/styles/poolinfoabout.module.scss'
import BigNumber from 'bignumber.js';
import Image from 'next/image';

function ExchangeRateEthRow(props: any) {
  const {
    poolDetail, poolDetails, key,
  } = props;
  const [showRateReserve, setShowRateReverse] = useState<boolean>(false);

  if (poolDetails?.purchasableCurrency != ACCEPT_CURRENCY.ETH) {
    return <></>;
  }

  if (!poolDetails?.displayPriceRate) {
    return <></>;
  }

  const tokenDetails = poolDetails?.tokenDetails;
  const reverseRate = `1 ${tokenDetails.symbol} = ${poolDetails.priceUsdt} USD`;
  const displayRate = `1 USD = ${new BigNumber(1).div(poolDetails.priceUsdt).toNumber()} ${tokenDetails?.symbol}`;

  return (
    <>
      <div className={styles.poolDetailBasic} key={key}>
        <span className={styles.poolDetailBasicLabel}>{poolDetail.label}</span>
        <p className={styles.poolsDetailBasicText}>
          <Tooltip title={<p style={{ fontSize: 15 }}>{displayRate}</p>}>
            <span>
             {poolDetails?.purchasableCurrency != ACCEPT_CURRENCY.ETH &&
               <>
                 {
                   showRateReserve ? reverseRate : displayRate
                 }
               </>
             }
             {poolDetails?.purchasableCurrency === ACCEPT_CURRENCY.ETH &&
               <>
                 { !!poolDetails?.displayPriceRate && (showRateReserve ? reverseRate : displayRate) }
               </>
             }
            </span>
          </Tooltip>

          {poolDetail.utilIcon && <Image width={24} height={24}
          alt=''
            src={poolDetail.utilIcon}
            className={styles.poolDetailUtil}
            onClick={() => {
              setShowRateReverse(!showRateReserve);
            }}
            key={key}
          /> }
        </p>
      </div>
    </>
  );
}

export default ExchangeRateEthRow;
