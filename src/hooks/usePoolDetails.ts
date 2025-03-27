"use client";

import BigNumber from "bignumber.js";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { convertUnixTimeToDateTime } from "../utils/convertDate";
import { CLAIM_TYPE } from "./../constants";
import useFetch from "./useFetch";
import { TokenType } from "./useTokenDetails";

export type Tier = {
  allocation: string;
  ticket_allow: string;
  name: string;
  // maxBuy: string,s
  startTime: string;
  endTime: string;
  level: string | number;
};

export type PoolDetails = {
  id: number;
  website: string;
  amount: number;
  totalSoldCoin: number; // Alias of amount
  ethRate: number;
  method: string;
  type: string;
  tokenDetails: TokenType;
  title: string;
  buyLimit: number[];
  poolAddress: string;
  poolClaimAddress: string;
  joinTime: string;
  endJoinTime: string;
  startBuyTime: string;
  endBuyTime: string;
  releaseTime: string;
  purchasableCurrency: string;
  banner: string;
  networkClaim: string;
  networkAvailable: string;
  networkIcon: string;
  minTier: number;
  isDeployed: boolean;
  isDisplay: boolean;
  kycBypass: boolean;
  addressReceiver: string;
  minimumBuy: number[];
  shortDescription: string;
  description: string;
  businessModel: string;
  team: string;
  partnersInvestors: string;
  tokenMetrics: string;
  displayPriceRate: any;
  priceUsdt: string;
  isPrivate: string;
  campaignClaimConfig?: any;
  socialRequirement?: any;
  announcement_time?: any;
  whitelistCountry?: any;
  socialNetworkSetting?: any;
  claimType?: typeof CLAIM_TYPE;
  claimPolicy?: any;
  publicWinnerStatus?: any;
  progressDisplay?: any;
  tokenSoldDisplay?: any;
  tokenSold?: any;
  campaignStatus?: string;
  poolStatus?: string;
  freeBuyTimeSetting?: any;

  preOrderUsers?: any;
  preOrderMinTier?: any; // pre_order_min_tier
  startPreOrderTime?: any; // start_pre_order_time

  participantNumber?: string;
  remainingTokens?: string;
  claimGuide?: string;
  claimOnWebsiteTime?: string; // first time claim on website
  isLocked?: boolean; // first time claim on website
  relationship_type?: string;
  isTonDistribution?: any;
  isCustomToken?: any;
  customToken?: any;
  isTonClaimLink?: any;
  tonClaimLink?: any;
  forbiddenCountries?: any;
  hide_address?: any;
  is_custom_network: boolean;
  custom_network_icon: string;
  custom_network_title: string;
  external_refund_link: string;
  poolIndex?: number;
  token_price?: any;
  tiers?: any;
  pool_display_version?: any;
};

export type PoolDetailsReturnType = {
  poolDetails: PoolDetails | undefined;
  loading: boolean;
  poolDetailDone: boolean;
};

const ETH_ICON = "/assets/images/eth.svg";
const BSC_ICON = "/assets/images/bsc.svg";
const POLYGON_ICON = "/assets/images/polygon-matic.svg";

const usePoolDetails = (poolId: number): PoolDetailsReturnType => {
  const [poolDetailDone, setPoolDetailDone] = useState<boolean>(false);
  const {
    loading: fetchPoolLoading,
    error,
    data,
  } = useFetch<any>(`/pool/${poolId}`, false, {}, false);
  const { data: connectedAccountTier } = useTypedSelector((state) => state.userTier);

  const poolDetails = useMemo(() => {
    if (data && data.tiers && !fetchPoolLoading && !error && poolDetailDone) {
      const buyLimit: number[] = [];
      const minimumBuy: number[] = [];

      const tokenDetails =
        data.token == "TBD"
          ? {
              symbol: "TBA",
              name: "TBA",
              decimals: 18,
              address: "Token contract not available yet.",
            }
          : {
              symbol: data.symbol,
              name: data.name,
              decimals: data.decimals,
              address: data.token,
            };

      if (data.tiers.length > 0) {
        data.tiers.map((tier: any) => {
          buyLimit.push(tier.max_buy);
          minimumBuy.push(tier.min_buy);
        });
      }

      let campaignClaimConfig = data.campaignClaimConfig || [];
      campaignClaimConfig = campaignClaimConfig.map((claimConfig: any) => {
        return {
          ...claimConfig,
          start_time_formated: convertUnixTimeToDateTime(claimConfig.start_time),
          start_time_moment: moment(claimConfig.start_time),
        };
      });

      const networkIcon = (() => {
        switch (data.network_available) {
          case "bsc":
            return BSC_ICON;
          case "polygon":
            return POLYGON_ICON;
          case "eth":
          default:
            return ETH_ICON;
        }
      })();

      return {
        method: data.buy_type,
        startTime: data.start_join_pool_time,
        token: data.token,
        ethRate:
          data.purchasableCurrency === "eth"
            ? data.ether_conversion_rate
            : data.token_conversion_rate,
        type: data.pool_type,
        amount: data.total_sold_coin,
        totalSoldCoin: data.total_sold_coin, // Alias of amount
        website: data.website,
        tokenDetails,
        title: data.title,
        buyLimit,
        minimumBuy,
        poolAddress: data.campaign_hash,
        poolClaimAddress: data.campaign_claim_hash,
        joinTime: data.start_join_pool_time,
        endJoinTime: data.end_join_pool_time,
        startBuyTime: data.start_time,
        endBuyTime: data.finish_time,
        purchasableCurrency: data.accept_currency,
        id: data.id,
        banner: data.token_images,
        releaseTime: data.release_time,
        networkAvailable: data.network_available,
        networkClaim: data.network_claim,
        networkIcon: networkIcon,
        minTier: data.min_tier,
        isDeployed: data.is_deploy === 1,
        isDisplay: data.is_display === 1,
        kycBypass: data.kyc_bypass === 1,
        addressReceiver: data.address_receiver,
        shortDescription: data.short_description,
        description: data.description,
        roadmap: data.roadmap,
        businessModel: data.business_model,
        team: data.team,
        partnersInvestors: data.partners_investors,
        tokenMetrics: data.token_metrics,
        displayPriceRate: !!data.display_price_rate,
        priceUsdt: new BigNumber(data?.price_usdt || 0).toFixed(),
        campaignClaimConfig,
        socialRequirement: data.socialRequirement,
        announcement_time: data.announcement_time,
        isPrivate: data.is_private,
        lockSchedule: data.lock_schedule,
        whitelistCountry: data.whitelist_country,
        socialNetworkSetting: data.socialNetworkSetting,
        claimPolicy: data.claim_policy,
        claimType: data.claim_type,
        publicWinnerStatus: data.public_winner_status,
        progressDisplay: data.progress_display || 0,
        tokenSoldDisplay: data.token_sold_display || 0,
        tokenSold: data.token_sold || 0, // Token sold from Backend (Crawler)
        campaignStatus: data?.campaign_status,
        poolStatus: data?.campaign_status, // alias of campaignStatus
        freeBuyTimeSetting: data?.freeBuyTimeSetting,

        preOrderUsers: data?.preOrderUsers,
        preOrderMinTier: data?.pre_order_min_tier,
        startPreOrderTime: data?.start_pre_order_time,

        listing_time: data?.listing_time,
        start_refund_time: data?.start_refund_time,
        end_refund_time: data?.end_refund_time,
        airdropNetwork: data?.airdrop_network,
        participantNumber: data.participant_number,
        remainingTokens: data.remaining_tokens,
        claimGuide: data.claim_guide,
        claimOnWebsiteTime: data.first_time_claim_phase,

        relationship_type: data.relationship_type,
        refund_term: data.refund_terms,
        token_price: data.token_price,
        display_token_price: data.display_token_price,
        isLocked: data.is_locked === 1,
        totalinitialCapitalization: data.total_imc,
        fullyDelutedValuation: data.fdv,
        initialCapitalization: data.imc_excl_liq,
        isTonDistribution: data?.is_custom_network,
        isCustomToken: data?.is_custom_token,
        customToken: data?.custom_token,
        isTonClaimLink: data?.is_claim_link,
        tonClaimLink: data?.external_claim_link,
        forbiddenCountries: data.forbidden_countries,
        hide_address: data.hide_address,
        is_custom_network: data.is_custom_network,
        custom_network_icon: data.custom_network_icon,
        custom_network_title: data.custom_network_title,
        external_refund_link: data.external_refund_link,
        poolIndex: data.pool_index,
        tiers: data.tiers,
        pool_display_version: data?.pool_display_version,
        claimableTokenAccount: data.claimable_token_account,
        refundableTokenAccount: data.refundable_token_account,
      };
    }

    return;
  }, [data, fetchPoolLoading, error, poolDetailDone, connectedAccountTier]);

  useEffect(() => {
    if (data) {
      setPoolDetailDone(true);
    }
  }, [data]);

  return {
    poolDetails,
    loading: fetchPoolLoading,
    poolDetailDone: poolDetailDone
  };
};

export default usePoolDetails;
