import React from "react";
import Button from "../Button";
import BigNumber from "bignumber.js";
import { PUBLIC_WINNER_STATUS, CUSTOM_NETWORK } from "../../../constants";
import { isMobile } from "react-device-detect";

// chain integration
function ApplyWhiteListButton(props: any) {
  const today = new Date();
  const {
    poolDetails,
    joinTimeInDate,
    endJoinTimeInDate,
    currentUserTier,
    connectedAccount,
    wrongChain,
    verifiedEmail,
    alreadyJoinPool,
    joinPoolSuccess,
    poolJoinLoading,
    joinPool,
    winnersList,
    ableToFetchFromBlockchain,
    isTonWalletLinked
  } = props;

  const availableJoin =
    poolDetails?.method === "whitelist" && joinTimeInDate && endJoinTimeInDate
      ? today >= joinTimeInDate &&
        today <= endJoinTimeInDate &&
        currentUserTier &&
        connectedAccount &&
        !wrongChain &&
        new BigNumber(currentUserTier?.level || 0).gte(poolDetails?.minTier) &&
        verifiedEmail
      : false;
  const disableButton =
    !availableJoin ||
    alreadyJoinPool ||
    joinPoolSuccess;
  const readyJoin = alreadyJoinPool || joinPoolSuccess;

  const hideButton =
    ableToFetchFromBlockchain &&
    verifiedEmail &&
    winnersList &&
    winnersList.total > 0 &&
    poolDetails?.publicWinnerStatus == PUBLIC_WINNER_STATUS.PUBLIC;
  if (hideButton) {
    return <></>;
  }

  return (
    <>
      <Button
        text={readyJoin ? "Registered Interest" : "Register Interest"}
        
        color={"#1e1e1e"}
        style={{
          width: "100%",
          height: 36,
          borderRadius: 50,
          font: "normal normal 500 14px/20px   Violet Sans",
          background: "transparent",
          border: "1px solid  #0066FF",
         
          padding: 4,
          margin: isMobile ? "7px auto" : "unset",
          color:'#1e1e1e'
        }}
        loading={poolJoinLoading}
        onClick={joinPool}
        disabled={disableButton || (CUSTOM_NETWORK && !!poolDetails?.is_custom_network && !isTonWalletLinked)}
      />
    </>
  );
}

export default ApplyWhiteListButton;
