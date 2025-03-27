"use client";

import { debounce, isNumber } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { USER_STATUS } from "@/constants";
import { ChainId } from "@/constants/network";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import useUserTier from "@/hooks/useUserTier";
import axios from "@/services/axios";
import {
  getTiers,
  getUserInfo,
  getUserTier,
} from "@/store/slices/sota-tierSlice";
import { getConfigHeader } from "@/utils/configHeader";
import { numberWithCommas } from "@/utils/formatNumber";
import classes from "@/styles/profile.module.scss";

import { useRouter, useSearchParams } from "next/navigation";
import AccountInformation from "@/components/AccountV2/AccountInformation";
import MyTiers from "@/components/AccountV2/MyTiers";
import MyPools from "@/components/AccountV2/MyPools";
import NeedHelp from "@/components/AccountV2/NeedHelp";
import Image from "next/image";

const iconWarning = "/assets/images/warning-red.svg";

export const menuMyAccount = [
  {
    name: "My Profile",
    icon: "/assets/images/account_v3/icons/icon_my_profile.svg",
  },
  {
    name: "My Tier",
    icon: "/assets/images/account_v3/icons/icon_my_tier.svg",
  },
  {
    name: "My Pools",
    icon: "/assets/images/account_v3/icons/icon_my_pools.svg",
  },
  // {
  //   name: "My Referrals",
  //   icon: "/assets/images/account_v3/icons/icon_my_ref.svg",
  // },
  {
    name: "Need Help",
    icon: "/assets/images/account_v3/icons/icon_need_help.svg",
  },
];
const DEFAULT_PROFILE = {
  email: "",
  twitter: "",
  telegram: "",
  solanaAddress: "",
  terraAddress: "",
  emailVeryfied: USER_STATUS.UNVERIFIED,
  isKYC: false,
  isLoadingKYC: false,
  createdAt: "",
};

const AccountV2 = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const history = useRouter()

  // Get a specific query parameter
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { isAuth, connectedAccount, wrongChain } = useAuth();

  const { data: kycData } = useFetch<any>(
    connectedAccount ? `/is-kyc-user/${connectedAccount}` : undefined
  );
  const currentTab = searchParams.get("tab");
  let currentTabIndex = currentTab ? parseInt(currentTab) : 0;
  currentTabIndex =
    currentTabIndex < menuMyAccount.length ? currentTabIndex : 0;

  const [userProfile, setUserProfile] = useState<null | {
    email: string;
    twitter: string;
    telegram: string;
    solanaAddress: string;
    terraAddress: string;
    emailVeryfied: number;
    isKYC: boolean;
    isLoadingKYC: boolean;
    createdAt: string;
  }>(DEFAULT_PROFILE);
  const [emailVerified, setEmailVeryfied] = useState(0);
  const [email, setEmail] = useState<string>("");
  const { data: appChainID } = useSelector((state: any) => state.appNetwork);
  const { total } = useUserTier(
    connectedAccount || "",
    "eth"
  );
  const [tabAccount] = useState(menuMyAccount);
  const [activeMenuAccount, setActiveMenuAccount] = useState(
    menuMyAccount[currentTabIndex].name
  );
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  const { data: userTier = 0 } = useSelector((state: any) => state.userTier);

  useEffect(() => {
    if (isAuth && connectedAccount && !wrongChain) {
      dispatch(getUserTier(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount, dispatch]);

  useEffect(() => {
    setUpdatedSuccess(false);
  }, [activeMenuAccount]);

  useEffect(() => {
    if (isAuth && !wrongChain) {
      getUserProfile();
    }
  }, [updatedSuccess]);

  useEffect(() => {
    const tabIndex = searchParams.get("tab");
    if (!tabIndex) return;
    const index = parseInt(tabIndex);
    if (!isNumber(index)) return;
    setActiveMenuAccount(menuMyAccount[index].name);
  }, [searchParams]);

  

  const selectTab = (name: any, index: any) => {
    // setActiveMenuAccount(name)
    history.push("/account?tab=" + index);
  };

  useEffect(() => {
    setUserProfile(DEFAULT_PROFILE);
    setEmail("");
    setEmailVeryfied(USER_STATUS.UNVERIFIED);
    getUserProfile();
  }, [connectedAccount]);

  const getUserProfile = useCallback(
    debounce(async () => {
      if (!connectedAccount) {
        return null;
      } else {
        const config = getConfigHeader(connectedAccount);
        const response = await axios.get(`/user/profile`, config);
        if (response?.data) {
          if (response.data.status === 200) {
            const user = response?.data?.data?.user;
            setEmail(user?.email);
            setEmailVeryfied(user?.status);
            setUserProfile({
              email: user?.email,
              emailVeryfied: user?.status,
              twitter: user?.user_twitter,
              telegram: user?.user_telegram,
              solanaAddress: user?.solana_address,
              terraAddress: user?.terra_address,
              isKYC: !!user?.is_kyc,
              isLoadingKYC: false,
              createdAt: user?.created_at,
            });
          } else {
            setUserProfile(DEFAULT_PROFILE);
            setEmail("");
            setEmailVeryfied(USER_STATUS.UNVERIFIED);
          }
        }
      }
    }, 200),
    [connectedAccount]
  );

  useEffect(() => {
    dispatch(getTiers());
    if (connectedAccount) {
     dispatch(getUserInfo(connectedAccount));
      dispatch(getUserTier(connectedAccount));
    }
  }, [connectedAccount, dispatch]);

  const totalRedKitePoints = userInfo?.totalStaked
    ? numberWithCommas(Number(userInfo?.totalStaked).toString() || "0")
    : "0";
  const pointsLeftToNextTier = userInfo?.totalStaked
    ? (tiers[userTier] - Number(userInfo?.totalStaked)).toString() || "0"
    : "0";

  return (
    <>
      <div className={classes.accountContainer}>
        {/* appChainID > KOVAN ID => Not Ethereum mainnet/testnet */}
        {+appChainID?.appChainID > ChainId.BSC_TESTNET &&
          kycData &&
          activeMenuAccount === "My Tier" && (
            <div
              className={`${classes.alertVerifyEmail} ${classes.errorSwich}`}
            >
              <Image width={20} height={20} src={iconWarning} style={{ marginRight: "12px" }} alt="" />
              <span>Please switch to the BSC network to Stake/Unstake</span>
            </div>
          )}

        {updatedSuccess && (
          <div className={classes.messageUpdateSuccess}>
            <Image width={20}
            height={20}
              src="/assets/images/account_v3/icons/icon_updated_success.svg"
              alt=""
            />
            Your profile has been updated successfully
          </div>
        )}

        <div className={classes.bodyContentMyAccount}>
          <div className={classes.leftAccount}>
            <nav className={classes.tabAccount}>
              {tabAccount.map((item, index) => {
                return (
                  <li
                    className={`${classes.itemTabAccount}  ${
                      activeMenuAccount === item.name ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => selectTab(item.name, index)}
                  >
                    {item.icon && <Image width={30} height={30} src={item?.icon} alt="" /> }
                    {item.name}
                  </li>
                );
              })}
            </nav>
          </div>

          <div className={classes.rightAccount}>
            {activeMenuAccount === "My Profile" && (
              <AccountInformation
                notEth={+appChainID?.appChainID > ChainId.BSC_TESTNET}
                classNamePrefix="account-infomation"
                userInfo={userInfo}
                userTier={userTier}
                email={email}
                twitter={userProfile?.twitter}
                telegram={userProfile?.telegram}
                solanaWallet={userProfile?.solanaAddress}
                terraWallet={userProfile?.terraAddress}
                emailVerified={emailVerified}
                setEmail={setEmail}
                setEmailVeryfied={setEmailVeryfied}
                isKYC={kycData}
                isLoadingKYC={userProfile?.isLoadingKYC}
                kycStatus={Number(kycData)}
                setUpdatedSuccess={setUpdatedSuccess}
              />
            )}

            {activeMenuAccount === "My Tier" && (
              <div className={classes.tier}>
                <MyTiers
                  showMoreInfomation={false}
                  total={total}
                  isKYC={kycData}
                  tiers={tiers}
                  userInfo={userInfo}
                  userTier={userTier}
                  emailVerified={emailVerified}
                  connectedAccount={connectedAccount}
                  totalRedKitePoints={totalRedKitePoints}
                  pointsLeftToNextTier={pointsLeftToNextTier}
                />
              </div>
            )}

            {activeMenuAccount === "My Pools" && (
              <MyPools
                // notEth={+appChainID?.appChainID > ChainId.KOVAN}
                // userTier={currentTier}
              />
            )}

            {activeMenuAccount === "Need Help" && <NeedHelp />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountV2;
