import BigNumber from "bignumber.js";

const MIN_USD_REMAIN = 1;

// Token remaining amount convert to USD < MIN_USD_REMAIN => Fake to all tokens sold out
export const getIsTokenSoldOut = (
  totalSoldCoin: string,
  tokenSold: string,
  pool: any
) => {
  if (!pool) return false;

  const remainingUsd = new BigNumber(
    new BigNumber(totalSoldCoin).minus(tokenSold)
  ).multipliedBy(pool?.ethRate || pool?.token_conversion_rate || 0);
  const isFilled = new BigNumber(remainingUsd).lte(MIN_USD_REMAIN);

  return isFilled;
};
