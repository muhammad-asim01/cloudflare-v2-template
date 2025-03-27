export enum PurchaseCurrency {
  USDT = "USDT",
  USDC = "USDC",
  ETH = "ETH",
  BUSD = "BUSD",
  WETH = "WETH",
  HNY= "HONEY",
}
// chain integration
export type purchaseCurrency = Extract<PurchaseCurrency, PurchaseCurrency.ETH | PurchaseCurrency.USDC | PurchaseCurrency.USDT | PurchaseCurrency.WETH>;
