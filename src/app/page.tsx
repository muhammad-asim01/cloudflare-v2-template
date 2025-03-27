"use client";

import { Box } from "@mui/material";
import Skeleton from "@mui/lab/Skeleton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { POOL_IS_PRIVATE } from "@/constants";
import useFetch from "@/hooks/useFetch";
import { isNumber } from "lodash";
import { getTotalRaiseByPool } from "@/utils/campaign";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import { QuestionsAndAnswers } from "@/components/Dashboard/LandingComponents/Questions";
const ApplyToLaunch = dynamic(() => import("@/components/Base/ApplyToLaunch"), {
  loading: () => <Skeleton variant="rectangular" width={200} height={40} />,
});



const Instruction = dynamic(
  () => import("@/components/Dashboard/LandingComponents/Instruction"),
  {
    loading: () => <Skeleton variant="rectangular" width="100%" height={80} />,
  }
);

const ProjectBar = dynamic(() => import("@/components/Dashboard/ProjectBar"), {
  loading: () => <Skeleton variant="rectangular" width="100%" height={50} />,
});

const CardActive = dynamic(() => import("@/components/Dashboard/CardActive"), {
  loading: () => <Skeleton variant="rectangular" width="100%" height={150} />,
});

const Card = dynamic(() => import("@/components/Dashboard/Card"), {
  loading: () => <Skeleton variant="rectangular" width="100%" height={150} />,
});

const CardCompletedSales = dynamic(
  () => import("@/components/Dashboard/CardCompletedSales"),
  {
    loading: () => <Skeleton variant="rectangular" width="100%" height={150} />,
  }
);

const Staking = dynamic(
  () => import("@/components/Dashboard/LandingComponents/Staking"),
  {
    loading: () => <Skeleton variant="rectangular" width="100%" height={200} />,
  }
);

const Features = dynamic(
  () => import("@/components/Dashboard/LandingComponents/Features"),
  {
    loading: () => <Skeleton variant="rectangular" width="100%" height={200} />,
  }
);

const Welcome = dynamic(
  () => import("@/components/Dashboard/LandingComponents/Welcome"),
  {
    loading: () => <Skeleton variant="rectangular" width="100%" height={100} />,
  }
);

type PoolData = {
  data: [];
  total: string;
  perPage: number;
  page: number;
  lastPage: number;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Dashboard = (props: any) => {
  const [upcomingPoolsV3Display, setUpcomingPoolsV3Display] = useState<
    Array<any>
  >([]);
  const [upcomingCommunityPoolsV3Display, setUpcomingCommunityPoolsV3Display] =
    useState<Array<any>>([]);
  const [activePoolsV3Display, setActivePoolsV3Display] = useState<Array<any>>(
    []
  );
  const [nextToLaunchPoolsV3Display, setNextToLaunchPoolsV3Display] = useState<
    Array<any>
  >([]);
  const [completeSalePoolsV3Filtered, setCompleteSalePoolsV3Filtered] =
    useState<Array<any>>([]);
  const [completeSalePoolsV3Display, setCompleteSalePoolsV3Display] = useState<
    Array<any>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPage, setTotalPage] = useState(1); // may be used >>>>
  const [relationshipType, setRelationShipType] = useState("");
  const router = useRouter();

  const { data: upcomingTBAPoolsV3, loading: loadingUpcomingTBAPoolV3 } =
    useFetch<PoolData>(`/upcoming-tba-pools?limit=99&page=1`);
  const {
    data: upcomingPoolsV3,
    loading: loadingUpcomingPoolV3,
    // error: errorUpcomingPoolV3,
  } = useFetch<PoolData>(`/pools/v3/upcoming-pools`);
  const {
    data: activePoolsV3,
    loading: loadingActivePoolsV3,
    // error: errorActivePoolsV3,
  } = useFetch<PoolData>(`/pools/v3/active-pools`);
  const {
    data: nextToLaunchPoolsV3,
    loading: loadingNextToLaunchPoolsV3,
    // error: errorNextToLaunchPoolsV3,
  } = useFetch<PoolData>(`/pools/v3/next-to-launch-pools`);
  const {
    data: completeSalePoolsV3,
    loading: loadingCompleteSalePoolsV3,
    // error: errorCompleteSalePoolsV3,
  } = useFetch<PoolData>(`/pools/v3/complete-sale-pools`);

  const setStatusPools = async (pools: Array<any>) => {
    await Promise.all(
      pools.map(async (pool: any) => {
        pool.status = pool.campaign_status;
      })
    );
  };

  useEffect(() => {
    if (!upcomingPoolsV3 || !upcomingTBAPoolsV3) return;
    const tbaPools =
      upcomingTBAPoolsV3?.data && upcomingTBAPoolsV3.data.length > 0
        ? [...upcomingTBAPoolsV3.data].map((pool: any) => {
            return {
              ...pool,
              is_private: +pool.is_private,
              campaign_status: "Upcoming",
              isTBAPool: true,
            };
          })
        : [];
    if (upcomingPoolsV3?.data) {
      const pools = [...upcomingPoolsV3.data, ...tbaPools];
      setStatusPools(pools).then(() => {
        setUpcomingCommunityPoolsV3Display(
          pools.filter((p: any) => p?.is_private === POOL_IS_PRIVATE.COMMUNITY)
        );
        setUpcomingPoolsV3Display(
          pools.filter((p: any) => p?.is_private !== POOL_IS_PRIVATE.COMMUNITY)
        );
      });
    }
  }, [
    loadingUpcomingPoolV3,
    upcomingPoolsV3,
    upcomingTBAPoolsV3,
    loadingUpcomingTBAPoolV3,
  ]);

  useEffect(() => {
    if (!activePoolsV3 || !loadingActivePoolsV3) return;
    if (activePoolsV3?.data && activePoolsV3.data.length) {
      const pools = activePoolsV3.data;
      setStatusPools(pools).then(() => {
        setActivePoolsV3Display(pools);
      });
    }
  }, [activePoolsV3, loadingActivePoolsV3]);

  useEffect(() => {
    if (!nextToLaunchPoolsV3 || !loadingNextToLaunchPoolsV3) return;
    if (nextToLaunchPoolsV3?.data && nextToLaunchPoolsV3.data.length) {
      const pools = nextToLaunchPoolsV3.data;
      setStatusPools(pools).then(() => {
        pools.sort(function (a, b) {
          const x = a["start_time"];
          const y = b["start_time"];
          return +(x === null) - +(y === null) || +(x > y) || -(x < y);
        });
        setNextToLaunchPoolsV3Display(pools);
      });
    }
  }, [loadingNextToLaunchPoolsV3, nextToLaunchPoolsV3]);

  useEffect(() => {
    if (!completeSalePoolsV3) return;
    if (completeSalePoolsV3?.data && completeSalePoolsV3.data.length) {
      // let pools = completeSalePoolsV3.data;
      let pools: any;
      if (relationshipType) {
        if (relationshipType === "ido") {
          pools = completeSalePoolsV3.data.filter(
            (pool: any) =>
              pool.relationship_type === "Standard IDO" ||
              pool.relationship_type === "Exclusive IDO" ||
              pool.relationship_type === "Incubation" ||
              pool.relationship_type === "Acceleration"
          );
        }
        if (relationshipType === "Giveaway") {
          pools = completeSalePoolsV3.data.filter(
            (pool: any) => pool.relationship_type === "Giveaway"
          );
        }
        if (relationshipType === "private") {
          pools = completeSalePoolsV3.data.filter(
            (pool: any) => pool.relationship_type === "Private Sale"
          );
        }
      } else {
        pools = completeSalePoolsV3.data;
      }
      // setTotalPage(Math.ceil(parseInt(completeSalePoolsV3.total) / 10));
      // setTotalPage(Math.ceil(parseInt(pools.length) / 10));
      setStatusPools(pools).then(async () => {
        pools.sort(function (a: any, b: any) {
          const x = a["finish_time"];
          const y = b["finish_time"];
          return x > y ? -1 : x < y ? 1 : 0;
        });
        setCompleteSalePoolsV3Filtered(pools);

        await filterCompletedPools(pools, 1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeSalePoolsV3, loadingCompleteSalePoolsV3, relationshipType]);

  useEffect(() => {
    if (completeSalePoolsV3Filtered.length === 0) return;
    filterCompletedPools(completeSalePoolsV3Filtered, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, completeSalePoolsV3Filtered]);

  const filterCompletedPools = async (pools: any, page: number) => {
    const displayPools = (await getPoolsWithTokenPrice(pools, page)) as any;
    setCompleteSalePoolsV3Display(displayPools);
  };

  async function getPoolsWithTokenPrice(listPools: any, page: any) {
    listPools = listPools.slice((page - 1) * 10, page * 10).map((pool: any) => {
      return {
        ...pool,
        status: pool.campaign_status || pool.campaignStatus,
      };
    });
    setCompleteSalePoolsV3Display(listPools);

    let poolWithTokenPrice = [...listPools];
    const symbolList = listPools.map((pool: any) => pool.symbol);
    const searchParams = symbolList?.length > 0 ? symbolList.join(",") : "";
    await axios
      .get(`${baseUrl}/token-price?page=0&search=${searchParams}`)
      .then((response) => {
        poolWithTokenPrice = poolWithTokenPrice.map((pool: any) => {
          const tokenPrice = response.data.data.data.find(
            (dt: any) => dt.token_symbol === pool.symbol.toUpperCase()
          );
          // console.log('tokenPrice', isNumber(Number(pool.token_price)))
          return {
            ...pool,
            current_roi:
              tokenPrice &&
              Number(tokenPrice.current_price / tokenPrice.ido_price),
            current_usd_value:
              tokenPrice &&
              Number(tokenPrice.current_price * pool.total_sold_coin),
            orignal_usd_value: isNumber(Number(pool.token_price))
              ? Number(pool.total_sold_coin * pool.token_price)
              : pool.token_price,
            // orignal_usd_value:Number(pool.total_sold_coin * pool.token_price),
            ath_roi:
              +pool.ath_roi !== 0
                ? +pool.ath_roi
                : tokenPrice && Number(tokenPrice.ath_roi),
          };
        });
      })
      .catch((e) => {
        console.log("ERROR analytic", e);
      });
    return poolWithTokenPrice;
  }

  // REDNER
  const renderLoadingLivePools = () => {
    const lineHeight = isMobile ? 18 : 22;
    const imageSize = isMobile ? 36 : 52;
    return (
      <div className={`listPools listPools2`}>
        <Skeleton
          className="skeleton"
          style={{ marginBottom: 16 }}
          variant="rectangular"
          width={200}
          height={24}
        />
        <div className="active_pools">
          {Array(2)
            .fill(1)
            .map((item: any, index: any) => {
              return (
                <Box className="skeletonCardActive" key={index}>
                  <Skeleton
                    className={"skeleton" + " " + "skeletonCardActiveImg"}
                    variant="rectangular"
                  />
                  <Box className="skeletonCardActiveRight">
                    <Box height={imageSize} className="flexRow">
                      <Skeleton
                        className="skeleton"
                        variant="rectangular"
                        width={imageSize}
                        height={imageSize}
                      />
                      <Box
                        width={"100%"}
                        className="flexCol"
                        marginLeft={1}
                        maxWidth={306}
                      >
                        <Skeleton
                          className="skeleton"
                          variant="rectangular"
                          width={"100%"}
                          height={22}
                        />
                        <Skeleton
                          className="skeleton mt4"
                          variant="rectangular"
                          width={"50%"}
                          height={22}
                        />
                      </Box>
                    </Box>
                    <Box marginTop={2} className="flexCol">
                      <Box className="skeletonPoolInfo">
                        {Array(3)
                          .fill(1)
                          .map((item: any, index: number) => {
                            return (
                              <Box key={index}>
                                <Skeleton
                                  className="skeleton"
                                  variant="rectangular"
                                  width={"100%"}
                                  height={lineHeight}
                                />
                                <Skeleton
                                  className="skeleton mt4"
                                  variant="rectangular"
                                  width={"100%"}
                                  height={lineHeight}
                                />
                              </Box>
                            );
                          })}
                      </Box>
                    </Box>
                    <Box marginTop={2} className="flexRow">
                      <Skeleton
                        className="skeleton"
                        variant="rectangular"
                        width={120}
                        height={lineHeight}
                      />
                      <Box marginLeft={2} className="flexCol" width={"100%"}>
                        <Skeleton
                          className="skeleton"
                          variant="rectangular"
                          width={"100%"}
                          height={lineHeight}
                        />
                        <Skeleton
                          className="skeleton mt4 pullRight"
                          variant="rectangular"
                          width={"70%"}
                          height={lineHeight}
                        />
                      </Box>
                    </Box>
                    <Skeleton
                      className="skeleton mt12"
                      variant="rectangular"
                      width={"100%"}
                      height={36}
                    />
                  </Box>
                </Box>
              );
            })}
        </div>
      </div>
    );
  };

  const renderListSkeletonPools = () => {
    return (
      <div className="pools">
        {Array(3)
          .fill(1)
          .map((item: any, index: any) => {
            return (
              <Box className="skeletonCard" key={index}>
                <Skeleton
                  className="skeleton"
                  variant="rectangular"
                  width={"100%"}
                  height={160}
                />
                <Box className="skeletonCardBottom">
                  <Box height={24} className="flexRow">
                    <Skeleton
                      className="skeleton"
                      variant="rectangular"
                      width={"70%"}
                      height={24}
                    />
                    <Skeleton
                      className={"skeleton" + " " + "pullRight"}
                      variant="rectangular"
                      width={24}
                      height={24}
                    />
                  </Box>
                  <Box height={24} className="flexRow mt12">
                    <Skeleton
                      className="skeleton"
                      variant="rectangular"
                      width={70}
                      height={16}
                    />
                    <Skeleton
                      className="skeleton pullRight"
                      variant="rectangular"
                      width={60}
                      height={16}
                    />
                  </Box>
                  <Skeleton
                    className="skeleton mt12"
                    variant="rectangular"
                    width={"100%"}
                    height={36}
                  />
                </Box>
              </Box>
            );
          })}
      </div>
    );
  };

  const renderSingleField = () => {
    return (
      <Box className="flexCol">
        <Skeleton
          className="skeleton"
          variant="rectangular"
          width={"100%"}
          height={16}
        />
        <Skeleton
          className="skeleton mt12"
          variant="rectangular"
          width={"100%"}
          height={24}
        />
      </Box>
    );
  };

  const renderLoadingCompletedSales = () => {
    const renderMobile = () => {
      const renderSingleBox = () => {
        return (
          <Box width={"100%"} className="flexCol">
            <Skeleton
              className="skeleton"
              variant="rectangular"
              width={"100%"}
              height={16}
            />
            <Skeleton
              className="skeleton mt4"
              variant="rectangular"
              width={"100%"}
              height={22}
            />
          </Box>
        );
      };
      return (
        <>
          {Array(3)
            .fill(1)
            .map((item: any, index: number) => {
              return (
                <Box key={index} className="skeletonCompletedSalesMobile">
                  <Box height={48} className="flexRow">
                    <Skeleton
                      className="skeleton"
                      variant="rectangular"
                      width={48}
                      height={48}
                    />
                    <Box
                      width={"100%"}
                      className="flexCol"
                      marginLeft={1}
                      maxWidth={"80%"}
                    >
                      <Skeleton
                        className="skeleton"
                        variant="rectangular"
                        width={"100%"}
                        height={22}
                      />
                      <Skeleton
                        className="skeleton mt4"
                        variant="rectangular"
                        width={"50%"}
                        height={22}
                      />
                    </Box>
                  </Box>
                  <Box height={42} className="boxSkeletonCompletedSales">
                    {renderSingleBox()}
                    {renderSingleBox()}
                  </Box>
                  <Box
                    height={42}
                    marginTop={2}
                    className="boxSkeletonCompletedSales"
                  >
                    {renderSingleBox()}
                    {renderSingleBox()}
                  </Box>
                </Box>
              );
            })}
        </>
      );
    };

    const renderListSkeleton = () => {
      return (
        <>
          {Array(10)
            .fill(1)
            .map((item: any, index: any) => {
              return (
                <Box key={index} className="skeletonCompletedSalesItem">
                  <Box className="flexRow" width="100%">
                    <Skeleton
                      className="skeleton"
                      style={{ marginRight: 12 }}
                      variant="rectangular"
                      width={52}
                      height={52}
                    />
                    <Box className="flexCol" flex={1}>
                      <Box className="flexRow">
                        <Skeleton
                          className="skeleton"
                          style={{ marginRight: 12 }}
                          variant="rectangular"
                          width={"35%"}
                          height={16}
                        />
                        <Skeleton
                          className="skeleton"
                          variant="rectangular"
                          width={"35%"}
                          height={16}
                        />
                      </Box>
                      <Skeleton
                        className="skeleton mt12"
                        variant="rectangular"
                        width={"100%"}
                        height={24}
                      />
                    </Box>
                  </Box>
                  <Box className="subItemCompletedSales">
                    {renderSingleField()}
                    {renderSingleField()}
                  </Box>
                  <Box className="subItemCompletedSales">
                    {renderSingleField()}
                    {renderSingleField()}
                  </Box>
                </Box>
              );
            })}
        </>
      );
    };
    return (
      <div className="listPools">
        <Box height={24} className="flexRow">
          <Skeleton
            className="skeleton"
            variant="rectangular"
            width={200}
            height={24}
          />
          <Skeleton
            className={"skeleton" + " " + "pullRight"}
            variant="rectangular"
            style={{ marginRight: isMobile ? 0 : 20 }}
            width={140}
            height={24}
          />
        </Box>
        {isMobile ? renderMobile() : renderListSkeleton()}
      </div>
    );
  };
  // End Render

  return (
    <>
      <Welcome {...props} />
      <Instruction />
      <div id="launchpad" className="tokenSaleTitle">
        <h1>Token Sale Launchpad</h1>
        <p>
          Gain early access to public and special token sales at a lower price
          before they hit the market
        </p>
      </div>
      <ProjectBar />

      {activePoolsV3Display && activePoolsV3Display.length > 0 && (
        <div className={`listPools live-pools`}>
          <h2 className="flexRow">
            Live Pools&nbsp;
            <Image
              width={20}
              height={20}
              src="/assets/images/icons/icon_btn_pool.svg"
              alt=""
            />
          </h2>
          <div className="active_pools">
            {activePoolsV3Display.map((pool: any) => {
              return <CardActive pool={pool} key={pool.id} autoFetch={true} />;
            })}
          </div>
        </div>
      )}
      {loadingActivePoolsV3 && renderLoadingLivePools()}

      {nextToLaunchPoolsV3Display && nextToLaunchPoolsV3Display.length > 0 && (
        <div className="listPools">
          <h2>Next to launch</h2>
          <div className="pools">
            {nextToLaunchPoolsV3Display.map((pool: any) => {
              return <Card pool={pool} key={pool.id} autoFetch={false} />;
            })}
          </div>
        </div>
      )}
      {loadingNextToLaunchPoolsV3 && (
        <div className="listPools">
          <Skeleton
            className="skeleton"
            style={{ marginBottom: 16 }}
            variant="rectangular"
            width={200}
            height={24}
          />
          {renderListSkeletonPools()}
        </div>
      )}

      {((upcomingPoolsV3Display && upcomingPoolsV3Display.length > 0) ||
        (upcomingCommunityPoolsV3Display &&
          upcomingCommunityPoolsV3Display.length > 0)) && (
        <div className="listPools">
          <h2>Upcoming</h2>
          {upcomingPoolsV3Display && upcomingPoolsV3Display.length > 0 && (
            <>
              <h3>POOL IDO</h3>
              <div className="pools">
                {upcomingPoolsV3Display
                  .filter((p) => p.start_join_pool_time)
                  .map((pool: any) => {
                    return <Card pool={pool} key={pool.id} autoFetch={true} />;
                  })}
                {upcomingPoolsV3Display
                  .filter((p) => !p.start_join_pool_time)
                  .reduce((acc, pool) => {
                    const order: any = {
                      Incubation: 1,
                      Acceleration: 2,
                      "Standard IDO": 3,
                      Giveaway: 4,
                      "Exclusive IDO": 5,
                      "Private Sale": 6,
                      None: 7,
                    };
                    const index = order[pool.relationship_type];
                    if (index) {
                      if (!acc[index]) {
                        acc[index] = [];
                      }
                      acc[index].push(pool);
                    } else {
                      if (!acc[8]) {
                        acc[8] = [];
                      }
                      acc[8].push(pool);
                    }
                    return acc;
                  }, [])
                  .map((group: any) => {
                    if (group) {
                      return group.sort((a: any, b: any) => {
                        const totalRaiseA: any =
                          getTotalRaiseByPool(a).totalRaise;
                        const totalRaiseB: any =
                          getTotalRaiseByPool(b).totalRaise;

                        return totalRaiseB - totalRaiseA;
                      });
                    }
                    return null;
                  })
                  .flat()
                  .map((pool: any) => {
                    if (pool) {
                      return (
                        <Card pool={pool} key={pool.id} autoFetch={true} />
                      );
                    }
                    return null;
                  })}
              </div>
            </>
          )}
          {upcomingCommunityPoolsV3Display &&
            upcomingCommunityPoolsV3Display.length > 0 && (
              <>
                <h3>POOL IDO</h3>
                <div className="pools">
                  {upcomingPoolsV3Display
                    .filter((p) => p.start_join_pool_time)
                    .map((pool: any) => {
                      return (
                        <Card pool={pool} key={pool.id} autoFetch={true} />
                      );
                    })}
                  {upcomingPoolsV3Display
                    .filter((p) => !p.start_join_pool_time)
                    .reduce((acc, pool) => {
                      const order: any = {
                        Incubation: 1,
                        Acceleration: 2,
                        "Standard IDO": 3,
                        Giveaway: 4,
                        "Exclusive IDO": 5,
                        "Private Sale": 6,
                        None: 7,
                      };
                      const index = order[pool.relationship_type];
                      if (index) {
                        if (!acc[index]) {
                          acc[index] = [];
                        }
                        acc[index].push(pool);
                      } else {
                        if (!acc[8]) {
                          acc[8] = [];
                        }
                        acc[8].push(pool);
                      }
                      return acc;
                    }, [])
                    .map((group: any) => {
                      if (group) {
                        return group.sort((a: any, b: any) => {
                          const totalRaiseA: any =
                            getTotalRaiseByPool(a).totalRaise;
                          const totalRaiseB: any =
                            getTotalRaiseByPool(b).totalRaise;

                          return totalRaiseB - totalRaiseA;
                        });
                      }
                      return null;
                    })
                    .flat()
                    .map((pool: any) => {
                      if (pool) {
                        return (
                          <Card pool={pool} key={pool.id} autoFetch={true} />
                        );
                      }
                      return null;
                    })}
                </div>
              </>
            )}
          {upcomingCommunityPoolsV3Display &&
            upcomingCommunityPoolsV3Display.length > 0 && (
              <>
                <h3 style={{ marginTop: 40 }}>POOL COMMUNITY</h3>
                <div className="pools">
                  {upcomingCommunityPoolsV3Display
                    .filter((p) => p.start_join_pool_time)
                    .map((pool: any) => {
                      return (
                        <Card pool={pool} key={pool.id} autoFetch={true} />
                      );
                    })}
                  {upcomingCommunityPoolsV3Display
                    .filter((p) => !p.start_join_pool_time)
                    .map((pool: any) => {
                      return (
                        <Card pool={pool} key={pool.id} autoFetch={true} />
                      );
                    })}
                </div>
              </>
            )}
        </div>
      )}

      {loadingUpcomingPoolV3 && (
        <div className="listPools">
          <Skeleton
            className="skeleton"
            style={{ marginBottom: 12 }}
            variant="rectangular"
            width={200}
            height={24}
          />
          <Skeleton
            className="skeleton"
            style={{ marginBottom: 16 }}
            variant="rectangular"
            width={90}
            height={24}
          />
          {renderListSkeletonPools()}
        </div>
      )}

      {/* Pools Completed Sales */}
      {completeSalePoolsV3Display && (
        <div className="listPools">
          <div className="listPoolsHeader">
            <h2>Completed Sales</h2>
            {!isMobile && (
              <div
                className="btnDiv"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "15px",
                  marginTop: "-15px",
                }}
              >
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    setRelationShipType("");
                  }}
                  className={`btnFilters ${
                    relationshipType === "" ? "active" : ""
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    setRelationShipType("ido");
                  }}
                  className={`btnFilters ${
                    relationshipType === "ido" ? "active" : ""
                  }`}
                >
                  IDO
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    setRelationShipType("private");
                  }}
                  className={`btnFilters ${
                    relationshipType === "private" ? "active" : ""
                  }`}
                >
                  Private
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    setRelationShipType("Giveaway");
                  }}
                  className={`btnFilters ${
                    relationshipType === "Giveaway" ? "active" : ""
                  }`}
                >
                  Giveaway
                </button>
              </div>
            )}
            <button
              className="btnViewAllPools"
              onClick={() => router.push("/pools")}
            >
              View all Pools
              <div>
                <Image
                  width={20}
                  height={20}
                  src="/assets/images/icons/next.svg"
                  alt=""
                />
              </div>
            </button>
          </div>
          {isMobile && (
            <div
              className="btnDiv"
              style={{
                display: "flex",
                marginTop: "15px",
                marginBottom: "15px",
                justifyContent: "flex-start",
              }}
            >
              <button
                onClick={() => {
                  setRelationShipType("");
                  setCurrentPage(1);
                }}
                className={`btnFilters ${
                  relationshipType === "" ? "active" : ""
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setRelationShipType("ido");
                  setCurrentPage(1);
                }}
                className={`btnFilters ${
                  relationshipType === "ido" ? "active" : ""
                }`}
              >
                IDO
              </button>
              <button
                onClick={() => {
                  setRelationShipType("private");
                  setCurrentPage(1);
                }}
                className={`btnFilters ${
                  relationshipType === "private" ? "active" : ""
                }`}
              >
                Private
              </button>
              <button
                onClick={() => {
                  setRelationShipType("Giveaway");
                  setCurrentPage(1);
                }}
                className={`btnFilters ${
                  relationshipType === "Giveaway" ? "active" : ""
                }`}
              >
                Giveaway
              </button>
            </div>
          )}
          <div>
            {completeSalePoolsV3Display.map((pool: any) => {
              return (
                <CardCompletedSales
                  pool={pool}
                  key={pool.id}
                  autoFetch={true}
                />
              );
            })}
          </div>
          {completeSalePoolsV3Display?.length <= 0 &&
            !loadingCompleteSalePoolsV3 && (
              <p
                style={{
                  color: "white",
                }}
              >
                No Record Found
              </p>
            )}
          {/* {totalPage > 1 && (
            <Pagination
              count={totalPage}
              shape="rounded"
              style={{ marginTop: 30 }}
              className="pagination"
              onChange={(e: any, value: any) => {
                setCurrentPage(value);
              }}
              page={currentPage}
              renderItem={(item: any) => (
                <PaginationItem className="pagination-item" {...item} />
              )}
            />
          )} */}
        </div>
      )}

      <Staking />

      <Features />

      <ApplyToLaunch />

      <QuestionsAndAnswers />

      {loadingCompleteSalePoolsV3 && renderLoadingCompletedSales()}
    </>
  );
};

export default Dashboard;
