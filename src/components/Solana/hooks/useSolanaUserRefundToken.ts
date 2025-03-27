import { useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import { PublicKey } from "@solana/web3.js";
import { TokenType } from "@/hooks/useTokenDetails";
import { getuserByCurrency } from "@/context/Solana/utils";
import useAuth from "@/hooks/useAuth";

const useSolanaUserRefundToken = (
  id: number,
  tokenToApprove: TokenType
) => {
  const [loadingRefundBalance, setLoadingRefundBalance] =
    useState<boolean>(false);
  const [refundBalance, setRefundBalance] = useState<string>();

  const { connectedAccount } = useAuth();

  const retrieveRefundToken = useCallback(async () => {
    try {
      setLoadingRefundBalance(true);
      const currency_ = tokenToApprove.address;
      const currency = new PublicKey(currency_);
      if (window?.solana?.publicKey && id) {
        const response = await getuserByCurrency(
          connectedAccount,
          id,
          window?.solana?.publicKey.toBase58()
        );
        const userPurchased = response;

        let refundBalance = new BigNumber(
          parseInt(userPurchased.userRefundTokenCurrencyAmount, 16)
        )
          .div(new BigNumber(10).pow(tokenToApprove.decimals))
          .toFixed();

        setRefundBalance(refundBalance);
        setLoadingRefundBalance(false);
        return {
          isClaimed: userPurchased.userRefundTokenIsClaimed,
          currencyAmount: refundBalance,
          currency: userPurchased.userRefundTokenCurrency.toString(),
          balanceAmount: refundBalance,
        };
      }
    } catch (err) {}
  }, [id, window?.solana?.publicKey]);

  return {
    loadingRefundBalance,
    refundBalance,
    retrieveRefundToken,
  };
};

export default useSolanaUserRefundToken;
