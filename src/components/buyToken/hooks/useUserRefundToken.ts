import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { TokenType } from '@/hooks/useTokenDetails';
import { getContractReadInstance } from '@/services/web3';
import Pool_ABI_V2 from '@/abi/PreSalePoolV2.json';

// chain integration
const useUserRefundToken = (
    tokenDetails: TokenType | undefined,
    poolAddress: string | undefined,
    networkAvaiable: string | 'eth',
    currency: string | 'eth',
) => {
    const [loadingRefundBalance, setLoadingRefundBalance] = useState<boolean>(false);
    const [refundBalance, setRefundBalance] = useState<string>();

    const retrieveRefundToken = useCallback(async (userAddress: string) => {
        try {
            if (userAddress && poolAddress && tokenDetails
                && ethers.utils.isAddress(userAddress)
                && ethers.utils.isAddress(poolAddress)
            ) {
                setLoadingRefundBalance(true);
                const contract = getContractReadInstance(Pool_ABI_V2, poolAddress, networkAvaiable);
                if (contract) {
                    const currencyInfo: any = {
                        eth: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_SMART_CONTRACT,
                                decimal: 6
                            },
                        },
                        bsc: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_BSC_SMART_CONTRACT,
                                decimal: 18
                            },
                            busd: {
                                address: process.env.NEXT_PUBLIC_BUSD_BSC_SMART_CONTRACT,
                                decimal: 18
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_BSC_SMART_CONTRACT,
                                decimal: 18
                            },
                        },
                        polygon: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_POLYGON_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_POLYGON_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        avalanche: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_AVALANCHE_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_AVALANCHE_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        arbitrum: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_ARBITRUM_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_ARBITRUM_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        base: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_BASE_SMART_CONTRACT,
                                decimal: 18
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_BASE_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        coredao: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_DAO_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_DAO_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        xlayer: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_OKX_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_OKX_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        zksync: {
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_ZKSYNC_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        linea: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_LINEA_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_LINEA_SMART_CONTRACT,
                                decimal: 6
                            }
                        },
                        blast: {
                            weth: {
                                address: process.env.NEXT_PUBLIC_WETH_BLAST_SMART_CONTRACT,
                                decimal: 18
                            }
                        },
                        bera: {
                            honey: {
                                address: process.env.NEXT_PUBLIC_HNY_SMART_CONTRACT,
                                decimal: 18
                            }
                        },
                        sonic: {
                            usdt: {
                                address: process.env.NEXT_PUBLIC_USDT_SONIC_SMART_CONTRACT,
                                decimal: 6
                            },
                            usdc: {
                                address: process.env.NEXT_PUBLIC_USDC_SONIC_SMART_CONTRACT,
                                decimal: 6
                            }
                        }
                    }


                    console.log(currencyInfo,currencyInfo[networkAvaiable][currency].decimal,currencyInfo[networkAvaiable][currency].address)

                    const currencyAddress = currency == 'eth' ? '0x0000000000000000000000000000000000000000' : currencyInfo[networkAvaiable][currency].address
                    const currencyDecimal = currency == 'eth' ? 18 : currencyInfo[networkAvaiable][currency].decimal

                    const [userRefund] : any = await Promise.all([
                        contract.methods.userRefundToken(userAddress, currencyAddress).call(),
                        contract.methods.offeredCurrencies(currencyAddress).call(),
                    ])

                    const refundBalance = new BigNumber(userRefund.currencyAmount).div(new BigNumber(10).pow(currencyDecimal)).toFixed()

                    setRefundBalance(refundBalance)
                    setLoadingRefundBalance(false)
                    return {
                        isClaimed: userRefund.isClaimed,
                        currencyAmount: userRefund.currencyAmount,
                        currency: userRefund.currency,
                        balanceAmount: refundBalance
                    }
                }
                return {
                    isClaimed: false,
                    currencyAmount: null,
                    currency: null
                }
            }
        } catch (err) {
            console.log(err);
        }
    }, [tokenDetails, poolAddress, networkAvaiable]);

    return {
        loadingRefundBalance,
        refundBalance,
        retrieveRefundToken
    }
}

export default useUserRefundToken;
