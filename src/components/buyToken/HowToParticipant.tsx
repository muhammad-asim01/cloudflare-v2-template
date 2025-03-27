import React, {useState} from 'react';
import styles from '@/styles/poolinfoabout.module.scss'

import BigNumber from "bignumber.js";
import moment from 'moment'
import momentTimezone from 'moment-timezone';
import { POOL_IS_PRIVATE } from '../../constants';
import Image from 'next/image';

function HowToParticipant(props: any) {
  const [showHowTo, setShowHowTo] = useState<boolean>(false);
  const today = new Date();
  const {
    poolDetails,
    joinTimeInDate,
    endJoinTimeInDate,
    currentUserTier,

    alreadyJoinPool,
    joinPoolSuccess,
    whitelistCompleted,
    isKYC,
  } = props;

  const announcementTime = poolDetails?.announcement_time ? new Date(Number(poolDetails?.announcement_time) * 1000): undefined;
  const announcementTimeDisplay = momentTimezone.tz(announcementTime, moment.tz.guess()).format("dddd, MMMM DD, YYYY");
  const endJoinTimeDisplay = momentTimezone.tz(endJoinTimeInDate, moment.tz.guess()).format("dddd, MMMM DD, YYYY");

  const availableJoin = (poolDetails?.method === 'whitelist' && joinTimeInDate && endJoinTimeInDate) ? today <= endJoinTimeInDate : false;
  if (!availableJoin) {
    return <></>;
  }
  const enoughtMinTier = new BigNumber(currentUserTier?.level || 0).gte(poolDetails?.minTier);
  const appliedWhiteList = alreadyJoinPool || joinPoolSuccess;
  const isAppliedSuccess = isKYC && appliedWhiteList && enoughtMinTier;
  const isCommunityPool = poolDetails?.isPrivate === POOL_IS_PRIVATE.COMMUNITY;

  return (
    <>
      <div className={styles.bottomBoxHowTo}>
        <div className={styles.boxHowTo}>
          <div className={styles.titleBoxHowTo} onClick={() => setShowHowTo(!showHowTo)}>
            How to participate?
            <Image width={24} height={24} className={styles.iconHowTo} src={`/assets/images/icons/${showHowTo ? 'icon_how_to_close' : 'icon_how_to'}.svg`} alt="" />
          </div>
          {
            showHowTo &&
            <div className={styles.contentHowTo}>
              <ul className={styles.listHowTo}>
                <li className={`${styles.itemHowTo} ${isKYC && styles.activeItemHowTo}`}>
                  <div className={`${styles.checkmark} ${isKYC && styles.activeCheckmark}`}></div>
                  KYC Verification
                </li>
                <li className={`${styles.itemHowTo} ${enoughtMinTier && styles.activeItemHowTo}`}>
                  <div className={`${styles.checkmark} ${enoughtMinTier && styles.activeCheckmark}`}></div>
                  Achieve Min Tier of pool
                </li>
                <li className={`${styles.itemHowTo} ${appliedWhiteList && styles.activeItemHowTo}`}>
                  <div className={`${styles.checkmark} ${appliedWhiteList && styles.activeCheckmark}`}></div>
                  {isCommunityPool ? 'Join Competition' : 'Register Interest'}
                </li>
              </ul>
              <div className={styles.textClickHowTo}>
                {isAppliedSuccess &&
                  (
                  <>
                    {!whitelistCompleted &&
                    'Please wait until your whitelist application is approved. We will check and verify later in a short time.'
                    }
                    {whitelistCompleted &&
                    <>
                      {announcementTimeDisplay &&
                      `You are ready for the IDO. Please stay tune for winner annoucement on ${announcementTimeDisplay}`
                      }
                      {!announcementTimeDisplay &&
                      `You are ready for the IDO. Please stay tune for winner annoucement on ${endJoinTimeDisplay}`
                      }
                    </>
                    }
                  </>
                  )
                }
                {!isAppliedSuccess &&
                  (isCommunityPool
                  ? 'Click Join Competition button to participate in the competition.'
                  : 'Click Register Interest button to join the Interest.')
                }
              </div>
            </div>
          }
        </div>
      </div>

    </>
  );
}

export default HowToParticipant;
