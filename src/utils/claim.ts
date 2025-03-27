import {ethers} from 'ethers';
import BigNumber from 'bignumber.js';
import Pool_ABI from '../abi/PreSalePoolV2.json';
import { getContractInstanceWeb3 } from "../services/web3";
import moment from "moment";
import {formatRoundDown} from "./formatNumber";
import {POOL_STATUS, POOL_STATUS_JOINED} from "../constants";
import {
  getFirstClaimConfigTime,
  getLastClaimConfigTime,
} from "./getPoolCountDown";

// tokenDetails has format:
// const tokenDetails: TokenType = {
//   decimals: number;
//   symbol: string;
//   name: string;
//   address: string;
// }

// With ableToFetchFromBlockchain, please use code below:
// // Use for check whether pool exist in selected network or not
// const { isAuth, connectedAccount, wrongChain } = useAuth();
// const appNetwork = (()=>{
//   switch (appChainID) {
//     case BSC_CHAIN_ID:
//       return 'bsc';
//
//     case POLYGON_CHAIN_ID:
//       return 'polygon';
//
//     case ETH_CHAIN_ID:
//       return 'eth';
//   }
// })();
// const ableToFetchFromBlockchain = appNetwork === poolDetails?.networkAvailable && !wrongChain;


// With connector/appChainID, can use code below:
// const { appChainID } = useTypedSelector(state  => state.appNetwork).data;
// const connector  = useTypedSelector(state => state.connector).data;


export const getUserClaimInfoFromSmartContract = async (params: any) => {
  const {
    poolDetails,
    userAddress,
  } = params;

  const poolAddress = poolDetails.campaign_hash;
  const tokenDetails = {
    decimals: poolDetails.decimals,
    symbol: poolDetails.symbol,
    name: poolDetails.name,
    address: poolDetails.token,
  };

  try {
    if (userAddress && poolAddress && tokenDetails
      && ethers.utils.isAddress(userAddress)
      && ethers.utils.isAddress(poolAddress)
    ) {

      // const contract = getContractInstance(Pool_ABI, poolAddress, poolDetails?.network_available, appChainID, SmartContractMethod.Read);
      const web3Instance = getContractInstanceWeb3(poolDetails?.network_available);
      if (!web3Instance) {
        return {
          userPurchased: 0,
          userClaimed: 0,
          userPurchasedReturn: 0,
          tokenDecimals: tokenDetails.decimals,
        };
      }

      const contract = new web3Instance.eth.Contract(Pool_ABI as any, poolAddress);
      if (contract) {
        const userPurchased = await contract.methods.userPurchased(userAddress).call();
        const userClaimed = await contract.methods.userClaimed(userAddress).call();
        const userPurchasedReturn = new BigNumber(userPurchased as any).minus(new BigNumber(userClaimed as any)).div(new BigNumber(10).pow(tokenDetails.decimals)).toFixed();

        return {
          userPurchased: new BigNumber(userPurchased as any).div(new BigNumber(10).pow(tokenDetails.decimals)).toFixed(),
          userClaimed: new BigNumber(userClaimed as any).div(new BigNumber(10).pow(tokenDetails.decimals)).toFixed(),
          userPurchasedReturn,
        }
      }
      return {
        userPurchased: 0,
        userClaimed: 0,
        userPurchasedReturn: 0,
        tokenDecimals: tokenDetails.decimals,
      }
    }
  } catch (err) {
    console.log('getUserClaimInfoFromSmartContract', err);
  }
}

export const detectClaimConfigApplying = async (params: any) => {
  const {
    poolDetails,
    userPurchased,
    userClaimed,
  } = params;

  let currentClaim;
  let currentClaimIndex = 0;
  let nextClaim;
  let nextClaimIndex = 0;
  let maximumTokenClaimUtilNow = 0;
  // let detechCurrentPhaseInterval = undefined as any;

  if (poolDetails && poolDetails.campaignClaimConfig && poolDetails.campaignClaimConfig.length > 0) {
    const now = moment();
    const nowUnix = now.unix();
    let validRow: any = null;
    let validIndex = -1;
    for (let i = 0; i < poolDetails.campaignClaimConfig.length; i++) {
      const row = poolDetails.campaignClaimConfig[i];
      if (nowUnix < row.start_time) {
        break;
      } else {
        validRow = row;
        validIndex = i;
      }
    }

    if (validRow) {
      currentClaim = validRow;
      currentClaimIndex = validIndex;
      const next = poolDetails.campaignClaimConfig[validIndex + 1];

      if (next) {
        nextClaim = next;
        nextClaimIndex = validIndex + 1;
      }

      if (validIndex >= 0 && userPurchased && userClaimed) {
        let maximum: any = (new BigNumber(validRow?.max_percent_claim || 0).dividedBy(100).multipliedBy(userPurchased as any)).minus(userClaimed);
        maximum = new BigNumber(formatRoundDown(maximum));
        if (maximum.lt(0)) {
          maximumTokenClaimUtilNow = 0;
        } else {
          maximumTokenClaimUtilNow = maximum;
        }
      }
    }
  }

  return {
    currentClaim,
    currentClaimIndex,
    nextClaim,
    nextClaimIndex,
    maximumTokenClaimUtilNow,
  };
}

export const detechClaimablePhase = async (params: any) => {
  const {
    poolDetails,
    connectedAccount,
    connector,
    appChainID,
    appNetwork,
    wrongChain,
  } = params;

  const ableToFetchFromBlockchain = appNetwork === poolDetails?.network_available && !wrongChain;
  const userClaimInfo = await getUserClaimInfoFromSmartContract({
    poolDetails,
    userAddress: connectedAccount,
    ableToFetchFromBlockchain,
    connector,
    appChainID,
  });

  const userPurchased = userClaimInfo?.userPurchased || 0;
  const userPurchasedValue = userClaimInfo?.userPurchasedReturn || 0;
  const userClaimed = userClaimInfo?.userClaimed || 0;

  const {
    currentClaim,
    currentClaimIndex,
    nextClaim,
    nextClaimIndex,
    maximumTokenClaimUtilNow,
  } = await detectClaimConfigApplying({
    poolDetails,
    userPurchased,
    userClaimed
  });

  return {
    currentClaim,
    currentClaimIndex,
    nextClaim,
    nextClaimIndex,
    maximumTokenClaimUtilNow,
    userPurchased,
    userPurchasedValue,
    userClaimed,
  }
}

export const fillClaimInfo = async (params: any) => {
  let {
    listData,
    connectedAccount,
    connector,
    appChainID,
    appNetwork,
    wrongChain
  } = params;

  let poolWithStatus = listData;
  poolWithStatus = poolWithStatus.map(async (pool: any) => {

    pool.status = pool.campaign_status || pool.campaignStatus;
    const userClaimInfo: any = {
      show_claim_button: false,
      is_claimed_all_token: false,
      user_claimed: '0',
      user_purchased: '0',
      maximum_token_claim_util_now: '0',
      is_filled_claim: false,
    };

    const claimPhaseInfo = await detechClaimablePhase({
      poolDetails: pool,
      connectedAccount,
      connector,
      appChainID,
      appNetwork,
      wrongChain
    });
    const { maximumTokenClaimUtilNow, userPurchased, userClaimed } = claimPhaseInfo;
    userClaimInfo.user_claimed = userClaimed;
    userClaimInfo.user_purchased = userPurchased;
    userClaimInfo.maximum_token_claim_util_now = maximumTokenClaimUtilNow;

    if (pool.status == POOL_STATUS.CLAIMABLE || pool.joined_status == POOL_STATUS_JOINED.CLAIMABLE) {
      // Check pool is Filled or Claimable
      let isFilled = false;
      const nowTime = moment().unix();
      const endTime = pool.finish_time;
      const lastClaimConfigTime = getLastClaimConfigTime(pool);
      if (endTime < nowTime && nowTime < (lastClaimConfigTime || 0)) {
        isFilled = true;
        userClaimInfo.is_filled_claim = isFilled;
      }
      const releaseTime = parseInt(pool.release_time || 0);
      const availableClaim = releaseTime ? nowTime >= releaseTime : false;

      const firstClaimConfigTime = getFirstClaimConfigTime(pool);
      pool.claimPhaseInfo = {
        ...claimPhaseInfo,
        availableClaim,
        firstClaimConfigTime: firstClaimConfigTime,
        lastClaimConfigTime: lastClaimConfigTime,
      };

      if (new BigNumber(userPurchased).lte(0)) { // userPurchased <= 0
        // User don't buy anything
        userClaimInfo.show_claim_button = false;
      } else {
        // With userPurchased > 0: User must buy any token
        if (new BigNumber(userClaimed).gte(userPurchased)) { // userClaimed >= userPurchased
          // User claimed all own token
          userClaimInfo.show_claim_button = false;
        } else {  // userClaimed < userPurchased
          // Users have not claimed all the tokens
          if (new BigNumber(maximumTokenClaimUtilNow).lte(0)) { // maximumTokenClaimUtilNow <= 0
            userClaimInfo.show_claim_button = false;
            userClaimInfo.is_claimed_all_token = true;
          } else {  // maximumTokenClaimUtilNow > 0
            userClaimInfo.show_claim_button = true;
            userClaimInfo.is_claimed_all_token = false;
          }
        }
      }
    }
    pool.userClaimInfo = userClaimInfo;
    return pool;
  });
  listData = await Promise.all(poolWithStatus);
  return listData
};

