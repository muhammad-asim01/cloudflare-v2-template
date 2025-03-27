import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import Card from "../../Card";
import Skeleton from "@mui/lab/Skeleton";
import common from '@/styles/commonstyle.module.scss'
import styles from "@/styles/landingcomponentstakingcard.module.scss"

import { Box } from "@mui/material";

type PoolData = {
  data: [];
  total: string;
  perPage: number;
  page: number;
  lastPage: number;
};

const TokenSale: React.FC<any> = (props: any) => {
  const [displayPools, setDisplayPools] = useState<Array<any>>([]);

  const { data: upcomingPoolsV3, loading: loadingUpcoming } =
    useFetch<PoolData>(`/pools/v3/upcoming-pools`);
  const { data: activePoolsV3, loading: loadingActive } = useFetch<PoolData>(
    `/pools/v3/active-pools`
  );
  const { data: nextToLaunchPoolsV3, loading: loadingNextToLaunch } =
    useFetch<PoolData>(`/pools/v3/complete-sale-pools`);
    //useFetch<PoolData>(`/pools/v3/next-to-launch-pools`);

  useEffect(() => {
    let totalPools: any[] = [];
    if (activePoolsV3?.data && activePoolsV3.data.length) {
      totalPools.push(...activePoolsV3.data);
    }
    if (nextToLaunchPoolsV3?.data && nextToLaunchPoolsV3.data.length) {
      totalPools.push(...nextToLaunchPoolsV3.data);
    }
    if (upcomingPoolsV3?.data && upcomingPoolsV3.data.length) {
      totalPools.push(...upcomingPoolsV3.data);
    }

    // Hard code for beFitter pools id = 188, 189, 190
    let beFitterIds = [188, 189, 190];

    const pools = totalPools
      .sort((a: any, b: any) => {
        if (beFitterIds.includes(a.id) || beFitterIds.includes(b.id)) return -1;

        if (a.start_time === null) {
          return 1;
        }

        if (b.start_time === null) {
          return -1;
        }

        if (+a.start_time === +b.start_time) {
          return 0;
        }

        return +a.start_time < +b.start_time ? -1 : 1;
      })
      .slice(0, 3);
    // console.log(pools, totalPools);

    setDisplayPools(
      pools.map((p: any) => ({
        ...p,
        status: p?.campaign_status,
      }))
    );
  }, [activePoolsV3, upcomingPoolsV3, nextToLaunchPoolsV3]);

  const renderLoading = () => {
    return (
      <>
        {new Array(3).fill(3).map((item: any, index: number) => {
          return (
            <div key={index} className={styles.cardContainer}>
              <Skeleton
                className={common.skeleton}
                style={{ marginBottom: 8 }}
                variant="rectangular"
                width={"100%"}
                height={28}
              />
              <Skeleton
                className={common.skeleton}
                style={{ marginBottom: 12 }}
                variant="rectangular"
                width={"100%"}
                height={24}
              />
              {Array(3)
                .fill(1)
                .map((item: any, index: number) => {
                  return (
                    <Box key={index} className={styles.skeletonStaking}>
                      <Skeleton
                        className={common.skeleton}
                        variant="rectangular"
                        width={140}
                        height={24}
                      />
                      <Skeleton
                        className={common.skeleton}
                        variant="rectangular"
                        width={100}
                        height={24}
                      />
                    </Box>
                  );
                })}
              <Skeleton
                className={common.skeleton}
                style={{ marginTop: 12 }}
                variant="rectangular"
                width={"100%"}
                height={36}
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {loadingActive || loadingNextToLaunch || loadingUpcoming
        ? renderLoading()
        : displayPools.map((pool: any, index: number) => {
            return <Card pool={pool} key={index} autoFetch={false} />;
          })}
    </div>
  );
};

export default TokenSale;
