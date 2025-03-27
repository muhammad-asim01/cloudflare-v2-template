import BigNumber from "bignumber.js";
import moment from "moment";
import momentTimezone from "moment-timezone";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CLAIM_TYPE, POOL_STATUS, POOL_STATUS_TEXT } from "../../../constants";
import { TokenType } from "../../../hooks/useTokenDetails";
import commonStyles from '@/styles/commonstyle.module.scss'
import { updateUserClaimInfo } from "@/store/slices/claimUserInfoSlice";

import Button from "../Button";
import useDetectClaimConfigApplying from "../hooks/useDetectClaimConfigApplying";
import ClaimInfo from "./ClaimInfo";
import RefundTokenModal from "./RefundTokenModal";
import styles from '@/styles/claimToken.module.scss'

import TableSchedule from "./TableSchedule";
import useSolanaUserRemainTokensClaim from "../hooks/useSolanaRemainTokensClaim";
import useSolanaPoolBalance from "../hooks/useSolanaPoolBalance";
import useSolanaUserRefundToken from "../hooks/useSolanaUserRefundToken";
import useSolanaTokenClaim from "../hooks/useSolanaTokenClaim";
import useSolanaClaimRefundToken from "../hooks/useSolanaClaimRefundToken";
import { PurchaseCurrency } from "../../../constants/purchasableCurrency";
import SolanaTransactionSubmitModal from "../../../components/Base/SolanaTransactionSubmitModal";
import { useAppKitAccount } from "@reown/appkit/react";
import { getDateTimeDisplay } from "@/components/buyToken/BuyTokenPoolTimeLine";
import { toast } from "react-toastify";
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
  width: any;
  isPreOrderPool?: boolean;
  allowUserBuyPreOrder?: boolean;
  startBuyTimeNormal: any;
  userBuyLimit: any;
  dataUser: any;
  setIsRefunded: any;
  poolStatus: string;
  poolIndex?: number;
  purchasableCurrency: string;
  handleInvalidAddressDialogOpen: any;
  isValidSolanaAddress: any;
};

const ClaimToken: React.FC<ClaimTokenProps> = (props: ClaimTokenProps) => {
  const dispatch = useDispatch();
  

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
    currencyName,
    startBuyTimeInDate,
    isPreOrderPool,
    allowUserBuyPreOrder,
    startBuyTimeNormal,
    userBuyLimit,
    dataUser,
    setIsRefunded,
    poolStatus,
    poolIndex,
    purchasableCurrency,
  } = props;

  const nowTime = new Date();
  const deadlineFormat = `HH:mm, DD MMM YYYY`;

  const poolNetwork = useMemo(() => {
    return poolDetails?.networkClaim &&
      poolDetails?.networkClaim !== poolDetails?.networkAvailable &&
      poolDetails?.poolClaimAddress
      ? poolDetails?.networkClaim || poolDetails?.network_claim
      : poolDetails?.networkAvailable || poolDetails?.network_available;
  }, [poolDetails]);

  const getApproveToken = useCallback(() => {
    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.USDT) {
      return {
        address: process.env.NEXT_PUBLIC_SOLANA_USDT_ADDRESS,
        name: "USDT",
        symbol: "USDT",
        decimals: 6,
      };
    }

    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.USDC) {
      return {
        address: process.env.NEXT_PUBLIC_SOLANA_USDC_ADDRESS,
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
      };
    }
  }, [purchasableCurrency]);

  const tokenToApprove = getApproveToken();

  const {
    claimToken,
    setClaimTokenLoading,
    transactionHash,
    claimTokenSuccess,
    loading,
    error,
  } = useSolanaTokenClaim(
    poolId,
    poolIndex,
    poolDetails?.decimals,
    poolDetails?.token
  );
  const {
    claimRefundToken,
    loadingClaimRefund,
    setLoadingClaimRefundToken,
    transactionHashClaimRefundToken,
    claimRefundTokenSuccess,
  } = useSolanaClaimRefundToken(
    poolId,
    poolIndex,
    purchasableCurrency,
    setOpenTransactionSubmitModal
  );

  const { retrieveClaimableTokens } = useSolanaUserRemainTokensClaim(
    poolNetwork,
    poolId,
    tokenDetails as TokenType
  );
  const { refundBalance, retrieveRefundToken } = useSolanaUserRefundToken(
    poolId as number,
    tokenToApprove as TokenType
  );
  const { poolBalance, retrievePoolBalance } = useSolanaPoolBalance(
    tokenDetails as TokenType
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
        let [userClaimInformations, userRefundToken] = await Promise.all([
          retrieveClaimableTokens(),
          retrieveRefundToken(),
          retrievePoolBalance(poolDetails?.refundableTokenAccount),
        ]);
        if (
          userRefundToken &&
          +userRefundToken.currencyAmount > 0 &&
          !userRefundToken.isClaimed
        ) {
          setCanclaimRefundToken(true);
        } else {
          setCanclaimRefundToken(false);
        }
        setUserRefundToken(userRefundToken);
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
    tokenDetails,
  ]);

  const [isLatestData, setIsLatestData] = useState(false);
  const [isRequestRefundLoading, setIsRequestRefundLoading] = useState(false);

  useEffect(() => {
    const fetchUserPurchased = async () => {
      if (connectedAccount && poolDetails) {
        let [userClaimInformations, userRefundToken] = await Promise.all([
          retrieveClaimableTokens(),
          retrieveRefundToken(),
          retrievePoolBalance(poolDetails?.refundableTokenAccount),
        ]);
        if (
          userRefundToken &&
          +userRefundToken.currencyAmount > 0 &&
          !userRefundToken.isClaimed
        ) {
          setCanclaimRefundToken(true);
        } else {
          setCanclaimRefundToken(false);
        }
        setUserRefundToken(userRefundToken);
        setIsRefunded(userRefundToken?.isClaimed || false);
        dispatch(updateUserClaimInfo(userClaimInformations));
        setUserClaimInfo(userClaimInformations);
        setUserPurchased(
          (userClaimInformations?.userPurchasedReturn || 0) as number
        );
      }
    };

    if (claimTokenSuccess || claimRefundTokenSuccess || refundTokenSuccess) {
      setIsRequestRefundLoading(true);
      const timeoutId = setTimeout(async () => {
        await fetchUserPurchased();
        setIsLatestData(false);
        setIsRequestRefundLoading(false);
        if (claimTokenSuccess) {
          toast.success("Token Claim Successful");
        }
        if (claimRefundTokenSuccess) {
          toast.success("Token Refund Successful");
        }
        if (refundTokenSuccess) {
          toast.success("Token Request Refund Successful");
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    claimTokenSuccess,
    claimRefundTokenSuccess,
    refundTokenSuccess,
    connectedAccount,
    dispatch,
    poolDetails,
    retrieveClaimableTokens,
    retrievePoolBalance,
    setIsRefunded,
    retrieveRefundToken,
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

  const validateClaimable = () => {
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

    if (!nextClaim && new BigNumber(maximumTokenClaimUtilNow).lte(0)) {
      toast.error("You not enough claimable token!");
      return false;
    }

    return true;
  };

  const handleTokenClaim = async () => {
    if (!validateClaimable()) {
      return;
    }
    if (!window?.solana?.publicKey) {
      toast.error("Please connect your solana wallet");
      return;
    }

    try {
      setOpenTransactionSubmitModal(true);
      setIsLatestData(true);
      await claimToken();
    } catch (err) {
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
    let total = poolDetails?.campaignClaimConfig?.length || 0;
    if (!total) return;

    const userPurchased = userClaimInfo?.userPurchased || 0;
    const userClaimed = userClaimInfo?.userClaimed || 0;
    const percentClaimed = new BigNumber(userClaimed)
      .div(userPurchased)
      .multipliedBy(100);

    let lastPercent = 0,
      currentPage = 1,
      pageSize = 5,
      isUnClaimed = false;
    let campaignConfigs = poolDetails?.campaignClaimConfig;

    let data = campaignConfigs?.map((cfg: any, index: number) => {
      let percent = new BigNumber(+cfg.max_percent_claim)
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
    let { currentPage, pageSize, total } = paginationProgress;
    let firstIndex = (currentPage - 1) * pageSize;
    let currentPageConfigs = dataConfigs.slice(
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
    let newCurrentPage = paginationProgress.currentPage + number;
    setPaginationProgress({
      ...paginationProgress,
      currentPage: newCurrentPage,
    });
  };

  const checkingListingTime = () => {
    let startRefundTime = userRefundConfig?.start_refund_time;
    let endRefundTime = userRefundConfig?.end_refund_time;
    let now = Date.now();
    return (
      startRefundTime &&
      endRefundTime &&
      now >= +startRefundTime * 1000 &&
      now <= +endRefundTime * 1000
    );
  };
  const isRefundOverdue = () => {
    let endRefundTime = userRefundConfig?.end_refund_time;
    return endRefundTime && Date.now() > +endRefundTime * 1000;
  };

  const handleRequestRefund = async () => {
    if (!checkingListingTime())
      toast.error("Please wait until the refund request period starts.");
    if (!window?.solana?.publicKey) {
      toast.error("Please connect your solana wallet");
      return;
    }
    setLoadingRefund(true);
    setOpenRefundTokenModal(true);
  };

  const handleClaimRefund = async () => {
    if (new BigNumber(poolBalance || 0).lt(new BigNumber(refundBalance || 0))) {
      toast.error("Your request is being verified.");
      return;
    }
    if (!window?.solana?.publicKey) {
      toast.error("Please connect your solana wallet");
      return;
    }
    try {
      setOpenTransactionSubmitModal(true);
      await claimRefundToken();
    } catch (err) {
      setOpenTransactionSubmitModal(false);
    }
  };

  const getDeadlineDisplay = () => {
    let startRefundTime = userRefundConfig?.start_refund_time;
    let endRefundTime = userRefundConfig?.end_refund_time;

    if (!startRefundTime || !endRefundTime)
      return "The refund request period will be determined by the token listing date. Please stay tuned for more information.";

    let deadlineFrom = momentTimezone
      .tz(+startRefundTime * 1000, moment.tz.guess())
      .format(deadlineFormat);
    let deadlineTo = momentTimezone
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
              font: "normal normal 500 14px/20px Violet Sans",
              color: "black",
            }}
            text={"Claim Token"}
            disabled={!availableClaim || userPurchased <= 0}
            loading={loading}
            onClick={() => {
              if (!!poolDetails?.isTonDistribution) {
                if (
                  !!poolDetails?.isTonClaimLink &&
                  poolDetails?.tonClaimLink
                ) {
                  window.open(poolDetails?.tonClaimLink, "_blank");
                } else {
                  toast.error("Ton Claim link is not available");
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
              <span className="sub-title">Claim Schedule on ChainGPT Pad</span>
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
    let isPoolStatusRefund = [
      POOL_STATUS_TEXT[POOL_STATUS.FILLED],
      POOL_STATUS_TEXT[POOL_STATUS.CLAIMABLE],
      POOL_STATUS_TEXT[POOL_STATUS.CLOSED],
    ].includes(poolStatus);

    let showRefund =
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
                      disabled={loadingClaimRefund || isRequestRefundLoading}
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

      <SolanaTransactionSubmitModal
        opened={openClaimModal}
        handleClose={() => {
          setOpenTransactionSubmitModal(false);
          setClaimTokenLoading(false);
          setLoadingClaimRefundToken(false);
        }}
        transactionHash={
          !isLatestData && !isRequestRefundLoading
            ? transactionHash || transactionHashClaimRefundToken
            : undefined
        }
      />

      <RefundTokenModal
        opened={openRefundTokenModal}
        handleClose={() => {
          setOpenRefundTokenModal(false);
        }}
        setLoadingRefund={setLoadingRefund}
        poolAddress={poolIndex}
        poolId={poolId}
        poolDetails={poolDetails}
        setRefundTokenSuccess={setRefundTokenSuccess}
        purchasableCurrency={purchasableCurrency}
      />
    </>
  );
};

export default ClaimToken;
