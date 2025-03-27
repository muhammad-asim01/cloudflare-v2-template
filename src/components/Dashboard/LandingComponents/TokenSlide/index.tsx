import React, {useEffect, useState} from 'react';
import useFetch from "@/hooks/useFetch";
import Card from '../../Card'

type PoolData = {
  data: [],
  total: string,
  perPage: number,
  page: number,
  lastPage: number,
};

import styles from "@/styles/tokenslide.module.scss"

const TokenSlide: React.FC<any> = (props: any) => {
  const [displayPools, setDisplayPools] = useState<Array<any>>([])

  const { data: upcomingPoolsV3 } = useFetch<PoolData>(`/pools/v3/upcoming-pools`);
  const { data: activePoolsV3 } = useFetch<PoolData>(`/pools/v3/active-pools`);
  const { data: nextToLaunchPoolsV3 } = useFetch<PoolData>(`/pools/v3/next-to-launch-pools`);

  useEffect(() => {
    let totalPools: any[] = []
    if (activePoolsV3?.data && activePoolsV3.data.length) {
      totalPools.push(...activePoolsV3.data)
    }
    if (upcomingPoolsV3?.data && upcomingPoolsV3.data.length) {
      totalPools.push(...upcomingPoolsV3.data)
    }
    if (nextToLaunchPoolsV3?.data && nextToLaunchPoolsV3.data.length) {
      totalPools.push(...nextToLaunchPoolsV3.data)
    }
    const pools = totalPools.slice(0, 3)
    pools.push(...pools) //dup for animation
    setDisplayPools(pools.map((p: any) => ({
      ...p,
      status: p?.campaign_status
    })))
  }, [activePoolsV3, upcomingPoolsV3, nextToLaunchPoolsV3]);

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        {displayPools.map((pool: any, index: number) => {
          return <Card pool={pool} key={index} autoFetch={false} />
        })}
      </div>
    </div>
  )
}

export default TokenSlide;
