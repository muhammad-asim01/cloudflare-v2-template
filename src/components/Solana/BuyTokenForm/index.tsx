'use client'
import BigNumber from "bignumber.js";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import NumberFormat from "react-number-format";
import { useDispatch } from "react-redux";
import { TokenType } from "@/hooks/useTokenDetails";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import commonStyles from '@/styles/commonstyle.module.scss'

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
import { getIconCurrencyUsdt } from "@/utils/usdt";
import Button from "../Button";
// import useTokenAccountBalance from "@/hooks/useTokenAccountBalance";
// import useSolanaUserPurchased from "../hooks/useSolanaUserPurchased";
import useSolanaPoolDepositAction from "../hooks/useSolanaPoolDepositAction";
import SolanaTransactionSubmitModal from "@/components/Base/SolanaTransactionSubmitModal";
import { PurchaseCurrency } from "@/constants/purchasableCurrency";
import {
  deriveTokenAccount,
  getTokenInfo,
  getuserPurchased,
} from "@/context/Solana/utils";
import axios from "@/services/axios";
import { getParamsWithConnector } from "@/hooks/useWalletSignature";
import { ConnectorNames, connectorNames } from "@/constants/connectors";
import { base64Encode } from "@/utils";
import { useAccount } from "wagmi";
import styles from '@/styles/buyTokenForm.module.scss'
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
  guaranteeAllocation: number;
  fcfsAllocation: number;
  showText?: any;
  poolIndex?: number;
  isValidSolanaAddress?: any;
  handleInvalidAddressDialogOpen?: any;
};

enum MessageType {
  error = "error",
  warning = "warning",
}

const BuyTokenForm: React.FC<BuyTokenFormProps> = (props: any) => {
  const dispatch = useDispatch();
  const { connector: library } = useAccount();

  const [input, setInput] = useState("");
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [estimateTokens, setEstimateTokens] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [loadingPoolInfo, setLoadingPoolInfo] = useState<boolean>(false);

  const {
    tokenDetails,
    rate,
    poolAddress,
    maximumBuy,
    purchasableCurrency,
    poolId,
    availablePurchase,
    minimumBuy,
    poolAmount,
    startBuyTimeInDate,
    endBuyTimeInDate,
    tokenSold,
    setBuyTokenSuccess,
    isClaimable,
    disableAllButton,
    networkAvailable,
    poolDetails,
    isInPreOrderTime,
    connectedAccount,
    wrongChain,
    guaranteeAllocation,
    fcfsAllocation,
    poolIndex,
  } = props;

  const { appChainID, walletChainID } = useTypedSelector(
    (state) => state.appNetwork
  ).data;
  const connector = useTypedSelector((state) => state.connector).data;

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

  const tokenToApprove: any = getApproveToken();

  const { currencyName } = getIconCurrencyUsdt({
    purchasableCurrency,
    networkAvailable,
  });

  const now = new Date();
  const isInFreeBuying =
    poolDetails?.freeBuyTimeSetting?.start_buy_time &&
    endBuyTimeInDate &&
    new Date(poolDetails?.freeBuyTimeSetting.start_buy_time * 1000) < now &&
    now < endBuyTimeInDate;

  const remainingAmount = formatRoundDown(
    new BigNumber(maximumBuy).minus(
      new BigNumber(userPurchased).multipliedBy(rate)
    )
  );

  const firstBuy = localStorage.getItem("firstBuy") || undefined;
  let parsedFirstBuy = {} as any;
  if (firstBuy) {
    try {
      parsedFirstBuy = JSON.parse(firstBuy);
    } catch (err: any) {
      console.log("parsedFirstBuy", err.message);
    }
  }

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

  const purchasable =
    availablePurchase &&
    estimateTokens > 0 &&
    !poolErrorBeforeBuy &&
    !disableAllButton;

  const availableSignature = availablePurchase && !poolErrorBeforeBuy;

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

  const fetchPoolDetails = useCallback(async () => {
    if (tokenDetails && connectedAccount) {
      // setUserPurchased((await retrieveUserPurchased()) as any);
      try {
        const response = await getuserPurchased(
          connectedAccount,
          poolId,
          window?.solana?.publicKey?.toBase58()
        );
        const userPurchasedReturn: any = new BigNumber(
          parseInt(response.amount, 16)
        )
          .div(new BigNumber(10).pow(tokenDetails.decimals))
          .toFixed();
        setUserPurchased(userPurchasedReturn);
      } catch (error) {
        console.log("🚀 ~ fetchPoolDetails ~ error:", error)
        setUserPurchased(0);
      }
      try {
        const buy_currency_: any =
          poolDetails?.purchasableCurrency?.toUpperCase() ===
          PurchaseCurrency.USDT
            ? process.env.NEXT_PUBLIC_SOLANA_USDT_ADDRESS
            : poolDetails?.purchasableCurrency?.toUpperCase() ===
              PurchaseCurrency.USDC
            ? process.env.NEXT_PUBLIC_SOLANA_USDC_ADDRESS
            : "";
        const refund_account: string = deriveTokenAccount(
          window?.solana?.publicKey?.toBase58(),
          buy_currency_
        ).toBase58();
        const account = await getTokenInfo(connectedAccount, refund_account);
        const data: any = new BigNumber(account.amount.toString())
        .div(new BigNumber(10).pow(tokenToApprove.decimals))
        .toString();
        setTokenBalance(data);
      } catch (error) {
        console.log("🚀 ~ fetchPoolDetails ~ error:", error)
        setTokenBalance(0);
      }
    }
  }, [tokenDetails, connectedAccount, tokenToApprove, poolId]);

  useEffect(() => {
    if (maximumBuy && userPurchased && rate) {
      const remainingAmountObject = new BigNumber(remainingAmount);
      remainingAmountObject.gt(0) && setInput(remainingAmountObject.toFixed(8));
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

    fetchPoolDetailsBlockchain();
  }, [
    loadingPoolInfo,
    tokenDetails,
    connectedAccount,
    userPurchased,
    window?.solana?.publicKey,
  ]);

  const {
    deposit,
    tokenDepositLoading,
    tokenDepositTransaction,
    depositError,
    tokenDepositSuccess,
  } = useSolanaPoolDepositAction({
    poolIndex,
    poolId,
    purchasableCurrency,
    amount: input,
    isClaimable,
    poolDetails,
    token: tokenToApprove as TokenType,
  });

  useEffect(() => {
    const fetchTokenPoolAllowance = async () => {
      try {
        setLoadingPoolInfo(true);
      } catch (err) {
        console.log("🚀 ~ fetchTokenPoolAllowance ~ err:", err)
        setLoadingPoolInfo(false);
      }
    };

    connectedAccount && window?.solana?.publicKey && fetchTokenPoolAllowance();
  }, [connectedAccount, window?.solana?.publicKey]);

  useEffect(() => {
    if (depositError) {
      setOpenSubmitModal(false);
    }
  }, [depositError]);

  useEffect(() => {
    const handleWhenDepositSuccess = async () => {
      setBuyTokenSuccess(true);
      await fetchUserBalance();
      await fetchPoolDetails();
    };

    tokenDepositSuccess && handleWhenDepositSuccess();
  }, [tokenDepositSuccess]);

  const [isLatestData, setIslatestData] = useState(false);

  useEffect(() => {
    const handleWhenDepositSuccess = async () => {
      setBuyTokenSuccess(true);
      await fetchUserBalance();
      await fetchPoolDetails();
    };

    if (tokenDepositSuccess) {
      setIslatestData(true);
      const timer = setTimeout(async () => {
        await handleWhenDepositSuccess();
        setIslatestData(false);
        toast.success("Token Deposit Successful!");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [tokenDepositSuccess]);

  useEffect(() => {
    if (tokenDepositTransaction) {
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
    const currencyUserBought = formatRoundUp(
      new BigNumber(userPurchased).multipliedBy(poolDetails?.ethRate || 0)
    );
    const remainCurrencyAvailable = formatRoundDown(
      new BigNumber(maximumBuy).minus(currencyUserBought)
    );

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

  const getSolanaAddress = useCallback(async () => {
    if (connectedAccount) {
      const response = await axios.get("user/get-solana-address", {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem(`access_token:${connectedAccount}`),
        },
      });
      return response?.data?.data?.solana_address;
    }
  }, [connectedAccount]);

  const handleTokenDeposit = async () => {
    const isValid = validateDeposit();
    if (!isValid) {
      return false;
    }
    const userSolanaWalletAddress = await getSolanaAddress();
    if (
      userSolanaWalletAddress !== window?.solana?.publicKey?.toBase58() &&
      window?.solana?.publicKey?.toBase58() &&
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
      return;
    }
    try {
      if (purchasableCurrency && window?.solana?.publicKey) {
        setOpenSubmitModal(true);
        setBuyTokenSuccess(false);

        await deposit();
      }
    } catch (err) {
      console.log("🚀 ~ handleTokenDeposit ~ err:", err)
      setOpenSubmitModal(false);
    }
  };

  const getSignature = async () => {
      try {
        if (connectedAccount && library && connector) {
          const paramsWithConnector = getParamsWithConnector(
            connectedAccount 
          )[connector as connectorNames];
          const provider = library.provider;
    
          if (connector === ConnectorNames.WalletConnect) {
            const params = [
              connectedAccount,
              process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
            ];
            await (library as any).provider.enable();
    
            const signature = await (library as any).provider.wc.signMessage(params);
            return signature;
          } else {
            return new Promise((resolve, reject) => {
              (provider as any).sendAsync(
                {
                  method: paramsWithConnector.method,
                  params: paramsWithConnector.params,
                },
                function (err: Error, result: any) {
                  if (err || result.error) {
                    const errMsg =
                      err.message || (err as any).error || result.error.message;
                    console.log("useWalletSignature", errMsg);
                    reject(errMsg); // Reject the promise with the error message
                  } else {
                    resolve(result.result); // Resolve the promise with the result
                  }
                }
              );
            });
          }
        }
      } catch (err: any) {
        throw err;
      }
    };  
  
    const handlePreApprove = async () => {
      try {
        const encodedOriginalMessage = base64Encode(
          process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE
        );
        const signature = await getSignature();
        const data = {
          signature,
          poolAddress: poolIndex,
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
        console.log("🚀 ~ handlePreApprove ~ error:", error)
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
          decodedData.poolAddress === poolIndex &&
          decodedData.id === poolDetails.id
        );
      } catch (error) {
        console.log("🚀 ~ isFCFSDataMatching ~ error:", error)
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
            {poolDetails.relationship_type !== "Giveaway" ||
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
            {`(Balance: ${tokenBalance.toString()} ${currencyName})`}
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
              {currencyName}
              <button
                className={styles.purchasableCurrencyMax}
                onClick={() => {
                  setInput(formatRoundDown(availableMaximumBuy));
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

        <div className={styles.btnGroup}>
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
              style={{border: "1px solid #0066FF", borderRadius: '50px', width: '100%', marginTop: '10px', marginBottom: '10px'}}
            />
          </div>
        )}

        <SolanaTransactionSubmitModal
          opened={openSubmitModal}
          handleClose={() => {
            setOpenSubmitModal(false);
          }}
          transactionHash={!isLatestData ? tokenDepositTransaction as string : undefined}
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
