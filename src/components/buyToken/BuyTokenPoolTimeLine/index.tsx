import { FC } from "react";
import { PoolStatus, poolStatus } from "@/utils/getPoolStatus";
import Countdown from "@/components/Base/Countdown";
import moment from "moment";
import commonStyle from '@/styles/commonstyle.module.scss'

import { CLAIM_TYPE, POOL_IS_PRIVATE } from "@/constants";
import momentTimezone from "moment-timezone";
import styles from '@/styles/buyTokenPoolTimeline.module.scss'

type Props = {
  currentStatus?: poolStatus | undefined;
  display: string | undefined;
  poolDetails: any;
  countDownDate: Date | undefined;
  refetchPoolDetails?: Function;
  refetchCurrentTier?: Function;
  timezone?: string;
  isEnoughTierPreOrder?: boolean;
};
type StatusBarStepProps = {
  name: string;
  value: string;
  active: poolStatus;
  shortDate: Date | undefined;
  shortContent: Date | string | undefined;
  displayDetail: string;
  overTime: boolean;
};

const timeFormat = "HH:mm";
export const getDateTimeDisplay = (date: any, showtime: boolean = true) => {
  const dateTimeFormat = `${showtime ? `${timeFormat}, ` : ""}DD MMM YYYY`;
  return momentTimezone.tz(date, moment.tz.guess()).format(dateTimeFormat);
};
export const getShortTimeDisplay = (date: any, showtime: boolean = true) => {
  const dateTimeFormat = `${showtime ? `${timeFormat}, ` : ""}DD MMM YYYY`;
  return momentTimezone.tz(date, moment.tz.guess()).format(dateTimeFormat);
};

const BuyTokenPoolTimeLine: FC<Props> = ({
  currentStatus,
  display,
  poolDetails,
  countDownDate,
  refetchPoolDetails,
  refetchCurrentTier,
  timezone,
  isEnoughTierPreOrder,
}) => {
  const joinTimeInDate = poolDetails?.joinTime
    ? new Date(Number(poolDetails?.joinTime) * 1000)
    : undefined;
  const endJoinTimeInDate = poolDetails?.endJoinTime
    ? new Date(Number(poolDetails?.endJoinTime) * 1000)
    : undefined;
  const startBuyTimeInDate = poolDetails?.startBuyTime
    ? new Date(Number(poolDetails?.startBuyTime) * 1000)
    : undefined;
  const endBuyTimeInDate = poolDetails?.endBuyTime
    ? new Date(Number(poolDetails?.endBuyTime) * 1000)
    : undefined;

  const startPreOrderTime = poolDetails?.startPreOrderTime
    ? Number(poolDetails?.startPreOrderTime) * 1000
    : undefined;
  const endPreOrderTime = startBuyTimeInDate;
  const startFreeBuyTime = poolDetails?.freeBuyTimeSetting?.start_buy_time
    ? Number(poolDetails?.freeBuyTimeSetting?.start_buy_time) * 1000
    : undefined;
  const startFreeBuyTimeInDate = startFreeBuyTime
    ? new Date(startFreeBuyTime)
    : undefined;

  const isCommunityPool = poolDetails?.isPrivate === POOL_IS_PRIVATE.COMMUNITY;
  const now = new Date().getTime();
  const firstClaimTime =
    poolDetails?.claimType === CLAIM_TYPE.CLAIM_ON_THE_PROJECT_WEBSITE
      ? poolDetails?.claimOnWebsiteTime
        ? Number(poolDetails?.claimOnWebsiteTime) * 1000
        : undefined
      : poolDetails?.campaignClaimConfig[0]?.start_time
      ? Number(poolDetails?.campaignClaimConfig[0]?.start_time) * 1000
      : undefined;
  const firstClaimTimeInDate = firstClaimTime
    ? new Date(firstClaimTime)
    : undefined;

  const statusBarSteps: StatusBarStepProps[] = [
    {
      name: "Upcoming",
      value: "1",
      active: PoolStatus.Upcoming,
      shortDate: undefined,
      shortContent: undefined,
      displayDetail: "",
      overTime: true,
    },
    {
      name: "Swap",
      value: "2",
      active: PoolStatus.Progress,
      shortDate: startBuyTimeInDate,
      shortContent: startBuyTimeInDate,
      displayDetail: "",
      overTime: !!startBuyTimeInDate && now <= startBuyTimeInDate?.getTime(),
    },
    {
      name: "Filled",
      value: "3",
      active: PoolStatus.Filled,
      shortDate: undefined,
      shortContent: undefined,
      displayDetail: "",
      overTime: true,
    },
    {
      name: "Claimable",
      value: "4",
      active: PoolStatus.Claimable,
      shortDate: undefined,
      shortContent: firstClaimTimeInDate,
      displayDetail: "",
      overTime:
        !!firstClaimTimeInDate && now <= firstClaimTimeInDate?.getTime(),
    },
    {
      name: "Ended",
      value: "5",
      active: PoolStatus.Closed,
      shortDate: undefined,
      shortContent: undefined,
      displayDetail: "",
      overTime: true,
    },
  ];

  const getTimeGuarantee = () => {
    if (!startBuyTimeInDate || !endBuyTimeInDate) return "";
    let startIn = getShortTimeDisplay(startBuyTimeInDate);
    let endIn = getShortTimeDisplay(
      !!startFreeBuyTime ? startFreeBuyTimeInDate : endBuyTimeInDate
    );
    return `${startIn} - ${endIn}`;
  };
  const getTimeFCFS = () => {
    if (!startFreeBuyTime || !endBuyTimeInDate) return "";
    let startIn = getShortTimeDisplay(startFreeBuyTimeInDate);
    let endIn = getShortTimeDisplay(endBuyTimeInDate);
    return `${startIn} - ${endIn}`;
  };

  const renderUpcoming = () => {
    return (
      <div className={commonStyle.flexCol}>
        <span>{isCommunityPool ? "Competition" : "Interest"} Period:</span>
        {!!joinTimeInDate ? (
          <>
            <div className={commonStyle.flexRow}>
              <span>From</span>
              <span className="date-period">
                {getDateTimeDisplay(joinTimeInDate)}
              </span>
            </div>
            <div className={commonStyle.flexRow}>
              <span>To</span>
              <span className="date-period">
                {getDateTimeDisplay(endJoinTimeInDate)}
              </span>
            </div>
            {startPreOrderTime && isEnoughTierPreOrder && !isCommunityPool && (
              <div className={commonStyle.flexCol}>
                <span>Pre-Order Period:</span>
                <div className={commonStyle.flexRow}>
                  <span>From</span>
                  <span className="date-period">
                    {getDateTimeDisplay(startPreOrderTime)}
                  </span>
                </div>
                <div className={commonStyle.flexRow}>
                  <span>To</span>
                  <span className="date-period">
                    {getDateTimeDisplay(endPreOrderTime)}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          "TBA. Stay tuned for further updates!"
        )}
      </div>
    );
  };

  const renderSwap = () => {
    return (
      <div className={commonStyle.flexCol}>
        {!!startBuyTimeInDate ? (
          <div className={commonStyle.flexCol}>
            <span>
              {isCommunityPool || !startFreeBuyTime
                ? "Buy time:"
                : "Guaranteed Buy (Phase 1):"}
            </span>
            <span className="time-period">{getTimeGuarantee()}</span>
          </div>
        ) : (
          "TBA"
        )}
        {!!startFreeBuyTime && (
          <div className={commonStyle.flexCol}>
            <span>FCFS Buy Time (Phase 2):&nbsp;</span>
            <span className="time-period">{getTimeFCFS()}</span>
          </div>
        )}
      </div>
    );
  };

  const renderDetailContent = (statusStep: StatusBarStepProps) => {
    const renderDateTimePeriod = () => {
      switch (statusStep.active) {
        case PoolStatus.Upcoming:
          return renderUpcoming();
        case PoolStatus.Progress:
          return !statusStep.overTime && renderSwap();
        case PoolStatus.Claimable:
          return !statusStep.shortContent && "TBA";
        default:
          return <></>;
      }
    };
    return (
      <>
        <div className={styles.detailContent}>{renderDateTimePeriod()}</div>

        {statusStep.active === currentStatus &&
          currentStatus !== PoolStatus.Claimable &&
          currentStatus !== PoolStatus.Filled &&
          currentStatus !== PoolStatus.Closed && (
            <div style={{ marginTop: 20 }}>
              <span className={styles.countdownTitle}>{display}</span>
              <Countdown
                startDate={countDownDate}
                startTimePreOrder={startPreOrderTime}
                startFreeBuyTime={startFreeBuyTime}
                refetchPoolDetails={refetchPoolDetails}
                refetchCurrentTier={refetchCurrentTier}
              />
            </div>
          )}
      </>
    );
  };

  // 12:00 AM, 15 May 2021
  return (
    <section className={styles.sectionBuyTokenPoolTimeLine}>
      <span>* Time zone: (GMT {`${timezone}`})</span>
      <ul className={styles.statusBarSteps}>
        {statusBarSteps?.map((item: StatusBarStepProps, index: number) => {
          return (
            <li
              key={index}
              className={`${styles.itemStatusBarSteps} ${
                item.active === currentStatus ? styles.stepActive : ""
              }`}
            >
              <span
                className={`${styles.itemValue} ${
                  item.name === currentStatus ? "active" : ""
                }`}
              ></span>
              <div className={styles.stepContent}>
                <div className={styles.statusBar}>
                  <span className="status-title">{item.name}</span>
                  {item.shortDate && !item.overTime && (
                    <span className="short-date">
                      {getDateTimeDisplay(item.shortDate, false)}
                    </span>
                  )}
                </div>

                {item.shortContent && item.overTime && (
                  <span
                    className={`${styles.displayShort} ${commonStyle.nnn1216h}`}
                  >
                    {getDateTimeDisplay(item.shortContent)}
                  </span>
                )}
                {renderDetailContent(item)}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BuyTokenPoolTimeLine;
