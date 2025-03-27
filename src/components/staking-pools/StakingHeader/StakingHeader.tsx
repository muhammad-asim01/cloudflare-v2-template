'use client'

import useAuth from "@/hooks/useAuth";
import axios from "@/services/axios";
import { useCallback, useEffect, useState } from "react";
import { utils } from "ethers";
import classes from '@/styles/staking.module.scss'
import Image from "next/image";
export default function StakingHeader({ setTabActive, tabActive }: any) {
  const { connectedAccount } = useAuth();
  const [tierInfo, setTierInfo] = useState(null);
  const [cgptCurrentPrice, setCGPTCurrentPrice] = useState(null);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        `access_token:${connectedAccount}`
      )}`,
    },
  });

  const getTierInfo = useCallback(async () => {
    if (!connectedAccount) return;

    try {
      const response = await axios.get(`/user/tier-info`, getAuthHeaders());
      const stakingTokens =
        response.data?.data?.stakedInfo?.stakingTokens || {};
      const cgptAddress =
        process.env.NEXT_PUBLIC_CGPT_ADDRESS ||
        "0x7c423c75c4b42fd57b6c42f184ebd730f745c6ef";
      setTierInfo(stakingTokens[cgptAddress] || null);
    } catch (error) {
      console.error("Error fetching tier info:", error);
    }
  }, [connectedAccount]);

  const getCGPTInfo = useCallback(async () => {
    if (!connectedAccount) return;

    try {
      const response = await axios.get(
        `/token-price?page=0&search=CGPT`,
        getAuthHeaders()
      );
      setCGPTCurrentPrice(
        response.data?.data?.data?.[0]?.current_price || null
      );
    } catch (error) {
      console.error("Error fetching CGPT price:", error);
    }
  }, [connectedAccount]);

  useEffect(() => {
    getTierInfo();
    getCGPTInfo();
  }, [getTierInfo, getCGPTInfo]);

  return (
    <>
      <div className={classes.stakingHeader}>
        <div className="staking-header-left">
          <div className="staking-header-title">staking</div>

          <p className="staking-header-description">
            Be among the first to get your preferred tokens at attractive
            pre-sale prices with Degen Pad
          </p>
          <div className="total-invested">
            <div className="total-invested-title">
              <span>
                {" "}
                <Image
                  width={32}
                  height={24}
                  src={"/assets/images/icon-invested.svg"}
                  alt=""
                />
              </span>{" "}
              Total Invested
            </div>
            <div className="total-invested-value">
              {tierInfo
                ? `${
                    Number.isFinite(parseFloat(utils.formatEther(tierInfo)))
                      ? parseFloat(utils.formatEther(tierInfo)).toFixed(2)
                      : "0.00"
                  } CGPT`
                : "0.00 CGPT"}
            </div>

            <div className="total-invested-equal">
              {tierInfo && cgptCurrentPrice
                ? `=$${
                    Number.isFinite(
                      parseFloat(utils.formatEther(tierInfo)) * cgptCurrentPrice
                    )
                      ? (
                          parseFloat(utils.formatEther(tierInfo)) *
                          cgptCurrentPrice
                        ).toFixed(2)
                      : "0.00"
                  }`
                : "=$0.00"}
            </div>
          </div>

          <div className="tab-list">
            <div
              className={`tab-item ${
                tabActive === "staking" ? "tab-item-active" : ""
              }`}
              onClick={() => setTabActive("staking")}
            >
              Staking
            </div>
            <div
              className={`tab-item ${
                tabActive === "delegated-staking" ? "tab-item-active" : ""
              }`}
              onClick={() => setTabActive("delegated-staking")}
            >
              Delegated Staking
            </div>
          </div>
        </div>
        <div className="staking-header-right">
          <Image
          width={32} height={32}
            src={"/assets/images/staking-pic.svg"}
            alt=""
          />
        </div>
      </div>
    </>
  );
}
