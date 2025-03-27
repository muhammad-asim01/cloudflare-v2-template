"use client";

import { Menu, MenuItem, MenuProps, styled } from "@mui/material";
import Skeleton from "@mui/lab/Skeleton";
import { isNumber } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../../AppContext";
import {
  ENABLE_GIVEAWAY_FEATURE,
  ENABLE_SOLANA_POOLS,
  TIERS,
} from "../../../constants";
import { APP_NETWORKS_SUPPORT } from "../../../constants/network";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import axios from "../../../services/axios";
import { getUserTier } from "../../../store/slices/sota-tierSlice";
import { trimMiddlePartAddress } from "../../../utils/accountAddress";
import { getConfigHeader } from "../../../utils/configHeader";
import ButtonLink from "../ButtonLink";
import { HeaderContext } from "./context/HeaderContext";
import SignRequiredModal from "./SignRequiredModal";
import styles from "@/styles/headerDefaultLayout.module.scss";
import Disclaimermodal from "./Disclaimermodal";
import { getCookie } from "../../../utils";
import { FormatWalletAddressDots } from "../../../utils/solana";
import useSolanaFlag from "../../../hooks/useSolanaFlag";
import Link from "next/link";
// import { menuMyAccount } from "@/app/AccountV2";
import { usePathname } from "next/navigation";


import Image from "next/image";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import AppNetworkSwitch from "./AppNetworkSwitch";
import { menuMyAccount } from "@/components/AccountV2";
import CustomImage from "../Image";

declare global {
  interface Window {
    solana?: any;
  }
}

const logo = "/assets/images/landing/logo.svg";
const iconClose = "/assets/images/icons/close.svg";
const iconHamburger = "/assets/images/icons/hamburger.svg";
const BnbIcon = "/assets/images/BNB.png";
interface MenuItem {
  id: number;
  menu_name: string;
  menu_url: string;
  type: string;
  icon_url: string;
  is_parent: number;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  children: MenuItem[];
}

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    minWidth: 236,
    color: "#1e1e1e",
    backgroundColor: "#F5F5F5",
    borderRadius: "2px",
    border: "1px solid #d9d9d9",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiList-padding": {
      padding: "0",
    },
    "& .MuiListItem-gutters": {
      padding: "14px 20px",
      font: "14px/24px   Violet Sans",
    },
    "& .MuiMenuItem-root": {
      borderBottom: "1px solid #d9d9d9",

      "&:last-child": {
        borderBottom: "0",
      },
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
      },
      "&:hover": {
        backgroundColor: "#d9d9d9",
      },
    },
  },
}));

type HeaderLinks = {
  [key: string]: string;
};

const LEARN_LINKS = [
  {
    menu_name: "Introduction & Overview",
    menu_url:
      "https://docs.chaingpt.org/the-ecosystem/degenpad/introduction-to-degenpad",
  },
  {
    menu_name: "Tier System & Staking",
    menu_url: "https://docs.chaingpt.org/the-ecosystem/degenpad/tier-system",
  },
  {
    menu_name: "Flexible Refund Policy",
    menu_url:
      "https://docs.chaingpt.org/the-ecosystem/degenpad/flexible-refund-policy",
  },
  {
    menu_name: "Frequently Asked Questions",
    menu_url: "https://docs.chaingpt.org/the-ecosystem/degenpad/degenpad-faqs",
  },
  {
    menu_name: "ChainGPT Incubation Program",
    menu_url: "https://www.chaingpt.org/blog/chaingpt-incubation-program",
  },
  {
    menu_name: "Documentation Page",
    menu_url: "https://docs.chaingpt.org/the-ecosystem/degenpad",
  },
];

export const HEADER_LINKS: HeaderLinks = {
  POOL: "/",
  STAKING: "/staking-pools",
  ACCOUNT: "/account",
  LEARN: "",
  GIVEAWAY: "/giveaway",
};

const defaultMenuItems = [
  {
    menu_name: "Launchpad",
    menu_url: "/",
    icon_url: "/assets/images/icon-rocket.svg",
  },
  {
    menu_name: "Staking",
    menu_url: "/staking-pools",
    icon_url: "/assets/images/icons/staking.svg",
  },
  { menu_name: "Learn", menu_url: "/", icon_url: "", children: LEARN_LINKS },
];

const HeaderDefaultLayout = () => {
  const { address } = useAppKitAccount();
  const { open: openAppKit } = useAppKit();

  const dispatch = useDispatch();
  const isSolanaEnable = useSolanaFlag();
  const pathname: string = usePathname();
  const isSolanaUrlPathMatch =
    pathname.includes("solana/") || pathname === "/account";
  const { refreshing } = useSelector((state: any) => state.tokensByUser);
  const configData = useSelector((store: any) => store?.config?.data);
  const MenuData: MenuItem[] = configData?.Menus;
  const headerMenus =
    MenuData && MenuData.length > 0
      ? MenuData?.filter((menu) => menu.type === "header")
      : defaultMenuItems;
  const attachments = configData?.attachments || [];
  const [switchNetworkDialog, setSwitchNetworkDialog] =
    useState<boolean>(false);
  const [disconnectDialog, setDisconnectDialog] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;

  const [openSideBar, setOpenSideBar] = useState(false);
  const { data: message = "" } = useSelector((state: any) => state.messages);
  const { data: userTier = 0 } = useSelector((state: any) => state.userTier);

  const [logoLoading, setLogoLoading] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorLearnMenu, setAnchorLearnMenu] = useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);
  const isOpenLearnMenu = Boolean(anchorLearnMenu);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [mobileOpenLearnMenu, setMobileOpenLearnMenu] =
    useState<boolean>(false);

  const [chainLogo, setChainLogo] = useState<string>(BnbIcon);
  const [chainName, setChainName] = useState<string>("BSC");
  const [chainCurrency, setChainCurrency] = useState<string>("BNB");
  const [isKyc, setIsKyc] = useState<boolean>(false);
  const [loadingIsKyc, setLoadingIsKyc] = useState<boolean>(true);
  const { isAuth, connectedAccount, wrongChain } = useAuth();

  // Solana
  const [solanaOpenWallet, setSolanaOpenWallet] = useState(false);
  const [solanaDisconnectDialog, setSolanaDisconnectDialog] =
    useState<boolean>(false);

  const [termsData, setTermsData] = useState<any>([]);

  useEffect(() => {
    try {
      const getTermsData = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/landing-page-json`
        );
        setTermsData(response?.data?.data?.TermsAndConditions);
      };

      getTermsData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (isAuth && connectedAccount) {
      dispatch(getUserTier(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount, dispatch]);

  const {
    handleProviderChosen,
    currentConnector,
    walletName,
    setWalletName,
    loginError,
    currentConnectedWallet,
    setCurrentConnectedWallet,
    setOpenConnectWallet,
    connectWalletLoading,
  } = useContext(AppContext);

  const { data: kycData } = useFetch<any>(
    connectedAccount ? `/is-kyc-user/${connectedAccount}` : undefined
  );

  useEffect(() => {
    const getUserProfile = async () => {
      const configHeader = getConfigHeader(connectedAccount);
      setLoadingIsKyc(true);
      const response = (await axios.get(`/user/profile`, configHeader)) as any;
      setLoadingIsKyc(false);

      if (response?.status && response.status === 200 && response.data) {
        setIsKyc(kycData);
      }
    };
    if (connectedAccount) {
      getUserProfile();
    }
  }, [connectedAccount]);

  const currentAccount = address;

  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const handleDisclaimerAccept = () => {
    setIsDisclaimerOpen(false);
    handleConnectWalletOpen();
  };

  const handleDisclaimerClose = () => {
    setIsDisclaimerOpen(false);
  };

  const handleDisclaimerOpen = () => {
    setIsDisclaimerOpen(true);
  };

  const handleConnectWalletOpen = () => {
    if (setOpenConnectWallet) {
      setOpenConnectWallet(true);
    }
  };

  const handleDisconnectDialogOpen = () => {
    setDisconnectDialog(true);
    setOpenSideBar(false);
  };

  const handleSolanaConnectWalletOpen = () => {
    setSolanaOpenWallet(true);
  };

  const handleSolanaDisconnectDialogOpen = () => {
    setSolanaDisconnectDialog(true);
    setOpenSideBar(false);
  };

  useEffect(() => {
    const networkInfo = APP_NETWORKS_SUPPORT[Number(appChainID)];
    if (!networkInfo) {
      return;
    }

    setChainLogo(networkInfo.icon || BnbIcon);
    setChainName(networkInfo?.networkName || networkInfo?.name || "BSC");
    setChainCurrency(networkInfo.currency || "BNB");
  }, [appChainID]);

  const getClassActive = (path: string) => {
    if (path !== pathname) return "";
    return styles.linkActived;
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (isMobile) setMobileOpen((prev) => !prev);
  };
  const openLearnMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorLearnMenu(event.currentTarget);
    if (isMobile) setMobileOpenLearnMenu((prev) => !prev);
  };
  const handleClose = (index: number) => {
    setAnchorEl(null);
    isNumber(index) && window.location.replace("/account?tab=" + index);
  };

  const handleCloseLearnMenu = (index: number) => {
    setAnchorLearnMenu(null);
    if (isNumber(index)) {
      const newWindow = window.open(LEARN_LINKS[index].menu_url, "_blank");
      if (newWindow) {
        newWindow.focus();
      }
    }
  };

  const renderMyAccount = () => {
    return (
      currentAccount && (
        <div className={styles.myAccount}>
          {!!TIERS[userTier] ? (
            <span className={styles.currentAccount}>
              <span>&nbsp;{TIERS[userTier]?.name}</span>
              {TIERS[userTier]?.icon && <Image width={20} height={20} src={TIERS[userTier]?.icon} alt="" />}
            </span>
          ) : (
            <Skeleton
              className={styles.skeleton}
              variant="rectangular"
              width={200}
              height={36}
            />
          )}

          {isMobile ? (
            <>
              <div className={styles.headerMobileWallet}>
                {connectedAccount && (
                  <span className={styles.profileimage} onClick={handleClick}>
                    <Image
                      width={17}
                      height={17}
                      src="/assets/images/account_v3/icons/icon_my_profile.svg"
                      alt=""
                    />
                  </span>
                )}
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  {menuMyAccount.map((item, index) => {
                    return (
                      <MenuItem
                        key={index}
                        style={{ fontFamily: "  Violet Sans" }}
                        onClick={() => handleClose(index)}
                        disableRipple
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </StyledMenu>
              </div>
            </>
          ) : (
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {menuMyAccount.map((item, index) => {
                return (
                  <MenuItem
                    key={index}
                    style={{ fontFamily: "  Violet Sans" }}
                    onClick={() => handleClose(index)}
                    disableRipple
                  >
                    {item.name}
                  </MenuItem>
                );
              })}
            </StyledMenu>
          )}
        </div>
      )
    );
  };

  const renderButtonPool = () => {
    const poolData =
      headerMenus && headerMenus.length > 0
        ? headerMenus[0]
        : defaultMenuItems[0];
    return (
      <ButtonLink
        text={poolData.menu_name}
        icon={poolData.icon_url}
        to={poolData.menu_url}
        className={`${styles.btnHeader} ${getClassActive(HEADER_LINKS.POOL)}`}
        onClick={() => {
          const el = document.getElementById("launchpad");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    );
  };
  const renderButtonStaking = () => {
    const stakingData =
      headerMenus && headerMenus.length > 1
        ? headerMenus[1]
        : defaultMenuItems[1];
    return (
      <ButtonLink
        text={stakingData.menu_name}
        icon={stakingData.icon_url}
        to={stakingData.menu_url}
        className={`${styles.btnHeader} ${getClassActive(
          HEADER_LINKS.STAKING
        )}`}
      />
    );
  };
  const renderButtonLearn = () => {
    const learnData =
      headerMenus && headerMenus.length > 2
        ? headerMenus[2]
        : defaultMenuItems[2];
    return (
      <div className={styles.learnBtn}>
        <a onClick={openLearnMenu} className={styles.btnHeader}>
          <p>
            <span>{learnData?.menu_name}</span>
          </p>
          <Image
            width={17}
            height={17}
            src="/assets/images/icons/arrow-down.svg"
            alt=""
          />
        </a>
        {isMobile ? (
          mobileOpenLearnMenu && (
            <div className={styles.menuLearnMobile}>
              {learnData?.children?.map((item, index: number) => {
                return (
                  <a
                    key={index}
                    href={item?.menu_url}
                    target={"_blank"}
                    rel="noreferrer nofollow"
                  >
                    {item?.menu_name}
                  </a>
                );
              })}
            </div>
          )
        ) : (
          <StyledMenu
            id="learn-menu"
            MenuListProps={{
              "aria-labelledby": "learn-menu-button",
            }}
            anchorEl={anchorLearnMenu}
            open={isOpenLearnMenu}
            onClose={handleCloseLearnMenu}
          >
            {learnData?.children?.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  href={item?.menu_url}
                  target={"_blank"}
                  style={{ fontFamily: "  Violet Sans" }}
                  onClick={() => handleCloseLearnMenu(index)}
                  disableRipple
                >
                  {item?.menu_name}
                </MenuItem>
              );
            })}
          </StyledMenu>
        )}
      </div>
    );
  };

  const renderButtonGiveAway = () => {
    const giveawayData =
      headerMenus && headerMenus.length > 3
        ? headerMenus[3]
        : defaultMenuItems[3];
    return (
      <ButtonLink
        text={giveawayData?.menu_name}
        to={giveawayData?.menu_url}
        className={`${styles.btnGiveAway} ${styles.btnHeader} ${getClassActive(
          HEADER_LINKS.GIVEAWAY
        )}`}
      />
    );
  };

  const renderButtonNetwork = () => {
    return (
      <div
        style={{
          borderLeft: isMobile ? "none" : "1px solid #d9d9d9",
          height: "60px",
          display: "flex",
          alignItems: "center",
          width: isMobile ? "100%" : "",
        }}
      >
        <button
          className={styles.grayBtn}
          onClick={() => {
            openAppKit({view: 'Networks'})
            setOpenSideBar(false);
          }}
        >
          {" "}
          <div>
            <Image width={20} height={20} src={`${chainLogo}`} alt="" />
          </div>
        </button>
      </div>
    );
  };

  const renderButtonConnect = () => {
    return (
      <>
        <button
          className={!currentAccount ? styles.btnGradient : styles.btnConnected}
          onClick={() => {
            const isFirstWalletConnected = (() => {
              const storedDisclaimerId = getCookie("disclaimer_id");
              const firstWalletConnected =
                getCookie("firstWalletConnected") || "false";
              return (
                storedDisclaimerId === termsData?.id?.toString() &&
                JSON.parse(firstWalletConnected)
              );
            })();

            if (!currentAccount) {
              if (!isFirstWalletConnected) {
                openAppKit({ view: "Connect" });
              } else {
                openAppKit({ view: "Connect" });
              }
            } else {
              openAppKit({ view: "Account" });
            }
          }}
          disabled={connectWalletLoading}
        >
          <>
            <span
              className={
                currentAccount ? styles.btnAccount : styles.btnConnectText
              }
            >
              {(currentAccount && `${trimMiddlePartAddress(currentAccount)}`) ||
                "Connect Wallet"}
            </span>
          </>
        </button>

        {!isMobile && (
          <div className={styles.headerMobileWallet}>
            {connectedAccount && (
              <span className={styles.profileimage} onClick={handleClick}>
                <Image
                  width={17}
                  height={17}
                  src="/assets/images/account_v3/icons/icon_my_profile.svg"
                  alt=""
                />
              </span>
            )}
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {menuMyAccount.map((item, index) => {
                return (
                  <MenuItem
                    key={index}
                    style={{ fontFamily: "  Violet Sans" }}
                    onClick={() => handleClose(index)}
                    disableRipple
                  >
                    {item.name}
                  </MenuItem>
                );
              })}
            </StyledMenu>
          </div>
        )}
      </>
    );
  };

  const renderError = () => {
    return (
      <>
        {loginError && isKyc && (
          <div className={styles.loginErrorBanner}>
            <div className={styles.loginErrorBannerText}>
              <Image width={20} height={20}
                src="/assets/images/red-warning.svg"
                alt="red-warning icon"
                className={styles.iconWarning}
              />
              {loginError} Learn how to &nbsp;
              <a
                href="https://help.1inch.exchange/en/articles/4966690-how-to-use-1inch-on-bsc-binance-smart-chain"
                target="_blank"
                className={styles.loginErrorGuide}
                rel="noreferrer nofollow"
              >
                change network in wallet
              </a>
              &nbsp; or &nbsp;
              {message !==
                "Network for this pool is not yet available. Thank you for your patience." && (
                <button
                  className={styles.btnChangeAppNetwork}
                  onClick={() => {
                    setOpenSideBar(false);
                    setSwitchNetworkDialog(true);
                  }}
                >
                  Change App Network
                </button>
              )}
            </div>
          </div>
        )}
        {window.location.href.indexOf("buy-token") > -1 &&
          !loginError &&
          message !== "" && (
            <div className={styles.loginErrorBanner}>
              <span className={styles.loginErrorBannerText}>
                <Image width={20} height={20}
                  src="/assets/images/red-warning.svg"
                  alt="red-warning icon"
                  className={styles.iconWarning}
                />
                {message}&nbsp;&nbsp;
                {message !==
                  "Network for this pool is not yet available. Thank you for your patience." && (
                  <button
                    className={styles.btnChangeAppNetwork}
                    onClick={() => {
                      setOpenSideBar(false);
                      setSwitchNetworkDialog(true);
                    }}
                  >
                    Change App Network
                  </button>
                )}
              </span>
            </div>
          )}
      </>
    );
  };

  const renderMenuButtons = () => {
    return headerMenus.map((menu, index) => {
      if (menu.children && menu.children.length > 0) {
        return (
          <div
            className={`${styles.learnBtn} ${
              !menu?.children.length && menu?.menu_url == pathname
                ? styles.linkActived
                : ""
            }`}
            key={index}
          >
            <a onClick={openLearnMenu} className={styles.btnHeader}>
              <p>
                <span>{menu.menu_name}</span>
              </p>
              <Image
                width={17}
                height={17}
                src="/assets/images/icons/arrow-down.svg"
                alt=""
              />
            </a>
            {isMobile ? (
              mobileOpenLearnMenu && (
                <div className={styles.menuLearnMobile}>
                  {menu.children.map((item, childIndex) => (
                    <a
                      key={childIndex}
                      href={item.menu_url}
                      target="_blank"
                      rel="noreferrer nofollow"
                    >
                      {item.menu_name}
                    </a>
                  ))}
                </div>
              )
            ) : (
              <StyledMenu
                id="learn-menu"
                MenuListProps={{ "aria-labelledby": "learn-menu-button" }}
                anchorEl={anchorLearnMenu}
                open={isOpenLearnMenu}
                onClose={handleCloseLearnMenu}
              >
                {menu.children.map((item, childIndex) => (
                  <MenuItem
                    key={childIndex}
                    href={item.menu_url}
                    target="_blank"
                    style={{ fontFamily: "  Violet Sans" }}
                    onClick={() => {
                      window.open(item.menu_url, "_blank");
                    }}
                    disableRipple
                  >
                    {item.menu_name}
                  </MenuItem>
                ))}
              </StyledMenu>
            )}
          </div>
        );
      } else {
        return (
          <ButtonLink
            key={index}
            text={menu.menu_name}
            icon={menu.icon_url}
            to={menu.menu_url}
            className={`${styles.btnHeader} ${
              menu?.menu_url === pathname ? styles.linkActived : ""
            }`}
            onClick={() => {
              if (menu.menu_name === "Launchpad") {
                const el = document.getElementById("launchpad");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        );
      }
    });
  };


  const renderHeader = () => {
    return (
      <>
        <Link
        prefetch href={"/"} className={styles.navbarLogo}>
          {logoLoading && (
            <Skeleton
              className={styles.skeleton}
              variant="rectangular"
              width={103}
              height={38}
            />
          )}

<CustomImage
            className={styles.navBarHeaderLogo}
              src={
                '/assets/images/landing/logo.svg'
                // attachments.find(
                //   (item: any) => item.pivot.attachment_purpose === "header_logo"
                // )?.file_url
                //   ? attachments.find(
                //       (item: any) =>
                //         item.pivot.attachment_purpose === "header_logo"
                //     )?.file_url
                //   : logo
              }
              // style={logoLoading ? { display: "none" } : {}}
              // onLoad={() => setLogoLoading(false)}
              alt="degenpad logo"
              unoptimized={false}
              width={86}
              height={26}
              defaultImage={
                "/assets/images/defaultImages/image-placeholder.png"
              }
            />
        
        </Link>
        {renderMenuButtons()}
        {ENABLE_GIVEAWAY_FEATURE && renderButtonGiveAway()}
        <div className={styles.spacer}></div>
        {renderMyAccount()}
        {renderButtonNetwork()}
        {renderButtonConnect()}
      </>
    );
  };

  const renderHeaderMobile = () => {
    return (
      <>
        <div style={{ height: 30 }}>
          <Link
          prefetch href={"/"} className={styles.navbarLink}>
            {logoLoading && (
              <Skeleton
                className={styles.skeleton}
                variant="rectangular"
                width={103}
                height={38}
              />
            )}
            <Image width={86} height={26}
              src={
                // attachments.find(
                //   (item: any) => item.pivot.attachment_purpose === "header_logo"
                // )?.file_url
                //   ? attachments.find(
                //       (item: any) =>
                //         item.pivot.attachment_purpose === "header_logo"
                //     )?.file_url
                //   : logo
                '/assets/images/landing/logo.svg'
              }
              // onLoad={() => setLogoLoading(false)}
              // style={logoLoading ? { display: "none" } : {}}
              alt=""
            />
          </Link>
        </div>
        <div className={styles.rightHeadMobile}>
          {currentAccount &&
            !window?.solana?.publicKey &&
            ENABLE_SOLANA_POOLS &&
            isSolanaEnable &&
            isSolanaUrlPathMatch && (
              <button
                className={styles.btnGradient}
                onClick={() => {
                  handleSolanaConnectWalletOpen();
                }}
              >
                <>
                  <span className={styles.btnConnectText}>Connect Phantom</span>
                </>
              </button>
            )}
          {!window?.solana?.publicKey && (
            <button
              className={
                !currentAccount
                  ? `${styles.btnGradient} ${styles.btnTab}`
                  : `${styles.btnConnected} ${styles.btnConmob}`
              }
              onClick={() => {
                if (!connectWalletLoading) {
                  !currentAccount
                    ? handleConnectWalletOpen()
                    : handleDisconnectDialogOpen();
                }
              }}
              disabled={connectWalletLoading}
            >
              <>
                <span
                  className={
                    currentAccount
                      ? `${styles.btnAccount} ${styles.btnAccmob}`
                      : styles.btnConnectText
                  }
                >
                  {(currentAccount &&
                    `${trimMiddlePartAddress(currentAccount, 3)}`) ||
                    "Connect Wallet"}
                </span>
              </>
            </button>
          )}
          {window?.solana?.publicKey && !connectedAccount && (
            <button
              className={
                !currentAccount
                  ? `${styles.btnGradient} ${styles.btnTab}`
                  : `${styles.btnConnected} ${styles.btnConmob}`
              }
              onClick={() => {
                if (!connectWalletLoading) {
                  !currentAccount
                    ? handleConnectWalletOpen()
                    : handleDisconnectDialogOpen();
                }
              }}
              disabled={connectWalletLoading}
            >
              <>
                <span
                  className={
                    currentAccount
                      ? `${styles.btnAccount} ${styles.btnAccmob}`
                      : styles.btnConnectText
                  }
                >
                  {(currentAccount &&
                    `${trimMiddlePartAddress(currentAccount, 3)}`) ||
                    "Connect Wallet"}
                </span>
              </>
            </button>
          )}
          {window?.solana?.publicKey && currentAccount && (
            <>
              {!isSolanaUrlPathMatch ? (
                <button
                  className={
                    !currentAccount
                      ? `${styles.btnGradient} ${styles.btnTab}`
                      : `${styles.btnConnected} ${styles.btnConmob}`
                  }
                  onClick={() => {
                    if (!connectWalletLoading) {
                      !currentAccount
                        ? handleConnectWalletOpen()
                        : handleDisconnectDialogOpen();
                    }
                  }}
                  disabled={connectWalletLoading}
                >
                  <>
                    <span
                      className={
                        currentAccount
                          ? `${styles.btnAccount} ${styles.btnAccmob}`
                          : styles.btnConnectText
                      }
                    >
                      {(currentAccount &&
                        `${trimMiddlePartAddress(currentAccount, 3)}`) ||
                        "Connect Wallet"}
                    </span>
                  </>
                </button>
              ) : (
                <div className={styles.d_flex} style={{ marginRight: "8px" }}>
                  <div
                    className={styles.conntectwallet_btn}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                      // border: "1px solid #353539",
                      padding: "8px",
                      gap: "10px",
                      // borderTopLeftRadius: "5px",
                      // borderBottomRightRadius: "5px",
                      cursor: "pointer",
                      clipPath:
                        "polygon(0 8px,8px 0,calc(100% - 0px) 0,100% 20px,100% calc(100% - 8px),calc(100% - 8px) 100%,20px 100%,0 calc(100% - 0px))",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#fff",
                        gap: "5px",
                        borderRight: "1px solid #353539",
                      }}
                      onClick={() => {
                        if (!connectWalletLoading) {
                          !currentAccount
                            ? handleConnectWalletOpen()
                            : handleSolanaDisconnectDialogOpen();
                        }
                      }}
                    >
                      <Image
                        src="/assets/images/phantom-circle.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                      <span
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        {window?.solana?.publicKey &&
                          FormatWalletAddressDots(window?.solana?.publicKey, 3)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#fff",
                        gap: "5px",
                      }}
                      onClick={() => {
                        if (!connectWalletLoading) {
                          !currentAccount
                            ? handleConnectWalletOpen()
                            : handleDisconnectDialogOpen();
                        }
                      }}
                    >
                      <Image
                        src="/assets/images/metamask.svg"
                        alt=""
                        width={20}
                        height={20}
                      />
                      <span>
                        {currentAccount &&
                          trimMiddlePartAddress(currentAccount, 3)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <Image width={24} height={24}
            style={{ marginLeft: "8px" }}
            src={iconHamburger}
            onClick={() => setOpenSideBar(true)}
            alt=""
          />
        </div>
        <div className={styles.rightBar + (openSideBar ? " active" : "")}>
          <div className="mobihead">
            <Image width={86} height={26} src={logo} className={styles.sideBarLogo} alt="logo" />
            <Image
            width={24}
            height={24}

              src={iconClose}
              className={styles.closeBtn}
              onClick={() => setOpenSideBar(false)}
              alt="icon"
            />
          </div>
          {renderButtonPool()}
          {renderButtonStaking()}
          {renderButtonLearn()}
          {ENABLE_GIVEAWAY_FEATURE && renderButtonGiveAway()}
          {renderMyAccount()}

          {renderButtonNetwork()}
          {renderButtonConnect()}
        </div>
      </>
    );
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.navBar}>
          {isMobile ? renderHeaderMobile() : renderHeader()}
        </div>
      </div>

      <HeaderContext.Provider value={{ agreedTerms, setAgreedTerms }}>
        <Disclaimermodal
          opened={isDisclaimerOpen}
          handleClose={handleDisclaimerClose}
          handleDisclaimerAccept={handleDisclaimerAccept}
        />
           <AppNetworkSwitch
          opened={switchNetworkDialog}
          handleClose={() => setSwitchNetworkDialog(false)}
        />
        <SignRequiredModal opened={refreshing} />
      </HeaderContext.Provider>

      {renderError()}
    </>
  );
};

export default HeaderDefaultLayout;
