'use client'
import { useCallback, useEffect, useState } from "react";
import usePoolDetails from "@/hooks/usePoolDetails";
import BigNumber from "bignumber.js";
import { CLAIM_TYPE } from "@/constants";
import SolanaTransactionSubmitModal from "@/components/Base/SolanaTransactionSubmitModal";
import { PurchaseCurrency } from "@/constants/purchasableCurrency";
import useSolanaUserRemainTokensClaim from "@/components/Solana/hooks/useSolanaRemainTokensClaim";
import useSolanaClaimRefundToken from "@/components/Solana/hooks/useSolanaClaimRefundToken";
import { useAppKitAccount } from "@reown/appkit/react";
import useDetectClaimConfigApplying from "@/components/Solana/hooks/useDetectClaimConfigApplying";
import useSolanaTokenClaim from "@/components/Solana/hooks/useSolanaTokenClaim";
import useSolanaUserRefundToken from "@/components/Solana/hooks/useSolanaUserRefundToken";
import Button from "@/components/Solana/Button";
import { toast } from "react-toastify";

const SolanaClaimTokenButton = (props: any) => {
  const { id } = props;

  const [canClaimRefundToken, setCanclaimRefundToken] = useState<any>(false);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [userClaimInfo, setUserClaimInfo] = useState<any>();
  const [openClaimModal, setOpenTransactionSubmitModal] = useState<boolean>(false);
  const [release, setRelease] = useState<any>({});
  const { poolDetails }: any = usePoolDetails(id);
  const { address: connectedAccount } = useAppKitAccount();

  const getApproveToken = useCallback(() => {
    if (
      poolDetails?.purchasableCurrency &&
      poolDetails?.purchasableCurrency === PurchaseCurrency.USDT
    ) {
      return {
        address: process.env.NEXT_PUBLIC_SOLANA_USDT_ADDRESS,
        name: "USDT",
        symbol: "USDT",
        decimals: 6,
      };
    }

    if (
      poolDetails?.purchasableCurrency &&
      poolDetails?.purchasableCurrency === PurchaseCurrency.USDC
    ) {
      return {
        address: process.env.NEXT_PUBLIC_SOLANA_USDC_ADDRESS,
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
      };
    }
  }, [poolDetails?.purchasableCurrency]);

  const tokenToApprove : any = getApproveToken();

  const { transactionHashClaimRefundToken } = useSolanaClaimRefundToken(id, poolDetails?.poolIndex, poolDetails?.purchasableCurrency);
  const { retrieveClaimableTokens } = useSolanaUserRemainTokensClaim(
    poolDetails?.networkAvailable,
    poolDetails?.id,
    poolDetails?.tokenDetails,
  );
  const { retrieveRefundToken }: any = useSolanaUserRefundToken(
    poolDetails?.id,
    tokenToApprove
  );

  const { transactionHash, claimToken } = useSolanaTokenClaim(id, poolDetails?.poolIndex, poolDetails?.decimals, poolDetails?.token);

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
          retrieveClaimableTokens(),
          retrieveRefundToken(),
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

    if (
      !nextClaim &&
      new BigNumber(maximumTokenClaimUtilNow).lte(0) // maximumTokenClaimUtilNow <= 0
    ) {
      toast.error("You not enough claimable token!");
      return false;
    }
    return true;
  };

  const handleTokenClaim = async () => {
    if (!validateClaimable()) {
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
            font: "normal normal 500 14px/20px Violet Sans",
            color: "white",
          }}
          text={"Claim Token"}
          disabled={!availableClaim || userPurchased <= 0 || !!transactionHash}
          onClick={() => {
            if(!!poolDetails?.isTonDistribution) {
              if(!!poolDetails?.isTonClaimLink && poolDetails?.tonClaimLink) {
                window.open(poolDetails?.tonClaimLink, "_blank");
              }
              else {
                toast.error("Ton Claim link is not available");
              }
            }
            else {
              handleTokenClaim()
            }
          }}
        />
      )}
      <SolanaTransactionSubmitModal
        opened={openClaimModal}
        handleClose={() => {
          setOpenTransactionSubmitModal(false);
        }}
        transactionHash={transactionHash || transactionHashClaimRefundToken}
      />
    </div>
  );
};

export default SolanaClaimTokenButton;
