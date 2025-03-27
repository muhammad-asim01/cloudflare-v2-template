'use client'

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { utils, BigNumber} from 'ethers';
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { BSC_CHAIN_ID } from "@/constants/network";
import useTokenAllowance from "@/hooks/useStakingTokenAllowance";
import useTokenApprove from "@/hooks/useTokenApprove";
import useTokenBalance from "@/hooks/useTokenBalance";
import useTokenDetails from "@/hooks/useTokenDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { DURATION_LIVE } from "@/components/staking-pools/Header";
import commonStyles from '@/styles/commonstyle.module.scss'
import useLinearClaim from "@/components/staking-pools/hook/useLinearClaim";
import useLinearClaimPendingWithdraw from "@/components/staking-pools/hook/useLinearClaimPendingWithdraw";
import useLinearCompoundReward from "@/components/staking-pools/hook/useLinearCompoundReward";
import useLinearStake from "@/components/staking-pools/hook/useLinearStake";
import useLinearSwitch from "@/components/staking-pools/hook/useLinearSwitch";
import useLinearUnstake from "@/components/staking-pools/hook/useLinearUnstake";
import ModalClaim from "@/components/staking-pools/ModalClaim";
import ModalConfirmation from "@/components/staking-pools/ModalConfirm";
import ModalRewards from "@/components/staking-pools/ModalRewards";
import ModalROI from "@/components/staking-pools/ModalROI";
import ModalStake from "@/components/staking-pools/ModalStake";
import ModalSwitch from "@/components/staking-pools/ModalSwitch";
import ModalUnstake from "@/components/staking-pools/ModalUnstake";
import ConnectButton from "./ConnectButton";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/staking.module.scss'

import useLinearReStake from "@/components/staking-pools/hook/useLinearRestake";
import { toast } from "react-toastify";
import Image from "next/image";
import CustomImage from "@/components/Base/Image";

export const ONE_DAY_IN_SECONDS = 86400;
export const ONE_YEAR_IN_SECONDS = "31536000";

const ArrowIcon = () => {
  return (
    <svg
      width="8"
      height="4.5"
      viewBox="0 0 8 4.5"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Shape Copy 26"
        d="M8 1.02272C7.9678 0.952487 7.94553 0.875065 7.90202 0.813058C7.79343 0.659241 7.63755 0.599976 7.44948 0.599976C5.21348 0.601688 2.97782 0.601003 0.741826 0.601003C0.668858 0.601003 0.596231 0.600661 0.523262 0.601003C0.296476 0.601688 0.131354 0.708572 0.0429692 0.912406C-0.0430174 1.11042 0.00357294 1.29438 0.151224 1.45196C0.167325 1.46909 0.183769 1.48554 0.200555 1.50198C1.33414 2.63557 2.46773 3.76984 3.60303 4.90206C3.6664 4.96509 3.74006 5.02744 3.82091 5.06135C3.99733 5.13501 4.16794 5.10555 4.31696 4.98051C4.34882 4.95378 4.37896 4.92466 4.40843 4.89555C5.52591 3.77806 6.64271 2.66058 7.76054 1.54446C7.8664 1.4386 7.96608 1.33103 8 1.17893C8 1.12686 8 1.07479 8 1.02272Z"
        fill="currentColor"
      />
    </svg>
  );
};

const LinearPool = (props: any) => {
  const {
    connectedAccount,
    poolDetail,
    poolAddress,
    reload,
    setOpenModalTransactionSubmitting,
    setTransactionHashes,
    durationType,
    livePools,
    poolId
  } = props;
  const dispatch = useDispatch();

  const { appChainID, walletChainID } = useTypedSelector((state) => state.appNetwork).data;
  const { tokenDetails } = useTokenDetails(poolDetail?.acceptedToken, "eth");
  const [tokenAllowance, setTokenAllowance] = useState<string | undefined>("0");
  const { retrieveTokenAllowance } = useTokenAllowance();
  const [tokenBalance, setTokenBalance] = useState("0");
  const { retrieveTokenRawBalance } = useTokenBalance(tokenDetails, connectedAccount);
  const {
    approveToken,
    tokenApproveLoading,
    transactionHash: approveTransactionHash,
  } = useTokenApprove(tokenDetails, connectedAccount, poolAddress, false, false);

  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("0");
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState("0");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showRewards, setShowRewards] = useState<boolean>(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [targetSwitchPoolId, setTargetSwitchPoolId] = useState<number>(0);

  const {
    linearSwitchPool,
    switchPoolLoading,
    transactionHash: switchTransactionHash,
  } = useLinearSwitch(poolAddress, poolDetail?.pool_id, targetSwitchPoolId);
  const { linearStakeToken, transactionHash: stakeTransactionHash } = useLinearStake(
    poolAddress,
    poolDetail?.pool_id,
    stakeAmount,
    poolDetail
  );
  const { linearReStakeToken, transactionHash: reStakeTransactionHash  } = useLinearReStake(
    poolAddress,
    poolDetail?.pool_id,
  );
  const { linearClaimToken, transactionHash: unstakeTransactionHash } = useLinearClaim(
    poolAddress,
    poolDetail?.pool_id,
    poolDetail
  );
  const { linearCompoundReward, transactionHash: compoundTransactionHash } =
    useLinearCompoundReward(poolAddress, poolDetail?.pool_id);
  const { linearUnstakeToken, transactionHash: claimTransactionHash } = useLinearUnstake(
    poolAddress,
    poolDetail?.pool_id,
    unstakeAmount,
    poolDetail
  );
  const { linearClaimPendingWithdraw, transactionHash: claimPendingTransactionHash } =
    useLinearClaimPendingWithdraw(poolAddress, poolDetail?.pool_id);

  const [progress, setProgress] = useState("0");
  const [showROIModal, setShowROIModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previousStep, setPreviousStep] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  const loadTokenAllowance = useCallback(async () => {
    setTokenAllowance(
      (await retrieveTokenAllowance(tokenDetails, connectedAccount, poolAddress)) || "0"
    );
  }, [tokenDetails, connectedAccount, poolAddress, retrieveTokenAllowance]);

  useEffect(() => {
    try {
      loadTokenAllowance();
    } catch (err) {
      console.log("loadTokenAllowance", err);
    }
  }, [poolDetail, connectedAccount, loadTokenAllowance, tokenApproveLoading]);

  useEffect(() => {
    retrieveTokenRawBalance(tokenDetails, connectedAccount).then((balance) => {
      setTokenBalance(balance as string);
    });
  }, [retrieveTokenRawBalance, connectedAccount, tokenDetails]);

  useEffect(() => {
    if (!poolDetail?.cap || poolDetail?.cap === "0") {
      return;
    }
    const prg =
      (Number(utils.formatEther(poolDetail?.totalStaked)) /
        Number(utils.formatEther(poolDetail?.cap))) *
      100;
    setProgress(prg.toFixed(1));
  }, [poolDetail]);

  const handleApprove = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await approveToken();
      setOpenModalTransactionSubmitting(false);
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log("approveToken", err);
    }
  };

  useEffect(() => {
    if (!approveTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: approveTransactionHash, isApprove: true }]);
  }, [approveTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes]);

  const handleStake = async () => {
    try {
      if (
        utils
          .parseEther(stakeAmount)
          .add(poolDetail?.stakingAmount || "0")
          .lt(BigNumber.from(poolDetail?.minInvestment || "0"))
      ) {
        toast.error(`Minimum stake amount is ${utils.formatEther(poolDetail?.minInvestment)} ${
              tokenDetails?.symbol
            }`)
        return;
      }

      if (
        utils.parseEther(stakeAmount).gt(BigNumber.from(poolDetail?.maxInvestment || "0")) &&
        BigNumber.from(poolDetail?.maxInvestment || "0").gt(BigNumber.from("0"))
      ) {
        toast.error("You have exceeded the maximum number of tokens / person to stake");
        return;
      }

      if (
        BigNumber.from(poolDetail?.cap || "0").gt(BigNumber.from("0")) &&
        BigNumber.from(poolDetail?.totalStaked)
          .add(utils.parseEther(stakeAmount || "0"))
          .gt(BigNumber.from(poolDetail?.cap || "0"))
      ) {
        toast.error("The number of tokens you want to stake is greater than the amount remaining in the pool. Please try again")
        return;
      }

      if (
        poolDetail?.stakingAmount !== "0" &&
        poolDetail?.lockDuration !== "0" &&
        confirmed === false
      ) {
        setPreviousStep("stake");
        setConfirmationText(
          `You have ${tokenDetails?.symbol} staked in this pool. If you stake again, the Expiry date of the total ${tokenDetails?.symbol} will be extended. Do you want to continue?`
        );
        setShowConfirmModal(true);
        setShowStakeModal(false);
        return;
      }
      setConfirmed(false);
      setPreviousStep("");

      setShowStakeModal(false);
      setOpenModalTransactionSubmitting(true);
      await linearStakeToken();
      setStakeAmount("0");
      setOpenModalTransactionSubmitting(false);
      setConfirmationText("");
      if(reload) {
        reload();
      }
    } catch (err) {
      setConfirmed(false);
      setPreviousStep("");
      setConfirmationText("");

      setOpenModalTransactionSubmitting(false);
      console.log("linearStakeToken", err);
    }
  };

  const handleReStake = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await linearReStakeToken();
      setStakeAmount("0");
      setOpenModalTransactionSubmitting(false);
      setConfirmationText("");
      if(reload) {
        reload();
      }
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log("linearStakeToken", err);
    }
  };

  useEffect(() => {
    if (!reStakeTransactionHash) {
      return;
    }
    setTransactionHashes([{ tnx: reStakeTransactionHash, isApprove: false }]);
  }, [reStakeTransactionHash, setTransactionHashes]);

  useEffect(() => {
    if (!stakeTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: stakeTransactionHash, isApprove: false }]);
  }, [stakeTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes]);

  const handleUnstake = async () => {
    try {
      if (utils.parseEther(unstakeAmount).lt(BigNumber.from("0"))) {
        toast.error("Invalid amount");
        return;
      }

      if (
        BigNumber.from(poolDetail?.pendingWithdrawal?.amount || "0").gt(BigNumber.from("0")) &&
        confirmed === false
      ) {
        setPreviousStep("unstake");
        if (Number(poolDetail?.pendingWithdrawal?.applicableAt) > moment().unix()) {
          setConfirmationText(
            `You have ${tokenDetails?.symbol} waiting to withdrawn. If you continue to Unstake tokens, Withdrawal delay time of total ${tokenDetails?.symbol} will be extended. Do you want to continue?`
          );
        } else {
          setConfirmationText(
            `You have ${tokenDetails?.symbol} available to withdrawn. If you continue to Unstake tokens, Withdrawal delay time of total ${tokenDetails?.symbol} will be extended. Do you want to continue?`
          );
        }
        setShowConfirmModal(true);
        setShowUnstakeModal(false);
        return;
      }
      setConfirmed(false);
      setPreviousStep("");

      setShowUnstakeModal(false);
      setOpenModalTransactionSubmitting(true);
      await linearUnstakeToken();
      setUnstakeAmount("0");
      setOpenModalTransactionSubmitting(false);
      setConfirmationText("");
      if(reload) {
        reload();
      }
    } catch (err) {
      setConfirmed(false);
      setPreviousStep("");
      setConfirmationText("");

      setOpenModalTransactionSubmitting(false);
      console.log("linearUnstakeToken", err);
    }
  };

  useEffect(() => {
    if (!unstakeTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: unstakeTransactionHash, isApprove: false }]);
  }, [unstakeTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes]);

  const handleClaim = async () => {
    try {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(true);
      await linearClaimToken();
      setOpenModalTransactionSubmitting(false);
      if(reload) {
        reload();
      }
    } catch (err) {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(false);
      console.log("linearClaimToken", err);
    }
  };

  useEffect(() => {
    if (!claimTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: claimTransactionHash, isApprove: false }]);
  }, [claimTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes]);

  const handleCompoundReward = async () => {
    try {
      setShowRewards(false);
      setOpenModalTransactionSubmitting(true);
      await linearCompoundReward();
      setOpenModalTransactionSubmitting(false);
      if(reload) {
        reload();
      }
    } catch (err) {
      setShowRewards(false);
      setOpenModalTransactionSubmitting(false);
      console.log("linearCompoundReward", err);
    }
  };

  useEffect(() => {
    if (!compoundTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: compoundTransactionHash, isApprove: false }]);
  }, [compoundTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes]);

  const handleClaimPendingWithdraw = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await linearClaimPendingWithdraw();
      setOpenModalTransactionSubmitting(false);
      if(reload) {
        reload();
      }
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log("linearClaimPendingWithdraw", err);
    }
  };

  useEffect(() => {
    if (!claimPendingTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: claimPendingTransactionHash, isApprove: false }]);
  }, [claimPendingTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes]);

  const handleSwitchPool = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await linearSwitchPool();
      setOpenModalTransactionSubmitting(false);
      if(reload) {
        reload();
      }
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log("linearSwitchPool", err);
    }
  };

  useEffect(() => {
    if (!switchTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: switchTransactionHash, isApprove: false }]);
  }, [switchTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes]);

  useEffect(() => {
    if (!confirmed) {
      return;
    }
    setShowConfirmModal(false);
    switch (previousStep) {
      case "stake":
        handleStake();
        return;

      case "unstake":
        handleUnstake();
        return;

      case "claimPendingWithdraw":
        handleClaimPendingWithdraw();
        return;

      default:
        return;
    }
  }, [confirmed, previousStep]);

  const wrongChain = useMemo(() => {
    return appChainID !== BSC_CHAIN_ID || appChainID !== walletChainID;
  }, [appChainID, walletChainID]);

  const handleExpandAccordion = () => {
    setIsExpanded((preState) => !preState);
  };

  const handleOpenSwitchPool = () => {
    const unlockTime =
      (Number(poolDetail?.stakingJoinedTime) + Number(poolDetail?.lockDuration)) * 1000;

    if (unlockTime > new Date().getTime()) {
      toast.error("The lock-up term of your current staking pool has not ended.");
      return;
    }

    setShowSwitchModal(true);
  };

  const handleSelectSwitchPool = (poolId: number) => {
    setTargetSwitchPoolId(poolId);
  };

  useEffect(() => {
    if(poolDetail?.pool_id === poolId) {
      setIsExpanded(true);
    }
  }, [poolId, poolDetail])

  // region Render
  const renderStakingPoolHeader = () => {
    const renderTitleWrap = () => {
      return (
        <div className={styles.poolTitleWrap}>
          
                        <CustomImage
                      src={poolDetail?.logo} className={styles.poolLogo} alt=""
                        height={16}
                        width={16}
                       
                        onError={(event: any) => {
                          event.target.src = "/assets/images/icons/staking.svg";
                        }}
                        defaultImage={
                            "/assets/images/defaultImages/image-placeholder.png"
                        }
                      />
               
    
          <div className={commonStyles.flexCol}>
            <div className={styles.textPoolTitle}>{poolDetail?.title}</div>
            <div className={styles.textPoolSubTitle}>
              {Number(poolDetail?.point_rate) > 0 ? (
                <span >{poolDetail?.point_rate}x Multiplier</span>
              ) : (
                <span className={commonStyles.colorGray}>Without IDO</span>
              )}
            </div>
          </div>
        </div>
      );
    };

    const renderDetails = () => {
      return (
        <div className={styles.poolHeaderDetails}>
          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>Earned</div>
            <div className={styles.textDescription}>
              {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} {tokenDetails?.symbol}
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>APR</div>
            <div className={styles.textDescription}>
              {poolDetail?.APR}%
          
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>Remaining</div>
            <div className={styles.textDescription}>
              {poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from("0"))
                ? `${(+utils.formatEther(
                    BigNumber.from(poolDetail?.cap).sub(BigNumber.from(poolDetail?.totalStaked))
                  )).toFixed(2)} CGPT`
                : "-"}
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>Lock-up term</div>
            <div className={styles.textDescription}>
              {Number(poolDetail?.lockDuration) > 0
                ? `${(Number(poolDetail?.lockDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days`
                : "None"}
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>Withdrawal delay time</div>
            <div className={styles.textDescription}>
              {Number(poolDetail?.delayDuration) > 0
                ? `${(Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days`
                : "None"}
            </div>
          </div>
        </div>
      );
    };

    const renderTextExpand = () => {
      return (
        <div className={`${styles.expandText} ${isExpanded ? "color-hide" : "color-details"}`}>
          {isExpanded ? "Hide" : "Details"}
        </div>
      );
    };

    return (
      <AccordionSummary
        expandIcon={<ArrowIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {renderTitleWrap()}
        {renderDetails()}
        {renderTextExpand()}
      </AccordionSummary>
    );
  };

  const renderStakingPoolDetail = () => {
    const renderPoolDetailInfo = () => {
      const renderPoolDetailInfoMobile = () => {
        if (!isMobile) return <></>;
        return (
          <div className={styles.poolDetailInfoMobile}>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Earned</div>
              <div className={styles.textPrimary}>
                {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} {tokenDetails?.symbol}
              </div>
            </div>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>APR</div>
              <div className={styles.textPrimary}>
                {poolDetail?.APR}%
             
              </div>
            </div>
            {poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from("0")) && (
              <div className={styles.poolDetailsItem}>
                <div className={styles.textSecondary}>Remaining</div>
                <div className={styles.textPrimary}>
                  {(+utils.formatEther(
                    BigNumber.from(poolDetail?.cap).sub(BigNumber.from(poolDetail?.totalStaked))
                  )).toFixed(2)}{" CGPT"}
                </div>
              </div>
            )}
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Lock-up term</div>
              <div className={styles.textPrimary}>
                {Number(poolDetail?.lockDuration) > 0
                  ? `${(Number(poolDetail?.lockDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days`
                  : "None"}
              </div>
            </div>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Withdrawal delay time</div>
              <div className={styles.textPrimary}>
                {Number(poolDetail?.delayDuration) > 0
                  ? `${(Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days`
                  : "None"}
              </div>
            </div>
          </div>
        );
      };

      const renderProgress = () => {
        if (!(poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from("0"))))
          return <></>;
        return (
          <div className={styles.progressArea}>
            <div className={styles.progress}>
              <span
                className={`${styles.currentProgress} ${
                  parseFloat(progress) > 0 ? "" : "inactive"
                }`}
                style={{
                  width: `${parseFloat(progress) > 99 ? 100 : Math.round(parseFloat(progress))}%`,
                }}
              >
                <Image width={24}
                 height={24}
                  className={styles.iconCurrentProgress}
                  src="/assets/images/icon_fire_inprogress.png"
                  alt=""
                />
              </span>
            </div>
            <div className={styles.currentPercentage}>({Number(progress).toFixed(0)}%)</div>
          </div>
        );
      };

      return (
        <div className={styles.poolDetailsContent}>
          {renderPoolDetailInfoMobile()}

          <div className={styles.poolDetailsItem + " pt10-mobile"}>
            <div className={styles.textSecondary}>Total pool amount</div>
            <div className={styles.textPrimary}>
              {poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from("0"))
                ? `${(+utils.formatEther(poolDetail?.cap)).toFixed(2)} CGPT`
                : "Unlimited"}
            </div>
          </div>

          {renderProgress()}

          <div className={styles.poolDetailsItem}>
            <div className={styles.textSecondary}>Open time</div>
            <div className={styles.textPrimary}>
              {moment.unix(Number(poolDetail?.startJoinTime)).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>

          <div className={styles.poolDetailsItem}>
            <div className={styles.textSecondary}>Close time</div>
            <div className={styles.textPrimary}>
              {moment.unix(Number(poolDetail?.endJoinTime)).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>

          {BigNumber.from(poolDetail?.minInvestment || "0").gt(BigNumber.from("0")) && (
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Stake amount (Min)</div>
              <div className={styles.textPrimary}>
                {(+utils.formatEther(poolDetail?.minInvestment)).toFixed(2)} {tokenDetails?.symbol}
                /1 person
              </div>
            </div>
          )}
          {/* {
          BigNumber.from(poolDetail?.maxInvestment || '0').gt(BigNumber.from('0')) &&
          <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full mt6">
            <div className={styles.textSecondary}>
              Stake amount (Max)
            </div>
            <div className={styles.textPrimary}>
              {(+utils.formatEther(poolDetail?.maxInvestment)).toFixed(2)} {tokenDetails?.symbol}/1 person
            </div>
          </div>
        } */}

          {Number(poolDetail?.stakingJoinedTime) > 0 && Number(poolDetail?.lockDuration) > 0 && (
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Expiry Date</div>
              <div className={styles.textPrimary}>
                {moment
                  .unix(Number(poolDetail?.stakingJoinedTime) + Number(poolDetail?.lockDuration))
                  .format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
          )}

          {Number(poolDetail?.stakingJoinedTime) > 0 &&
            Number(poolDetail?.lockDuration) > 0 &&
            BigNumber.from(poolDetail?.stakingAmount || "0").gt(BigNumber.from("0")) && (
              <div className={styles.poolDetailsItem}>
                <div className={styles.textSecondary}>Estimated profit</div>
                <div className={styles.textPrimary}>
                  {Number(
                    utils.formatEther(
                      BigNumber.from(poolDetail?.stakingAmount || "0")
                        .mul(BigNumber.from(poolDetail?.APR || "0"))
                        .div(BigNumber.from("100"))
                        .mul(BigNumber.from(poolDetail?.lockDuration))
                        .div(BigNumber.from(ONE_YEAR_IN_SECONDS))
                    )
                  ).toFixed(2)}{" "}
                  {tokenDetails?.symbol}
                </div>
              </div>
            )}
        </div>
      );
    };

    const renderRecentProfit = () => {
      return (
        <div className={styles.earnedWrap}>
          <div className={styles.textSecondary}>Recent CGPT profit</div>
          <div className={styles.textDescription}>
            {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} {tokenDetails?.symbol}
          </div>

          <div className={styles.groupButton}>
            <button
              className={`${styles.btn} ${styles.btnClaimToken}`}
              onClick={() => setShowClaimModal(true)}
              disabled={poolDetail?.pendingReward === "0" || wrongChain}
            >
              Claim token
            </button>

            {connectedAccount &&
              Number(poolDetail?.lockDuration) > 0 &&
              Number(poolDetail?.startJoinTime) > 0 &&
              Number(poolDetail?.startJoinTime) < moment().unix() &&
              Number(poolDetail?.endJoinTime) > 0 &&
              Number(poolDetail?.endJoinTime) > moment().unix() &&
              (BigNumber.from(poolDetail?.cap).eq(BigNumber.from("0")) ||
                BigNumber.from(poolDetail?.cap)
                  .sub(BigNumber.from(poolDetail?.totalStaked))
                  .gt(BigNumber.from("0"))) && (
                <button
                  className={`${styles.btn} ${styles.btnStakeReward}`}
                  onClick={() => setShowRewards(true)}
                  disabled={poolDetail?.pendingReward === "0" || wrongChain}
                >
                  Stake Rewards
                </button>
              )}
          </div>
        </div>
      );
    };

    const renderStartStaking = () => {
      if (connectedAccount) return <></>;
      return (
        <div className={styles.poolDetailsBlock}>
          <div className={styles.textSecondary}>Start Staking</div>

          <ConnectButton />
        </div>
      );
    };

    const renderStakingWrap = () => {
      if (!connectedAccount) return <></>;
      return (
        <div className={styles.poolDetailsBlock}>
          <div className={styles.textSecondary}>Staking</div>
          <div className={styles.textDescription}>
            {(+utils.formatEther(poolDetail?.stakingAmount)).toFixed(2)} {tokenDetails?.symbol}
          </div>

          <div className={styles.groupButtonStaking}>
            {Number(poolDetail?.startJoinTime) > 0 &&
              Number(poolDetail?.startJoinTime) < moment().unix() &&
              Number(poolDetail?.endJoinTime) > 0 &&
              Number(poolDetail?.endJoinTime) > moment().unix() &&
              (BigNumber.from(poolDetail?.cap).eq(BigNumber.from("0")) ||
                BigNumber.from(poolDetail?.cap)
                  .sub(BigNumber.from(poolDetail?.totalStaked))
                  .gt(BigNumber.from("0"))) && (
                <button
                  className={`${styles.btn} ${styles.btnStake}`}
                  onClick={() => setShowStakeModal(true)}
                  disabled={
                    wrongChain ||
                    (Number(poolDetail?.startJoinTime) > 0 &&
                      Number(poolDetail?.startJoinTime) > moment().unix()) ||
                    (Number(poolDetail?.endJoinTime) > 0 &&
                      Number(poolDetail?.endJoinTime) < moment().unix())
                  }
                >
                  Stake
                </button>
              )}

            {BigNumber.from(poolDetail?.stakingAmount || "0").gt(BigNumber.from("0")) && (
              <button
                className={`${styles.btn} ${styles.btnUnstake}`}
                onClick={() => setShowUnstakeModal(true)}
                disabled={
                  wrongChain ||
                  poolDetail?.stakingAmount === "0" ||
                  (Number(poolDetail?.lockDuration) > 0 &&
                    Number(poolDetail?.stakingJoinedTime) + Number(poolDetail?.lockDuration) >
                      moment().unix())
                }
              >
                Unstake
              </button>
            )}
          </div>
        </div>
      );
    };

    const renderWithdrawWrap = () => {
      if (
        !(
          connectedAccount &&
          BigNumber.from(poolDetail?.pendingWithdrawal?.amount || "0").gt(BigNumber.from("0"))
        )
      )
        return <></>;
      return (
        <div className={styles.poolDetailsBlock}>
          <div className={styles.mb8}>
            <div className={styles.textSecondary}>Withdrawal Amount</div>
            <div className={styles.textDescription}>
              {(+utils.formatEther(poolDetail?.pendingWithdrawal?.amount)).toFixed(2)}{" "}
              {tokenDetails?.symbol}
            </div>
          </div>
          <div className={styles.mb8}>
            <div className={styles.textSecondary}>You can claim tokens after</div>
            <div className={styles.textDescription}>
              {moment
                .unix(Number(poolDetail?.pendingWithdrawal?.applicableAt))
                .format("YYYY-MM-DD HH:mm:ss")}
            </div>
          </div>

          <button
            className={`${styles.btn} ${styles.btnWithdraw}`}
            onClick={handleClaimPendingWithdraw}
            disabled={
              Number(poolDetail?.pendingWithdrawal?.applicableAt) > moment().unix() || wrongChain
            }
          >
            Withdraw
          </button>
        </div>
      );
    };

    const renderSwitchWrap = () => {
      if (
        !connectedAccount ||
        durationType === DURATION_LIVE ||
        poolDetail?.stakingAmount === "0" ||
        Number(poolDetail?.endJoinTime) > moment().unix()
      )
        return <></>;

      return (
        <div className={styles.poolDetailsBlock}>
          <button className={`${styles.btn} ${styles.btnSwitch}`} onClick={handleOpenSwitchPool}>
            <Image width={20} height={20} src="/assets/images/icons/switch.svg" alt="" />
            Switch to Live pools
          </button>
        </div>
      );
    };

    return (
      <AccordionDetails className={styles.poolDetails}>
        {renderPoolDetailInfo()}

        {renderRecentProfit()}

        {renderStartStaking()}

        {renderStakingWrap()}

        <div className={styles.groupButtonStaking}>
            {Number(poolDetail?.startJoinTime) > 0 &&
              Number(poolDetail?.startJoinTime) < moment().unix() &&
              Number(poolDetail?.endJoinTime) > 0 &&
              Number(poolDetail?.endJoinTime) > moment().unix() &&
              (BigNumber.from(poolDetail?.cap).eq(BigNumber.from("0")) ||
                BigNumber.from(poolDetail?.cap)
                  .sub(BigNumber.from(poolDetail?.totalStaked))
                  .gt(BigNumber.from("0"))) && (
                <button
                  className={`${styles.btn} ${styles.btnStake}`}
                  onClick={() => handleReStake()}
                  disabled={
                    wrongChain ||
                    (Number(poolDetail?.startJoinTime) > 0 &&
                      Number(poolDetail?.startJoinTime) > moment().unix()) ||
                    (Number(poolDetail?.endJoinTime) > 0 &&
                      Number(poolDetail?.endJoinTime) < moment().unix())
                  }
                >
                  Re Stake
                </button>
              )}
          </div>

        {renderWithdrawWrap()}

        {renderSwitchWrap()}
      </AccordionDetails>
    );
  };
  // endregion

  return (
    <Accordion className={styles.pool} onChange={handleExpandAccordion} expanded = {isExpanded}>
      {renderStakingPoolHeader()}

      <div className={styles.poolLine} />

      {renderStakingPoolDetail()}

      <ModalSwitch
        open={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        loading={switchPoolLoading}
        targetSwitchPoolId={targetSwitchPoolId}
        handleSelectSwitchPool={handleSelectSwitchPool}
        onConfirm={handleSwitchPool}
        livePools={livePools}
      />

      <ModalStake
        open={showStakeModal}
        amount={stakeAmount}
        setAmount={setStakeAmount}
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        tokenBalance={tokenBalance}
        min={Number(utils.formatEther(poolDetail?.minInvestment)).toFixed(2)}
        max={Number(utils.formatEther(poolDetail?.maxInvestment)).toFixed(2)}
        stakingAmount={Number(utils.formatEther(poolDetail?.stakingAmount)).toFixed(2)}
        onClose={() => setShowStakeModal(false)}
        onConfirm={handleStake}
        wrongChain={wrongChain}
        tokenAllowance={tokenAllowance}
        handleApprove={handleApprove}
      />

      <ModalUnstake
        amount={unstakeAmount}
        setAmount={setUnstakeAmount}
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        pendingReward={poolDetail?.pendingReward}
        delayDuration={poolDetail?.delayDuration}
        stakingAmount={poolDetail?.stakingAmount}
        open={showUnstakeModal}
        tokenBalance={tokenBalance}
        onClose={() => setShowUnstakeModal(false)}
        onConfirm={handleUnstake}
      />

      <ModalClaim
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        pendingReward={poolDetail?.pendingReward}
        open={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onConfirm={handleClaim}
      />

      <ModalRewards
        open={showRewards}
        onClose={() => setShowRewards(false)}
        lockDuration={
          Number(poolDetail?.lockDuration) > 0
            ? `${(Number(poolDetail?.lockDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days`
            : ""
        }
        onConfirm={handleCompoundReward}
      />

      <ModalConfirmation
        open={showConfirmModal}
        text={confirmationText}
        onConfirm={() => setConfirmed(true)}
        onClose={() => setShowConfirmModal(false)}
      />

      <ModalROI
        open={showROIModal}
        apr={Number(poolDetail?.APR) || 0}
        rewardTokenPrice={Number(poolDetail?.reward_token_price) || 1}
        rewardToken={tokenDetails}
        acceptedToken={tokenDetails}
        onClose={() => setShowROIModal(false)}
      />
    </Accordion>
  );
};

export default LinearPool;
