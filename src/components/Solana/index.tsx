"use client";
import { isNumber } from "lodash";
import moment from "moment";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ENABLE_ALLOCATION_CALCULATOR,
  KYC_STATUS,
  POOL_IS_PRIVATE,
  SOLANA_STEPS,
} from "@/constants";
import {
  BSC_CHAIN_ID,
  ETH_CHAIN_ID,
  POLYGON_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
} from "@/constants/network";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import usePoolDetails from "@/hooks/usePoolDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { sotaTiersActions } from "@/store/constants/sota-tiers";

import {
  getPoolCountDown,
  getPoolCountDownPreOrder,
} from "@/utils/getPoolCountDown";
import { PoolStatus } from "@/utils/getPoolStatus";
import { getPoolStatusByPoolDetail } from "@/utils/getPoolStatusByPoolDetail";
import {
  checkAllowUserBuyPreOrder,
  checkIsEnoughTierPreOrder,
  checkIsInPreOrderTime,
  checkIsPoolPreOrder,
} from "@/utils/preOrder";
import { getIconCurrencyUsdt } from "@/utils/usdt";
import BuyTokenForm from "@/components/Solana/BuyTokenForm";
import ByTokenHeader from "@/components/Solana/ByTokenHeader";
import BannerNotification from "@/components/Solana/ByTokenHeader/BannerNotification";
// import ClaimToken from "./ClaimToken";
import usePoolJoinAction from "@/components/Solana/hooks/usePoolJoinAction";
import useTokenSoldProgress from "@/components/Solana/hooks/useTokenSoldProgress";
import { getConfigHeader } from "@/utils/configHeader";
import BannerNotificationDisconnected from "@/components/Solana/ByTokenHeader/BannerNotificationDisconnected";
import { AppContext } from "@/AppContext";
import AppNetworkSwitch from "@/components/Base/HeaderDefaultLayout/AppNetworkSwitch";
import WalletDisconnect from "@/components/Base/HeaderDefaultLayout/WalletDisconnect";
import SignRequiredModal from "@/components/Base/HeaderDefaultLayout/SignRequiredModal";
import { HeaderContext } from "@/components/Base/HeaderDefaultLayout/context/HeaderContext";
import { gTagEvent } from "@/services/gtag";
import tiersData from "@/data/tiers.json";
import axios from "@/services/axios";
import ConnectWalletModal from "@/components/Base/HeaderDefaultLayout/ConnectWalletModal";
import WhitelistNotificationModal from "@/components/buyToken/WhitelistNotificationModal/WhitelistNotificationModal";
import LotteryWinners from "@/components/buyToken/LotteryWinners";
import BuyTokenPoolTimeLine, {
  getDateTimeDisplay,
} from "@/components/buyToken/BuyTokenPoolTimeLine";
import BuyTokenPoolDetails from "@/components/buyToken/BuyTokenPoolDetails";
import usePoolDetailsMapping from "@/components/buyToken/hooks/usePoolDetailsMapping";
import { pushMessage } from "@/store/slices/messageSlice";
import ConnectWalletStepper from "@/components/Solana/ConnectWalletStepper";
import { formatToNumber } from "@/utils/formatNumber";
import InvalidAddress from "@/components/Base/HeaderDefaultLayout/InvalidAddress";
import { formatDecimalNumber } from "@/utils";
import BigNumber from "bignumber.js";
import SolanaConnectWalletModal from "@/components/Base/HeaderDefaultLayout/SolanaConnectWalletModal";
import SolanaConfirmModal from "@/components/staking-pools/ModalConfirm/SolanaModalConfirm";
import useWalletSignature from "@/hooks/useWalletSignature";
import NotFound from "@/components/Base/404/NotFound";
import { useParams, usePathname } from "next/navigation";
import styles from "@/styles/tonConnectWalletStepper.module.scss";
import commonStyle from "@/styles/commonstyle.module.scss";
import ClaimToken from "@/components/Solana/ClaimToken";
import { toast } from "react-toastify";
import Image from "next/image";

enum TabDetais {
  Info = "Project Info",
  Swap = "Swap & Claim",
  Winner = "Winner",
  Allocation = "Allocation Calculator",
}

const SolanaBuyToken: React.FC<any> = () => {
  const dispatch = useDispatch();
  const { signature, signMessage, setSignature } = useWalletSignature();

  const [buyTokenSuccess, setBuyTokenSuccess] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [wrongBuyChain, setWrongBuyChain] = useState<boolean>(false);
  const [wrongClaimChain, setWrongClaimChain] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showWhitelistNotificationModal, setShowWhitelistNotificationModal] =
    useState<boolean>(false);

  const [refetch, setRefetch] = useState<boolean>(false);

  const pathname = usePathname();
  const { id } = useParams();
  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;
  const { poolDetails, poolDetailDone }: any = usePoolDetails(Number(id));
  const { connectedAccount, wrongChain } = useAuth();
  const [claimToken, setClaimToken] = useState("");
  const [refundToken, setRefundToken] = useState("");
  const [userSolanaAddress, setUserSolanaAddress] = useState<any>("");
  const [isValidSolanaAddress, setIsValidSolanaAddress] = useState<any>(false);
  const { tokenSold, soldProgress } = useTokenSoldProgress(
    poolDetails?.amount,
    poolDetails?.networkAvailable,
    poolDetails,
    poolDetails?.id as number
  );
  const { joinPool, poolJoinLoading, joinPoolSuccess } = usePoolJoinAction({
    poolId: poolDetails?.id,
    poolDetails,
  });

  const getSolanaAddress = useCallback(async () => {
    if (
      connectedAccount &&
      localStorage.getItem(`access_token:${connectedAccount}`)
    ) {
      const response = await axios.get("user/get-solana-address", {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem(`access_token:${connectedAccount}`),
        },
      });
      setUserSolanaAddress(response?.data?.data?.solana_address);
      return response?.data?.data?.solana_address;
    }
  }, [connectedAccount]);

  useEffect(() => {
    getSolanaAddress();
  }, [connectedAccount, window?.solana?.publicKey]);

  const updateSolanaWallet = useCallback(async () => {
    const config = {
      headers: {
        msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
        Authorization:
          "Bearer " + localStorage.getItem(`access_token:${connectedAccount}`),
      },
    };
    if (signature && window?.solana?.publicKey && connectedAccount) {
      try {
        const response = await axios.post(
          "user/link-solana-address",
          {
            signature: signature,
            wallet_address: connectedAccount,
            solana_address: window?.solana?.publicKey,
          },
          config as any
        );
        const { status, message } = response.data;
        if (status === 400) {
          toast.error("Cannnot Change Solana Address as user has already registered in this pool")
        }
        if (status === 200) {
          toast.success(message);
          onApplyWhitelist();
        }
        setSignature("");
        setShowConfirmModal(false);
      } catch (error) {
        console.log("🚀 ~ updateSolanaWal ~ error:", error);
        toast.error("An Unexpected Error occurred");
        setSignature("");
        setShowConfirmModal(true);
      }
    }
  }, [
    connectedAccount,
    window?.solana?.publicKey,
    dispatch,
    setSignature,
    signature,
  ]);

  const getSigner = useCallback(async () => {
    setSignature("");
    const solanaAddress = await getSolanaAddress();
    if (
      solanaAddress &&
      solanaAddress !== window?.solana?.publicKey?.toBase58()
    ) {
      await signMessage();
    } else {
      if (!solanaAddress) {
        await signMessage();
      }
    }
  }, [window?.solana?.publicKey, getSolanaAddress, setSignature, signMessage]);

  useEffect(() => {
    if (signature && window?.solana?.publicKey && connectedAccount) {
      updateSolanaWallet();
    }
  }, [
    signature,
    window?.solana?.publicKey,
    connectedAccount,
    updateSolanaWallet,
  ]);

  useEffect(() => {
    if (connectedAccount && window?.solana?.publicKey && userSolanaAddress) {
      setIsValidSolanaAddress(
        userSolanaAddress === window?.solana?.publicKey?.toBase58()
      );
    }
  }, [connectedAccount, window?.solana?.publicKey, userSolanaAddress]);

  useEffect(() => {
    gTagEvent({
      action: "view_ido",
      params: {
        wallet_address: connectedAccount || "",
        ido_name: poolDetails?.title,
      },
    });
  }, []);

  useEffect(() => {
    dispatch(pushMessage(""));
  }, []);

  const configTokenHeader = useMemo(() => {
    return getConfigHeader(connectedAccount);
  }, [connectedAccount]);

  const { data: kycData } = useFetch<any>(
    connectedAccount ? `/is-kyc-user/${connectedAccount}` : undefined
  );

  const onApplyWhitelist = async () => {
    if (!(Number(kycData) === KYC_STATUS.APPROVED || poolDetails?.kycBypass)) {
      return;
    }

    const userSolanaWalletAddress = await getSolanaAddress();
    if (
      userSolanaWalletAddress !== window?.solana?.publicKey?.toBase58() &&
      window?.solana?.publicKey &&
      userSolanaWalletAddress
    ) {
      toast.error(
        `Solana Wallet ${userSolanaWalletAddress?.substring(
          0,
          6
        )}***${userSolanaWalletAddress?.slice(
          -7
        )} Already Connected. Please use this wallet for interactions.`
      );
      setShowConfirmModal(true);
      return;
    } else if (userSolanaWalletAddress === "") {
      setShowConfirmModal(true);
      return;
    }

    await joinPool("");
    if (currentUserTier?.level <= 1) {
      setShowWhitelistNotificationModal(true);
    }
  };

  const { data: existedWinner, loading: existedWinnerLoading } = useFetch<
    Array<any>
  >(
    poolDetails && connectedAccount
      ? `/pool/${poolDetails?.id}/check-exist-winner?wallet_address=${connectedAccount}`
      : undefined,
    poolDetails?.method !== "whitelist",
    configTokenHeader,
    false
  );

  const { data: dataUser, loading: dataUserLoading } = useFetch<any>(
    connectedAccount
      ? `/user/profile?wallet_address=${connectedAccount}`
      : undefined,
    false,
    configTokenHeader,
    false
  );
  const { data: pickedWinner } = useFetch<Array<any>>(
    poolDetails ? `/pool/${poolDetails?.id}/check-picked-winner` : undefined,
    poolDetails?.method !== "whitelist"
  );

  const { data: alreadyJoinPool, loading: joinPoolLoading } = useFetch<boolean>(
    poolDetails && connectedAccount
      ? `/user/check-join-campaign/${poolDetails?.id}?wallet_address=${connectedAccount}`
      : undefined,
    false,
    configTokenHeader,
    false
  );

  const verifiedEmail = true;
  const {
    data: currentUserTier,
    loading: tierLoading,
    refetchData: refetchCurrientTier,
  } = useFetch<any>(
    id && connectedAccount
      ? `pool/${id}/user/current-tier?wallet_address=${connectedAccount}`
      : undefined,
    false,
    configTokenHeader,
    false
  );

  const { data: winnersList, loading: winnersListLoading } = useFetch<any>(
    id ? `/user/winner-list/${id}?page=1&limit=10&` : undefined
  );

  const refetchTier = () => {
    let newUri =
      id && connectedAccount ? `pool/${id}/user/current-tier` : undefined;
    refetchCurrientTier(newUri);
  };

  const firstLoading = !(!winnersListLoading && connectedAccount);
  const totalLoading =
    existedWinnerLoading ||
    dataUserLoading ||
    joinPoolLoading ||
    tierLoading ||
    poolJoinLoading ||
    firstLoading;

  const poolDetailsMapping = usePoolDetailsMapping(poolDetails);

  const appNetwork = useMemo(() => {
    switch (appChainID) {
      case BSC_CHAIN_ID:
        return "bsc";

      case POLYGON_CHAIN_ID:
        return "polygon";

      case ETH_CHAIN_ID:
        return "eth";

      case AVALANCHE_CHAIN_ID:
        return "avalanche";

      case ARBITRUM_CHAIN_ID:
        return "arbitrum";
    }
  }, [appChainID]);
  const ableToFetchFromBlockchain =
    appNetwork === poolDetails?.networkAvailable && !wrongChain;
  const userBuyLimit = currentUserTier?.max_buy || 0;
  const userBuyMinimum = currentUserTier?.min_buy || 0;
  const currentUserTierLevel = currentUserTier?.level || 0;
  const userReferralAllocation = currentUserTier?.referral_alloc || 0;
  const userGuaranteeAllocation = currentUserTier?.guarantee_alloc || 0;
  const userFcfsAllocation = currentUserTier?.fcfs_alloc || 0;

  const [isPreOrderPool, setIsPreOrderPool] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const [isEnoughTierPreOrder, setIsEnoughTierPreOrder] =
    useState<boolean>(false);
  const [isInPreOrderTime, setIsInPreOrderTime] = useState<boolean>(false);
  const [allowUserBuyPreOrder, setAllowUserBuyPreOrder] =
    useState<boolean>(false);

  const getIsPreOrderPool = useCallback(() => {
    return checkIsPoolPreOrder({ poolDetails, currentUserTierLevel });
  }, [poolDetails, currentUserTierLevel]);
  const getIsEnoughTierPreOrder = useCallback(() => {
    return checkIsEnoughTierPreOrder({ poolDetails, currentUserTierLevel });
  }, [poolDetails, currentUserTierLevel]);
  const getIsInPreOrderTime = useCallback(() => {
    return (
      isPreOrderPool &&
      checkIsInPreOrderTime({ poolDetails, currentUserTierLevel })
    );
  }, [poolDetails, refetch, isPreOrderPool, currentUserTierLevel]);
  const getAllowUserBuyPreOrder = useCallback(() => {
    return (
      isPreOrderPool &&
      checkAllowUserBuyPreOrder({
        poolDetails,
        currentUserTierLevel,
        userJoined: alreadyJoinPool || joinPoolSuccess,
        userIsWinner: existedWinner,
      })
    );
  }, [
    poolDetails,
    refetch,
    isPreOrderPool,
    currentUserTierLevel,
    existedWinner,
    alreadyJoinPool,
    joinPoolSuccess,
    connectedAccount,
  ]);

  const [poolTimeline, setPoolTimeline] = useState<any>({});

  useEffect(() => {
    if (!poolDetails) return;

    const joinTimeInDate = poolDetails?.joinTime
      ? new Date(Number(poolDetails?.joinTime) * 1000)
      : undefined;
    const endJoinTimeInDate = poolDetails?.endJoinTime
      ? new Date(Number(poolDetails?.endJoinTime) * 1000)
      : undefined;

    const startPreOrderTime = poolDetails?.startPreOrderTime
      ? new Date(Number(poolDetails?.startPreOrderTime) * 1000)
      : undefined;
    const startBuyTimeNormal = poolDetails?.startBuyTime
      ? new Date(Number(poolDetails?.startBuyTime) * 1000)
      : undefined;
    const startBuyTimeInDate = isInPreOrderTime
      ? startPreOrderTime
      : startBuyTimeNormal;

    const endPreOrderTime = startBuyTimeNormal;

    const endBuyTimeNormal = poolDetails?.endBuyTime
      ? new Date(Number(poolDetails?.endBuyTime) * 1000)
      : undefined;
    const endBuyTimeInDate = isInPreOrderTime
      ? endPreOrderTime
      : endBuyTimeNormal;

    const announcementTime = poolDetails?.announcement_time
      ? new Date(Number(poolDetails?.announcement_time) * 1000)
      : undefined;
    const releaseTimeInDate = poolDetails?.releaseTime
      ? new Date(Number(poolDetails?.releaseTime) * 1000)
      : undefined;

    setPoolTimeline({
      joinTimeInDate,
      endJoinTimeInDate,
      startBuyTimeNormal,
      endBuyTimeNormal,
      startBuyTimeInDate,
      endBuyTimeInDate,
      announcementTime,
      releaseTimeInDate,
      startPreOrderTime,
    });
  }, [poolDetails, currentUserTierLevel, isInPreOrderTime]);
  const {
    joinTimeInDate,
    endJoinTimeInDate,
    startBuyTimeNormal,
    endBuyTimeNormal,
    startBuyTimeInDate,
    endBuyTimeInDate,
    releaseTimeInDate,
    startPreOrderTime,
  } = poolTimeline;

  const [activeTabBottom, setActiveTabBottom] = useState<TabDetais>(
    TabDetais.Info
  );
  const [textSwapTab, setTextSwapTab] = useState<string>("Swap & Claim");
  const [numberWiner, setNumberWiner] = useState(0);

  const { currencyName } = getIconCurrencyUsdt({
    purchasableCurrency: poolDetails?.purchasableCurrency,
    networkAvailable: poolDetails?.networkAvailable,
  });

  const today = new Date();

  const availablePurchase =
    startBuyTimeInDate &&
    endBuyTimeInDate &&
    today >= startBuyTimeInDate &&
    today <= endBuyTimeInDate &&
    poolDetails?.isDeployed &&
    verifiedEmail;

  const getPoolStatus = useCallback(() => {
    return getPoolStatusByPoolDetail(poolDetails, tokenSold);
  }, [poolDetails, refetch, tokenSold]);
  const [poolStatus, setPoolStatus] = useState<PoolStatus | undefined>(
    undefined
  );

  const displayCountDownTime = useCallback(
    (
      method: string | undefined,
      startJoinTime: Date | undefined,
      endJoinTime: Date | undefined,
      startBuyTime: Date | undefined,
      endBuyTime: Date | undefined
    ) => {
      if (isEnoughTierPreOrder && isInPreOrderTime) {
        return getPoolCountDownPreOrder({ endBuyTime });
      }
      return getPoolCountDown(
        startJoinTime,
        endJoinTime,
        startBuyTime,
        endBuyTime,
        releaseTimeInDate,
        method,
        poolStatus,
        poolDetails,
        soldProgress,
        poolDetails?.isPrivate
      );
    },
    [
      poolStatus,
      poolDetails?.method,
      poolDetails?.isPrivate,
      joinTimeInDate,
      endJoinTimeInDate,
      startBuyTimeInDate,
      endBuyTimeInDate,
    ]
  );

  const getTimeline = useCallback(() => {
    let enoughInPreOrder = isEnoughTierPreOrder && isInPreOrderTime;
    let startTime = enoughInPreOrder ? startBuyTimeInDate : startBuyTimeNormal;
    let endTime = enoughInPreOrder ? endBuyTimeInDate : endBuyTimeNormal;
    let { date: countDownDate, display } = displayCountDownTime(
      poolDetails?.method,
      joinTimeInDate,
      endJoinTimeInDate,
      startTime,
      endTime
    );
    return { countDownDate, display };
  }, [poolDetails, poolStatus]);

  const [timeline, setTimeline] = useState({
    countDownDate: undefined,
    display: "",
  });
  const {

    currentConnectedWallet,
    openConnectWallet,
    setOpenConnectWallet,
    connectWalletLoading,

  } = useContext(AppContext);
  const [openSolanaConnectWallet, setSolanaConnectWallet] = useState(false);
  const [disconnectDialog, setDisconnectDialog] = useState<boolean>(false);
  const [invalidAddressDialog, setInvalidAddressDialog] =
    useState<boolean>(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [switchNetworkDialog, setSwitchNetworkDialog] =
    useState<boolean>(false);
 
  const handleConnectWalletClose = () => {
    setOpenConnectWallet && setOpenConnectWallet(false);
    setOpenSideBar(false);
  };

  const handleSolanaConnectWalletClose = () => {
    setSolanaConnectWallet && setSolanaConnectWallet(false);
    setOpenSideBar(false);
  };

  const handleConnectWalletOpen = () => {
    setOpenConnectWallet && setOpenConnectWallet(true);
    setOpenSideBar(false);
  };

  const handleSolanaConnectWalletOpen = () => {
    setSolanaConnectWallet && setSolanaConnectWallet(true);
    setOpenSideBar(false);
  };

  const handleInvalidAddressDialogOpen = () => {
    setInvalidAddressDialog(true);
    setOpenSideBar(false);
  };

  useEffect(() => {
    if (!poolDetails) return;

    setIsPreOrderPool(getIsPreOrderPool());
    setIsEnoughTierPreOrder(getIsEnoughTierPreOrder());
    setIsInPreOrderTime(getIsInPreOrderTime());
    setAllowUserBuyPreOrder(getAllowUserBuyPreOrder());

    setPoolStatus(getPoolStatus());

    setTimeline(getTimeline());
  }, [poolDetails, refetch, firstLoading, totalLoading, soldProgress]);

  useEffect(() => {
    if (!poolStatus) return;
    let activeTab = TabDetais.Info,
      newTextSwapTab = "Swap & Claim";

    switch (poolStatus) {
      case PoolStatus.Upcoming:
        if (existedWinner) {
          activeTab = TabDetais.Winner;
        }
        break;
      case PoolStatus.Progress:
        activeTab = TabDetais.Swap;
        newTextSwapTab = "Swap & Claim";
        break;
      case PoolStatus.Claimable:
      case PoolStatus.Closed:
      case PoolStatus.Filled:
        activeTab = TabDetais.Swap;
        newTextSwapTab = "Claim";
        break;

      default:
        activeTab = TabDetais.Info;
        newTextSwapTab = "Swap & Claim";
        break;
    }

    setActiveTabBottom(activeTab);
    setTextSwapTab(newTextSwapTab);
    setTimeline(getTimeline());
  }, [poolStatus]);
  const { refreshing } = useSelector((state: any) => state.tokensByUser);

  function refetchPool() {
    setRefetch((prev) => !prev);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    currentUserTier &&
      dispatch({
        type: sotaTiersActions.USER_TIER_SUCCESS,
        payload: currentUserTier.level,
      });
  }, [currentUserTier]);

  const isOverTimeApplyWhiteList =
    endJoinTimeInDate && endJoinTimeInDate < today;
  const isKYC = !!(
    Number(kycData) === KYC_STATUS.APPROVED || poolDetails?.kycBypass
  );
  const showKyc = poolDetails && !isKYC && connectedAccount;
  const showMinTier =
    poolDetails &&
    currentUserTier?.level < poolDetails.minTier &&
    !isOverTimeApplyWhiteList;
  const showSocialTask = poolDetails && currentUserTier?.level <= 1;

  const isCommunityPool =
    Number(poolDetails?.isPrivate || "0") === POOL_IS_PRIVATE.COMMUNITY;
  const region = moment.tz.guess();
  const timezone = moment.tz(region).format("Z");

  const openWhitelistNotificationModal = () => {
    setShowWhitelistNotificationModal(true);
  };

  useEffect(() => {
    if (
      (poolStatus !== PoolStatus.Filled &&
        startBuyTimeNormal &&
        endBuyTimeNormal &&
        startBuyTimeNormal < new Date() &&
        new Date() < endBuyTimeNormal &&
        !existedWinner) ||
      (poolStatus !== PoolStatus.Filled &&
        isPreOrderPool &&
        allowUserBuyPreOrder &&
        startBuyTimeInDate &&
        endBuyTimeInDate &&
        startBuyTimeInDate < new Date() &&
        new Date() < endBuyTimeInDate)
    ) {
      setShowText(true);
    } else {
      setShowText(false);
    }
  }, [
    poolDetails,
    poolStatus,
    endBuyTimeNormal,
    allowUserBuyPreOrder,
    joinPoolSuccess,
    alreadyJoinPool,
    startBuyTimeNormal,
    endBuyTimeInDate,
    existedWinner,
    isPreOrderPool,
    startBuyTimeInDate,
    isEnoughTierPreOrder,
  ]);

  const [currentStep, setCurrentStep] = useState<any>(SOLANA_STEPS.START);

  const renderSolanaTokensInfo = () => {
    const availableJoin =
      poolDetails?.method === "whitelist" && joinTimeInDate && endJoinTimeInDate
        ? today >= joinTimeInDate &&
          today <= endJoinTimeInDate &&
          currentUserTier &&
          connectedAccount &&
          new BigNumber(currentUserTier?.level || 0).gte(
            poolDetails?.minTier
          ) &&
          verifiedEmail
        : false;
    const disableButton = !availableJoin || alreadyJoinPool || joinPoolSuccess;
    return (
      <>
        {currentStep !== SOLANA_STEPS.NONE &&
          joinTimeInDate &&
          endJoinTimeInDate &&
          today >= joinTimeInDate &&
          today <= endJoinTimeInDate && (
            <ConnectWalletStepper
              connectedAccount={connectedAccount}
              setClaimToken={setClaimToken}
              claimToken={claimToken}
              poolDetails={poolDetails}
              setRefundToken={setRefundToken}
              refundToken={refundToken}
              handleConnectWalletOpen={handleConnectWalletOpen}
              handleSolanaConnectWalletOpen={handleSolanaConnectWalletOpen}
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              connectWalletLoading={connectWalletLoading}
              handleInvalidAddressDialogOpen={handleInvalidAddressDialogOpen}
              isValidSolanaAddress={isValidSolanaAddress}
              getSolanaAddress={getSolanaAddress}
              disableButton={disableButton}
            />
          )}
      </>
    );
  };

  const renderPoolDetailLeft = () => {
    return (
      <div className={styles.poolDetailLeft}>
        {renderSolanaTokensInfo()}
        <div className={styles.poolDetailBlock}>
          {connectedAccount ? (
            <BannerNotification
              poolDetails={poolDetails}
              ableToFetchFromBlockchain={ableToFetchFromBlockchain}
              winnersList={winnersList}
              verifiedEmail={verifiedEmail}
              currentUserTier={currentUserTier}
              existedWinner={existedWinner}
              currencyName={currencyName}
              userBuyLimit={userBuyLimit}
              alreadyJoinPool={alreadyJoinPool}
              joinPoolSuccess={joinPoolSuccess}
              connectedAccount={connectedAccount}
              wrongChain={wrongChain}
              isOverTimeApplyWhiteList={isOverTimeApplyWhiteList}
              poolStatus={poolStatus}
              refetch={refetch}
              totalLoading={totalLoading}
              tokenSold={tokenSold}
              soldProgress={soldProgress}
              poolTimeline={poolTimeline}
              poolJoinLoading={poolJoinLoading}
              onApplyWhitelist={onApplyWhitelist}
              openWhitelistNotificationModal={openWhitelistNotificationModal}
              showKyc={showKyc}
              showMinTier={showMinTier}
              isRefunded={isRefunded}
              guaranteeAllocation={userGuaranteeAllocation}
            />
          ) : (
            <BannerNotificationDisconnected
              poolDetails={poolDetails}
              ableToFetchFromBlockchain={ableToFetchFromBlockchain}
              winnersList={winnersList}
              isOverTimeApplyWhiteList={isOverTimeApplyWhiteList}
              poolStatus={poolStatus}
              refetch={refetch}
              totalLoading={!poolDetails}
              tokenSold={tokenSold}
              soldProgress={soldProgress}
              poolTimeline={poolTimeline}
              poolJoinLoading={poolJoinLoading}
              onApplyWhitelist={onApplyWhitelist}
              openWhitelistNotificationModal={openWhitelistNotificationModal}
              isRefunded={isRefunded}
            />
          )}
          <BuyTokenPoolTimeLine
            timezone={timezone}
            currentStatus={poolStatus}
            display={timeline.display}
            poolDetails={poolDetails}
            countDownDate={timeline.countDownDate}
            refetchPoolDetails={refetchPool}
            refetchCurrentTier={refetchTier}
            isEnoughTierPreOrder={isEnoughTierPreOrder}
          />
        </div>
      </div>
    );
  };

  const renderPoolDetailRight = () => {
    const renderNavbar = () => {
      return (
        <ul id="navTabs" className={styles.navBottom}>
          <li
            onClick={() => setActiveTabBottom(TabDetais.Info)}
            className={activeTabBottom === TabDetais.Info ? "active" : ""}
          >
            Project Info
          </li>
          <li
            onClick={() => setActiveTabBottom(TabDetais.Swap)}
            className={activeTabBottom === TabDetais.Swap ? "active" : ""}
          >
            {textSwapTab}
          </li>
          {isNumber(numberWiner) && numberWiner > 0 && !!pickedWinner && (
            <li
              onClick={() => setActiveTabBottom(TabDetais.Allocation)}
              className={
                activeTabBottom === TabDetais.Allocation ? "active" : ""
              }
            >
              Allocation Calculator
            </li>
          )}
          {isNumber(numberWiner) && numberWiner > 0 && !!pickedWinner && (
            <li
              onClick={() => setActiveTabBottom(TabDetais.Winner)}
              className={activeTabBottom === TabDetais.Winner ? "active" : ""}
            >
              Winner ({`${numberWiner}`})
            </li>
          )}
        </ul>
      );
    };

    const renderTabProjectInfo = () => {
      if (activeTabBottom !== TabDetais.Info) return;
      return (
        <BuyTokenPoolDetails
          currencyName={currencyName}
          poolDetails={poolDetails}
          currentUserTierLevel={currentUserTierLevel}
        />
      );
    };

    const calculateTimeDifference = (startDate: any, endDate: any) => {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();

      if (isNaN(startDateTime) || isNaN(endDateTime)) {
        return "few hours";
      }

      const differenceMs = Math.abs(endDateTime - startDateTime);

      const hoursDifference = Math.floor(differenceMs / (1000 * 60 * 60));
      const daysDifference = Math.floor(hoursDifference / 24);
      const monthsDifference = Math.floor(daysDifference / 30);
      const minutesDifference = Math.floor(differenceMs / (1000 * 60));

      if (monthsDifference > 0) {
        return `${monthsDifference} ${
          monthsDifference === 1 ? "month" : "months"
        }`;
      } else if (daysDifference > 0) {
        return `${daysDifference} ${daysDifference === 1 ? "day" : "days"}`;
      } else if (hoursDifference > 0) {
        return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"}`;
      } else {
        return `${minutesDifference} ${
          minutesDifference === 1 ? "minute" : "minutes"
        }`;
      }
    };
    const difference = calculateTimeDifference(
      startPreOrderTime,
      startBuyTimeInDate
    );

    const renderTabSwapClaim = () => {
      if (activeTabBottom !== TabDetais.Swap) return;
      return (
        <>
          {startPreOrderTime &&
          isEnoughTierPreOrder &&
          new Date() < startPreOrderTime ? (
            <>
              <span className={commonStyle.nnn1424h}>
                <b>Pre-Order Starts Soon</b>
              </span>
              <br />
              <span className={commonStyle.nnn1424h}>
                The IDO pre-order will open {difference} before the official IDO
                launch.
              </span>
              <br />
              <span className={commonStyle.nnn1424h}>
                Pre-Order Start: {getDateTimeDisplay(startPreOrderTime)} (GMT{" "}
                {`${timezone}`})
              </span>
              {startBuyTimeInDate && (
                <>
                  <br />
                  <span className={commonStyle.nnn1424h}>
                    IDO Launch: {getDateTimeDisplay(startBuyTimeInDate)} (GMT{" "}
                    {`${timezone}`})
                  </span>
                </>
              )}
              <br />
              <span className={commonStyle.nnn1424h}>
                Mark your calendar and come back when the pre-order begins for
                early access. <br /> We appreciate your enthusiasm and look
                forward to your participation!
              </span>
            </>
          ) : startBuyTimeNormal &&
            new Date() < startBuyTimeNormal &&
            !(isEnoughTierPreOrder && existedWinner) ? (
            <span className={commonStyle.nnn1424h}>
              Please wait until IDO Date & Time at{" "}
              {getDateTimeDisplay(startBuyTimeInDate)} (GMT {`${timezone}`})
            </span>
          ) : (
            !endBuyTimeNormal && (
              <span className={commonStyle.nnn1424h}>
                IDO launch time to be announced soon—stay tuned!
              </span>
            )
          )}

          {poolStatus !== PoolStatus.Filled &&
            startBuyTimeNormal &&
            endBuyTimeNormal &&
            startBuyTimeNormal < new Date() &&
            new Date() < endBuyTimeNormal && (
              <>
                {(!isPreOrderPool || (isPreOrderPool && !isInPreOrderTime)) && (
                  <BuyTokenForm
                    disableAllButton={wrongBuyChain}
                    existedWinner={existedWinner}
                    alreadyJoinPool={alreadyJoinPool}
                    joinPoolSuccess={joinPoolSuccess}
                    tokenDetails={poolDetails?.tokenDetails}
                    networkAvailable={poolDetails?.networkAvailable || ""}
                    rate={poolDetails?.ethRate}
                    poolAddress={poolDetails?.poolAddress}
                    maximumBuy={userBuyLimit}
                    minimumBuy={userBuyMinimum}
                    guaranteeAllocation={userGuaranteeAllocation}
                    fcfsAllocation={userFcfsAllocation}
                    poolAmount={poolDetails?.amount}
                    purchasableCurrency={poolDetails?.purchasableCurrency?.toUpperCase()}
                    poolId={poolDetails?.id}
                    joinTime={joinTimeInDate}
                    method={poolDetails?.method}
                    availablePurchase={availablePurchase}
                    ableToFetchFromBlockchain={ableToFetchFromBlockchain}
                    minTier={poolDetails?.minTier}
                    isDeployed={poolDetails?.isDeployed}
                    connectedAccount={connectedAccount}
                    wrongChain={wrongChain}
                    startBuyTimeInDate={startBuyTimeNormal}
                    endBuyTimeInDate={endBuyTimeNormal}
                    endJoinTimeInDate={endJoinTimeInDate}
                    tokenSold={tokenSold}
                    setBuyTokenSuccess={setBuyTokenSuccess}
                    isClaimable={poolDetails?.type === "claimable"}
                    currentUserTier={currentUserTier}
                    poolDetailsMapping={poolDetailsMapping}
                    poolDetails={poolDetails}
                    isInPreOrderTime={false}
                    showText={showText}
                    poolIndex={poolDetails?.poolIndex}
                    isValidSolanaAddress={isValidSolanaAddress}
                    handleInvalidAddressDialogOpen={
                      handleInvalidAddressDialogOpen
                    }
                  />
                )}
              </>
            )}

          {poolStatus !== PoolStatus.Filled &&
            isPreOrderPool &&
            isEnoughTierPreOrder &&
            allowUserBuyPreOrder &&
            startBuyTimeInDate &&
            endBuyTimeInDate &&
            startBuyTimeInDate < new Date() &&
            new Date() < endBuyTimeInDate && (
              <BuyTokenForm
                disableAllButton={wrongBuyChain}
                existedWinner={existedWinner}
                alreadyJoinPool={alreadyJoinPool}
                joinPoolSuccess={joinPoolSuccess}
                tokenDetails={poolDetails?.tokenDetails}
                networkAvailable={poolDetails?.networkAvailable || ""}
                rate={poolDetails?.ethRate}
                poolAddress={poolDetails?.poolAddress}
                maximumBuy={userBuyLimit}
                minimumBuy={userBuyMinimum}
                guaranteeAllocation={userGuaranteeAllocation}
                fcfsAllocation={userFcfsAllocation}
                poolAmount={poolDetails?.amount}
                purchasableCurrency={poolDetails?.purchasableCurrency?.toUpperCase()}
                poolId={poolDetails?.id}
                joinTime={joinTimeInDate}
                method={poolDetails?.method}
                availablePurchase={availablePurchase}
                ableToFetchFromBlockchain={ableToFetchFromBlockchain}
                minTier={poolDetails?.minTier}
                isDeployed={poolDetails?.isDeployed}
                connectedAccount={connectedAccount}
                wrongChain={wrongChain}
                startBuyTimeInDate={startBuyTimeInDate}
                endBuyTimeInDate={endBuyTimeInDate}
                endJoinTimeInDate={endJoinTimeInDate}
                tokenSold={tokenSold}
                setBuyTokenSuccess={setBuyTokenSuccess}
                isClaimable={poolDetails?.type === "claimable"}
                currentUserTier={currentUserTier}
                poolDetailsMapping={poolDetailsMapping}
                poolDetails={poolDetails}
                isInPreOrderTime={isInPreOrderTime}
                showText={showText}
                poolIndex={poolDetails?.poolIndex}
                isValidSolanaAddress={isValidSolanaAddress}
                handleInvalidAddressDialogOpen={handleInvalidAddressDialogOpen}
              />
            )}

          {poolDetails?.campaignStatus &&
            ([
              PoolStatus.Filled + "",
              PoolStatus.Progress + "",
              PoolStatus.Claimable + "",
              PoolStatus.Closed + "",
            ].includes(poolDetails.campaignStatus) ||
              (poolDetails.campaignStatus === PoolStatus.Upcoming &&
                isEnoughTierPreOrder)) && (
              <ClaimToken
                width={100}
                releaseTime={
                  poolDetails?.releaseTime ? releaseTimeInDate : undefined
                }
                ableToFetchFromBlockchain={ableToFetchFromBlockchain}
                tokenDetails={poolDetails?.tokenDetails}
                buyTokenSuccess={buyTokenSuccess}
                poolId={poolDetails?.id}
                wrongChain={wrongClaimChain}
                poolDetails={poolDetails}
                currencyName={currencyName}
                startBuyTimeInDate={startBuyTimeInDate}
                isPreOrderPool={isPreOrderPool}
                allowUserBuyPreOrder={allowUserBuyPreOrder}
                startBuyTimeNormal={startBuyTimeNormal}
                userBuyLimit={userBuyLimit}
                dataUser={dataUser}
                setIsRefunded={setIsRefunded}
                poolStatus={poolDetails.campaignStatus || ""}
                poolIndex={poolDetails?.poolIndex}
                purchasableCurrency={poolDetails?.purchasableCurrency?.toUpperCase()}
                isValidSolanaAddress={isValidSolanaAddress}
                handleInvalidAddressDialogOpen={handleInvalidAddressDialogOpen}
              />
            )}
        </>
      );
    };
    const allocationCalculator = () => {
      if (activeTabBottom !== TabDetais.Allocation) return;
      return (
        <>
          <div className={styles.allocationwrap}>
            <h2>Allocation Calculator</h2>
            <p
              style={{
                lineHeight: "1.7",
              }}
            >
              The IDO allocation calculator illustrates the distribution for
              each tier level participating in the IDO. Since the allocation
              varies between each IDO, we suggest referring to this tab for
              precise allocation per tier.
            </p>
            <div className={styles.tableResponse}>
              <table className="table tableBordered">
                <thead>
                  <tr>
                    <th scope="col">Tier Type</th>
                    <th scope="col">Multiplier</th>
                    {poolDetails?.relationship_type === "Giveaway" ? (
                      <th scope="col">Tier Allocation</th>
                    ) : (
                      <th scope="col">Tier Allocation in Tokens</th>
                    )}
                    {poolDetails?.relationship_type !== "Giveaway" && (
                      <th scope="col">Tier Allocation in USDT</th>
                    )}
                    {poolDetails?.relationship_type === "Giveaway" && (
                      <>
                        <th scope="col">Current Value</th>
                        <th scope="col">Original Value</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tiersData.map((tier, index) => {
                    const maxBuy: any = poolDetails?.tiers[0];
                    const usdtAllocation = new BigNumber(
                      maxBuy?.max_buy * tier?.multiplicationFactor
                    ).toNumber();
                    const formattedUsdtAllocation =
                      formatDecimalNumber(usdtAllocation);
                    const tokens = new BigNumber(formattedUsdtAllocation)
                      .multipliedBy(
                        new BigNumber(1).div(poolDetails?.ethRate as number)
                      )
                      .toNumber();
                    const tiersAllocation = new BigNumber(tokens)
                      .decimalPlaces(6)
                      .toNumber();
                    const currentValue =
                      tiersAllocation * poolDetails.current_price;
                    const originalValue = Number(
                      tiersAllocation * poolDetails?.token_price
                    );

                    return (
                      <tr key={index}>
                        <td>
                          <div
                            className="d_flex"
                            style={{
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              className=""
                              style={{ marginRight: "5px" }}
                              src={tier.imageUrl}
                              alt={tier.tier}
                              width={24}
                              height={24}
                            />
                            {tier?.tier}
                          </div>
                        </td>
                        <td>{tier?.multiplicationFactor}x</td>
                        <td className="p-0 w200" style={{ color: "#a0a0dc" }}>
                          <div className="price">
                            {isNaN(tiersAllocation)
                              ? "-"
                              : formatToNumber(tiersAllocation?.toFixed(2)) +
                                " " +
                                poolDetails?.tokenDetails.symbol}
                          </div>
                        </td>
                        {poolDetails?.relationship_type !== "Giveaway" && (
                          <td className="p-0 w200" style={{ color: "#a0a0dc" }}>
                            <div className="price">
                              {isNaN(formattedUsdtAllocation)
                                ? "-"
                                : "$" +
                                  formatToNumber(
                                    formattedUsdtAllocation.toFixed(2)
                                  )}
                            </div>
                          </td>
                        )}
                        {poolDetails?.relationship_type === "Giveaway" && (
                          <>
                            <td
                              className="p-0 w200"
                              style={{ color: "#a0a0dc" }}
                            >
                              <div className="price">
                                {isNaN(currentValue)
                                  ? "-"
                                  : "$" +
                                    formatToNumber(currentValue?.toFixed(2))}
                              </div>
                            </td>
                            <td
                              className="p-0 w200"
                              style={{ color: "#a0a0dc" }}
                            >
                              <div className="price">
                                {isNaN(originalValue)
                                  ? "-"
                                  : "$" +
                                    formatToNumber(originalValue?.toFixed(2))}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    };

    const renderTabWinner = () => {
      return (
        <div
          className={`${activeTabBottom === TabDetais.Winner && "show"} ${
            styles.hiddenTabWinner
          }`}
        >
          <LotteryWinners
            poolId={poolDetails?.id}
            title={poolDetails?.title}
            userWinLottery={!!existedWinner}
            pickedWinner={!!pickedWinner}
            currencyName={currencyName}
            userBuyLimit={userBuyLimit}
            alreadyJoinPool={alreadyJoinPool}
            joinPoolSuccess={joinPoolSuccess}
            setNumberWiner={setNumberWiner}
            isCommunityPool={isCommunityPool}
            userReferralAllocation={userReferralAllocation}
            participantNumber={poolDetails?.participantNumber}
          />
        </div>
      );
    };

    return (
      <div className={styles.poolDetailRight}>
        <ByTokenHeader
          poolDetailsMapping={poolDetailsMapping}
          poolDetails={poolDetails}
        />
        <div className={styles.boxBottom}>
          {renderNavbar()}

          {renderTabProjectInfo()}

          {renderTabSwapClaim()}
          {ENABLE_ALLOCATION_CALCULATOR && allocationCalculator()}

          {renderTabWinner()}
        </div>
      </div>
    );
  };

  return (
    <>
      {poolDetails?.networkAvailable === "solana" ? (
        <div className={styles.poolDetailContainer}>
          {renderPoolDetailLeft()}

          {renderPoolDetailRight()}

          {showWhitelistNotificationModal && (
            <WhitelistNotificationModal
              opened={showWhitelistNotificationModal}
              poolDetails={poolDetails}
              connectedAccount={connectedAccount as string}
              showKyc={showKyc as boolean}
              showMinTier={showMinTier as boolean}
              showSocialTask={showSocialTask as boolean}
              handleClose={() => {
                setShowWhitelistNotificationModal(false);
              }}
            />
          )}
        </div>
      ) : (
        poolDetails?.networkAvailable &&
        poolDetails?.networkAvailable !== "solana" &&
        poolDetailDone && (
          <NotFound
            title="Oops! The page you're trying to access is not available."
            description="The page you are looking for doesn't exist or has been moved"
            url="/"
            buttonLink="Back to Home Page"
          />
        )
      )}
      <HeaderContext.Provider value={{ agreedTerms, setAgreedTerms }}>
        <SolanaConnectWalletModal
          width={100}
          opened={openSolanaConnectWallet as boolean}
          handleClose={handleSolanaConnectWalletClose}
          getSolanaWallet={getSolanaAddress}
        />
        <ConnectWalletModal
          opened={openConnectWallet as boolean}
          handleClose={handleConnectWalletClose}
        />
        <AppNetworkSwitch
          opened={switchNetworkDialog}
          handleClose={() => setSwitchNetworkDialog(false)}
        />
        <WalletDisconnect
          opened={disconnectDialog}
          handleClose={() => {
            setDisconnectDialog(false);
            setAgreedTerms(false);
            setOpenSideBar(false);
          }}
          currentWallet={currentConnectedWallet}
        />
        <InvalidAddress
          opened={invalidAddressDialog}
          handleClose={() => {
            setInvalidAddressDialog(false);
            setOpenSideBar(false);
          }}
          solanaAddress={userSolanaAddress}
        />
        <SignRequiredModal opened={refreshing} />
        <SolanaConfirmModal
          open={showConfirmModal}
          onConfirm={() => getSigner()}
          onClose={() => {
            setShowConfirmModal(false);
          }}
          newSolanaAddress={window.solana?.publicKey?.toBase58()}
        />
      </HeaderContext.Provider>
    </>
  );
};

export default SolanaBuyToken;
