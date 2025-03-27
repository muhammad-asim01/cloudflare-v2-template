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
  CUSTOM_NETWORK,
} from "@/constants";
import {
  BSC_CHAIN_ID,
  ETH_CHAIN_ID,
  POLYGON_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  BASE_CHAIN_ID,
  DAO_CHAIN_ID,
  OKX_CHAIN_ID,
  ZKSYNC_CHAIN_ID,
  LINEA_CHAIN_ID,
  BLAST_CHAIN_ID,
  BERA_CHAIN_ID,
  SONIC_CHAIN_ID,
} from "@/constants/network";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import usePoolDetails from "@/hooks/usePoolDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { pushMessage } from "@/store/slices/messageSlice";
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
import BuyTokenForm from "@/components/buyToken/BuyTokenForm";
import BuyTokenPoolDetails from "@/components/buyToken/BuyTokenPoolDetails";
import BuyTokenPoolTimeLine, {
  getDateTimeDisplay,
} from "@/components/buyToken/BuyTokenPoolTimeLine";
// new component update ui
import ByTokenHeader from "@/components/buyToken/ByTokenHeader";
import BannerNotification from "@/components/buyToken/ByTokenHeader/BannerNotification";
import ClaimToken from "@/components/buyToken/ClaimToken";
import usePoolDetailsMapping from "@/components/buyToken/hooks/usePoolDetailsMapping";
import usePoolJoinAction from "@/components/buyToken/hooks/usePoolJoinAction";
import useTokenSoldProgress from "@/components/buyToken/hooks/useTokenSoldProgress";
import LotteryWinners from "@/components/buyToken/LotteryWinners";
import styles from "@/styles/poolDetail.module.scss";
import WhitelistNotificationModal from "@/components/buyToken/WhitelistNotificationModal/WhitelistNotificationModal";
import { getConfigAuthHeader, getConfigHeader } from "@/utils/configHeader";
import { getUserCountryCode } from "@/utils";
import BannerNotificationDisconnected from "@/components/buyToken/ByTokenHeader/BannerNotificationDisconnected";
import { AppContext } from "@/AppContext";
import { trimMiddlePartAddress } from "@/utils/accountAddress";
import Skeleton from "@mui/lab/Skeleton";
import ConnectWalletModal from "@/components/Base/HeaderDefaultLayout/ConnectWalletModal";
import AppNetworkSwitch from "@/components/Base/HeaderDefaultLayout/AppNetworkSwitch";
import WalletDisconnect from "@/components/Base/HeaderDefaultLayout/WalletDisconnect";
import SignRequiredModal from "@/components/Base/HeaderDefaultLayout/SignRequiredModal";
import { HeaderContext } from "@/components/Base/HeaderDefaultLayout/context/HeaderContext";
import { gTagEvent } from "@/services/gtag";
import tiersData from "@/data/tiers.json";
import NotFound from "@/components/Base/404/NotFound";
import axios from "@/services/axios";
import BigNumber from "bignumber.js";
// import { TextInputWithoutIcon } from "@/components/buytoken/TonConnectWalletStepper";


import { isMobile } from "react-device-detect";
import useWalletSignature from "@/hooks/useWalletSignature";
import { useParams, usePathname } from "next/navigation";
import commonStyle from "@/styles/commonstyle.module.scss";
import LegalDisclaimer from "@/components/buyToken/LegalDisclaimer";
import { TextInputWithoutIcon } from "@/components/buyToken/TonConnectWalletStepper";
import { toast } from "react-toastify";
import Button from "./Button";
import Image from "next/image";

enum TabDetais {
  Info = "Project Info",
  Swap = "Swap & Claim",
  Winner = "Winner",
  Allocation = "Allocation Calculator",
  LegalDisclaimer = "Legal Disclaimer",
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// chain integration
const BuyToken: React.FC<any> = () => {
  const dispatch = useDispatch();

  const [buyTokenSuccess, setBuyTokenSuccess] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [wrongBuyChain, setWrongBuyChain] = useState<boolean>(false);
  const [wrongClaimChain, setWrongClaimChain] = useState<boolean>(false);

  const [showWhitelistNotificationModal, setShowWhitelistNotificationModal] =
    useState<boolean>(false);

  const [refetch, setRefetch] = useState<boolean>(false);

  const pathname = usePathname(); // Get the current pathname
  const params = useParams(); // Get dynamic route parameters
  const { id } = params;
  /* const userTier = useTypedSelector(state => state.userTier).data; */
  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;
  const { poolDetails, poolDetailDone } = usePoolDetails(Number(id));
  const { connectedAccount, wrongChain } = useAuth();
  const [hashPool, setHashPool] = useState(true);
  const [restrictUser, setRestrictUser] = useState(false);

  // Fetch token sold, total tokens sold
  const { tokenSold, soldProgress } = useTokenSoldProgress(
    poolDetails?.poolAddress,
    poolDetails?.amount,
    poolDetails?.networkAvailable,
    poolDetails
  );
  const { joinPool, poolJoinLoading, joinPoolSuccess } = usePoolJoinAction({
    poolId: poolDetails?.id,
    poolDetails,
  });

  useEffect(() => {
    gTagEvent({
      action: "view_ido",
      params: {
        wallet_address: connectedAccount || "",
        ido_name: poolDetails?.title,
      },
    });
  }, [poolDetails?.title]);

  const configTokenHeader = useMemo(() => {
    return getConfigHeader(connectedAccount);
  }, [connectedAccount]);

  useEffect(() => {
    const getHash = async () => {
      const url = window.location.href;
      const parts = url.split("/");
      const hash = parts[5];
      if (hash) {
        const response = (await axios.get(
          `/public/pool/details-by-hash/${id}?hash=${hash}`
        )) as any;
        console.log(response, "response");
        if (response?.status === 401) {
          console.log(hashPool, "hash pool");
          setHashPool(true);
        }
        if (response.status === 200) {
          setHashPool(false);
        }
      }
    };
    getHash();
  }, []);

  const { data: dataUser, loading: dataUserLoading } = useFetch<any>(
    connectedAccount
      ? `/user/profile?wallet_address=${connectedAccount}`
      : undefined,
    false,
    configTokenHeader,
    false
  );

  useEffect(() => {
    const getCountryCode = async () => {
      const userCountryCode = await getUserCountryCode();
      if (["USA", "CAN"].includes(userCountryCode)) {
        setRestrictUser(true);
      }
    };
    if (poolDetailDone) {
      getCountryCode();
    }
    getCountryCode();
  }, [poolDetailDone, dataUser, poolDetails]);

  const { data: kycData } = useFetch<any>(
    connectedAccount ? `/is-kyc-user/${connectedAccount}` : undefined
  );

  const onApplyWhitelist = async () => {
    if (!(Number(kycData) === KYC_STATUS.APPROVED || poolDetails?.kycBypass)) {
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
    const newUri =
      id && connectedAccount ? `pool/${id}/user/current-tier` : undefined;
    refetchCurrientTier(newUri);
  };

  // const firstLoading = !(winnersList && connectedAccount);
  const firstLoading = !(!winnersListLoading && connectedAccount);
  const totalLoading =
    existedWinnerLoading ||
    dataUserLoading ||
    joinPoolLoading ||
    tierLoading ||
    poolJoinLoading ||
    firstLoading;

  const poolDetailsMapping = usePoolDetailsMapping(poolDetails);

  // const countDown = useCountDownFreeBuyTime(poolDetails);

  // Use for check whether pool exist in selected network or not
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

      case BASE_CHAIN_ID:
        return "base";

      case DAO_CHAIN_ID:
        return "coredao";

      case OKX_CHAIN_ID:
        return "xlayer";

      case ZKSYNC_CHAIN_ID:
        return "zksync";

      case LINEA_CHAIN_ID:
        return "linea";

      case BERA_CHAIN_ID:
        return "bera";

      case BLAST_CHAIN_ID:
        return "blast";

      case SONIC_CHAIN_ID:
        return "sonic";
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

    // With Whitelist situation, Enable when join time < current < end join time
    // With FCFS, always disable join button
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

  // Get Currency Info
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
    /* today >= tierStartBuyInDate && */
    /* today <= tierEndBuyInDate && */
    poolDetails?.isDeployed &&
    verifiedEmail;

  // const poolStatus = getPoolStatusByPoolDetail(
  //   poolDetails,
  //   tokenSold
  // );
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
        // Pool is PreOrder Pool and Pool in PreOrder Time Actived
        return getPoolCountDownPreOrder({ endBuyTime });
      }
      return getPoolCountDown(
        startJoinTime,
        endJoinTime,
        startBuyTime,
        endBuyTime,
        releaseTimeInDate,
        method,
        // poolDetails?.campaignStatus,
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

  // const { date: countDownDate, display } = (isEnoughTierPreOrder && isInPreOrderTime)
  //     ? displayCountDownTime(poolDetails?.method, joinTimeInDate, endJoinTimeInDate, startBuyTimeInDate, endBuyTimeInDate)
  //     : displayCountDownTime(poolDetails?.method, joinTimeInDate, endJoinTimeInDate, startBuyTimeNormal, endBuyTimeNormal);

  const getTimeline = useCallback(() => {
    const enoughInPreOrder = isEnoughTierPreOrder && isInPreOrderTime;
    const startTime = enoughInPreOrder
      ? startBuyTimeInDate
      : startBuyTimeNormal;
    const endTime = enoughInPreOrder ? endBuyTimeInDate : endBuyTimeNormal;
    const { date: countDownDate, display } = displayCountDownTime(
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
  const [chainCurrency] = useState<string>("BNB");
  const {
    loginError,
    currentConnectedWallet,
    openConnectWallet,
    setOpenConnectWallet,
    connectWalletLoading,
    setOpenEnterRefCode,
  } = useContext(AppContext);
  const [disconnectDialog, setDisconnectDialog] = useState<boolean>(false);
  // const [openSideBar, setOpenSideBar] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [switchNetworkDialog, setSwitchNetworkDialog] =
    useState<boolean>(false);
  const [showTokenBanner, setShowTokenBanner] = useState<any>("");
  const currentAccount =
    currentConnectedWallet && currentConnectedWallet.addresses[0];
  const balance = currentConnectedWallet
    ? currentConnectedWallet.balances[currentAccount]
    : 0;
  const handleConnectWalletClose = () => {
    setOpenConnectWallet && setOpenConnectWallet(false);
  
  };

  const handleEnterRefCodeClose = () => {
    setOpenEnterRefCode && setOpenEnterRefCode(false);
  };

  const handleConnectWalletOpen = () => {
    setOpenConnectWallet && setOpenConnectWallet(true);
    
  };

  const handleDisconnectDialogOpen = () => {
    setDisconnectDialog(true);
  
  };

  useEffect(() => {
    getPoolsWithTokenPrice();
  }, [poolDetails]);

  async function getPoolsWithTokenPrice() {
    let poolWithTokenPrice: any = poolDetails;
    let symbolList: any = poolDetails?.tokenDetails;
    let searchParams = symbolList?.length > 0 ? symbolList?.join(",") : "";
    await axios
      .get(`${baseUrl}/token-price?page=0&search=${searchParams}`)
      .then((response) => {
        let tokenPrice = response.data.data.data.find(
          (dt: any) =>
            dt.token_symbol === poolDetails?.tokenDetails.symbol.toUpperCase()
        );
        poolWithTokenPrice = {
          current_price: tokenPrice && Number(tokenPrice?.current_price),
          ido_price: tokenPrice && Number(tokenPrice?.ido_price),
        };
      })
      .catch((e) => {
        console.log("ERROR analytic", e);
      });
    setShowTokenBanner(poolWithTokenPrice);
    return poolWithTokenPrice;
  }

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
  const { refreshing } = useSelector(
    (state: any) => state.tokensByUser
  );

  function refetchPool() {
    setRefetch((prev) => !prev);
  }

  // Auto Scroll To Top When redirect from other pages
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

  useEffect(() => {
    if (!poolDetails) return;
    const appNetwork = (() => {
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
        case BASE_CHAIN_ID:
          return "base";
        case DAO_CHAIN_ID:
          return "coredao";
        case OKX_CHAIN_ID:
          return "xlayer";
        case ZKSYNC_CHAIN_ID:
          return "zksync";
        case LINEA_CHAIN_ID:
          return "linea";
        case BERA_CHAIN_ID:
          return "bera";
        case BLAST_CHAIN_ID:
          return "blast";
        case SONIC_CHAIN_ID:
          return "sonic";
      }
    })();
    const { networkAvailable, networkClaim, campaignStatus } = poolDetails;
    setWrongBuyChain(appNetwork !== networkAvailable);
    setWrongClaimChain(
      networkClaim && networkClaim !== networkAvailable
        ? appNetwork !== networkClaim
        : appNetwork !== networkAvailable
    );

    if (poolDetails.isDisplay === false) {
      dispatch(pushMessage(`` ));
    } else {
      if (poolDetails && networkClaim && networkClaim !== networkAvailable) {
        if (
          campaignStatus &&
          [
            PoolStatus.Filled + "",
            PoolStatus.Claimable + "",
            PoolStatus.Closed + "",
          ].includes(campaignStatus)
        ) {
          if (appNetwork !== networkClaim) {
            if (networkClaim !== "tba") {
              dispatch(
                pushMessage(
`Please switch to ${networkClaim.toLocaleUpperCase()} network to claim tokens.`,
                )
              );
            } else {
              if (networkClaim === "tba") {
                dispatch(
                  pushMessage(
                    `Network for this pool is not yet available. Thank you for your patience.`
                  )
                );
              }
            }
          } else {
            dispatch(pushMessage(""));
          }
        } else if (appNetwork !== networkAvailable) {
          if (networkAvailable !== "tba") {
            dispatch(
              pushMessage(
                `Please switch to ${networkAvailable.toLocaleUpperCase()} network to do Apply Whitelist, Approve/Buy tokens.`
              )
            );
          } else {
            if (networkAvailable === "tba") {
              dispatch(
                pushMessage(
                  `Network for this pool is not yet available. Thank you for your patience.`
                )
              );
            }
          }
        } else {
          dispatch(pushMessage(""));
        }
      } else if (poolDetails && appNetwork !== networkAvailable) {
        if (networkAvailable !== "tba") {
          dispatch(
            pushMessage(
              `Please switch to ${networkAvailable.toLocaleUpperCase()} network to do Apply Whitelist, Approve/Buy tokens.`
            )
          );
        } else {
          if (networkAvailable === "tba") {
            dispatch(
              pushMessage(
                `Network for this pool is not yet available. Thank you for your patience.`
              )
            );
          }
        }
      } else {
        dispatch(pushMessage(""));
      }
    }
  }, [appChainID, poolDetails, dispatch, appNetwork]);

  useEffect(() => {
    if (restrictUser) {
      dispatch(pushMessage(""));
    }
  }, [restrictUser]);



  // const [showWhitelistCountryModal, setShowWhitelistCountryModal] = useState(false);

  const isOverTimeApplyWhiteList =
    endJoinTimeInDate && endJoinTimeInDate < today;
  // const isCanceledWhitelist = (userCanceledWhiteList && userCanceledWhiteList.id);
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
        // (alreadyJoinPool || joinPoolSuccess) &&
        isPreOrderPool && // Pre Order Pool
        // isEnoughTierPreOrder &&
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

  const renderConnectBox = () => {
    console.log({currentAccount})
    return !connectWalletLoading ? (
      <div className={styles.connectBox}>
        {!currentAccount ? (
          <p className={styles.connectIntro}>
            Please connect your wallet to participate.
          </p>
        ) : (
          ""
        )}

        <div className={styles.connectThumb}>
          {!currentAccount ? (
            <Image
              className={styles.iconToken}
              src="/assets/images/connected-wallet-cgpt.png"
              width={140}
              height={140}
              alt="CGPT Connect wallet"
            />
          ) : (
            <Image
              className={styles.iconToken}
              src="/assets/images/connect-wallet-cgpt.png"
              width={140}
              height={140}
              alt="CGPT Connect wallet"
            />
          )}
        </div>
        <div className={styles.connectActions}>
          <button
            className={
              !currentAccount ? styles.btnGradient : styles.btnConnected
            }
            onClick={() => {
              if (!connectWalletLoading) {
                if (!currentAccount) {
                  handleConnectWalletOpen();
                } else {
                  handleDisconnectDialogOpen();
                }
              }
            }}
            disabled={connectWalletLoading}
          >
            <>
              {currentAccount && (
                <span className={styles.btnBalance}>
                  {currentAccount &&
                    (!loginError ? `${balance} ${chainCurrency}` : "0")}
                </span>
              )}
              {/* {!currentAccount && (
                      <Image src={`/assets/images/${WalletIcon}`} alt="wallet" />
                    )} */}
              <span
                className={
                  currentAccount ? styles.btnAccount : styles.btnConnectText
                }
              >
                {(currentAccount &&
                  `${trimMiddlePartAddress(currentAccount)}`) ||
                  "Connect Wallet"}
              </span>
            </>
          </button>
        </div>
      </div>
    ) : (
      <Skeleton
        className={styles.skeleton}
        variant="rectangular"
        width={238}
        height={36}
      />
    );
  };

  // Ton Network Changes

  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [tonWalletLoading, setTonWalletLoading] = useState<boolean>(false);
  const [isTonWalletLinked, setIsTonWalletLinked] = useState<boolean>(false);
  const accessToken = localStorage.getItem(`access_token:${connectedAccount}`);

  const getCutomNetworkAddress = async () => {
    if (!id && !poolDetails?.is_custom_network) return;
    const response = await axios.get(`/user/get-linked-custom-network/${id}`, {
      headers: {
        Authorization:
          "Bearer " + localStorage.getItem(`access_token:${connectedAccount}`),
      },
    });
    if (response.data.data) {
      setIsTonWalletLinked(true);
      setTonWalletAddress(response.data.data?.custom_wallet_address);
    }
  };

  useEffect(() => {
    if (connectedAccount && accessToken && poolDetails?.is_custom_network) {
      if (CUSTOM_NETWORK) {
        getCutomNetworkAddress();
      }
    }
  }, [id, connectedAccount, accessToken]);

  const { signature, signMessage, setSignature } = useWalletSignature();

  const getSigner = async () => {
    setSignature("");
    await signMessage();
  };

  useEffect(() => {
    if (signature && connectedAccount) {
      connectCustomWallet();
    }
  }, [signature, connectedAccount]);

  const connectCustomWallet = async () => {
    const authConfig = getConfigAuthHeader(connectedAccount);
    try {
      setTonWalletLoading(true);
      try {
        const response = await axios.post(
          "/user/link-custom-network",
          {
            signature: signature,
            campaign_id: id,
            custom_wallet_address: tonWalletAddress,
            wallet_address: connectedAccount,
          },
          authConfig as any
        );
        const { status, message } = response.data;
        if (status === 400) {
          toast.error(message);
        }
        if (status === 200) {
          toast.success(message);
        }
        setSignature("");
        getCutomNetworkAddress();
      } catch (error) {
        console.log("🚀 ~ connectCustomWal ~ error:", error);
        toast.error("An Unexpected Error occurred");
        setSignature("");
      }
      setTonWalletLoading(false);
    } catch (error) {
      console.log("🚀 ~ connectCustomWal ~ error:", error);
      setTonWalletLoading(false);
    }
  };

  const renderCustomNetworkInfo = () => {
    const availableJoin = endJoinTimeInDate
      ? poolDetails?.method === "whitelist" && endJoinTimeInDate
        ? today <= endJoinTimeInDate &&
          currentUserTier &&
          connectedAccount &&
          !wrongChain &&
          new BigNumber(currentUserTier?.level || 0).gte(
            poolDetails?.minTier
          ) &&
          verifiedEmail
        : false
      : false;
    return (
      <>
        <TextInputWithoutIcon
          label={poolDetails?.custom_network_title}
          placeholder={poolDetails?.custom_network_title}
          name="tonWalletAddress"
          setState={setTonWalletAddress}
          value={tonWalletAddress}
          disabled={isTonWalletLinked || !availableJoin}
        />
        <Button
          text={"Submit"}
          color={"white"}
          style={{
            width: "100%",
            height: 36,
            font: "normal normal 500 14px/20px   Violet Sans",
            background: "transparent",
            border: "1px solid  #0066FF",

            padding: 4,
            margin: isMobile ? "7px auto" : "unset",
            color: "#1e1e1e",
            marginBottom: "15px",
            marginTop: "5px",
          }}
          loading={tonWalletLoading}
          disabled={
            tonWalletLoading ||
            isTonWalletLinked ||
            appNetwork !== poolDetails?.networkAvailable ||
            !availableJoin
          }
          onClick={() => {
            if (tonWalletAddress) {
              getSigner();
            } else {
              toast.error(
                `Please enter ${poolDetails?.custom_network_title} Address`
              );
            }
          }}
        />
      </>
    );
  };

  const renderPoolDetailLeft = () => {
    return (
      <div className={styles.poolDetailLeft}>
        {CUSTOM_NETWORK &&
          !!poolDetails?.is_custom_network &&
          (!alreadyJoinPool || !joinPoolSuccess) &&
          renderCustomNetworkInfo()}
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
              // whitelistCompleted={whitelistCompleted}
              // whitelistLoading={whitelistLoading}
              // whitelistSubmission={whitelistSubmission}
              isOverTimeApplyWhiteList={isOverTimeApplyWhiteList}
              // isInPreOrderTime={isInPreOrderTime}
              poolStatus={poolStatus}
              refetch={refetch}
              totalLoading={totalLoading}
              tokenSold={tokenSold}
              soldProgress={soldProgress}
              // Button
              poolTimeline={poolTimeline}
              poolJoinLoading={poolJoinLoading}
              onApplyWhitelist={onApplyWhitelist}
              openWhitelistNotificationModal={openWhitelistNotificationModal}
              showKyc={showKyc}
              showMinTier={showMinTier}
              isRefunded={isRefunded}
              guaranteeAllocation={userGuaranteeAllocation}
              showTokenBanner={showTokenBanner}
              isTonWalletLinked={isTonWalletLinked}
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
              // Button
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

        {renderConnectBox()}
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

          <li
            onClick={() => setActiveTabBottom(TabDetais.LegalDisclaimer)}
            className={
              activeTabBottom === TabDetais.LegalDisclaimer ? "active" : ""
            }
          >
            Legal Disclaimer
          </li>
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

    const calculateTimeDifference = (startDate: Date, endDate: Date) => {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();

      if (isNaN(startDateTime) || isNaN(endDateTime)) {
        return "few hours";
      }

      // Calculate the difference in milliseconds
      const differenceMs = Math.abs(endDateTime - startDateTime);

      // Convert milliseconds to hours, days, or months
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

          {/* NEW PRE ORDER */}
          {/* {poolStatus !== PoolStatus.Filled && !existedWinner &&
            new Date() < startBuyTimeNormal && isEnoughTierPreOrder && (alreadyJoinPool || joinPoolSuccess) && (
              <>
                  <ApproveForm
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
                    // refetchPoolDetails={refetchPool}

                    // Apply Normal Time
                    startBuyTimeInDate={startBuyTimeNormal}
                    endBuyTimeInDate={endBuyTimeNormal}
                    endJoinTimeInDate={endJoinTimeInDate}
                    tokenSold={tokenSold}
                    setBuyTokenSuccess={setBuyTokenSuccess}
                    isClaimable={poolDetails?.type === "claimable"}
                    currentUserTier={currentUserTier}
                    poolDetailsMapping={poolDetailsMapping}
                    poolDetails={poolDetails}
                    // Setting Disable PreOrder
                    isInPreOrderTime={false}
                  />
              </>
            )} */}
          {/* NEW PRE ORDER */}

          {/* {currentUserTierLevel === 0 && renderTextNotJoin()} */}

          {poolStatus !== PoolStatus.Filled &&
            startBuyTimeNormal &&
            endBuyTimeNormal &&
            startBuyTimeNormal < new Date() &&
            new Date() < endBuyTimeNormal && (
              <>
                {(!isPreOrderPool || // Normal Pool
                  (isPreOrderPool && !isInPreOrderTime)) && ( // If Pool PreOrder and in Swap Time
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
                    // refetchPoolDetails={refetchPool}

                    // Apply Normal Time
                    startBuyTimeInDate={startBuyTimeNormal}
                    endBuyTimeInDate={endBuyTimeNormal}
                    endJoinTimeInDate={endJoinTimeInDate}
                    tokenSold={tokenSold}
                    setBuyTokenSuccess={setBuyTokenSuccess}
                    isClaimable={poolDetails?.type === "claimable"}
                    currentUserTier={currentUserTier}
                    poolDetailsMapping={poolDetailsMapping}
                    poolDetails={poolDetails}
                    // Setting Disable PreOrder
                    isInPreOrderTime={false}
                    showText={showText}
                    isKYC={isKYC}
                  />
                )}
              </>
            )}

          {/* Pre-Order  */}
          {poolStatus !== PoolStatus.Filled &&
            // (alreadyJoinPool || joinPoolSuccess) &&
            isPreOrderPool && // Pre Order Pool
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
                // refetchPoolDetails={refetchPool}

                // Apply PreOrder Time
                startBuyTimeInDate={startBuyTimeInDate}
                endBuyTimeInDate={endBuyTimeInDate}
                endJoinTimeInDate={endJoinTimeInDate}
                tokenSold={tokenSold}
                setBuyTokenSuccess={setBuyTokenSuccess}
                isClaimable={poolDetails?.type === "claimable"}
                currentUserTier={currentUserTier}
                poolDetailsMapping={poolDetailsMapping}
                poolDetails={poolDetails}
                // SettintextSwapTabg Enable PreOrder
                isInPreOrderTime={isInPreOrderTime}
                showText={showText}
                isKYC={isKYC}
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
              />
            )}
        </>
      );
    };
    const allocationCalculator = () => {
      if (activeTabBottom !== TabDetais.Allocation) return;
      const basePrice = poolDetails?.buyLimit[0] || 0;
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
                    <th scope="col">Tier Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {tiersData.map((tier, index) => {
                    const maxBuy = basePrice * tier?.multiplicationFactor;
                    return (
                      <tr key={index}>
                        <td>
                          <div
                            className="d_flex"
                            style={{
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            {/* Display image using the imageUrl */}
                           {tier.imageUrl && <Image
                              className=""
                              src={tier.imageUrl} // Use the imageUrl from your JSON
                              alt={tier.tier}
                              width={24}
                              height={24}
                            />}
                            {tier.tier}
                          </div>
                        </td>
                        <td>{tier.multiplicationFactor}x</td>
                        <td className="p-0 w200" style={{ color: "#0066ffab" }}>
                          <div className="price">${maxBuy.toFixed(2)}</div>
                        </td>
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

    const LegalDisclaimerTab = () => {
      return (
        <div
          className={`${
            activeTabBottom === TabDetais.LegalDisclaimer && "show"
          } ${styles.hiddenTabWinner}`}
        >
          <LegalDisclaimer />
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

          {LegalDisclaimerTab()}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* {restrictUser && (
        <NotFound
          title="Oops! The page you're trying to access is not available."
          description="The page you are looking for doesn't exist or has been moved"
          url="/"
          buttonLink="Back to Home Page"
        />
      )} */}
      {poolDetails?.networkAvailable !== "solana" ? (
        <div className={styles.poolDetailContainer}
       
        >
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
        poolDetails?.networkAvailable === "solana" &&
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
        <ConnectWalletModal
          opened={openConnectWallet as boolean}
          handleClose={handleConnectWalletClose}
        />
        {/* <EnterRefCodeModal
          opened={!!openEnterRefCode}
          handleClose={handleEnterRefCodeClose}
          currentAccount={currentAccount}
          referralProgramUrl={referLinkPublic.referral_program ?? ""}
        /> */}
        <AppNetworkSwitch
          opened={switchNetworkDialog}
          handleClose={() => setSwitchNetworkDialog(false)}
        />
        <WalletDisconnect
          opened={disconnectDialog}
          handleClose={() => {
            setDisconnectDialog(false);
            setAgreedTerms(false);
          
          }}
          currentWallet={currentConnectedWallet}
        />
        <SignRequiredModal opened={refreshing} />
      </HeaderContext.Provider>
    </>
  );
};

export default BuyToken;
