import { useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import { TokenType } from "@/hooks/useTokenDetails";
import { getuserClaimed, getuserPurchased } from "@/context/Solana/utils";
import useAuth from "@/hooks/useAuth";

const useSolanaUserRemainTokensClaim = (
  networkAvaiable: string | undefined,
  id: any,
  tokenDetails: TokenType
) => {
  const [userPurchasedLoading, setUserPurchasedLoading] =
    useState<boolean>(false);

  const { connectedAccount } = useAuth();

  const retrieveClaimableTokens = useCallback(async () => {

    var userPurchased: any = 0;
    var userClaimed: any = 0;
    const decimals = tokenDetails?.decimals;
    try {
      if (window?.solana?.publicKey && id) {
        setUserPurchasedLoading(true);
        const userPurchasedTokens = await getuserPurchased(
          connectedAccount,
          id,
          window?.solana?.publicKey.toBase58()
        );
        const { amount: userPurchasedAmount } = userPurchasedTokens;
        userPurchased = userPurchasedAmount.toString();
        try {
          const userClaimedTokens = await getuserClaimed(
            connectedAccount,
            id,
            window?.solana?.publicKey.toBase58()
          );
          const { amount: userClaimedAmount } = userClaimedTokens;
          userClaimed = parseInt(userClaimedAmount, 16);
        } catch (error) {
          
        }
        const userPurchasedReturn = new BigNumber(parseInt(userPurchased, 16))
          .minus(new BigNumber(userClaimed))
          .div(new BigNumber(10).pow(decimals))
          .toFixed();
        return {
          userPurchased: new BigNumber(parseInt(userPurchased, 16))
            .div(new BigNumber(10).pow(decimals))
            .toFixed(),
          userClaimed: new BigNumber(userClaimed)
            .div(new BigNumber(10).pow(decimals))
            .toFixed(),
          userPurchasedReturn,
        };
      }
    } catch (err) {
    }
  }, [networkAvaiable, tokenDetails, id, window?.solana?.publicKey]);

  return {
    userPurchasedLoading,
    retrieveClaimableTokens,
  };
};

export default useSolanaUserRemainTokensClaim;
