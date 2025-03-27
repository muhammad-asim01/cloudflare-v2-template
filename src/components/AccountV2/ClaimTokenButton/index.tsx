'use client'
import React, { useEffect, useMemo, useState } from "react";
import usePoolDetails from "@/hooks/usePoolDetails";
import useClaimRefundToken from "@/components/buyToken/hooks/useClaimRefundToken";
import useUserRemainTokensClaim from "@/components/buyToken/hooks/useUserRemainTokensClaim";
import useUserRefundToken from "@/components/buyToken/hooks/useUserRefundToken";
import usePoolBalance from "@/components/buyToken/hooks/usePoolBalance";
import useTokenClaim from "@/components/buyToken/hooks/useTokenClaim";
import useDetectClaimConfigApplying from "@/components/buyToken/hooks/useDetectClaimConfigApplying";
import BigNumber from "bignumber.js";
import { CLAIM_TYPE } from "@/constants";
import Button from "@/components/buyToken/Button";
import { getAppNetWork } from "@/utils/network";
import { useDispatch, useSelector } from "react-redux";
import TransactionSubmitModal from "@/components/Base/TransactionSubmitModal";
import {
  ARBITRUM_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  BASE_CHAIN_ID,
  BERA_CHAIN_ID,
  BLAST_CHAIN_ID,
  BSC_CHAIN_ID,
  DAO_CHAIN_ID,
  ETH_CHAIN_ID,
  LINEA_CHAIN_ID,
  OKX_CHAIN_ID,
  POLYGON_CHAIN_ID,
  SONIC_CHAIN_ID,
  ZKSYNC_CHAIN_ID,
} from "@/constants/network";
import { getChainIDByName } from "@/utils";
import {
  NetworkUpdateType,
  settingAppNetwork,
} from "@/store/slices/appNetworkSlice";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSwitchChain } from "wagmi";
import { toast } from "react-toastify";

// chain integration
const ClaimTokenButton = (props: any) => {
  const { id } = props;
  const { switchChainAsync } = useSwitchChain();

  const [canClaimRefundToken, setCanclaimRefundToken] = useState<any>(false);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [userClaimInfo, setUserClaimInfo] = useState<any>();
  const [openClaimModal, setOpenTransactionSubmitModal] =
    useState<boolean>(false);
  const [release, setRelease] = useState<any>({});
  const [wrongClaimChain, setWrongClaimChain] = useState<boolean>(false);
  const { poolDetails }: any = usePoolDetails(id);
  const { address: connectedAccount } = useAppKitAccount();
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const appChainID = appChain.appChainID;
  const appNetwork = getAppNetWork(appChainID);
  const dispatch = useDispatch();

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
        case BLAST_CHAIN_ID:
          return "blast";
        case BERA_CHAIN_ID:
          return "bera";
        case SONIC_CHAIN_ID:
          return "sonic";
      }
    })();
    const { networkAvailable, networkClaim } = poolDetails;
    setWrongClaimChain(
      networkClaim && networkClaim !== networkAvailable
        ? appNetwork !== networkClaim
        : appNetwork !== networkAvailable
    );
  }, [appChainID, poolDetails, dispatch, appNetwork]);

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

  const { transactionHashClaimRefundToken } = useClaimRefundToken(
    poolAddress,
    id
  );
  const { retrieveClaimableTokens } = useUserRemainTokensClaim(
    poolDetails?.tokenDetails,
    poolAddress,
    poolNetwork
  );
  const { retrieveRefundToken }: any = useUserRefundToken(
    poolDetails?.tokenDetails,
    poolAddress,
    poolDetails?.networkAvailable || poolDetails?.network_available,
    poolDetails?.purchasableCurrency
  );
  const { retrievePoolBalance } = usePoolBalance(
    poolDetails?.purchasableCurrency,
    poolAddress,
    poolDetails?.networkAvailable || poolDetails?.network_available
  );
  const { transactionHash, claimToken } = useTokenClaim(
    poolAddress,
    id,
    poolDetails?.title
  );

  const userPurchasedValue = userClaimInfo?.userPurchased || 0;
  const userClaimed = userClaimInfo?.userClaimed || 0;
  const {
    nextClaim,
    maximumTokenClaimUtilNow,
  } = useDetectClaimConfigApplying(
    poolDetails,
    userPurchasedValue,
    userClaimed
  );

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
          +userRefundToken.currencyAmount > 0 &&
          !userRefundToken.isClaimed
        ) {
          setCanclaimRefundToken(true);
        } else {
          setCanclaimRefundToken(false);
        }
        setUserClaimInfo(userClaimInformations);
        setUserPurchased(
          (userClaimInformations?.userPurchasedReturn || 0) as number
        );
      }
    };

    fetchUserPurchased();
  }, [connectedAccount, poolDetails]);

  useEffect(() => {
    const releaseTimeInDate: any = poolDetails?.releaseTime
      ? new Date(Number(poolDetails?.releaseTime) * 1000)
      : undefined;
    setRelease(releaseTimeInDate);
  }, [poolDetails?.releaseTime]);
  const nowTime = new Date();
  const availableClaim = release ? nowTime >= release : false;
  const isClaimOnRedkite =
    (poolDetails && !poolDetails.claimType) ||
    poolDetails?.claimType === CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD ||
    poolDetails?.claimType === CLAIM_TYPE.CLAIM_ON_LAUNCHPAD;

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
      toast.error("Please wait until the next milestone to claim the tokens.")
      return false;
    }

    if (
      !nextClaim &&
      new BigNumber(maximumTokenClaimUtilNow).lte(0) // maximumTokenClaimUtilNow <= 0
    ) {
      toast.error("You not enough claimable token!");
      return false;
    }

    if (wrongClaimChain) {
      const chainId: any = getChainIDByName(poolDetails?.networkAvailable);
      await switchChainAsync({ chainId: Number(chainId) })
      dispatch(settingAppNetwork({networkType: NetworkUpdateType.App, updatedVal:chainId}));
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
      console.log(err);
      setOpenTransactionSubmitModal(false);
    }
  };
  return (
    <div>
      {isClaimOnRedkite && !canClaimRefundToken && (
        <Button
          style={{
            width: "100%",
            font: "normal normal 500 14px/20px   Violet Sans",
            color: "#1e1e1e",
          }}
          text={"Claim Token"}
          disabled={!availableClaim || userPurchased <= 0 || !!transactionHash}
          onClick={() => {
            if (!!poolDetails?.is_custom_network) {
              if (!!poolDetails?.isTonClaimLink && poolDetails?.tonClaimLink) {
                window.open(poolDetails?.tonClaimLink, "_blank");
              } else {
                toast.error("Custom Network Claim link is not available");
              }
            } else {
              handleTokenClaim();
            }
          }}
        />
      )}
      <TransactionSubmitModal
        opened={openClaimModal}
        handleClose={() => {
          setOpenTransactionSubmitModal(false);
        }}
        transactionHash={transactionHash || transactionHashClaimRefundToken}
        networkAvailable={poolDetails?.networkAvailable}
      />
    </div>
  );
};

export default ClaimTokenButton;
