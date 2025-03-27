'use client'

import { Tooltip } from "@mui/material";
import BigNumber from "bignumber.js";
import { isNumber } from "lodash";
import { useEffect, useState } from "react";
import {
  CLAIM_TYPE,
  CLAIM_TYPE_DESCRIPTION,
  CLAIM_TYPE_TEXT,
  NETWORK,
  NETWORK_SRC_ICON,
} from "@/constants";
import { trimMiddlePartAddress } from "@/utils/accountAddress";
import {
  formatRoundDown,
  formatRoundUp,
  numberWithCommas,
} from "@/utils/formatNumber";
import styles from '@/styles/claimToken.module.scss'
import Image from "next/image";

function ClaimInfo(props: any) {
  const {
    dataUser,
    poolDetails,
    tokenDetails,
    userClaimInfo,
    currencyName,
    userBuyLimit,
    isClaimOnRedkite,
  } = props;
  const [airdropChainLogo, setAirdropChainLogo] = useState<string>("");
  const claimType = poolDetails?.claimType ?? CLAIM_TYPE.CLAIM_ON_LAUNCHPAD;
  const airdropAddress =
    poolDetails?.airdropNetwork === NETWORK.SOLANA
      ? dataUser?.user?.solana_address
      : poolDetails?.airdropNetwork === NETWORK.TERRA
      ? dataUser?.user?.terra_address
      : null;

  useEffect(() => {
    let airdropChain = poolDetails?.airdropNetwork || NETWORK.SOLANA;
    setAirdropChainLogo(NETWORK_SRC_ICON[airdropChain]);
  }, [poolDetails]);

  const {
    userPurchased = 0,
    userClaimed = 0,
  } = userClaimInfo || {};

  return (
    <>
      <div className={styles.poolDetailClaimInfo}>
        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Claim Type</span>
          <Tooltip
            classes={{ tooltip: styles.tooltip }}
            title={CLAIM_TYPE_DESCRIPTION[claimType]}
            arrow
            placement="top"
          >
            <span className={styles.claimTokenContent}>
              {CLAIM_TYPE_TEXT[claimType]}
            </span>
          </Tooltip>
        </div>

        {airdropAddress &&
          poolDetails?.claimType ===
            CLAIM_TYPE.AIRDROP_TO_PARTICIPANTS_WALLETS && (
            <div className={styles.poolDetailClaimInfoBlock}>
              <span>Wallet Address</span>
              <span className={styles.walletField}>
                <Image width={32} height={32} src={airdropChainLogo} alt="" className="chain-icon" />
                {airdropAddress && trimMiddlePartAddress(airdropAddress)}
              </span>
            </div>
          )}

        {poolDetails?.claimPolicy && (
          <div className={styles.poolDetailClaimInfoBlock}>
            <span>Vesting Schedule</span>
            <span className={styles.claimTokenContent}>
              {poolDetails?.claimPolicy}
            </span>
          </div>
        )}

        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Total bought tokens</span>
          <span className={styles.claimTokenContent}>
            {numberWithCommas(`${userPurchased || 0}`, 2)}{" "}
            {tokenDetails?.symbol}
          </span>
        </div>

        <div className={styles.poolDetailClaimInfoBlock}>
          <span>Have bought</span>
          <span className={styles.claimTokenContent}>
            {numberWithCommas(
              `${formatRoundUp(
                new BigNumber(userPurchased).multipliedBy(
                  poolDetails?.ethRate || 0
                )
              )}`,
              2
            )}
            {isNumber(+userBuyLimit) &&
              +userBuyLimit > 0 &&
              `/${numberWithCommas(formatRoundDown(userBuyLimit), 2)}`}
            &nbsp;
            {currencyName}
          </span>
        </div>

        {isClaimOnRedkite && (
          <div className={styles.poolDetailClaimInfoBlock}>
            <span>
              You have claimed{" "}
              {poolDetails?.claimType ===
                CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD && (
                <p className={styles.subTitle}>(On ChainGPT Pad)</p>
              )}
            </span>
            <span className={styles.claimTokenContent}>
              {numberWithCommas(`${userClaimed || 0}`, 2)}/
              {numberWithCommas(`${userPurchased || 0}`, 2)}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default ClaimInfo;
