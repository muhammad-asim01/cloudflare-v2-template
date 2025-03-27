'use client'

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { BigNumber, utils } from "ethers";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import {BSC_CHAIN_ID} from "@/constants/network";
import useTokenAllowance from "@/hooks/useStakingTokenAllowance";
import useTokenApprove from "@/hooks/useTokenApprove";
import useTokenBalance from "@/hooks/useTokenBalance";
import useTokenDetails from "@/hooks/useTokenDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import commonStyles from '@/styles/commonstyle.module.scss'

import { numberWithCommas } from "@/utils/formatNumber";
import useAllocClaim from "../hook/useAllocClaim";
import useAllocClaimPendingWithdraw from "../hook/useAllocClaimPendingWithdraw";
import useAllocStake from "../hook/useAllocStake";
import useAllocUnstake from "../hook/useAllocUnstake";
import ModalClaim from "../ModalClaim";
import ModalConfirmation from "../ModalConfirm";
import ModalROI from "../ModalROI";
import ModalStake from "../ModalStake";
import ModalUnstake from "../ModalUnstake";
import ConnectButton from "./ConnectButton";

const ONE_DAY_IN_SECONDS = 86400;
const EST_BLOCK_PER_YEAR = 2369600; // Number of block per year, with estimated 20s/block

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

const iconLinkSocial = "/assets/images/iconLinkSocial.svg";
const logoMetamask = "/assets/images/metamask-logo.png";

import styles from '@/styles/staking.module.scss'
import { toast } from "react-toastify";
import Image from "next/image";

const AllocationPool = (props: any) => {
  const {
    connectedAccount,
    poolDetail,
    blockNumber,
    poolAddress,
    reload,
    setOpenModalTransactionSubmitting,
    setTransactionHashes,
  } = props;


  const { appChainID, walletChainID } = useTypedSelector(
    (state) => state.appNetwork
  ).data;
  const { tokenDetails } = useTokenDetails(poolDetail?.lpToken, "eth");
  const { tokenDetails: rewardTokenDetails } = useTokenDetails(
    poolDetail?.rewardToken,
    "eth"
  );
  const [tokenAllowance, setTokenAllowance] = useState<string | undefined>("0");
  const { retrieveTokenAllowance } = useTokenAllowance();
  const [tokenBalance, setTokenBalance] = useState("0");
  const { retrieveTokenRawBalance } = useTokenBalance(
    tokenDetails,
    connectedAccount
  );
  const {
    approveToken,
    tokenApproveLoading,
    transactionHash: approveTransactionHash,
  } = useTokenApprove(
    tokenDetails,
    connectedAccount,
    poolAddress,
    false,
    false
  );

  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("0");
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState("0");
  const [showClaimModal, setShowClaimModal] = useState(false);

  const { allocStakeToken, transactionHash: stakeTransactionHash } =
    useAllocStake(poolAddress, poolDetail?.pool_id, stakeAmount, poolDetail);
  const { allocUnstakeToken, transactionHash: unstakeTransactionHash } =
    useAllocUnstake(poolAddress, poolDetail?.pool_id, unstakeAmount, poolDetail);
  const { allocClaimToken, transactionHash: claimTransactionHash } =
    useAllocClaim(poolAddress, poolDetail?.pool_id, poolDetail);
  const {
    allocClaimPendingWithdraw,
    transactionHash: claimPendingTransactionHash,
  } = useAllocClaimPendingWithdraw(poolAddress, poolDetail?.pool_id);

  const [apr, setApr] = useState(0);
  const [showROIModal, setShowROIModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previousStep, setPreviousStep] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  const loadTokenAllowance = useCallback(async () => {
    setTokenAllowance(
      (await retrieveTokenAllowance(
        tokenDetails,
        connectedAccount,
        poolAddress
      )) || "0"
    );
  }, [tokenDetails, connectedAccount, poolAddress, retrieveTokenAllowance]);

  useEffect(() => {
    try {
      loadTokenAllowance();
    } catch (err) {
      console.log(err);
    }
  }, [poolDetail, connectedAccount, loadTokenAllowance, tokenApproveLoading]);

  useEffect(() => {
    retrieveTokenRawBalance(tokenDetails, connectedAccount).then((balance) => {
      setTokenBalance(balance as string);
    });
  }, [retrieveTokenRawBalance, connectedAccount, tokenDetails]);

  useEffect(() => {
    // price in $
    const acceptedTokenPrice = Number(poolDetail?.accepted_token_price) || 1;
    const rewardTokenPrice = Number(poolDetail?.reward_token_price) || 1;

    const estimatedAmount = utils.parseEther(`${1000 / acceptedTokenPrice}`); // investment with $1000
    const poolRewardPerBlock = BigNumber.from(poolDetail?.rewardPerBlock || "0")
      .div(BigNumber.from(poolDetail?.totalAllocPoint || "0"))
      .mul(BigNumber.from(poolDetail?.allocPoint || "0"));
    const rewardPerYear = poolRewardPerBlock
      .mul(BigNumber.from(EST_BLOCK_PER_YEAR))
      .mul(estimatedAmount)
      .div(BigNumber.from(poolDetail?.lpSupply || "0").add(estimatedAmount));

    const estimatedRewardPerYear = Number(utils.formatEther(rewardPerYear));
    setApr(((estimatedRewardPerYear * rewardTokenPrice) / 1000) * 100);
  }, [poolDetail, connectedAccount, loadTokenAllowance]);

  const handleApprove = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await approveToken();
      setOpenModalTransactionSubmitting(false);
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log("handleApprove", err);
    }
  };

  useEffect(() => {
    if (!approveTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: approveTransactionHash, isApprove: true }]);
  }, [
    approveTransactionHash,
    setOpenModalTransactionSubmitting,
    setTransactionHashes,
  ]);

  const handleStake = async () => {
    try {
      if (utils.parseEther(stakeAmount).lt(BigNumber.from("0"))) {
        toast.error("Invalid amount");
        return;
      }
      setShowStakeModal(false);
      setOpenModalTransactionSubmitting(true);
      await allocStakeToken();
      setStakeAmount("0");
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log("handleStake", err);
    }
  };

  useEffect(() => {
    if (!stakeTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: stakeTransactionHash, isApprove: false }]);
  }, [
    stakeTransactionHash,
    setOpenModalTransactionSubmitting,
    setTransactionHashes,
  ]);

  const handleUnstake = async () => {
    try {
      if (utils.parseEther(unstakeAmount).lt(BigNumber.from("0"))) {
        toast.error("Invalid amount");
        return;
      }

      if (
        BigNumber.from(poolDetail?.pendingWithdrawal?.amount || "0").gt(
          BigNumber.from("0")
        ) &&
        confirmed === false
      ) {
        setPreviousStep("unstake");
        if (
          Number(poolDetail?.pendingWithdrawal?.applicableAt) > moment().unix()
        ) {
          setConfirmationText(
            `You have ${rewardTokenDetails?.symbol} waiting to withdrawn. If you continue to Unstake tokens, Withdrawal delay time of total ${rewardTokenDetails?.symbol} will be extended. Do you want to continue?`
          );
        } else {
          setConfirmationText(
            `You have ${rewardTokenDetails?.symbol} available to withdrawn. If you continue to Unstake tokens, Withdrawal delay time of total ${rewardTokenDetails?.symbol} will be extended. Do you want to continue?`
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
      await allocUnstakeToken();
      setUnstakeAmount("0");
      setOpenModalTransactionSubmitting(false);
      setConfirmationText("");
      reload && reload();
    } catch (err) {
      setConfirmed(false);
      setPreviousStep("");
      setConfirmationText("");

      setOpenModalTransactionSubmitting(false);
      console.log("handleUnstake", err);
    }
  };

  useEffect(() => {
    if (!unstakeTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: unstakeTransactionHash, isApprove: false }]);
  }, [
    unstakeTransactionHash,
    setOpenModalTransactionSubmitting,
    setTransactionHashes,
  ]);

  const handleClaim = async () => {
    try {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(true);
      await allocClaimToken();
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(false);
      console.log("handleClaim", err);
    }
  };

  useEffect(() => {
    if (!claimTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: claimTransactionHash, isApprove: false }]);
  }, [
    claimTransactionHash,
    setOpenModalTransactionSubmitting,
    setTransactionHashes,
  ]);

  const handleClaimPendingWithdraw = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await allocClaimPendingWithdraw();
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log("handleClaimPendingWithdraw", err);
    }
  };

  useEffect(() => {
    if (!claimPendingTransactionHash) {
      return;
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([
      { tnx: claimPendingTransactionHash, isApprove: false },
    ]);
  }, [
    claimPendingTransactionHash,
    setOpenModalTransactionSubmitting,
    setTransactionHashes,
  ]);

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

  const addToMetamask = async () => {
    try {
      if (!(window as any)?.ethereum) {
        return;
      }
      const windowObj = window as any;
      const { ethereum } = windowObj;
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenDetails?.address, // The address that the token is at.
            symbol: tokenDetails?.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDetails?.decimals, // The number of decimals in the token
          },
        },
      });
    } catch (err) {
      console.log("addToMetamask", err);
    }
  };

  const handleExpandAccordion = () => {
    // setIsExpanded(!isExpanded);
    setIsExpanded((preState) => !preState);
  };

  const onShowROIModal = (e: any) => {
    e.stopPropagation();
    setShowROIModal(true);
  };

  // Render
  const renderStakingPoolHeader = () => {
    const renderTitleWrap = () => {
      return (
        <div className={styles.poolTitleWrap}>
          <Image width={32} height={32} src={poolDetail?.logo} className={styles.poolLogo} alt="" />
          <div className={commonStyles.flexCol}>
            <div className={styles.textPoolTitle}>{poolDetail?.title}</div>
            <div className={styles.textPoolSubTitle}>
              {poolDetail?.point_rate > 0 ? (
                <span >With IDO</span>
              ) : (
                <span>Without IDO</span>
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
              {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} CGPT
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>APR</div>
            <div className={styles.textDescription}>
              {apr.toFixed(1)}%
              <Image width={24} height={24}
                src="/assets/images/icon-staking-details.svg"
                alt=""
                onClick={onShowROIModal}
              />
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>Total staked</div>
            <div className={styles.textDescription}>
              {(+utils.formatEther(poolDetail?.lpSupply)).toFixed(2)}{" "}
              {tokenDetails?.symbol}
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>Ends in</div>
            <div className={styles.textDescription}>
              {poolDetail?.endBlockNumber !== "0" &&
              Number(poolDetail?.endBlockNumber) > blockNumber
                ? `${numberWithCommas(
                    Number(
                      Number(poolDetail?.endBlockNumber) - blockNumber
                    ).toString()
                  )} blocks`
                : "---"}
            </div>
          </div>

          <div className={commonStyles.flexCol}>
            <div className={styles.textSecondary}>Withdrawal delay time</div>
            <div className={styles.textDescription}>
              {Number(poolDetail?.delayDuration) > 0
                ? `${(
                    Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS
                  ).toFixed(0)} days`
                : "None"}
            </div>
          </div>
        </div>
      );
    };

    const renderTextExpand = () => {
      return (
        <div
          className={`${styles.expandText} ${
            isExpanded ? "color-hide" : "color-details"
          }`}
        >
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
          <>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Earned</div>
              <div className={styles.textPrimary}>
                {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)}{" "}
                {tokenDetails?.symbol}
              </div>
            </div>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>APR</div>
              <div className={styles.textPrimary}>
                {apr.toFixed(1)}%
                <Image width={24} height={24}
                  src="/assets/images/icon-staking-details.svg"
                  alt=""
                  onClick={onShowROIModal}
                />
              </div>
            </div>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Total staked</div>
              <div className={styles.textPrimary}>
                {(+utils.formatEther(poolDetail?.lpSupply)).toFixed(2)}{" "}
                {tokenDetails?.symbol}
              </div>
            </div>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Ends in</div>
              <div className={styles.textPrimary}>
                {poolDetail?.endBlockNumber !== "0" &&
                Number(poolDetail?.endBlockNumber) > blockNumber
                  ? `${numberWithCommas(
                      Number(
                        Number(poolDetail?.endBlockNumber) - blockNumber
                      ).toString()
                    )} blocks`
                  : "---"}
              </div>
            </div>
            <div className={styles.poolDetailsItem}>
              <div className={styles.textSecondary}>Withdrawal delay time</div>
              <div className={styles.textPrimary}>
                {Number(poolDetail?.delayDuration) > 0
                  ? `${(
                      Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS
                    ).toFixed(0)} days`
                  : "None"}
              </div>
            </div>
          </>
        );
      };

      return (
        <div className={styles.poolDetailsContent}>
          {renderPoolDetailInfoMobile()}

          <div className={styles.tokenInfo}>
            <div className={styles.tokenInfoItem}>
              <a
                className={styles.btnLink}
                target="_blank"
                href={poolDetail?.website}
                rel="noreferrer"
              >
                View Project Site
                <Image width={24} height={24} src={iconLinkSocial} alt="" />
              </a>
            </div>
            <div className={styles.tokenInfoItem}>
              <a
                className={styles.btnLink}
                target="_blank"
                href={`https://etherscan.io/address/${poolDetail?.pool_address}`}
                rel="noreferrer nofollow"
              >
                View Contract
                <Image width={24} height={24} src={iconLinkSocial} alt="" />
              </a>
            </div>
            <div className={styles.tokenInfoItem}>
              <button className={styles.btnLink} onClick={addToMetamask}>
                Add to Metamask
                <Image width={24} height={24} data-role="metamask" src={logoMetamask} alt="" />
              </button>
            </div>
          </div>
        </div>
      );
    };

    const renderRecentProfit = () => {
      return (
        <div className={styles.earnedWrap}>
          <div className={styles.textSecondary}>Recent CGPT profit</div>
          <div className={styles.textDescription}>
            {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} CGPT
          </div>

          <div className={styles.groupButton}>
            <button
              className={`${styles.btn} ${styles.btnClaimToken}`}
              onClick={() => setShowClaimModal(true)}
              disabled={poolDetail?.pendingReward === "0" || wrongChain}
            >
              Claim token
            </button>
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
            {(+utils.formatEther(poolDetail?.stakingAmount)).toFixed(2)}{" "}
            {tokenDetails?.symbol}
          </div>

          <div className={styles.groupButtonStaking}>
            <button
              className={`${styles.btn} ${styles.btnStake}`}
              onClick={() => setShowStakeModal(true)}
              disabled={wrongChain}
            >
              Stake
            </button>

            {BigNumber.from(poolDetail?.stakingAmount || "0").gt(
              BigNumber.from("0")
            ) && (
              <button
                className={`${styles.btn} ${styles.btnUnstake}`}
                onClick={() => setShowUnstakeModal(true)}
                disabled={poolDetail?.stakingAmount === "0" || wrongChain}
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
          BigNumber.from(poolDetail?.pendingWithdrawal?.amount || "0").gt(
            BigNumber.from("0")
          )
        )
      )
        return <></>;
      return (
        <div className={styles.poolDetailsBlock}>
          <div className={styles.mb8}>
            <div className={styles.textSecondary}>Withdrawal Amount</div>
            <div className={styles.textDescription}>
              {(+utils.formatEther(
                poolDetail?.pendingWithdrawal?.amount
              )).toFixed(2)}{" "}
              {tokenDetails?.symbol}
            </div>
          </div>
          <div className={styles.mb8}>
            <div className={`${styles.textSecondary} ${styles.mt8Mobile}`}>
              You can claim tokens after
            </div>
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
              Number(poolDetail?.pendingWithdrawal?.applicableAt) >
                moment().unix() || wrongChain
            }
          >
            Withdraw
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

        {renderWithdrawWrap()}
      </AccordionDetails>
    );
  };
  // End Render

  return (
    <Accordion className={styles.pool} onChange={handleExpandAccordion}>
      {renderStakingPoolHeader()}

      <div className={styles.poolLine} />

      {renderStakingPoolDetail()}

      <ModalStake
        open={showStakeModal}
        amount={stakeAmount}
        setAmount={setStakeAmount}
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        tokenBalance={tokenBalance}
        stakingAmount={Number(
          utils.formatEther(poolDetail?.stakingAmount)
        ).toFixed(2)}
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
        tokenBalance={tokenBalance}
        pendingReward={poolDetail?.pendingReward}
        delayDuration={poolDetail?.delayDuration}
        stakingAmount={poolDetail?.stakingAmount}
        open={showUnstakeModal}
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

      <ModalConfirmation
        open={showConfirmModal}
        text={confirmationText}
        onConfirm={() => setConfirmed(true)}
        onClose={() => setShowConfirmModal(false)}
      />

      <ModalROI
        open={showROIModal}
        apr={apr}
        rewardTokenPrice={Number(poolDetail?.reward_token_price) || 1}
        rewardToken={rewardTokenDetails}
        acceptedToken={tokenDetails}
        onClose={() => setShowROIModal(false)}
      />
    </Accordion>
  );
};

export default AllocationPool;
