import React from "react";
import Button from "../Button";
import BigNumber from "bignumber.js";
import { useTypedSelector } from "@/hooks/useTypedSelector";
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
import {
  NETWORK_AVAILABLE,
  PUBLIC_WINNER_STATUS,
  CUSTOM_NETWORK,
} from "@/constants";
import { isMobile } from "react-device-detect";
import { useTheme } from "@mui/material"
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";

// chain integration
function ApplyWhiteListButton(props: any) {
  const today = new Date();
  const theme: any = useTheme();
  const {
    poolDetails,
    joinTimeInDate,
    endJoinTimeInDate,
    currentUserTier,
    connectedAccount,
    wrongChain,
    verifiedEmail,
    disableAllButton,
    alreadyJoinPool,
    joinPoolSuccess,
    poolJoinLoading,
    joinPool,
    winnersList,
    ableToFetchFromBlockchain,
    isTonWalletLinked,
  } = props;

  const { appChainID } = useTypedSelector(
    (state: any) => state.appNetwork
  ).data;
  const solanaWallet = useSelector((state: any) => state.solanaWallet);
  const appNetwork = (() => {
    switch (appChainID) {
      case BSC_CHAIN_ID:
        return NETWORK_AVAILABLE.BSC;
      case POLYGON_CHAIN_ID:
        return NETWORK_AVAILABLE.POLYGON;
      case AVALANCHE_CHAIN_ID:
        return NETWORK_AVAILABLE.AVALANCHE;
      case ARBITRUM_CHAIN_ID:
        return NETWORK_AVAILABLE.ARBITRUM;
      case BASE_CHAIN_ID:
        return NETWORK_AVAILABLE.BASE;
      case DAO_CHAIN_ID:
        return NETWORK_AVAILABLE.DAO;
      case OKX_CHAIN_ID:
        return NETWORK_AVAILABLE.OKX;
      case ZKSYNC_CHAIN_ID:
        return NETWORK_AVAILABLE.ZKSYNC;
      case LINEA_CHAIN_ID:
        return NETWORK_AVAILABLE.LINEA;
      case BLAST_CHAIN_ID:
        return NETWORK_AVAILABLE.BLAST;
      case BERA_CHAIN_ID:
        return NETWORK_AVAILABLE.BERA;
      case SONIC_CHAIN_ID:
        return NETWORK_AVAILABLE.SONIC;
      case ETH_CHAIN_ID:
      default:
        return NETWORK_AVAILABLE.ETH;
    }
  })();

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
  const matchNetwork = appNetwork == poolDetails?.networkAvailable;
  const disableButton = !availableJoin || alreadyJoinPool || joinPoolSuccess;
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
      {!solanaWallet.isConnected ? (
        <Tooltip title={"Please connect your solana wallet"}>
          <span>
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
                color: "#1e1e1e",
              }}
              loading={poolJoinLoading}
              onClick={joinPool}
              disabled={
                disableButton ||
                (CUSTOM_NETWORK &&
                  !!poolDetails?.is_custom_network &&
                  !isTonWalletLinked) ||
                !solanaWallet.isConnected
              }
            />
          </span>
        </Tooltip>
      ) : (
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
            color: "#1e1e1e",
          }}
          loading={poolJoinLoading}
          onClick={joinPool}
          disabled={
            disableButton ||
            (CUSTOM_NETWORK &&
              !!poolDetails?.is_custom_network &&
              !isTonWalletLinked) ||
            !solanaWallet.isConnected
          }
        />
      )}
    </>
  );
}

export default ApplyWhiteListButton;
