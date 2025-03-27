"use client";

import BigNumber from "bignumber.js";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import TransactionSubmitModal from "@/components/Base/TransactionSubmitModal";
import { ACCEPT_CURRENCY } from "@/constants";
import {
  ETH_CHAIN_ID,
  POLYGON_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  OKX_CHAIN_ID,
  DAO_CHAIN_ID,
  BASE_CHAIN_ID,
  ZKSYNC_CHAIN_ID,
  LINEA_CHAIN_ID,
  HNY_BERA_ADDRESS,
  SONIC_CHAIN_ID,
} from "@/constants/network";
import { PurchaseCurrency } from "@/constants/purchasableCurrency";
import useTokenAllowance from "@/hooks/useTokenAllowance";
import useTokenApprove from "@/hooks/useTokenApprove";
import useTokenBalance from "@/hooks/useTokenBalance";
import { TokenType } from "@/hooks/useTokenDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";

import commonStyles from "@/styles/commonstyle.module.scss";

import {
  getBUSDAddress,
  getUSDCAddress,
  getUSDTAddress,
  getWETHAddress,
} from "@/utils/contractAddress/getAddresses";
import {
  convertDateTimeToUnix,
  convertTimeToStringFormatWithoutGMT,
  convertUnixTimeToDateTime,
} from "@/utils/convertDate";
import {
  formatRoundDown,
  formatRoundUp,
  numberWithCommas,
} from "@/utils/formatNumber";
import getAccountBalance from "@/utils/getAccountBalance";
import { getEtherscanName } from "@/utils/network";
import { getIconCurrencyUsdt } from "@/utils/usdt";
import Button from "@/components/buyToken/Button";
import usePoolDepositAction from "../hooks/usePoolDepositAction";
import useUserPurchased from "../hooks/useUserPurchased";
import styles from "@/styles/buyTokenForm.module.scss";
import { base64Encode, getChainIDByName } from "@/utils";
import {
  NetworkUpdateType,
  settingAppNetwork,
} from "@/store/slices/appNetworkSlice";
import { useSignMessage, useSwitchChain } from "wagmi";

import NumberFormat from "react-number-format";
import { toast } from "react-toastify";
import { connectWalletSuccess } from "@/store/slices/walletSlice";

const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,6}$/;

type BuyTokenFormProps = {
  tokenDetails: TokenType | undefined;
  rate: number | undefined;
  poolAddress: string | undefined;
  maximumBuy: number;
  minimumBuy: number;
  poolAmount: number | undefined;
  purchasableCurrency: string | undefined;
  poolId: number | undefined;
  joinTime: Date | undefined;
  method: string | undefined;
  availablePurchase: boolean | undefined;
  ableToFetchFromBlockchain: boolean | undefined;
  minTier: any | undefined;
  isDeployed: boolean | undefined;
  endBuyTimeInDate: Date | undefined;
  startBuyTimeInDate: Date | undefined;
  endJoinTimeInDate: Date | undefined;
  tokenSold: string | undefined;
  setBuyTokenSuccess: Dispatch<SetStateAction<boolean>>;
  isClaimable: boolean | undefined;
  currentUserTier: any;
  alreadyJoinPool: any;
  joinPoolSuccess: boolean;
  existedWinner: any;
  disableAllButton: boolean;
  networkAvailable: string;
  poolDetailsMapping: any;
  poolDetails: any;
  isInPreOrderTime: boolean;
  connectedAccount: any;
  wrongChain: any;
  // refetchPoolDetails: Function
  guaranteeAllocation: number;
  fcfsAllocation: number;
  showText?: any;
  isKYC?: any;
  // poolStatus: string
};

enum MessageType {
  error = "error",
  warning = "warning",
}

// chain integration
const BuyTokenForm: React.FC<BuyTokenFormProps> = (props: any) => {
  const dispatch = useDispatch();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();

  const [input, setInput] = useState("");
  const [openApproveModal, setApproveModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [estimateTokens, setEstimateTokens] = useState<number>(0);
  const [tokenAllowance, setTokenAllowance] = useState<string | undefined>(
    undefined
  );
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [loadingPoolInfo, setLoadingPoolInfo] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [poolBalance, setPoolBalance] = useState<number>(0);

  const {
    tokenDetails,
    rate,
    poolAddress,
    maximumBuy,
    purchasableCurrency,
    poolId,
    availablePurchase,
    ableToFetchFromBlockchain,
    isDeployed,
    minimumBuy,
    poolAmount,
    startBuyTimeInDate,
    endBuyTimeInDate,
    tokenSold,
    setBuyTokenSuccess,
    isClaimable,
    existedWinner,
    disableAllButton,
    networkAvailable,
    poolDetails,
    isInPreOrderTime,
    connectedAccount,
    wrongChain,
    guaranteeAllocation,
    fcfsAllocation,
    showText,
    alreadyJoinPool,
    joinPoolSuccess,
    isKYC,
    currentUserTier,
    // poolStatus
  } = props;

  // const { connectedAccount, wrongChain } = useAuth();
  const { appChainID: appChainID1, walletChainID } = useTypedSelector(
    (state) => state.appNetwork
  ).data;
  const appChainID: any = getChainIDByName(poolDetails?.networkAvailable);
  const connector = useTypedSelector((state) => state.connector).data;

  const etherscanName = getEtherscanName({ networkAvailable });
  const {
    deposit,
    tokenDepositLoading,
    tokenDepositTransaction,
    depositError,
    tokenDepositSuccess,
  } = usePoolDepositAction({
    poolAddress,
    poolId,
    purchasableCurrency,
    amount: input,
    isClaimable,
    networkAvailable,
    isInPreOrderTime,
    title: poolDetails?.title,
    poolDetails,
  });

  const { currencyName } = getIconCurrencyUsdt({
    purchasableCurrency,
    networkAvailable,
  });
  const { retrieveTokenAllowance } = useTokenAllowance();
  const { retrieveUserPurchased } = useUserPurchased(
    tokenDetails,
    poolAddress,
    ableToFetchFromBlockchain,
    networkAvailable
  );

  const getApproveToken = useCallback(
    (appChainID: string) => {
      if (
        purchasableCurrency &&
        purchasableCurrency === PurchaseCurrency.USDT
      ) {
        return {
          address: getUSDTAddress(appChainID),
          name: "USDT",
          symbol: "USDT",
          decimals:
            appChainID == ETH_CHAIN_ID ||
            appChainID == POLYGON_CHAIN_ID ||
            appChainID == AVALANCHE_CHAIN_ID ||
            appChainID === ARBITRUM_CHAIN_ID ||
            appChainID === OKX_CHAIN_ID ||
            appChainID === DAO_CHAIN_ID ||
            appChainID === SONIC_CHAIN_ID
              ? 6
              : 18,
        };
      }

      if (
        purchasableCurrency &&
        purchasableCurrency === PurchaseCurrency.BUSD
      ) {
        return {
          address: getBUSDAddress(),
          name: "BUSD",
          symbol: "BUSD",
          decimals: 18,
        };
      }

      if (
        purchasableCurrency &&
        purchasableCurrency === PurchaseCurrency.USDC
      ) {
        return {
          address: getUSDCAddress(appChainID),
          name: "USDC",
          symbol: "USDC",
          decimals:
            appChainID === ETH_CHAIN_ID ||
            appChainID === POLYGON_CHAIN_ID ||
            appChainID === AVALANCHE_CHAIN_ID ||
            appChainID === ARBITRUM_CHAIN_ID ||
            appChainID === BASE_CHAIN_ID ||
            appChainID === DAO_CHAIN_ID ||
            appChainID === OKX_CHAIN_ID ||
            appChainID === ZKSYNC_CHAIN_ID ||
            appChainID === LINEA_CHAIN_ID ||
            appChainID === SONIC_CHAIN_ID
              ? 6
              : 18,
        };
      }

      if (
        purchasableCurrency &&
        purchasableCurrency === PurchaseCurrency.WETH
      ) {
        return {
          address: getWETHAddress(appChainID),
          name: "WETH",
          symbol: "WETH",
          decimals: 18,
        };
      }

      if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.ETH) {
        return {
          address: "0x00",
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        };
      }

      if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.HNY) {
        return {
          address: HNY_BERA_ADDRESS as string,
          name: "HONEY",
          symbol: "HNY",
          decimals: 18,
        };
      }
    },
    [purchasableCurrency, appChainID]
  );

  const tokenToApprove = getApproveToken(appChainID1 as string);

  const { approveToken, tokenApproveLoading, transactionHash } =
    useTokenApprove(
      tokenToApprove,
      connectedAccount,
      poolAddress,
      false,
      true
      // refetchPoolDetails
    );

  const now = new Date();
  const isInFreeBuying =
    poolDetails?.freeBuyTimeSetting?.start_buy_time &&
    endBuyTimeInDate &&
    new Date(poolDetails?.freeBuyTimeSetting.start_buy_time * 1000) < now &&
    now < endBuyTimeInDate;

  const { retrieveTokenBalance } = useTokenBalance(
    tokenToApprove,
    connectedAccount
  );

  const remainingAmount = formatRoundDown(
    new BigNumber(maximumBuy).minus(
      new BigNumber(userPurchased).multipliedBy(rate)
    )
    // new BigNumber(
    //   new BigNumber(guaranteeAllocation).plus(fcfsAllocation)
    // ).minus(new BigNumber(userPurchased).multipliedBy(rate))
  );

  // Check if user already buy ICO token at the first time or not ?
  const firstBuy = localStorage.getItem("firstBuy") || undefined;
  let parsedFirstBuy = {} as any;
  if (firstBuy) {
    try {
      parsedFirstBuy = JSON.parse(firstBuy);
    } catch (err: any) {
      console.log("parsedFirstBuy", err.message);
    }
  }

  // Check if user already buy at least minimum tokens at the first time
  const connectedAccountFirstBuy = connectedAccount
    ? parsedFirstBuy[poolAddress]
      ? parsedFirstBuy[poolAddress][connectedAccount]
      : false
    : false;

  const availableMaximumBuy = useMemo(() => {
    let maxBuy = new BigNumber(guaranteeAllocation).minus(
      new BigNumber(new BigNumber(userPurchased).multipliedBy(rate))
    );

    if (isInFreeBuying) maxBuy = new BigNumber(remainingAmount);
    // Check if max buy greater than total ICO coins sold
    if (maxBuy.gt(tokenBalance)) {
      return new BigNumber(tokenBalance).gt(0)
        ? formatRoundDown(new BigNumber(tokenBalance))
        : "0";
    }

    return maxBuy.gt(0) ? formatRoundDown(maxBuy) : "0";
  }, [tokenBalance, maximumBuy, userPurchased, poolAmount, tokenSold, rate]);

  const poolErrorBeforeBuy = useMemo(() => {
    if (
      minimumBuy &&
      input &&
      new BigNumber(input || 0).lt(minimumBuy) &&
      !connectedAccountFirstBuy &&
      new Date() > startBuyTimeInDate
    ) {
      return {
        message: `The minimum amount you must trade is ${new BigNumber(
          minimumBuy
        ).toFixed(8)} ${currencyName}.`,
        type: MessageType.error,
      };
    }

    return;
  }, [
    startBuyTimeInDate,
    minimumBuy,
    input,
    connectedAccountFirstBuy,
    currencyName,
    tokenDetails?.symbol,
  ]);

  const [enableApprove, setEnableApprove] = useState<boolean>(false);

  // Check whether current user's tier is valid or not
  /* const validTier = new BigNumber(userTier).gte(minTier); */

  // Check multiple conditions for purchasing time
  const purchasable =
    availablePurchase && // pool opening time
    estimateTokens > 0 &&
    !poolErrorBeforeBuy &&
    // && new BigNumber(input).lte(new BigNumber(maximumBuy))
    // && new BigNumber(input).lte(remainingAmount)
    // && new BigNumber(estimateTokens).lte(new BigNumber(poolAmount).minus(tokenSold))
    // && new BigNumber(tokenBalance).gte(new BigNumber(input))
    // && validTier
    // !wrongChain && // auth
    // !disableAllButton && // wrong network
    !enableApprove &&
    (purchasableCurrency !== PurchaseCurrency.ETH
      ? new BigNumber(tokenAllowance || 0).gt(0)
      : true);

  const availableSignature = availablePurchase && !poolErrorBeforeBuy;

  useEffect(() => {
    if (tokenAllowance === undefined) return;

    if (
      (+tokenAllowance <= 0 || new BigNumber(tokenAllowance).lt(input)) &&
      purchasableCurrency &&
      purchasableCurrency !== PurchaseCurrency.ETH &&
      !wrongChain &&
      ableToFetchFromBlockchain &&
      isDeployed &&
      // existedWinner &&
      !disableAllButton
    ) {
      setEnableApprove(true);
      return;
    }

    setEnableApprove(new BigNumber(tokenAllowance).lt(input));
  }, [
    tokenAllowance,
    input,
    purchasableCurrency,
    wrongChain,
    ableToFetchFromBlockchain,
    isDeployed,
    existedWinner,
    disableAllButton,
    rate,
  ]);

  // Fetch User balance
  const fetchUserBalance = useCallback(async () => {
    if (appChainID && connectedAccount && connector) {
      const accountBalance = await getAccountBalance(
        appChainID,
        walletChainID,
        connectedAccount as string,
        connector
      );

      const balance = new BigNumber(accountBalance._hex)
        .div(new BigNumber(10).pow(18))
        .toFixed(5);

      dispatch(
        connectWalletSuccess({
          entity: connector,
          addresses: [connectedAccount],
          balances: {
            [connectedAccount]: balance,
          },
        })
      );
    }
  }, [connector, appChainID, walletChainID, connectedAccount]);

  useEffect(() => {
    const getUserPurchased = async () => {
      if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
        setUserPurchased(
          (await retrieveUserPurchased(connectedAccount, poolAddress)) as number
        );
        setTokenBalance(
          (await retrieveTokenBalance(
            tokenToApprove,
            connectedAccount,
            networkAvailable
          )) as number
        );
      }
    };

    getUserPurchased();
  }, [
    tokenDetails,
    poolAddress,
    connectedAccount,
    tokenToApprove,
    retrieveUserPurchased,
  ]);

  const fetchPoolDetails = useCallback(async () => {
    if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
      setTokenAllowance(
        (await retrieveTokenAllowance(
          tokenToApprove,
          connectedAccount,
          poolAddress,
          networkAvailable
        )) || "0"
      );
      setUserPurchased(
        (await retrieveUserPurchased(connectedAccount, poolAddress)) as number
      );
      setTokenBalance(
        (await retrieveTokenBalance(
          tokenToApprove,
          connectedAccount,
          networkAvailable
        )) as number
      );
      setWalletBalance(
        (await retrieveTokenBalance(tokenDetails, connectedAccount)) as number
      );
      setPoolBalance(
        (await retrieveTokenBalance(tokenDetails, poolAddress)) as number
      );
    }
  }, [tokenDetails, connectedAccount, tokenToApprove, poolAddress]);

  useEffect(() => {
    if (maximumBuy && userPurchased && rate) {
      const remainingAmountObject = new BigNumber(remainingAmount);
      if (remainingAmountObject.gt(0)) {
        setInput(
          Math.floor(Number(remainingAmountObject.toFixed(8))).toString()
        );
      }
    }

    return () => {
      setInput("");
    };
  }, [maximumBuy, userPurchased, rate]);

  useEffect(() => {
    const fetchPoolDetailsBlockchain = async () => {
      await fetchPoolDetails();
      setLoadingPoolInfo(false);
    };

    if (loadingPoolInfo) {
      fetchPoolDetailsBlockchain();
    }
  }, [loadingPoolInfo]);

  // Handle for fetching pool general information 1 time
  useEffect(() => {
    const fetchTokenPoolAllowance = async () => {
      try {
        setLoadingPoolInfo(true);
      } catch (err) {
        console.log("🚀 ~ fetchTokenPoolAllowance ~ err:", err);
        setLoadingPoolInfo(false);
      }
    };

    if (connectedAccount) {
      fetchTokenPoolAllowance();
    }
  }, [connectedAccount, ableToFetchFromBlockchain]);

  // Check if has any error when deposit => close modal
  useEffect(() => {
    if (depositError) {
      setOpenSubmitModal(false);
    }
  }, [depositError]);

  // Re-fetch user balance when deposit successful
  useEffect(() => {
    const handleWhenDepositSuccess = async () => {
      setBuyTokenSuccess(true);
      await fetchUserBalance();
      await fetchPoolDetails();
    };

    if (tokenDepositSuccess) {
      handleWhenDepositSuccess();
    }
  }, [tokenDepositSuccess]);

  useEffect(() => {
    if (tokenDepositTransaction) {
      //  Clear input field and additional information field below and close modal
      setInput("");
      setEstimateTokens(0);

      if (!connectedAccountFirstBuy) {
        localStorage.setItem(
          "firstBuy",
          JSON.stringify(
            Object.assign(
              {},
              {
                ...parsedFirstBuy,
                [poolAddress as string]: {
                  ...parsedFirstBuy[poolAddress],
                  [connectedAccount as string]: true,
                },
              }
            )
          )
        );
      }
    }
  }, [tokenDepositTransaction, connectedAccountFirstBuy]);

  useEffect(() => {
    if (input && rate && purchasableCurrency) {
      const tokens = new BigNumber(input)
        .multipliedBy(new BigNumber(1).div(rate))
        .toNumber();
      const tokenWithDecimal = new BigNumber(tokens)
        .decimalPlaces(6)
        .toNumber();
      setEstimateTokens(tokenWithDecimal);
    } else {
      setEstimateTokens(0);
    }
  }, [input, purchasableCurrency, rate]);

  const checkAllowInput = (values: any) => {
    const { value, floatValue } = values;
    return (
      Number(value) === 0 ||
      (!!floatValue && floatValue <= formatRoundDown(availableMaximumBuy))
    );
  };

  const handleInputChange = async (e: any) => {
    const value = e.target.value.replaceAll(",", "");
    if (value === "" || REGEX_NUMBER.test(value)) {
      setInput(value);
    }
  };

  const validateDeposit = () => {
    // Check over buy Currency
    // Example:
    // Total Max Allocate: 300.43
    // Bought: 5
    // Remain: 295.43

    const currencyUserBought = formatRoundUp(
      new BigNumber(userPurchased).multipliedBy(poolDetails?.ethRate || 0)
    ); // ROUND_UP: 4.999999999999999999987744 --> 5
    const remainCurrencyAvailable = formatRoundDown(
      new BigNumber(maximumBuy).minus(currencyUserBought)
    ); // ROUND_DOWN: 295.435424132100000000012256 --> 295.43

    if (new BigNumber(maximumBuy).eq(0) && !isInFreeBuying) {
      toast.error(`Please wait until Phase 2 start time.`);
      return false;
    }

    const isOverMaxBuy = new BigNumber(input).gt(remainCurrencyAvailable);
    if (isOverMaxBuy) {
      toast.error(
        `You can only buy up to ${numberWithCommas(
          remainCurrencyAvailable,
          2
        )} ${currencyName}`
      );
      return false;
    }

    // Check over Token
    const remainToken = new BigNumber(poolAmount).minus(tokenSold).toFixed();
    const isOverRemainToken = new BigNumber(estimateTokens).gt(remainToken);
    if (isOverRemainToken) {
      toast.error(
        `Not enough token for sale, you can only buy up to ${numberWithCommas(
          remainToken,
          2
        )} ${tokenDetails?.symbol}`
      );
      return false;
    }

    return true;
  };

  const handleTokenDeposit = async () => {
    const isValid = validateDeposit();
    if (!isValid) {
      return false;
    }
    try {
      if (purchasableCurrency) {
        setOpenSubmitModal(true);
        setBuyTokenSuccess(false);

        const chainId = getChainIDByName(poolDetails?.networkAvailable);
        if (chainId !== appChainID1) {
          const chainId: any = getChainIDByName(poolDetails?.networkAvailable);
          await switchChainAsync({ chainId: Number(chainId) });

          dispatch(
            settingAppNetwork({
              networkType: NetworkUpdateType.App,
              updatedVal: chainId,
            })
          );
        }
        // Call to smart contract to deposit token and refetch user balance
        await deposit();
      }
    } catch (err) {
      console.log("🚀 ~ handleTokenDeposit ~ err:", err);
      setOpenSubmitModal(false);
    }
  };

  const handleTokenApprove = async () => {
    if (
      (!alreadyJoinPool && !joinPoolSuccess) ||
      !isKYC ||
      currentUserTier?.level < poolDetails.minTier ||
      (Number(guaranteeAllocation) <= 0 && Number(fcfsAllocation) <= 0)
    ) {
      toast.error(
        "You’re not eligible to participate in this sale. Please ensure you have a qualifying tier, have completed KYC, and have registered for the sale."
      );
      return;
    }
    try {
      setApproveModal(true);
      await approveToken();

      if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
        setTokenAllowance(
          (await retrieveTokenAllowance(
            tokenToApprove,
            connectedAccount,
            poolAddress,
            networkAvailable
          )) || "0"
        );
        setTokenBalance(
          (await retrieveTokenBalance(
            tokenToApprove,
            connectedAccount,
            networkAvailable
          )) as number
        );
      }
    } catch (err) {
      console.log("🚀 ~ handleTokenApprove ~ err:", err);
      setApproveModal(false);
    }
  };

  const handlePreApprove = async () => {
    try {
      const encodedOriginalMessage = base64Encode(
        process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE
      );
      const signature = await signMessageAsync({
        message: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE || "",
      });
      const data = {
        signature,
        poolAddress,
        id: poolDetails.id,
        user: connectedAccount,
        encodedOriginalMessage,
      };
      localStorage.setItem(
        `fcfsData-${poolDetails.id}`,
        btoa(JSON.stringify(data))
      );
      toast.success("FCFS Pre-Sign Completed Successfully");
    } catch (error) {
      console.log("🚀 ~ handlePreApprove ~ error:", error);
      toast.error("FCFS Pre-Sign Failed");
    }
  };

  function isFCFSDataMatching() {
    const storedData = localStorage.getItem(`fcfsData-${poolDetails.id}`);

    if (!storedData) {
      return false;
    }

    try {
      const decodedData = JSON.parse(atob(storedData));

      return (
        decodedData.user === connectedAccount &&
        decodedData.poolAddress === poolAddress &&
        decodedData.id === poolDetails.id
      );
    } catch (error) {
      console.log("🚀 ~ isFCFSDataMatching ~ error:", error);
      return false;
    }
  }

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkConditions = () => {
      const currentTime = new Date().getTime();
      const startBuyTime =
        Number(poolDetails?.freeBuyTimeSetting?.start_buy_time) * 1000;

      const conditionsMet =
        new Date() >= startBuyTimeInDate &&
        new Date() <=
          new Date(
            Number(poolDetails?.freeBuyTimeSetting?.start_buy_time) * 1000
          ) &&
        currentTime >= startBuyTime - 60000 &&
        currentTime < startBuyTime &&
        !isFCFSDataMatching();

      setShowButton(conditionsMet);
    };

    checkConditions();
    const interval = setInterval(checkConditions, 1000);

    return () => clearInterval(interval);
  }, [poolDetails]);

  const renderSwapTokenInfo = () => {
    return (
      <div className={styles.leftBuyTokenForm}>
        <h2 className={styles.title}>
          {isInPreOrderTime ? "PRE-ORDER " : "Swap Tokens"}
        </h2>

        <div className={styles.buyTokenFormTitle}>
          <div className={styles.allowcationWrap}>
            <span className={styles.allocationTitle}>
              {!!poolDetails?.freeBuyTimeSetting?.start_buy_time
                ? "Allocation for Phase 1"
                : "Max Allocation"}
            </span>
            {poolDetails?.relationship_type !== "Giveaway" ||
            !poolDetails?.startBuyTime ? (
              <span className={styles.allocationContent}>
                {numberWithCommas(
                  formatRoundDown(new BigNumber(guaranteeAllocation))
                )}{" "}
                {currencyName}
              </span>
            ) : (
              <span className={styles.allocationContent}>
                {guaranteeAllocation && rate
                  ? Number(guaranteeAllocation / rate).toFixed(2)
                  : "TBA"}{" "}
                {poolDetails.tokenDetails.symbol}
              </span>
            )}
          </div>

          {!!poolDetails?.freeBuyTimeSetting?.start_buy_time && (
            <div className={styles.allowcationWrap}>
              <span className={styles.allocationTitle}>
                Allocation for Phase 2{" "}
              </span>
              {poolDetails.relationship_type !== "Giveaway" ||
              !poolDetails?.freeBuyTimeSetting?.start_buy_time ? (
                <span className={styles.allocationContent}>
                  {numberWithCommas(
                    formatRoundDown(new BigNumber(fcfsAllocation))
                  )}{" "}
                  {currencyName}
                </span>
              ) : (
                <span className={styles.allocationContent}>
                  {fcfsAllocation && rate
                    ? Number(fcfsAllocation / rate).toFixed(2)
                    : "TBA"}{" "}
                  {poolDetails.tokenDetails.symbol}
                </span>
              )}
            </div>
          )}

          <div className={styles.allowcationWrap}>
            <span className={styles.allocationTitle}>Have Bought </span>
            {poolDetails?.relationship_type !== "Giveaway" ||
            !poolDetails?.freeBuyTimeSetting?.start_buy_time ? (
              <span className={styles.allocationContent}>
                {isNaN(
                  numberWithCommas(
                    formatRoundUp(
                      new BigNumber(userPurchased).multipliedBy(rate)
                    ) // Round UP with 2 decimal places: 1.369999 --> 1.37
                  )
                )
                  ? "TBA"
                  : numberWithCommas(
                      formatRoundUp(
                        new BigNumber(userPurchased).multipliedBy(rate)
                      ) // Round UP with 2 decimal places: 1.369999 --> 1.37
                    )}{" "}
                {currencyName}
              </span>
            ) : (
              <span className={styles.allocationContent}>
                {userPurchased && rate
                  ? numberWithCommas(
                      formatRoundUp(
                        new BigNumber(userPurchased).multipliedBy(rate)
                      )
                    )
                  : "TBA"}{" "}
                {poolDetails.tokenDetails.symbol}
              </span>
            )}
          </div>

          <div className={styles.allowcationWrap}>
            <span className={styles.allocationTitle}>Remaining </span>
            {poolDetails?.relationship_type !== "Giveaway" ||
            !poolDetails?.freeBuyTimeSetting?.start_buy_time ? (
              <span className={styles.allocationContent}>
                {isNaN(
                  numberWithCommas(
                    new BigNumber(remainingAmount).lte(0)
                      ? "0"
                      : formatRoundDown(new BigNumber(remainingAmount)) // Round DOWN with 2 decimal places: 1.369999 --> 1.36
                  )
                )
                  ? "TBA"
                  : numberWithCommas(
                      new BigNumber(remainingAmount).lte(0)
                        ? "0"
                        : formatRoundDown(new BigNumber(remainingAmount)) // Round DOWN with 2 decimal places: 1.369999 --> 1.36
                    )}{" "}
                {currencyName}
              </span>
            ) : (
              <span className={styles.allocationContent}>
                {isNaN(
                  numberWithCommas(
                    new BigNumber(remainingAmount).lte(0)
                      ? "0"
                      : formatRoundDown(new BigNumber(remainingAmount)) // Round DOWN with 2 decimal places: 1.369999 --> 1.36
                  )
                )
                  ? "TBA"
                  : numberWithCommas(
                      new BigNumber(remainingAmount).lte(0)
                        ? "0"
                        : formatRoundDown(new BigNumber(remainingAmount)) // Round DOWN with 2 decimal places: 1.369999 --> 1.36
                    )}{" "}
                {poolDetails.tokenDetails.symbol}
              </span>
            )}
          </div>

          {isInPreOrderTime && (
            <div className={styles.allowcationWrap}>
              <span className={styles.allocationTitle}>Pre Order Time</span>
              <span className={styles.allocationContent}>
                {convertTimeToStringFormatWithoutGMT(startBuyTimeInDate)} -{" "}
                <br />
                {convertUnixTimeToDateTime(
                  parseInt(convertDateTimeToUnix(endBuyTimeInDate)),
                  1
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSwapForm = () => {
    return (
      <div className={styles.rightBuyTokenForm}>
        <div className={styles.title2}>
          Your Wallet Balance&nbsp;
          <div className={styles.currencyName}>
            {`(Balance: ${numberWithCommas(
              parseFloat(tokenBalance.toString()).toFixed(6)
            )} ${currencyName})`}
          </div>
        </div>

        <div className={styles.buyTokenInputForm}>
          <div className={styles.buyTokenInputWrapper}>
            <NumberFormat
              className={styles.buyTokenInput}
              placeholder={"Enter amount"}
              thousandSeparator={true}
              onChange={handleInputChange}
              decimalScale={6}
              value={input}
              defaultValue={maximumBuy || 0.00001}
              isAllowed={checkAllowInput}
              max={tokenBalance}
              min={0}
              maxLength={255}
              disabled={wrongChain}
            />
            <span className={styles.purchasableCurrency}>
              {/* <Image src={currencyIcon} alt={purchasableCurrency} className={styles.purchasableCurrencyIcon} /> */}
              {currencyName}
              <button
                className={styles.purchasableCurrencyMax}
                onClick={() => {
                  setInput(
                    Math.floor(
                      Number(formatRoundDown(availableMaximumBuy))
                    ).toString()
                  );
                }}
              >
                Max
              </button>
            </span>
          </div>
        </div>

        <div className={styles.buyTokenEstimate}>
          <div className={commonStyles.flexRow}>
            <p className={commonStyles.nnn1216h}>You will get approximately</p>
            {poolDetails?.ethRate && poolDetails?.tokenDetails?.symbol && (
              <span className={styles.tokenPrice}>
                {poolDetails?.ethRate} {currencyName} per&nbsp;
                {poolDetails?.tokenDetails?.symbol}
              </span>
            )}
          </div>
          <strong className={styles.buyTokenEstimateAmount}>
            {numberWithCommas(`${estimateTokens || 0}`, 6)}{" "}
            {tokenDetails?.symbol}
          </strong>
        </div>

        {
          <p
            className={`${
              poolErrorBeforeBuy?.type === MessageType.error
                ? `${styles.poolErrorBuy}`
                : `${styles.poolErrorBuyWarning}`
            }`}
          >
            {poolErrorBeforeBuy && poolErrorBeforeBuy.message}
          </p>
        }

        {purchasableCurrency !== PurchaseCurrency.ETH &&
          purchasableCurrency?.toUpperCase() !==
            ACCEPT_CURRENCY.ETH?.toUpperCase() && (
            <p
              className={styles.title3}
            >{`You need to Approve first before purchasing. Please set a sufficient spending cap or use the default value.`}</p>
          )}
        <div className={styles.btnGroup}>
          <div>
            {purchasableCurrency?.toUpperCase() !==
              ACCEPT_CURRENCY.ETH?.toUpperCase() && (
              <Button
                text={enableApprove ? "Approve" : "Approved"}
                disabled={!enableApprove || !ableToFetchFromBlockchain}
                onClick={handleTokenApprove}
                loading={tokenApproveLoading}
              />
            )}
          </div>

          <div>
            <Button
              text={isInPreOrderTime ? "Pre-order" : "Swap"}
              disabled={!purchasable}
              onClick={handleTokenDeposit}
              loading={tokenDepositLoading}
            />
          </div>
        </div>

        {showButton && (
          <div>
            <Button
              text={"Prepare for FCFS Round"}
              disabled={!availableSignature}
              onClick={handlePreApprove}
              loading={tokenDepositLoading}
              style={{
                border: "1px solid #0066FF",
                borderRadius: "50px",
                width: "100%",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            />
          </div>
        )}

        {showText && tokenAllowance && (
          <span>
            You can prepare to participate in Guaranteed and FCFS phase by Pre
            approving the transaction
          </span>
        )}

        <TransactionSubmitModal
          opened={openSubmitModal}
          handleClose={() => {
            setOpenSubmitModal(false);
          }}
          transactionHash={tokenDepositTransaction}
        />
        <TransactionSubmitModal
          additionalText={`Please be patient and no need to approve again, you can check the transaction status on ${etherscanName}.`}
          opened={openApproveModal}
          handleClose={() => {
            setApproveModal(false);
          }}
          transactionHash={transactionHash}
        />
      </div>
    );
  };

  return (
    <div className={styles.buyTokenForm}>
      {renderSwapTokenInfo()}
      {renderSwapForm()}
    </div>
  );
};

export default BuyTokenForm;
