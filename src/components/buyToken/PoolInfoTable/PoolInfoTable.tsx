import React from 'react';
// import {PoolDetailKey, poolDetailKey} from "../hooks/usePoolDetailsMapping";
import Tooltip from "@mui/material/Tooltip";
import {ACCEPT_CURRENCY} from "@/constants";
import styles from '@/styles/poolinfoabout.module.scss'
import {PoolDetailKey, poolDetailKey} from "../hooks/usePoolDetailsMapping";
import ExchangeRateEthRow from "./ExchangeRateEthRow";
import ExchangeRateUsdtRow from "./ExchangeRateUsdtRow";
import Image from 'next/image';

function PoolInfoTable(props: any) {
  const {
    poolDetailsMapping,
    poolDetails
  } = props;

  return (
    <>
      {
        Object.keys(poolDetailsMapping).map((key: string) => {
          const poolDetail = poolDetailsMapping[key as poolDetailKey];
          if (poolDetails?.method !== 'whitelist' && key === PoolDetailKey.joinTime) return;

          if (key === PoolDetailKey.exchangeRate) {
            if (poolDetails?.purchasableCurrency == ACCEPT_CURRENCY.ETH && !poolDetails?.displayPriceRate) {
              return (
                <ExchangeRateUsdtRow
                  key={key}
                  poolDetails={poolDetails}
                  poolDetail={poolDetail}
                  label={'Exchange Rate'}
                  force={true}
                />
              );
            }
            return (
              <ExchangeRateEthRow
                key={key}
                poolDetails={poolDetails}
                poolDetail={poolDetail}
              />
            );
          }


          if (key === PoolDetailKey.usdtExchangeRate) {
            if (poolDetails?.purchasableCurrency == ACCEPT_CURRENCY.ETH && !poolDetails?.displayPriceRate) {
              return <></>;
            }
            return (
              <ExchangeRateUsdtRow
                key={key}
                poolDetails={poolDetails}
                poolDetail={poolDetail}
              />
            );
          }


          return (
            <div className={styles.poolDetailBasic} key={key}>
              <span className={styles.poolDetailBasicLabel}>{poolDetail.label}</span>
              <p className={styles.poolsDetailBasicText}>
                {
                  poolDetail.image && <Image alt='' layout='fill'  src={poolDetail.image} className={styles.poolDetailBasicIcon}  />
                }
                <Tooltip title={<p style={{ fontSize: 15 }}>{poolDetail.display}</p>}>
                  <span>
                    {(key !== PoolDetailKey.exchangeRate && key !== PoolDetailKey.usdtExchangeRate) && poolDetail.display}

                  </span>
                </Tooltip>
                {
                  poolDetail.utilIcon && (
                    <Image width={32} height={32}
                    alt=''
                      src={poolDetail.utilIcon}
                      className={styles.poolDetailUtil}
                      onClick={() => {
                        if (key === PoolDetailKey.website) {
                          window.open(poolDetail.display as string, '_blank')
                        }
                      }}
                      key={key}
                    />)
                }
              </p>
            </div>
          )
        })
      }

    </>
  );
}

export default PoolInfoTable;
