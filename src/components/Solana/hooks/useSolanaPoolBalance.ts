import { useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import { TokenType } from "@/hooks/useTokenDetails";
import { getTokenInfo } from "@/context/Solana/utils";
import useAuth from "@/hooks/useAuth";

const useSolanaPoolBalance = (tokenDetails: TokenType) => {
  const [poolBalance, setPoolBalance] = useState<any>();
  const [loadingPoolBalance, setLoadingPoolBalance] = useState<boolean>(false);

  const { connectedAccount } = useAuth();

  const retrievePoolBalance = useCallback(
    async (token: any) => {
      try {
        setLoadingPoolBalance(true);
        if (window?.solana?.publicKey) {
          const token_account_address = token;
          const account = await getTokenInfo(
            connectedAccount,
            token_account_address
          );
          setPoolBalance(
            new BigNumber(account.amount.toString())
              .div(new BigNumber(10).pow(tokenDetails.decimals))
              .toString()
          );
        }

        setLoadingPoolBalance(false);
      } catch (err) {
        console.log(err);
      }
    },
    [tokenDetails]
  );

  return {
    loadingPoolBalance,
    poolBalance,
    retrievePoolBalance,
  };
};

export default useSolanaPoolBalance;
