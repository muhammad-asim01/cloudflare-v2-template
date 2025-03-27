'use client'

import {
  Button,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Pagination from "@mui/lab/Pagination";
import PaginationItem from "@mui/lab/PaginationItem";
import BigNumber from "bignumber.js";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingTable from "@/components/Base/LoadingTable";
import {
  NETWORK,
  POOL_STATUS_JOINED,
} from "@/constants";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import useWalletSignature from "@/hooks/useWalletSignature";
import axios from "@/services/axios";
import { getAccessPoolText } from "@/utils/campaign";
import { fillClaimInfo } from "@/utils/claim";
import { getAppNetWork } from "@/utils/network";
import ClaimStatusTextCell from "./ClaimStatusTextCell";
import ModalWhitelistCancel from "./ModalWhitelistCancel";
import styles from "@/styles/myPools.module.scss";
import ClaimTokenButton from "../ClaimTokenButton";
import { getConfigAuthHeader } from "@/utils/configHeader";
import SolanaClaimTokenButton from "../ClaimTokenButton/SolanaClaimTokenButton";
import { useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";
import CustomImage from "@/components/Base/Image";

// chain integration
const MyPools = () => {

  const { address: account } = useAppKitAccount();
  const { signature } = useWalletSignature();

  // For Detech Claim
  const { connectedAccount, wrongChain } = useAuth();
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const appChainID = appChain.appChainID;
  const { data: connector } = useSelector((state: any) => state.connector);
  const appNetwork = getAppNetWork(appChainID);

  const [input, setInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pools, setPools] = useState([]);
  const [poolCancel, setPoolCancel] = useState({});
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [currentTimeGetPool, setCurrentTimeGetPool] = useState(
    new Date().getTime()
  );




  const getPoolsPrefixUri = () => {
    const uri = "/pools";
    return `${uri}/user/joined-pools`;
  };

  const { data: poolsList, loading: loadingGetPool } = useFetch<any>(
    `${getPoolsPrefixUri()}?page=${currentPage}&limit=10&title=${input}&current_time=${currentTimeGetPool}`
  );

  const handleInputChange = debounce((e: any) => {
    Promise.resolve().then(() => {
      setInput(e.target.value);
      setCurrentPage(1);
    });
  }, 500);

  useEffect(() => {
    if (!poolsList?.data) return;
    const manipulatePoolsData = async (pools: any) => {
      let listData = pools.data;
      // Setting Pages:
      setTotalPage(pools.lastPage);
      setCurrentPage(Number(pools.page));


      if (listData && listData.length > 0) {
        listData = await fillClaimInfo({
          listData,
          connectedAccount,
          connector,
          appChainID,
          appNetwork,
          wrongChain,
        });
      }

      setPools(listData);
    };

    manipulatePoolsData(poolsList);
  }, [poolsList, appChain, connector]);

  const poolStatus = (pool: any) => {
    if (pool.campaign_status === "Filled") {
      return (
        <div className="status_pool claimable">
          <span>Filled</span>
        </div>
      );
    }
    switch (pool.joined_status) {
      case POOL_STATUS_JOINED.CANCELED_WHITELIST:
        return (
          <div className="status_pool canceled-whitelist">
            <span>Canceled Whitelist</span>
          </div>
        );
      case POOL_STATUS_JOINED.APPLIED_WHITELIST:
        return (
          <div className="status_pool applied-whitelist">
            <span>Registered Interest</span>
          </div>
        );
      case POOL_STATUS_JOINED.WIN_WHITELIST:
        return (
          <div className="status_pool win-whitelist">
            <span>Win Interest</span>
          </div>
        );
      case POOL_STATUS_JOINED.NOT_WIN_WHITELIST:
        return (
          <div className="status_pool not-win-whitelist">
            <span>Not Win Interest</span>
          </div>
        );
      case POOL_STATUS_JOINED.SWAPPING:
        return (
          <div className="status_pool swapping">
            <span>Swapping</span>
          </div>
        );
      case POOL_STATUS_JOINED.CLAIMABLE:
        return <ClaimStatusTextCell poolDetails={pool} />;
      case POOL_STATUS_JOINED.COMPLETED:
        return (
          <div className="status_pool completed">
            <span>Completed</span>
          </div>
        );
      default:
        return (
          <div className="status_pool none">
            <span>-</span>
          </div>
        );
    }
  };

  const purchasedAmount = (pool: any) => {
    if (!pool?.purchasers?.[0]) return "-";

    const purchasedAmount = pool?.purchasers?.[0]?.purchased_amount;
    if (new BigNumber(purchasedAmount).lte(0)) return "-";

    const purchasedAmountText = `${new BigNumber(
      purchasedAmount || 0
    ).div(new BigNumber(10).pow((pool && pool.decimals) ? pool.decimals : 18)).toFixed(3)} ${pool?.symbol?.toUpperCase()}`;

    return purchasedAmountText;
  };

  const investedAmount = (pool: any) => {
    if (!pool?.purchasers?.[0]) return "-";

    const currencyInfo: any = {
      eth: {
          usdt: {
              decimal: 6
          },
          usdc: {
              decimal: 6
          },
      },
      bsc: {
          usdt: {
              decimal: 18
          },
          busd: {
              decimal: 18
          },
          usdc: {
              decimal: 18
          },
      },
      polygon: {
          usdt: {
              decimal: 6
          },
          usdc: {
              decimal: 6
          }
      },
      avalanche: {
          usdt: {
              decimal: 6
          },
          usdc: {
            decimal: 6
          }
      },
      arbitrum: {
          usdt: {
              decimal: 6
          },
          usdc: {
            decimal: 6
          }
      },
      coredao: {
        usdt: {
            decimal: 6
        },
        usdc: {
            decimal: 6
        }
      },
      base: {
        usdt: {
            decimal: 18
        },
        usdc: {
            decimal: 6
        }
      },
      xlayer: {
        usdt: {
          decimal: 6
        },
        usdc: {
          decimal: 6
        }
      },
      zksync: {
        usdc: {
            decimal: 6
        },
      },
      linea: {
        usdt: {
          decimal: 6,
        },
        usdc: {
          decimal: 6,
        },
      },
      blast: {
        weth: {
          decimal: 18,
        },
      },
      bera: {
        honey: {
            address: process.env.NEXT_PUBLIC_HNY_SMART_CONTRACT,
            decimal: 18
        }
    },
    solana: {
      usdt: {
          decimal: 6
      },
      usdc: {
          decimal: 6
      }
  },
  sonic: {
    usdt: {
      decimal: 6
    },
    usdc: {
      decimal: 6
    }
  }
  }

  const currencyDecimal = pool?.accept_currency == 'eth' ? 18 : currencyInfo[pool?.network_available] && currencyInfo[pool?.network_available][pool?.accept_currency]?.decimal

    const investedAmount = pool?.purchasers?.[0]?.invested_amount;
    if (new BigNumber(investedAmount).lte(0)) return "-";

    const investedAmountText = `${new BigNumber(
      investedAmount || 0
    ).div(new BigNumber(10).pow(currencyDecimal || 18)).toFixed()} ${pool?.accept_currency?.toUpperCase()}`;

    return investedAmountText;
  };

  useEffect(() => {
    if (signature && connectedAccount) {
      setOpenModalCancel(true);
    }
  }, [signature, connectedAccount]);

  const onCloseModalCancel = () => {
    setPoolCancel({});
    setOpenModalCancel(false);
  };

  const onCancelPool = async (pool: any) => {
    if (signature) {
      // const config = {
      //   headers: {
      //     msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
      //   },
      // };

      const authConfig = getConfigAuthHeader(account)
      const response = (await axios.post(
        `/user/unjoin-campaign`,
        {
          signature,
          campaign_id: pool?.id,
          wallet_address: account,
        },
        authConfig as any
      )) as any;

      if (response.data) {
        if (response.data.status === 200) {
          getPoolsPrefixUri();
          setPoolCancel({});
          setOpenModalCancel(false);
          setCurrentTimeGetPool(new Date().getTime());
          toast.success("You have successfully cancelled your whitelist application.");
        }

        if (response.data.status !== 200) {
          toast.error(response.data.message);
        }
      }
    }
  };


  const renderSearchFilter = () => {
    return (
      <div className={styles.headTable}>
        <div className={styles.leftFillter}>
          {/* <FormControl className={styles.formControlSelect}>
            <Select
              className={styles.selectBox}
              native
              IconComponent={ExpandMoreIcon}
              value={filterStatus.status}
              onChange={handleChangeStatus}
              inputProps={{
                name: "status",
              }}
            >
              {listStatuses?.map((item, index) => {
                return (
                  <option value={item.value} key={index}>
                    {item.babel}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className={styles.formControlSelect}>
            <Select
              className={`${styles.selectBox} ${styles.selectBoxType}`}
              native
              IconComponent={ExpandMoreIcon}
              value={filterType.type}
              onChange={handleChangeType}
              inputProps={{
                name: "type",
                id: "list-types",
              }}
            >
              {listTypes?.map((item, index) => {
                return (
                  <option value={item.value} key={index}>
                    {item.babel}
                  </option>
                );
              })}
            </Select>
          </FormControl> */}
        </div>

        <div className={styles.groupSearch}>
          <input
            type="text"
            placeholder="Search by Pool name, Token Symbol"
            onChange={handleInputChange}
          />
          <Button style={{position:'absolute', left:'3px', top:'3px'}}>
            <Image width={15} height={15} src="/assets/images/icon-search.svg" alt="" />
          </Button>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    const renderLoadingTable = () => {
      return (
        <div className={styles.tableLoading}>
          <LoadingTable />
        </div>
      );
    };

    const renderNoResult = () => {
      return (
        <div className={styles.tableLoading}>
          You have not participated in any pools.
        </div>
      );
    };

    return (
      <Hidden smDown>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table} aria-label="simple table">
            <TableHead className={styles.tableHeaderWrapper}>
              <TableRow>
                <TableCell>Pool Name</TableCell>
                <TableCell>Type</TableCell>
                {/* <TableCell>Status</TableCell> */}
                {/* <TableCell>Allocation</TableCell> */}
                <TableCell>Purchased</TableCell>
                <TableCell>Invested</TableCell>
                <TableCell>Claim Token</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pools.length > 0 &&
                !loadingGetPool &&
                pools.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <Link
                      prefetch
                        href={row?.network_available === NETWORK.SOLANA
                          ? `/solana/buy-token/${row.id}`
                          : `/buy-token/${row?.id}`}
                        className={styles.toDetailPool}
                      >
                        {row?.token_images && 
                        <CustomImage
                        className={styles.iconToken}
                          src={row?.token_images}
                          alt=""
                        height={16}
                        width={16}
                       
                        onError={(event: any) => {
                          event.target.src = "/assets/images/icons/staking.svg";
                        }}
                        defaultImage={
                            "/assets/images/defaultImages/image-placeholder.png"
                        }
                      />
                        }
                        <span className={styles.nameToken}>{row.title}</span>
                      </Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getAccessPoolText(row)}
                    </TableCell>
                    {/* <TableCell component="th" scope="row">
                      {poolStatus(row)}
                    </TableCell> */}
                    {/* <TableCell component="th" scope="row">
                      {allocationAmount(row)}
                    </TableCell> */}
                    <TableCell component="th" scope="row">
                      {purchasedAmount(row)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {investedAmount(row)}
                    </TableCell>
                    <TableCell component="th" scope="row" className={styles.poolDetailClaim}>
                    {row?.network_available === "solana" ? <SolanaClaimTokenButton id={row.id} /> : <ClaimTokenButton id={row.id} />}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {loadingGetPool
          ? renderLoadingTable()
          : pools.length === 0 && renderNoResult()}
      </Hidden>
    );
  };

  const renderTableMobile = () => {
    return (
      <Hidden mdUp>
        <div className={styles.datasMobile}>
          {pools.length > 1 &&
            pools.map((row: any, index: number) => (
              <div key={index} className={styles.boxDataMobile}>
                <div className={styles.titleBoxMobile}>
                  <Link
                  prefetch
                    href={row?.network_available === NETWORK.SOLANA
                      ? `/solana/buy-token/${row.id}`
                      : `/buy-token/${row?.id}`}
                    className={styles.toDetailPool}
                  >
                    
                     <CustomImage
                       height={16}
                       width={16}
                       className={styles.iconTokenMobile}
                       src={row.token_images}
                       alt=""
                       onError={(event: any) => {
                         event.target.src =   "/assets/images/defaultImages/image-placeholder.png";
                       }}
                       defaultImage={
                          "/assets/images/defaultImages/image-placeholder.png"
                       }
                     />
                    <span className={styles.nameTokenMobile}>{row.title}</span>
                  </Link>
                </div>

                <div className={styles.boxContentMobile}>
                  <div className={styles.boxMobileItem}>
                    <div>
                      <span className={styles.nameMobile}>Type</span>
                      <span>{getAccessPoolText(row)}</span>
                    </div>
                    <div className={styles.rightItem}>
                      <span className={styles.nameMobile}>Status</span>
                      <span>{poolStatus(row)}</span>
                    </div>
                  </div>
                  <div className={styles.boxMobileItem}>
                    {/* <div>
                      <span className={styles.nameMobile}>Allocation</span>
                      <span>{allocationAmount(row)}</span>
                    </div> */}
                    <div>
                      <span className={styles.nameMobile}>Purchased</span>
                      <span>{purchasedAmount(row)}</span>
                    </div>
                    <div className={styles.rightItem}>
                      <span className={styles.nameMobile}>Invested</span>
                      <span>{investedAmount(row)}</span>
                    </div>
                  </div>
                  <div className={styles.boxMobileItem}>
                  <div>
                    <span className={styles.nameMobile}>Claim Token</span>
                    <span>
                      {" "}
                      {row?.network_available === "solana" ? <SolanaClaimTokenButton id={row.id} /> : <ClaimTokenButton id={row.id} />}
                    </span>
                  </div>
                  </div>
                  {/* {actionButton(row) !== null && (
                    <div>
                      <div className={styles.nameMobile}>Action</div>
                      <div className={styles.valueMobile}>
                        {actionButton(row)}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            ))}
        </div>
        {loadingGetPool && (
          <div className={styles.tableLoading}>
            <LoadingTable />
          </div>
        )}
      </Hidden>
    );
  };

  const renderPagination = () => {
    return (
      <div className={styles.pagination}>
        {totalPage > 1 && (
          <Pagination
            count={totalPage}
            className={styles.pagination}
            onChange={(e: any, value: any) => {
              if (!loadingGetPool) {
                setCurrentPage(value);
              }
            }}
            page={currentPage}
            renderItem={(item: any) => (
              <PaginationItem className="pagination-item" {...item} />
            )}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageMyPools}>
      <h2 className={styles.title}>My Pools</h2>
      <div className={styles.des}>
        Here are all pools that you have participated in.
      </div>

      {renderSearchFilter()}
      {renderTable()}
      {renderTableMobile()}
      {renderPagination()}

      <ModalWhitelistCancel
        poolCancel={poolCancel}
        openModalCancel={openModalCancel}
        onCloseModalCancel={() => onCloseModalCancel()}
        onCancelPool={(pool: any) => onCancelPool(pool)}
      />
    </div>
  );
};

export default MyPools;
