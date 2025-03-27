"use client";

import BigNumber from "bignumber.js";
import moment from "moment";
import momentTimezone from "moment-timezone";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionSubmitModal from "@/components/Base/TransactionSubmitModal";
import { CLAIM_TYPE, POOL_STATUS, POOL_STATUS_TEXT } from "@/constants";
import { TokenType } from "@/hooks/useTokenDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import commonStyles from "@/styles/commonstyle.module.scss";

import Button from "@/components/buyToken/Button";
import { getDateTimeDisplay } from "../BuyTokenPoolTimeLine";
import useClaimRefundToken from "@/components/buyToken/hooks/useClaimRefundToken";
import useDetectClaimConfigApplying from "@/components/buyToken/hooks/useDetectClaimConfigApplying";
import usePoolBalance from "@/components/buyToken/hooks/usePoolBalance";
import useTokenClaim from "@/components/buyToken/hooks/useTokenClaim";
import useUserRefundToken from "@/components/buyToken/hooks/useUserRefundToken";
import useUserRemainTokensClaim from "@/components/buyToken/hooks/useUserRemainTokensClaim";
import ClaimInfo from "./ClaimInfo";
import RefundTokenModal from "./RefundTokenModal";
import styles from "@/styles/claimToken.module.scss";
import TableSchedule from "./TableSchedule";
import { NetworkUpdateType, settingAppNetwork } from "@/store/slices/appNetworkSlice";
import { getChainIDByName } from "@/utils";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSwitchChain } from "wagmi";
import { toast } from "react-toastify";
import { updateUserClaimInfo } from "@/store/slices/claimUserInfoSlice";
import Image from "next/image";

type ClaimTokenProps = {
  releaseTime: Date | undefined;
  tokenDetails: TokenType | undefined;
  ableToFetchFromBlockchain: boolean | undefined;
  buyTokenSuccess: boolean | undefined;
  poolId: number | undefined;
  wrongChain: boolean;
  poolDetails: any;
  currencyName: any;
  startBuyTimeInDate: any;
  width?: any;
  isPreOrderPool?: boolean;
  allowUserBuyPreOrder?: boolean;
  startBuyTimeNormal: any;
  userBuyLimit: any;
  dataUser: any;
  setIsRefunded: any;
  poolStatus: string;
};

// chain integration
const ClaimToken: React.FC<ClaimTokenProps> = (props: ClaimTokenProps) => {
  const dispatch = useDispatch();
  const { switchChainAsync } = useSwitchChain();

  const [openClaimModal, setOpenTransactionSubmitModal] =
    useState<boolean>(false);
  const [openRefundTokenModal, setOpenRefundTokenModal] =
    useState<boolean>(false);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [userClaimInfo, setUserClaimInfo] = useState<any>();
  const [userRefundToken, setUserRefundToken] = useState<any>();
  const [canClaimRefundToken, setCanclaimRefundToken] = useState<any>(false);
  const [loadingRefund, setLoadingRefund] = useState<any>(false);
  const [refundTokenSuccess, setRefundTokenSuccess] = useState<boolean>(false);

  const { data: userTier = "0" } = useSelector((state: any) => state.userTier);
  const { address: connectedAccount } = useAppKitAccount();
  const {
    releaseTime,
    poolDetails,
    tokenDetails,
    poolId,
    buyTokenSuccess,
    wrongChain,
    currencyName,
    startBuyTimeInDate,
    isPreOrderPool,
    allowUserBuyPreOrder,
    startBuyTimeNormal,
    userBuyLimit,
    dataUser,
    setIsRefunded,
    poolStatus,
  } = props;

  const nowTime = new Date();
  const deadlineFormat = `HH:mm, DD MMM YYYY`;

  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;

  const poolAddress = useMemo(() => {
    return !!poolDetails?.poolClaimAddress &&
      poolDetails?.poolClaimAddress !== poolDetails?.poolAddress
      ? poolDetails?.poolClaimAddress
      : poolDetails?.poolAddress;
  }, [poolDetails]);

  const poolNetwork = useMemo(() => {
    return poolDetails?.networkClaim &&
      poolDetails?.networkClaim !== poolDetails?.networkAvailable &&
      poolDetails?.poolClaimAddress
      ? poolDetails?.networkClaim || poolDetails?.network_claim
      : poolDetails?.networkAvailable || poolDetails?.network_available;
  }, [poolDetails]);

  const {
    claimToken,
    setClaimTokenLoading,
    transactionHash,
    claimTokenSuccess,
    loading,
    error,
  } = useTokenClaim(poolAddress, poolId, poolDetails?.title);
  const {
    claimRefundToken,
    loadingClaimRefund,
    setLoadingClaimRefundToken,
    transactionHashClaimRefundToken,
    claimRefundTokenSuccess,
  } = useClaimRefundToken(poolAddress, poolId);
  const { retrieveClaimableTokens } = useUserRemainTokensClaim(
    tokenDetails,
    poolAddress,
    poolNetwork
  );
  const { refundBalance, retrieveRefundToken } = useUserRefundToken(
    tokenDetails,
    poolAddress,
    poolDetails?.networkAvailable || poolDetails?.network_available,
    poolDetails?.purchasableCurrency
  );
  const { poolBalance, retrievePoolBalance } = usePoolBalance(
    poolDetails?.purchasableCurrency,
    poolAddress,
    poolDetails?.networkAvailable || poolDetails?.network_available
  );
  const availableClaim = releaseTime ? nowTime >= releaseTime : false;
  const isClaimOnRedkite =
    (poolDetails && !poolDetails.claimType) ||
    poolDetails?.claimType === CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD ||
    poolDetails?.claimType === CLAIM_TYPE.CLAIM_ON_LAUNCHPAD;
  const claimOnWebsiteTimeInDate = poolDetails?.claimOnWebsiteTime
    ? new Date(Number(poolDetails?.claimOnWebsiteTime) * 1000)
    : undefined;
  const claimOnWebsiteTimeFormat = claimOnWebsiteTimeInDate
    ? getDateTimeDisplay(claimOnWebsiteTimeInDate)
    : undefined;

  useEffect(() => {
    const fetchUserPurchased = async () => {
      if (connectedAccount && poolDetails) {
        const [userClaimInformations, userRefundToken] = await Promise.all([
          retrieveClaimableTokens(connectedAccount),
          retrieveRefundToken(connectedAccount),
          retrievePoolBalance(),
        ]);

      
        if (
          userRefundToken &&
          Number(userRefundToken?.currencyAmount) > 0 &&
          !userRefundToken?.isClaimed
        ) {
          setCanclaimRefundToken(true);
        } else {
          setCanclaimRefundToken(false);
        }
        // setUserRefundToken(userRefundToken);
        setUserRefundToken({...userRefundToken,currencyAmount: Number(userRefundToken?.currencyAmount)});
        setIsRefunded(userRefundToken?.isClaimed || false);
        dispatch(updateUserClaimInfo(userClaimInformations));
        setUserClaimInfo(userClaimInformations);
        setUserPurchased(
          (userClaimInformations?.userPurchasedReturn || 0) as number
        );
      }
    };

    fetchUserPurchased();
  }, [
    connectedAccount,
    poolDetails,
    claimTokenSuccess,
    buyTokenSuccess,
    claimRefundTokenSuccess,
    refundTokenSuccess,
  ]);

  useEffect(() => {
    if (error) {
      setOpenTransactionSubmitModal(false);
      setClaimTokenLoading(false);
    }
  }, [error, setClaimTokenLoading]);

  const userPurchasedValue = userClaimInfo?.userPurchased || 0;
  const userClaimed = userClaimInfo?.userClaimed || 0;
  const { nextClaim, maximumTokenClaimUtilNow } = useDetectClaimConfigApplying(
    poolDetails,
    userPurchasedValue,
    userClaimed
  );

  const validateClaimable = async () => {
    if (new BigNumber(userPurchased).lte(0)) {
      toast.error("You not enough claimable token!");
      return false;
    }

    if (!availableClaim) {
      toast.error("You can not claim token at current time!");
      return false;
    }

    if (nextClaim && new BigNumber(maximumTokenClaimUtilNow).lte(0)) {
      toast.error("Please wait until the next milestone to claim the tokens.");
      return false;
    }

    if (
      !nextClaim &&
      new BigNumber(maximumTokenClaimUtilNow).lte(0) // maximumTokenClaimUtilNow <= 0
    ) {
      toast.error("You not enough claimable token!");
      return false;
    }

    if (wrongChain) {
      
      const chainId: any = getChainIDByName(poolDetails?.networkAvailable);
      
      await switchChainAsync({ chainId: Number(chainId) });

      dispatch(settingAppNetwork({networkType:NetworkUpdateType.App, updatedVal:chainId}));
      return true;
    }
    return true;
  };

  const handleTokenClaim = async () => {
    const claimable = await validateClaimable();
    if (!claimable) {
      return;
    }
    try {
      setOpenTransactionSubmitModal(true);
      await claimToken();
    } catch (err) {
      console.log("🚀 ~ handleTokenClaim ~ err:", err);
      setOpenTransactionSubmitModal(false);
    }
  };

  const [dataConfigs, setDataConfigs] = useState<any[]>([]);
  const [currentProgress, setCurrentProgress] = useState([
    {},
    {
      percent: 100,
      marked: true,
      tokenAmount: 10000,
      date: new Date(),
      showInfo: true,
    },
  ]);
  const [paginationProgress, setPaginationProgress] = useState<any>({
    currentPage: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    const total = poolDetails?.campaignClaimConfig?.length || 0;
    if (!total) return;
    // console.log("userClaimInfo", userClaimInfo);

    const userPurchased = userClaimInfo?.userPurchased || 0;
    const userClaimed = userClaimInfo?.userClaimed || 0;
    const percentClaimed = new BigNumber(userClaimed)
      .div(userPurchased)
      .multipliedBy(100);

    let lastPercent = 0,
      currentPage = 1,
      isUnClaimed = false;
    const pageSize = 5;
    const campaignConfigs = poolDetails?.campaignClaimConfig;

    const data = campaignConfigs?.map((cfg: any, index: number) => {
      const percent = new BigNumber(+cfg.max_percent_claim)
          .minus(lastPercent)
          .toNumber(),
        tokenAmount = new BigNumber(userPurchased)
          .multipliedBy(percent)
          .div(100)
          .toNumber(),
        date = new Date(cfg.start_time * 1000),
        marked = new BigNumber(+cfg.max_percent_claim).isLessThanOrEqualTo(
          percentClaimed.toNumber().toFixed(4)
        ),
        showInfo = false;
      lastPercent = +cfg.max_percent_claim;
      if (!marked && !isUnClaimed) {
        currentPage = Math.floor(index / pageSize) + 1;
        isUnClaimed = true;
      }
      return { percent, tokenAmount, date, marked, showInfo };
    });
    //add 0% start for only 1 time claim
    if (data?.length === 1) {
      if (userClaimed > 0) {
        data.unshift({ marked: true });
      } else {
        data.unshift({});
      }
    }
    setDataConfigs(data);
    setPaginationProgress({
      currentPage: currentPage,
      pageSize: pageSize,
      total: total,
    });
  }, [poolDetails, userClaimInfo]);

  useEffect(() => {
    const { currentPage, pageSize } = paginationProgress;
    const firstIndex = (currentPage - 1) * pageSize;
    const currentPageConfigs = dataConfigs.slice(
      firstIndex,
      firstIndex + pageSize
    );
    setCurrentProgress(currentPageConfigs);
  }, [paginationProgress]);

  const userRefundConfig = useMemo(() => {
    if (!poolDetails) return;
    return {
      start_refund_time: poolDetails.start_refund_time,
      end_refund_time: poolDetails.end_refund_time,
    };
  }, [userTier, poolDetails]);

  if (!startBuyTimeInDate || nowTime < startBuyTimeInDate) {
    return <></>;
  }

  // Check with PreOrder Pool
  if (isPreOrderPool && startBuyTimeNormal) {
    if (nowTime < startBuyTimeNormal) {
      if (!allowUserBuyPreOrder) {
        return <></>;
      }
    }
  }

  const getDisabledPrevBtn = () => {
    return paginationProgress.currentPage <= 1;
  };

  const getDisabledNextBtn = () => {
    return (
      paginationProgress.currentPage >=
      paginationProgress.total / paginationProgress.pageSize
    );
  };
  const handleChangeCurrentPage = (number: number) => {
    const newCurrentPage = paginationProgress.currentPage + number;
    setPaginationProgress({
      ...paginationProgress,
      currentPage: newCurrentPage,
    });
  };

  const checkingListingTime = () => {
    // return true: startRefundTime <= current time <= endRefundTime
    const startRefundTime = userRefundConfig?.start_refund_time;
    const endRefundTime = userRefundConfig?.end_refund_time;
    const now = Date.now();
    return (
      startRefundTime &&
      endRefundTime &&
      now >= +startRefundTime * 1000 &&
      now <= +endRefundTime * 1000
    );
  };
  const isRefundOverdue = () => {
    // return true: >1 hour after listinglet endRefundTime = userRefundConfig?.end_refund_time;
    const endRefundTime = userRefundConfig?.end_refund_time;
    return endRefundTime && Date.now() > +endRefundTime * 1000;
  };

  const handleRequestRefund = async () => {
    if (!checkingListingTime())
      toast.error("Please wait until the refund request period starts.");
    setLoadingRefund(true);
    setOpenRefundTokenModal(true);
  };

  const handleClaimRefund = async () => {
    if (new BigNumber(poolBalance || 0).lt(new BigNumber(refundBalance || 0))) {
      toast.error("Your request is being verified.");
    }
    try {
      setOpenTransactionSubmitModal(true);
      const chainId = getChainIDByName(poolDetails?.networkAvailable);
      if (chainId !== appChainID) {
        const chainId: any = getChainIDByName(poolDetails?.networkAvailable);
        await switchChainAsync({ chainId: Number(chainId) });


        dispatch(settingAppNetwork({networkType:NetworkUpdateType.App, updatedVal:chainId}));
      }
      await claimRefundToken();
    } catch (err) {
      console.log("🚀 ~ handleClaimRefund ~ err:", err);
      setOpenTransactionSubmitModal(false);
    }
  };

  const getDeadlineDisplay = () => {
    const startRefundTime = userRefundConfig?.start_refund_time;
    const endRefundTime = userRefundConfig?.end_refund_time;

    if (!startRefundTime || !endRefundTime)
      return "The refund request period will be determined by the token listing date. Please stay tuned for more information.";

    const deadlineFrom = momentTimezone
      .tz(+startRefundTime * 1000, moment.tz.guess())
      .format(deadlineFormat);
    const deadlineTo = momentTimezone
      .tz(+endRefundTime * 1000, moment.tz.guess())
      .format(deadlineFormat);

    return `${deadlineFrom} - ${deadlineTo}`;
  };

  const renderClaimToken = () => {
    return (
      <div className={styles.claimToken}>
        <div className={styles.poolDetailClaimTitle}>Claim Token</div>
        <ClaimInfo
          dataUser={dataUser}
          poolDetails={poolDetails}
          tokenDetails={tokenDetails}
          userClaimInfo={userClaimInfo}
          currencyName={currencyName}
          userBuyLimit={userBuyLimit}
          connectedAccount={connectedAccount}
          isClaimOnRedkite={isClaimOnRedkite}
        />

        {isClaimOnRedkite && !canClaimRefundToken && (
          <Button
            style={{
              width: "100%",
              font: "normal normal 500 14px/20px   Violet Sans",
              color: "#1e1e1e",
            }}
            text={"Claim Token"}
            disabled={!availableClaim || userPurchased <= 0}
            loading={loading}
            onClick={() => {
              if (!!poolDetails?.is_custom_network) {
                if (
                  !!poolDetails?.isTonClaimLink &&
                  poolDetails?.tonClaimLink
                ) {
                  window.open(poolDetails?.tonClaimLink, "_blank");
                } else {
                  toast.error("Custom Network Claim link is not available")
                }
              } else {
                handleTokenClaim();
              }
            }}
          />
        )}
      </div>
    );
  };

  const renderSchedule = () => {
    return (
      <div className={styles.schedule}>
        <div className={styles.scheduleHeader}>
          <div className={styles.poolDetailClaimTitle}>
            <span>Schedule</span>
            {poolDetails?.claimType ===
              CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD && (
              <span className="sub-title">Claim Schedule on DegenPad</span>
            )}
          </div>
          {currentProgress.length > 0 && (
            <>
              <div className={styles.schedulePagination}>
                <input
                  type="button"
                  className={styles.btnPrevious}
                  disabled={getDisabledPrevBtn()}
                  onClick={() => handleChangeCurrentPage(-1)}
                />
              </div>
              <div className={styles.schedulePagination}>
                <input
                  type="button"
                  className={styles.btnNext}
                  disabled={getDisabledNextBtn()}
                  onClick={() => handleChangeCurrentPage(1)}
                />
              </div>
            </>
          )}
        </div>

        <TableSchedule
          poolDetails={poolDetails}
          dataTable={currentProgress}
          websiteClaimTime={claimOnWebsiteTimeInDate}
        />

        {poolDetails?.claimType ===
          CLAIM_TYPE.AIRDROP_TO_PARTICIPANTS_WALLETS && (
          <p className={commonStyles.nnn1216h}>
            * Tokens are airdropped to your wallet address as the above table.
          </p>
        )}

        {poolDetails?.claimType === CLAIM_TYPE.CLAIM_ON_THE_PROJECT_WEBSITE && (
          <>
            {claimOnWebsiteTimeFormat && (
              <div style={{ marginBottom: 6 }}>
                <span className={commonStyles.nnn1424h}>Token Claim Time:</span>
                <span className={`${commonStyles.nnn1424h} ${styles.colorRed}`}>
                  &nbsp;{claimOnWebsiteTimeFormat}
                </span>
              </div>
            )}
            <div
              dangerouslySetInnerHTML={{ __html: poolDetails?.claimGuide }}
            ></div>
          </>
        )}

        {poolDetails?.claimType ===
          CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD && (
          <div
            dangerouslySetInnerHTML={{ __html: poolDetails?.remainingTokens }}
          ></div>
        )}
      </div>
    );
  };

  const renderRefund = () => {
    const isPoolStatusRefund = [
      POOL_STATUS_TEXT[POOL_STATUS.FILLED],
      POOL_STATUS_TEXT[POOL_STATUS.CLAIMABLE],
      POOL_STATUS_TEXT[POOL_STATUS.CLOSED],
    ].includes(poolStatus);

    const showRefund =
      (Number(userClaimInfo?.userPurchased) > 0 &&
        isPoolStatusRefund &&
        [
          CLAIM_TYPE.CLAIM_ON_LAUNCHPAD,
          CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD,
        ].includes(poolDetails?.claimType) &&
        poolDetails?.networkClaim === poolDetails?.networkAvailable) ||
      +userRefundToken?.currencyAmount > 0;

    if (!showRefund) return <></>;

    const renderNonRefundable = () => {
      if (!userClaimed || +userClaimed <= 0) return <></>;

      return (
        <div className={styles.refundDetail + " " + styles.nonRefundable}>
          <Image width={24} height={24} src="/assets/images/icons/close-red.svg" alt="" />
          <p>
            Since you have already claimed <span>{tokenDetails?.symbol}</span>,
            you are not eligible for requesting a refund.
          </p>
        </div>
      );
    };

    const renderRefundable = () => {
      if (+userClaimed > 0) return <></>;

      const renderBtnRefund = () => {
        if (
          !(
            +userPurchasedValue !== 0 &&
            +userClaimed === 0 &&
            isPoolStatusRefund &&
            !isRefundOverdue()
          )
        )
          return <></>;
        return (
          <button
            className={styles.btnRefundContainer}
            disabled={loadingRefund}
            onClick={handleRequestRefund}
          >
            Request Refund
          </button>
        );
      };

      return (
        <div className={styles.refundDetail + " " + styles.refundable}>
          <div className={styles.refundRequest}>
            <div className={styles.requestTextContent}>
              <div>
                <p>
                  You can request a refund if you have not claimed any{" "}
                  <span>{tokenDetails?.symbol}</span> yet.
                </p>
                <div className={styles.requestDeadlineContainer}>
                  <i>Refund request time:</i>{" "}
                  <span
                    className={
                      !userRefundConfig?.start_refund_time ||
                      !userRefundConfig?.end_refund_time
                        ? styles.requestDeadlineEmpty
                        : styles.requestDeadline
                    }
                  >
                    {getDeadlineDisplay()}
                  </span>
                  {/* {userRefundConfig?.start_refund_time && (
                    <p>
                      <i>Claim refund time:</i>{" "}
                      <span className={styles.requestDeadline}>
                      {momentTimezone
                          .tz(
                              +userRefundConfig?.start_refund_time * 1000 + 60 * 60 * 60 * 1000,
                              moment.tz.guess()
                          )
                          .format(deadlineFormat)}
                    </span>
                    </p>
                )} */}
                </div>
              </div>
              <div className={styles.btnRefund}>{renderBtnRefund()}</div>
            </div>
            <div className={styles.btnRefundXs}>{renderBtnRefund()}</div>
          </div>

          {(userRefundToken?.isClaimed ||
            (!userRefundToken?.isClaimed &&
              +userRefundToken?.balanceAmount > 0) ||
            isRefundOverdue()) && (
            <div className={styles.refundStatus}>
              <span className="label">Status</span>
              {canClaimRefundToken && (
                <>
                  <span className="status status-requested">
                    Refund Requested
                  </span>
                  <div className={styles.btnClaim}>
                    <button
                      className={`${styles.btnRefundContainer} ${styles.btnRefundSM}`}
                      onClick={handleClaimRefund}
                      disabled={loadingClaimRefund}
                    >
                      Claim Refund
                    </button>
                  </div>
                </>
              )}
              {userRefundToken?.isClaimed && (
                <span className="status status-refunded">{`Fully Refunded ($${
                  userRefundToken?.balanceAmount || 0
                } USDT)`}</span>
              )}
              {isRefundOverdue() &&
                (!userRefundToken || +userRefundToken?.balanceAmount === 0) && (
                  <span className="status status-not-request">
                    Not Request Refund
                  </span>
                )}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className={styles.poolDetailRefund}>
        <div className={styles.poolDetailClaimTitle}>REFUND</div>

        {renderNonRefundable()}

        {renderRefundable()}

        <p className={styles.refundPolicy}>
          Learn more about this policy{" "}
          <a
            href="https://medium.com/chaingpt-blog/chaingpt-launch-pad-refund-policy-c3c0a979d0b8"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
      </div>
    );
  };

  return (
    <>
      <div className={styles.poolDetailClaim}>
        {renderClaimToken()}
        {renderSchedule()}
      </div>

      {renderRefund()}

      <TransactionSubmitModal
        opened={openClaimModal}
        handleClose={() => {
          setOpenTransactionSubmitModal(false);
          setClaimTokenLoading(false);
          setLoadingClaimRefundToken(false);
        }}
        transactionHash={transactionHash || transactionHashClaimRefundToken}
        networkAvailable={poolDetails?.networkAvailable}
      />

      <RefundTokenModal
        opened={openRefundTokenModal}
        handleClose={() => {
          setOpenRefundTokenModal(false);
        }}
        setLoadingRefund={setLoadingRefund}
        poolAddress={poolAddress}
        poolId={poolId}
        poolDetails={poolDetails}
        setRefundTokenSuccess={setRefundTokenSuccess}
      />
    </>
  );
};

export default ClaimToken;
