"use client";

import { Dialog, DialogContent } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import LoadingTable from "../../components/Base/LoadingTable";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { BSC_CHAIN_ID } from "../../constants/network";
import useFetch from "../../hooks/useFetch";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import StakingHeader, {
  BENEFIT_ALL,
  BENEFIT_IDO_ONLY,
  BENEFIT_REWARD_ONLY,
  DURATION_FINISHED,
  DURATION_LIVE,
  POOL_TYPE_ALLOC,
  POOL_TYPE_LINEAR,
} from "@/components/staking-pools/Header";
// import useDetailListStakingPool from "./hook/useDetailListStakingPool";
import ModalTransaction from "@/components/staking-pools/ModalTransaction";
import AllocationPool from "@/components/staking-pools/Pool/AllocationPool";
import LinearPool from "@/components/staking-pools/Pool/LinearPool";
import { getUserCountryCode, isVpn } from "@/utils";
import NotFound from "../../components/Base/404/NotFound";
import StakingPoolsHeader from "@/components/staking-pools/StakingHeader/StakingHeader";
import DelegateStaking from "../../components/DelegateStaking";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSearchParams } from "next/navigation";

const closeIcon = "/assets/images/icons/close.svg";
const iconWarning = "/assets/images/warning-red.svg";

const DEFAULT_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC_URL || "";

const provider = new ethers.providers.JsonRpcProvider(DEFAULT_RPC_URL);
import styles from "@/styles/staking.module.scss";
import useDetailListStakingPool from "@/components/staking-pools/hook/useDetailListStakingPool";
import Image from "next/image";

const StakingPools = () => {

  // Start Staking Logic
  const [blockNumber, setBlockNumber] = useState<number | undefined>(undefined);


  const { appChainID, walletChainID } = useTypedSelector(
    (state) => state.appNetwork
  ).data;
  const { address: connectedAccount } = useAppKitAccount();

  // Filter
  const [durationType, setDurationType] = useState(DURATION_LIVE);
  const [poolType, setPoolType] = useState(POOL_TYPE_LINEAR);
  const [benefitType, setBenefitType] = useState(BENEFIT_ALL);
  const [stakedOnly, setStakedOnly] = useState(false);
  const [searchString, setSearchString] = useState("");

  // Transaction
  const [openModalTransactionSubmitting, setOpenModalTransactionSubmitting] =
    useState(false);
  const [transactionHashes, setTransactionHashes] = useState([]) as any;
  const { data: poolsList } = useFetch<any>(`/staking-pool`);
  const {
    allocPools,
    linearPools,
    fetchDetailList,
    loading: loadingDetailList,
  } = useDetailListStakingPool(poolsList);


  const [restrictUser, setRestrictUser] = useState(false);
  const [isVPNUsed, setIsVPNUsed] = useState(false);


  useEffect(() => {
    const getCountryCode = async () => {
      const userCountryCode = await getUserCountryCode();
      console.log("🚀 ~ getCountryCode ~ userCountryCode:", userCountryCode);
      if (["USA", "CAN"].includes(userCountryCode)) {
        setRestrictUser(true);
      }
    };
    getCountryCode();
  }, []);

  useEffect(() => {
    const getVPNData = async () => {
      const isVPNData = await isVpn();
      setIsVPNUsed(
        isVPNData?.security?.is_proxy &&
          isVPNData?.security?.proxy_type === "VPN"
      );
    };
    getVPNData();
  }, []);

  const [filteredAllocPools, setFilteredAllocPools] = useState([]) as any;
  const [filteredLinearPools, setFilteredLinearPools] = useState([]) as any;


  // Filter allocation | linear Pools
  useEffect(() => {
    let listAlloc = Object.values(allocPools);
    let listLinear = Object.values(linearPools);


    if (durationType === DURATION_FINISHED) {
      listAlloc = listAlloc.filter((e: any) => e?.allocPoint === "0");
      listLinear = listLinear.filter(
        (e: any) =>
          Number(e?.endJoinTime) <= moment().unix() ||
          (BigNumber.from(e?.cap).gt(BigNumber.from("0")) &&
            BigNumber.from(e?.cap)
              .sub(BigNumber.from(e?.totalStaked))
              .eq(BigNumber.from("0")))
      );
    } else {
      listAlloc = listAlloc.filter((e: any) => e?.allocPoint !== "0");
      listLinear = listLinear.filter(
        (e: any) =>
          Number(e?.endJoinTime) > moment().unix() &&
          (BigNumber.from(e?.cap).eq(BigNumber.from("0")) ||
            BigNumber.from(e?.cap)
              .sub(BigNumber.from(e?.totalStaked))
              .gt(BigNumber.from("0")))
      );
    }

    if (benefitType === BENEFIT_REWARD_ONLY) {
      listAlloc = listAlloc.filter((e: any) => e?.point_rate === 0);
      listLinear = listLinear.filter((e: any) => e?.point_rate === 0);
    }

    if (benefitType === BENEFIT_IDO_ONLY) {
      listAlloc = listAlloc.filter((e: any) => e?.point_rate > 0);
      listLinear = listLinear.filter((e: any) => e?.point_rate > 0);
    }

    if (searchString) {
      listAlloc = listAlloc.filter(
        (e: any) =>
          (e?.title as string)
            .toLowerCase()
            .indexOf(searchString.toLowerCase()) !== -1
      );
      listLinear = listLinear.filter(
        (e: any) =>
          (e?.title as string)
            .toLowerCase()
            .indexOf(searchString.toLowerCase()) !== -1
      );
    }

    if (stakedOnly) {
      listAlloc = listAlloc.filter(
        (e: any) =>
          e?.stakingAmount !== "0" || e?.pendingWithdrawal?.amount !== "0"
      );
      listLinear = listLinear.filter(
        (e: any) =>
          e?.stakingAmount !== "0" || e?.pendingWithdrawal?.amount !== "0"
      );
    }
    setFilteredAllocPools(listAlloc);
    setFilteredLinearPools(listLinear);
  }, [
    linearPools,
    allocPools,
    durationType,
    benefitType,
    stakedOnly,
    searchString,
  ]);

  // Get 3 live pools linear
  const linearLivePools = useMemo(() => {
    const listLinear = Object.values(linearPools);
    return listLinear.filter(
      (e: any) =>
        Number(e?.endJoinTime) > moment().unix() &&
        (BigNumber.from(e?.cap).eq(BigNumber.from("0")) ||
          BigNumber.from(e?.cap)
            .sub(BigNumber.from(e?.totalStaked))
            .gt(BigNumber.from("0")))
    );
  }, [linearPools]);

  const reloadData = useCallback(async () => {
    if (fetchDetailList) {
      fetchDetailList();
    }
  }, [fetchDetailList]);

  const wrongChain = useMemo(() => {
    return false;
    return appChainID !== BSC_CHAIN_ID || appChainID !== walletChainID;
  }, [appChainID, walletChainID]);

  // End Staking Logic
  // Render
  const renderWrongChain = () => {
    return (
      <div className={styles.message}>
        <Image width={23} height={23} src={iconWarning} style={{ marginRight: "12px" }} alt="" />
        Please switch to the BSC network to join these staking pools
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className={styles.loader}>
        <LoadingTable />
      </div>
    );
  };

  const renderAllocationPools = () => {
    return (
      <>
        <div className={styles.messageDuration}>
          <Image width={24} height={23} src={iconWarning} style={{ marginRight: "12px" }} alt="" />
          UNI-V2 LP-CGPT pool has stopped receiving LP-CGPT staking. This policy
          is applied from October 4, 2021 until a new announcement.
        </div>
        <div className="pool-area">
          {filteredAllocPools
            .sort((a: any, b: any) => {
              return parseInt(b?.lockDuration) - parseInt(a?.lockDuration);
            })
            .map((pool: any) => (
              <AllocationPool
                key={pool?.id}
                reload={reloadData}
                setTransactionHashes={setTransactionHashes}
                setOpenModalTransactionSubmitting={
                  setOpenModalTransactionSubmitting
                }
                connectedAccount={connectedAccount}
                poolDetail={pool}
                blockNumber={blockNumber}
                poolAddress={pool?.pool_address}
                durationType={durationType}
              />
            ))}
        </div>
      </>
    );
  };

  const searchParams = useSearchParams();

  const poolId = searchParams.get("poolId");

  const poolRefs: any = useRef({});

  useEffect(() => {
    if (poolId && poolRefs.current[poolId] && filteredLinearPools?.length > 0) {
      const element = poolRefs.current[poolId];
      const offset = 70;

      const rect = element.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      window.scrollTo({
        top: rect.top + scrollTop - offset,
        behavior: "smooth",
      });
    }
  }, [poolId, poolRefs, filteredLinearPools]);

  const renderLinearPools = () => {
    return (
      <>
        <div className="pool-area">

          {filteredLinearPools
            .sort((a: any, b: any) => {
              return parseInt(b?.lockDuration) - parseInt(a?.lockDuration);
            })
            .map((pool: any, index: number) => (
              <div key={index}>
                <LinearPool
                  key={pool?.id}
                  reload={reloadData}
                  setTransactionHashes={setTransactionHashes}
                  setOpenModalTransactionSubmitting={
                    setOpenModalTransactionSubmitting
                  }
                  connectedAccount={connectedAccount}
                  poolDetail={pool}
                  poolAddress={pool?.pool_address}
                  durationType={durationType}
                  livePools={linearLivePools}
                  poolId={poolId}
                />
              </div>
            ))}
        </div>
      </>
    );
  };

  const renderStakingPools = () => {
    if (poolType === POOL_TYPE_ALLOC && filteredAllocPools.length > 0)
      return renderAllocationPools();

    if (poolType === POOL_TYPE_LINEAR && filteredLinearPools.length > 0)
      return renderLinearPools();

    return <></>;
  };

  const [tabActive, setTabActive] = useState<any>("staking");


  return (
    <>
      <StakingPoolsHeader setTabActive={setTabActive} tabActive={tabActive} />

      {tabActive === "staking" && (
        <>
        
          {!restrictUser && !isVPNUsed ? (
            <div className={styles.wrapper}>
              <div className="content">
                {wrongChain && renderWrongChain()}

                <StakingHeader
                  durationType={durationType}
                  setDurationType={setDurationType}
                  poolType={poolType}
                  setPoolType={setPoolType}
                  stakedOnly={stakedOnly}
                  setStakedOnly={setStakedOnly}
                  benefitType={benefitType}
                  setBenefitType={setBenefitType}
                  searchString={searchString}
                  setSearchString={setSearchString}
                />

                {loadingDetailList ? renderLoading() : renderStakingPools()}
              </div>

              {openModalTransactionSubmitting && (
                <Dialog
                  open={openModalTransactionSubmitting}
                  keepMounted
                  onClose={() => setOpenModalTransactionSubmitting(false)}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                  className={styles.submittingDialog}
                >
                  <DialogContent className="content">
                    <ClipLoader color={"#0066ff"} />
                    <Image
                    width={20} height={20}
        alt="close icon"
                      src={closeIcon}
                      
                      onClick={() => setOpenModalTransactionSubmitting(false)}
                    />
                    <span className="title">Transaction Submitting</span>
                  </DialogContent>
                </Dialog>
              )}

              {transactionHashes.length > 0 && (
                <ModalTransaction
                  transactionHashes={transactionHashes}
                  setTransactionHashes={setTransactionHashes}
                  open={transactionHashes.length > 0}
                />
              )}
            </div>
          ) : (
            (restrictUser || isVPNUsed) && (
              <NotFound
                title="Oops! The page you're trying to access is not available."
                description="The page you are looking for doesn't exist or has been moved"
                url="/"
                buttonLink="Back to Home Page"
              />
            )
          )}
        </>
      )}

      {tabActive === "delegated-staking" && <DelegateStaking />}
    </>
  );
};

export default StakingPools;
