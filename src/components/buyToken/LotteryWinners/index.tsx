'use client'

/* import { CircularProgress } from '@mui/material'; */
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import commonStyles from '@/styles/commonstyle.module.scss'

import { numberWithCommas } from "@/utils/formatNumber";
import styles from '@/styles/lotteryWinner.module.scss'


type LotteryWinnersProps = {
  poolId: number | undefined;
  title: string | undefined;
  userWinLottery: boolean | undefined;
  pickedWinner?: boolean;
  currencyName: string;
  userBuyLimit: string | undefined;
  alreadyJoinPool: boolean | undefined;
  joinPoolSuccess: boolean;
  isCommunityPool: boolean;
  setNumberWiner: any;
  participantNumber?: string;
  userReferralAllocation?: string | undefined;
};

const LotteryWinners: React.FC<LotteryWinnersProps> = (
  props: LotteryWinnersProps
) => {
  const {
    poolId,
    title,
    userWinLottery,
    pickedWinner,
    currencyName,
    userBuyLimit,
    alreadyJoinPool,
    joinPoolSuccess,
    isCommunityPool,
    setNumberWiner,
    participantNumber = "0",
  } = props;
  const [totalWinners, setTotalWinners] = useState<string>("0");
  const { data: winnersList } = useFetch<any>(
    poolId ? `/user/winner-list/${poolId}?page=1&limit=10&` : undefined
  );


  useEffect(() => {
    if (winnersList?.data) {
      const winnersNumber = winnersList.total || "0";
      setTotalWinners(winnersNumber);
      setNumberWiner(+winnersNumber);
    }
  }, [winnersList, setNumberWiner]);

  if (!pickedWinner) return <></>;

  const getDisplayAllocation = () => {
    return `$${numberWithCommas(userBuyLimit)} ${currencyName}`;
  };

  return (
    <div className={commonStyles.flexCol}>
      {isCommunityPool ? (
        <>
          {!!participantNumber && (
            <div className={styles.winnersNumber}>
              <span className="sub-title">Number of Gleam participants</span>
              <span>{`${numberWithCommas(participantNumber)} `}users</span>
            </div>
          )}
          <div className={styles.winnersNumber}>
            <span className="sub-title">Pool Winners (FCFS)</span>
            <span>{`${numberWithCommas(totalWinners)} `}users</span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.winnersNumber}>
            <span className="sub-title">Winner</span>
            <span>{`${numberWithCommas(totalWinners)} `}users</span>
          </div>
        </>
      )}
      {isCommunityPool ? (
        <div className={`${commonStyles.flexRow} ${commonStyles.nnn1424h}`}>
          {userWinLottery ? (
            <div>
              <span>Your allocation for {`${title}`} pool is&nbsp;</span>
              <span className={styles.buyLimit}>{getDisplayAllocation()}</span>
            </div>
          ) : (
            <span>
              You are not on the list of winners for this community pool.
            </span>
          )}
        </div>
      ) : (
        <div className={`${commonStyles.flexRow} ${commonStyles.nnn1424h}`}>
          {userWinLottery ? (
            <div>
              <span>
                Your guaranteed allocation for {`${title}`} pool is&nbsp;
              </span>
              <span className={styles.buyLimit}>{getDisplayAllocation()}</span>
              {/* , which includes:
              <ul className={styles.allocation}>
                <li>
                  Allocation by Referral Program:{" "}
                  <span className={styles.buyLimit}>
                    ${numberWithCommas(userReferralAllocation || "0")}
                  </span>
                </li>
                <li>
                  Allocation by Winner Selection Mechanism:{" "}
                  <span className={styles.buyLimit}>
                    $
                    {numberWithCommas(
                      Number(
                        +(userBuyLimit ?? "0") -
                          +(userReferralAllocation ?? "0")
                      ).toFixed(0)
                    )}
                  </span>
                </li>
              </ul> */}
            </div>
          ) : (
            <span>
              {alreadyJoinPool || joinPoolSuccess
                ? "Unfortunately, you did not win a guaranteed allocation for this pool."
                : "You did not apply for this pool's interest "}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LotteryWinners;
