"use client";

import { Box } from "@mui/material";
import Skeleton from "@mui/lab/Skeleton";
import { BigNumber } from "ethers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import useDetailListStakingPool from "@/components/staking-pools/hook/useDetailListStakingPool";
import { StakingCard } from "../StakingCard";
import common from "@/styles/commonstyle.module.scss";

import Slider from "react-slick";
import styles from "@/styles/landingcomponentstakingcard.module.scss";

const StakingPools: React.FC<any> = () => {
  const { data: poolsList, loading: loadingGetPool } =
    useFetch<any>(`/staking-pool`);
  const { linearPools, loading } = useDetailListStakingPool(poolsList);
  const [displayPools, setDisplayPools] = useState<Array<any>>([]);
  // get 3 live linear pools
  useEffect(() => {
    if (!linearPools) return;

    let listLinear = Object.values(linearPools);

    listLinear = listLinear
      .filter(
        (e: any) =>
          Number(e?.endJoinTime) > moment().unix() &&
          (BigNumber.from(e?.cap).eq(BigNumber.from("0")) ||
            BigNumber.from(e?.cap)
              .sub(BigNumber.from(e?.totalStaked))
              .gt(BigNumber.from("0")))
      )
      .slice(0, 5);

    setDisplayPools(listLinear);
  }, [linearPools]);

  const renderLoading = () => {
    return (
      <>
        {new Array(4).fill(4).map((item: any, index: number) => {
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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      {loadingGetPool || loading ? (
        renderLoading()
      ) : (
        // displayPools.map((pool: any, index: number) => {
        //     return <StakingCard cardInfo={pool} key={index} />;
        //   })
        <Slider {...settings}>
          {displayPools
            .sort((a: any, b: any) => {
              return parseInt(a.lockDuration) - parseInt(b.lockDuration);
            })
            .map((pool: any, index: number) => {
              return (
                <div key={index}>
                  <StakingCard cardInfo={pool} key={index} />
                </div>
              );
            })}
        </Slider>
      )}
    </div>
  );
};

export default StakingPools;
