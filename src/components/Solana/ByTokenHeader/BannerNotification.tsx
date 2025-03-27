'use client'

import BigNumber from "bignumber.js";
import moment from "moment";
import momentTimezone from "moment-timezone";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { POOL_IS_PRIVATE, PUBLIC_WINNER_STATUS } from "@/constants";
import { numberWithCommas } from "@/utils/formatNumber";
import { PoolStatus } from "@/utils/getPoolStatus";
import Button from "../Button";
import ApplyWhiteListButton from "./ApplyWhiteListButton";
import styles from "@/styles/buyTokenHeader.module.scss"

import WhitelistNotificationButton from "./WhitelistNotificationButton";
import Image from "next/image";

const iconApplied = "/assets/images/icon-applied.svg";
const iconWin = "/assets/images/icon-check.svg";
const iconNotWin = "/assets/images/icon-not-win.svg";
const CLASSES = {
  NORMAL: "normal",
  WIN: "win",
  NOT_WIN: "not-win",
  APPLIED: "applied",
};
function BannerNotification(props: any) {
  const {
    poolDetails,
    ableToFetchFromBlockchain,
    winnersList,
    verifiedEmail,
    currentUserTier,
    existedWinner,
    currencyName,
    userBuyLimit,
    isOverTimeApplyWhiteList,
    alreadyJoinPool,
    joinPoolSuccess,
    connectedAccount,
    wrongChain,
    poolStatus,
    poolJoinLoading,
    onApplyWhitelist,
    openWhitelistNotificationModal,
    refetch,
    totalLoading,
    showKyc,
    showMinTier,
    tokenSold,
    soldProgress,
    poolTimeline,
    isTonWalletLinked
  } = props;

  const [showSwapProgress, setShowSwapProgress] = useState<boolean>(false);
  const [iconBanner, setIconBanner] = useState<string | null>(null);
  const [classNameTitle, setClassNameTitle] = useState<string>("");
  const [notificationText, setNotificationText] = useState<any>({
    whitelist: "",
    allocation: "",
    winAmount: "",
  });

  const {
    joinTimeInDate,
    endJoinTimeInDate,
    endBuyTimeInDate,
    announcementTime,
  } = poolTimeline;

  const now = new Date();
  const totalSoldCoin = poolDetails?.totalSoldCoin || 0;

  const listWinnerReadyPublic =
    winnersList &&
    winnersList.total > 0 &&
    poolDetails?.publicWinnerStatus === PUBLIC_WINNER_STATUS.PUBLIC;

  // const isCanceledWhitelist = userCanceledWhiteList && userCanceledWhiteList.id;
  const poolType = Number(poolDetails?.isPrivate || "0");
  const isEventPool = poolType === POOL_IS_PRIVATE.EVENT;
  const poolForCommunity =
    poolType === POOL_IS_PRIVATE.COMMUNITY || isEventPool;
  const joinableWhitelist =
    !(winnersList && winnersList.total > 0) &&
    !(alreadyJoinPool || joinPoolSuccess) &&
    !isOverTimeApplyWhiteList &&
    (poolStatus === PoolStatus.Upcoming || poolStatus === PoolStatus.TBA);

  const showTierButton = showKyc || showMinTier;
  const showApplyWhitelistButton = !poolForCommunity && joinableWhitelist;
  const showJoinCompetitionButton =
    poolForCommunity &&
    !!poolDetails?.socialRequirement?.gleam_link &&
    joinableWhitelist;
  const disableJoinButton =
    !joinTimeInDate || (joinTimeInDate && new Date() < joinTimeInDate);
  const showJoinButton = showApplyWhitelistButton || showJoinCompetitionButton;
  
  useEffect(() => {
    let icon: string | null = null;
    let className: string = CLASSES.NORMAL;
    let textWhitelist: string = "Loading ...";
    let textAllocation: string = "";
    let textAmount: string = "";

    if (!totalLoading) {
      // 1. Pool ở trạng thái Upcoming và chưa mở whitelist
      if (poolStatus === PoolStatus.Upcoming || poolStatus === PoolStatus.TBA) {
        className = CLASSES.NORMAL;
        if (!poolForCommunity) {
          if(listWinnerReadyPublic && (alreadyJoinPool || joinPoolSuccess)) {
            if (existedWinner) {
              // user win
              icon = iconWin;
              className = CLASSES.WIN;
              textWhitelist = isEventPool ? "EVENT WINNER" : "WIN COMPETITION";
              textAllocation = `Congrats! Your allocation for ${
                isEventPool ? "event" : "community"
              } pool is \n\n`;
              // textAmount = `Gold = $500+ in $AITECH \n\n
              // Diamond = $1,600+ in $AITECH`;
              textAmount = `$${numberWithCommas(userBuyLimit)} ${currencyName}`;
            } else {
              // user not win, not join
              icon = iconNotWin;
              className = CLASSES.NOT_WIN;
              textWhitelist = isEventPool
                ? "NOT WIN EVENT"
                : "NOT WIN COMPETITION";
              textAllocation = `Unfortunately, you are not in the winner list of this ${
                isEventPool ? "Event" : "Community"
              } Pool`;
            }
          } else {
            if(listWinnerReadyPublic && !alreadyJoinPool) {
              textWhitelist = "JOIN INTEREST";
              textAllocation = "Interest is no Longer open as allocations has already been calculated.";
            } else {
              textWhitelist = "JOIN INTEREST";
              textAllocation = "The interest is not yet open.";
            }
          }
        } else {
          textWhitelist = isEventPool ? "EVENT POOL" : "JOIN COMPETITION";
          textAllocation = isEventPool
            ? "This pool is reserved for event participants. The event is not yet open."
            : "The competition is not yet open.";
        }
      }

      // 3. Khi đến thời gian Apply whitelist và user chưa apply
      if ((showJoinButton || showKyc || showMinTier) && !disableJoinButton) {
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

      // 2. User không apply whitelist và whitelist đã đóng.
      if (!alreadyJoinPool && isOverTimeApplyWhiteList) {
        className = CLASSES.NORMAL;
        if (!poolForCommunity) {
          textWhitelist = "WHITELIST NOT APPLIED";
          textAllocation = "You did not apply for this pool's whitelist.";
        } else {
          textWhitelist = isEventPool ? "EVENT POOL" : "JOIN COMPETITION";
          textAllocation = `${
            isEventPool ? "The event" : "Sale Periods"
          } has ended. Allocation Results will be announced on ${momentTimezone
            .tz(announcementTime, moment.tz.guess())
            .format("dddd, MMMM DD, YYYY")}`;
        }
      }
      // 4. User Apply whitelist thành công - Public Pool
      if (
        (alreadyJoinPool || joinPoolSuccess) &&
        // whitelistCompleted &&
        // !whitelistLoading &&
        !listWinnerReadyPublic &&
        !poolForCommunity
      ) {
        icon = iconApplied;
        className = CLASSES.APPLIED;
        textWhitelist = "Registered Interest";
        textAllocation = `Allocation Results will be announced on ${momentTimezone
          .tz(announcementTime, moment.tz.guess())
          .format("dddd, MMMM DD, YYYY")}`;
      }

      // 5-6. Có KQ whitelist
      if (
        listWinnerReadyPublic &&
        verifiedEmail &&
        now.valueOf() < endBuyTimeInDate?.valueOf()
      ) {
        if (poolForCommunity) {
          if (existedWinner) {
            // user win
            icon = iconWin;
            className = CLASSES.WIN;
            textWhitelist = isEventPool ? "EVENT WINNER" : "WIN COMPETITION";
            textAllocation = `Congrats! Your allocation for ${
              isEventPool ? "event" : "community"
            } pool is \n\n`;
            // textAmount = `Gold = $500+ in $AITECH \n\n
            // Diamond = $1,600+ in $AITECH`;
            textAmount = `$${numberWithCommas(userBuyLimit)} ${currencyName}`;
          } else {
            // user not win, not join
            icon = iconNotWin;
            className = CLASSES.NOT_WIN;
            textWhitelist = isEventPool
              ? "NOT WIN EVENT"
              : "NOT WIN COMPETITION";
            textAllocation = `Unfortunately, you are not in the winner list of this ${
              isEventPool ? "Event" : "Community"
            } Pool`;
          }
        } else {
          // Public Pool
          // user not apply whitelist
          className = CLASSES.NORMAL;
          textWhitelist = "WHITELIST NOT APPLIED";
          textAllocation = "You did not apply for this pool's whitelist.";

          if (alreadyJoinPool || joinPoolSuccess) {
            if (!existedWinner) {
              // user not win
              icon = iconNotWin;
              className = CLASSES.NOT_WIN;
              textWhitelist = "NOT WIN WHITELIST";
              textAllocation =
                "Unfortunately, you did not win a guaranteed allocation for this pool. However, you can join FCFS Phase if there is any token left from Phase 1.";
            } else {
              // user win
              icon = iconWin;
              className = CLASSES.WIN;
              textWhitelist = "WIN WHITELIST";
              textAllocation = `Congrats! Your guaranteed allocation for this pool is \n\n`;
              // textAmount = `Gold = $500+ in $AITECH \n\n
              // Diamond = $1,600+ in $AITECH`;
              textAmount = `${numberWithCommas(userBuyLimit)} ${currencyName}`;
            }
          }
        }
      }

      // 8-10. Khi pool ở trạng thái Swap | Filled
      if (
        poolStatus === PoolStatus.Progress ||
        poolStatus === PoolStatus.Filled
      ) {
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
  }, [refetch, poolStatus, totalLoading, connectedAccount]);

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
            {numberWithCommas(tokenSold, 0)}/{numberWithCommas(totalSoldCoin)}
          </span>
        </div>
      </div>
    );
  };
  return (
    <>
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

          {!isOverTimeApplyWhiteList && showTierButton && !totalLoading && (
            <WhitelistNotificationButton
              joinPool={openWhitelistNotificationModal}
            />
          )}

          {showApplyWhitelistButton && !showTierButton && !totalLoading && (
            <ApplyWhiteListButton
              poolDetails={poolDetails}
              joinTimeInDate={joinTimeInDate}
              endJoinTimeInDate={endJoinTimeInDate}
              currentUserTier={currentUserTier}
              connectedAccount={connectedAccount}
              wrongChain={wrongChain}
              verifiedEmail={verifiedEmail}
              alreadyJoinPool={alreadyJoinPool}
              joinPoolSuccess={joinPoolSuccess}
              poolJoinLoading={poolJoinLoading}
              joinPool={onApplyWhitelist}
              winnersList={winnersList}
              ableToFetchFromBlockchain={ableToFetchFromBlockchain}
              isTonWalletLinked = {isTonWalletLinked}
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

export default BannerNotification;
