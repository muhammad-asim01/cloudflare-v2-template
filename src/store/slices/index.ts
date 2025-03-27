import { combineReducers } from "@reduxjs/toolkit";
import {
  connectorSlicer,
  appNetworkSlicer,
} from "@/store/slices/appNetworkSlice";
import claimUserInfoSlice from "@/store/slices/claimUserInfoSlice";
import messageSlice from "@/store/slices/messageSlice";
import userDataSlice from "@/store/slices/userDataSlice";
import solanaWalletSlice from "@/store/slices/solanaWalletSlice";
import { landingConfigSlicer } from "@/store/slices/landingConfigSlice";
import { createTokenSlicer, tokenSlicer } from "@/store/slices/tokenSilce";
import { alertSlicer } from "@/store/slices/alertSlice";
import userSlicer, { investorRegisterSlicer, investorSlicer, userConnectSlicer, userProfileSlicer, userProfileUpdateSlicer, userRegisterSlicer } from "@/store/slices/userSlice";
import {
  campaignsSlicer,
  campaignCreateSlicer,
  campaignDetailSlicer,
  campaignICORegisterSlicer,
  campaignAffiliateCreateSlicer,
  campaignErc20RateSetSlicer,
  campaignLatestSlicer,
  campaignEditSlicer,
  campaignStatusToggleSlicer,
  campaignRefundTokensSlicer,
  campaignProcessingSlicer,
  campaignLatestActiveSlicer,
} from "@/store/slices/campaignSlice";
import {
  getTiersReducer,
  getUserTierReducer,
  getUserInfoReducer,
  ratesReducer,
  depositReducer,
  withdrawReducer,
  withdrawFeeReducer,
  withdrawPercentReducer,
} from "@/store/slices/sota-tierSlice";
import { walletReducer } from "./walletSlice";


const rootReducer = combineReducers({
  // done slicer >>>>>>>>>>>>>>>>
  userData: userDataSlice,
  messages: messageSlice,
  claimUserInfo: claimUserInfoSlice,
  solanaWallet: solanaWalletSlice,
  appNetwork: appNetworkSlicer,
  connector: connectorSlicer,
  tokensByUser: tokenSlicer,
  tokenCreateByUser: createTokenSlicer,
  config: landingConfigSlicer,
  alert: alertSlicer,
  user: userSlicer,
  investor: investorSlicer,
  investorRegister: investorRegisterSlicer,
  userConnect: userConnectSlicer,
  userRegister: userRegisterSlicer,
  userProfile: userProfileSlicer,
  userProfileUpdate: userProfileUpdateSlicer,
  campaigns: campaignsSlicer,
  campaignProcessing: campaignProcessingSlicer,
  campaignCreate: campaignCreateSlicer,
  campaignEdit: campaignEditSlicer,
  campaignDetail: campaignDetailSlicer,
  campaignICORegister: campaignICORegisterSlicer,
  campaignAffiliateCreate: campaignAffiliateCreateSlicer,
  campaignErc20RateSet: campaignErc20RateSetSlicer,
  campaignLatest: campaignLatestSlicer,
  campaignLatestActive: campaignLatestActiveSlicer,
  campaignStatusToggle: campaignStatusToggleSlicer,
  campaignRefundTokens: campaignRefundTokensSlicer,
  tiers: getTiersReducer,
  userTier: getUserTierReducer,
  deposit: depositReducer,
  withdraw: withdrawReducer,
  userInfo: getUserInfoReducer,
  withdrawFee: withdrawFeeReducer,
  withdrawPercent: withdrawPercentReducer,
  rates: ratesReducer,
  wallet: walletReducer,

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
