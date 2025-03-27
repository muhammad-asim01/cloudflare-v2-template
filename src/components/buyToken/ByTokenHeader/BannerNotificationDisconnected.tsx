'use client'

import BigNumber from "bignumber.js";
import React, {useContext, useEffect, useState} from "react";
import { isMobile } from "react-device-detect";
import { POOL_IS_PRIVATE } from "@/constants";
import { numberWithCommas } from "@/utils/formatNumber";
import { PoolStatus } from "@/utils/getPoolStatus";
import Button from "../Button";
import styles from "@/styles/buyTokenHeader.module.scss"
import {AppContext} from "@/AppContext";
import ConnectWalletModal from "@/components/Base/HeaderDefaultLayout/ConnectWalletModal";
import {HeaderContext} from "@/components/Base/HeaderDefaultLayout/context/HeaderContext";
import Image from "next/image";

const CLASSES = {
  NORMAL: "normal",
  WIN: "win",
  NOT_WIN: "not-win",
  APPLIED: "applied",
};

function BannerNotificationDisconnected(props: any) {
  const {
    openConnectWallet,
    setOpenConnectWallet,
  } = useContext(AppContext);

  const {
    poolDetails,
    ableToFetchFromBlockchain,
    winnersList,
    isOverTimeApplyWhiteList,
    poolStatus,
    refetch,
    totalLoading,
    tokenSold,
    soldProgress,
    poolTimeline,
  } = props;

  const [showSwapProgress, setShowSwapProgress] = useState<boolean>(false);
  const [iconBanner, setIconBanner] = useState<string | null>(null);
  const [classNameTitle, setClassNameTitle] = useState<string>("");
  const [notificationText, setNotificationText] = useState<any>({
    whitelist: "",
    allocation: "",
    winAmount: "",
  });
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);

  const {
    joinTimeInDate
  } = poolTimeline;

  const handleConnectWalletOpen = () => {
    if(setOpenConnectWallet) {
      setOpenConnectWallet(true);
    }
  };

  const handleConnectWalletClose = () => {
    if(setOpenConnectWallet) {
      setOpenConnectWallet(false);
    }
  };
  const totalSoldCoin = poolDetails?.totalSoldCoin || 0;

  // const isCanceledWhitelist = userCanceledWhiteList && userCanceledWhiteList.id;
  const poolType = Number(poolDetails?.isPrivate || "0");
  const isEventPool = poolType === POOL_IS_PRIVATE.EVENT;
  const poolForCommunity =
      poolType === POOL_IS_PRIVATE.COMMUNITY || isEventPool;
  const joinableWhitelist =
      !(ableToFetchFromBlockchain && winnersList && winnersList.total > 0) &&
      !isOverTimeApplyWhiteList &&
      (poolStatus === PoolStatus.Upcoming || poolStatus === PoolStatus.TBA);

  const showApplyWhitelistButton = !poolForCommunity && joinableWhitelist;
  const showJoinCompetitionButton =
      poolForCommunity &&
      !!poolDetails?.socialRequirement?.gleam_link &&
      joinableWhitelist;
  const disableJoinButton =
      !joinTimeInDate || (joinTimeInDate && new Date() < joinTimeInDate);
  const showJoinButton = showApplyWhitelistButton || showJoinCompetitionButton;

  useEffect(() => {
    const icon = null;
    let className = CLASSES.NORMAL;
    let textWhitelist = "Loading ...";
    let textAllocation = "";
    const textAmount = "";

    if (!totalLoading) {
      // 1. Pool ở trạng thái Upcoming và chưa mở whitelist
      if (poolStatus === PoolStatus.Upcoming || poolStatus === PoolStatus.TBA) {
        className = CLASSES.NORMAL;
        if (!poolForCommunity) {
          textWhitelist = "JOIN INTEREST";
          textAllocation = "The interest is not yet open.";
        } else {
          textWhitelist = isEventPool ? "EVENT POOL" : "JOIN COMPETITION";
          textAllocation = isEventPool
              ? "This pool is reserved for event participants. The event is not yet open."
              : "The competition is not yet open.";
        }
      }

      // 3. Khi đến thời gian Apply whitelist và user chưa apply
      if ((showJoinButton) && !disableJoinButton) {
        className = CLASSES.NORMAL;
        if (!poolForCommunity) {
          textWhitelist = "JOIN INTEREST";
          textAllocation = "The whitelist is now open.";
        } else {
          textWhitelist = isEventPool ? "EVENT POOL" : "JOIN COMPETITION";
          textAllocation = isEventPool
              ? "This pool is reserved for event participants. Click on the button below to learn more about the event."
              : "The competition is opening.";
        }
      }

      if (isOverTimeApplyWhiteList) {
        className = CLASSES.NORMAL;
        if (!poolForCommunity) {
          textWhitelist = "Registration Ended";
          textAllocation = "The Registration has ended.";
        } else {
          textWhitelist = isEventPool ? "EVENT POOL" : "JOIN COMPETITION";
          textAllocation = `${
              isEventPool ? "The event" : "Whitelist period"
          } has ended.`
        }
      }

      // 8-10. Khi pool ở trạng thái Swap | Filled
      if (poolStatus === PoolStatus.Progress || poolStatus === PoolStatus.Filled) {
        setShowSwapProgress(true);
      }
    }

    setClassNameTitle(className);
    setIconBanner(icon);
    setNotificationText({
      whitelist: textWhitelist,
      allocation: textAllocation,
      winAmount: textAmount,
    });
  }, [refetch, poolStatus, totalLoading]);

  const renderSwapProgress = () => {
    return (
        <div className={styles.swapProgress}>
          <div className="title-progress">Swap Progress</div>
          <div className={styles.progress}>
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
                  src="/assets/images/icons/icon_progress_burn.svg"
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
            {numberWithCommas(tokenSold, 0)}
              /{numberWithCommas(totalSoldCoin)}
          </span>
          </div>
        </div>
    );
  };
  return (
    <>
      <HeaderContext.Provider value={{ agreedTerms, setAgreedTerms }}>
        <ConnectWalletModal
          opened={openConnectWallet as boolean}
          handleClose={handleConnectWalletClose}
        />
      </HeaderContext.Provider>
      {showSwapProgress ? (
        renderSwapProgress()
      ) : (
        <div className={styles.notification}>
          <>
            <div className={`noti-whitelist ${classNameTitle}`}>
              {iconBanner && <Image width={24} height={24} src={iconBanner} alt="" />}
              <span>{notificationText.whitelist}</span>
            </div>

            <span className="noti-allocation">
              {notificationText.allocation}
              {notificationText.winAmount && (
                <>
                  <span className="text-amount win">
                    {notificationText.winAmount}
                  </span>
                  .
                </>
              )}
            </span>
          </>

          {/* {showSubWallet && !totalLoading && (
            <div>
              <div className={styles.solanaWallet}>Solana Wallet Address</div>
              <div className={styles.solanaInput}>
                <Image width={24} height={24} src={iconSolana} alt="" />
                <span>{`${whitelistSubmission?.airdrop_address.slice(
                  0,
                  8
                )}*****${whitelistSubmission?.airdrop_address.slice(
                  -8
                )}`}</span>
              </div>
            </div>
          )} */}

          {showApplyWhitelistButton && !totalLoading && (
            <Button
              text="Register Interest"
              
              color={"#1e1e1e"}
              style={{
                width: "100%",
                height: 36,
                borderRadius: 50,
                font: "normal normal 500 14px/20px   Violet Sans",
                background: "transparent",
                border: "1px solid  #0066FF",
               
                padding: 4,
                margin: isMobile ? "7px auto" : "unset",
                color:'#1e1e1e'
              }}
              disabled={disableJoinButton}
              onClick={handleConnectWalletOpen}
            />
          )}

          {showJoinCompetitionButton && !totalLoading && (
            <Button
              text={isEventPool ? "About Event" : "Join Competition"}
              backgroundColor={isEventPool ? "#0066FF" : "#0066FF"}
              color={isEventPool ? "#000" : "#000"}
              style={{
                width: "100%",
                height: 36,
                borderRadius: 2,
                font: "normal normal 500 14px/20px   Violet Sans",
                border: "none",
                padding: 8,
                margin: isMobile ? "7px auto" : "unset",
              }}
              disabled={disableJoinButton}
              onClick={() =>
                window.open(poolDetails?.socialRequirement?.gleam_link)
              }
            />
          )}

          {/* {showWhitelistStatusButton && !totalLoading && (
            <Button
              text="Whitelist Status"
              backgroundColor="#FFD058"
              style={{
                width: "100%",
                height: 36,
                backgroundColor: "FFD058",
                borderRadius: 4,
                color: "#fff",
                font: "normal normal 500 14px/20px   Violet Sans",
                border: "none",
                padding: 8,
                // position: isMobile ? 'initial' : 'absolute',
                margin: isMobile ? "7px auto" : "unset",
              }}
              onClick={openApplyWhitelistModal}
            />
            )} */}
        </div>
      )}
    </>
  );
}

export default BannerNotificationDisconnected;
