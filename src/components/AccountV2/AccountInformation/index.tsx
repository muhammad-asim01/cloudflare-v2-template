"use client";

import { useContext, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import ModalVerifyEmail from "../ModalVerifyEmail";
import { Button, TextField, Hidden } from "@mui/material";
import { ENABLE_SOLANA_POOLS, KYC_STATUS } from "@/constants";
import useWalletSignature from "@/hooks/useWalletSignature";
import axios from "@/services/axios";
import { useForm } from "react-hook-form";
import styles from "@/styles/accountInformation.module.scss";
import { ConnectorNames } from "@/constants/connectors";
import { AppContext } from "@/AppContext";
import { gTagEvent } from "@/services/gtag";
import { getConfigAuthHeader } from "@/utils/configHeader";
import SolanaWallet from "../SolanaWallet";
import SolanaWalletDisconnect from "@/components/Base/HeaderDefaultLayout/SolanaWalletDisconnect";
import { useAppKitAccount } from "@reown/appkit/react";

const allWallets = [
  {
    icon: "/assets/images/mainWalletImg.png",
    title: "Main Wallet Address",
    key: "MetaMask",
  },
];

export const startedSteps = [
  {
    id: 1,
    title: "Stake $CGPT for a Tier",
    content: "Stake CGPT to achieve a tier (Ape, Chad, Shark, Whale)",
    actionTitle: "Stake Now",
    img: "/assets/images/account_v3/icons/icon_share.svg",
    url: "/staking-pools?benefit=ido-only",
    completedText: "Stake for a tier",
  },
  {
    id: 2,
    title: "Complete a KYC",
    content: "Complete a KYC with DegenPad via Blockpass to access IDOs",
    actionTitle: "Enter KYC",
    img: "/assets/images/account_v3/icons/icon_user_completed.svg",
    url: "https://verify-with.blockpass.org/?clientId=degenpad_30b1f&serviceName=DegenPad&env=prod",
    completedText: "KYC",
  },
  {
    id: 3,
    title: "Register Interest For IDOs",
    content:
      "To participate in the first round (guaranteed) of any IDO you have to Register Interest, if you have a Ape tier you must participate in a Galxe event to earn allocation in a guaranteed round.",
    actionTitle: "How to join",
    img: "/assets/images/account_v3/icons/icon_reward.svg",
    url: "https://docs.chaingpt.org/the-ecosystem/degenpad",
  },
];

import common from "@/styles/commonstyle.module.scss";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

const AccountInformation = (props: any) => {
  const history = useRouter();
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const { connectedAccount } = useAuth();
  const [onEditProfile, setOnEditProfile] = useState(false);
  const { signature, signMessage } = useWalletSignature();
  const { address: account } = useAppKitAccount();
  const [disconnectDialog, setDisconnectDialog] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleDisconnectDialogOpen = () => {
    setDisconnectDialog(true);
  };

  const { logout: disconnectWallet } = useContext(AppContext);

  const handleKYC = () => {
    window.open(
      "https://verify-with.blockpass.org/?clientId=degenpad_30b1f&serviceName=DegenPad&env=prod",
      "_blank"
    );
  };

  const {
    email,
    setEmail,
    setEmailVeryfied,
    kycStatus,
    twitter,
    userInfo,
    telegram,
    setUpdatedSuccess,
    
    userTier,
    isKYC,
    isLoadingKYC,
  } = props;

  useEffect(() => {
    if (!connectedAccount) {
      setOnEditProfile(false);
    }
  }, [connectedAccount]);

  const { register,  formState: { errors }, handleSubmit } = useForm({
    mode: "onChange",
  });

  const onSetEditProfile = async () => {
    if (!signature) {
      await signMessage();
    } else {
      setOnEditProfile(true);
      setUpdatedSuccess(false);
    }
  };

  useEffect(() => {
    if (signature && connectedAccount) {
      setOnEditProfile(true);
      setUpdatedSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, connectedAccount]);

  const handleFormSubmit = async (data: any) => {
    if (signature) {
      // const config = {
      //   headers: {
      //     msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
      //   },
      // };

      const authConfig = getConfigAuthHeader(account);

      const response = (await axios.put(
        `/user/update-profile`,
        {
          signature,
          wallet_address: account,
          user_twitter: data?.twitter,
          user_telegram: data?.telegram,
        },
        authConfig as any
      )) as any;

      if (response.data) {
        if (response.data.status === 200) {
          setOnEditProfile(false);
          setUpdatedSuccess(true);
        }

        if (response.data.status !== 200) {
          toast.error(response.data.message);
        }
      }
    }
  };

  const renderErrorRequired = (errors: any, prop: string) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return "This field is required";
      }
    }
  };

  const renderWalletAddress = (key: string) => {
    let currentAddress;
    if (key === "MetaMask") {
      currentAddress = connectedAccount;
    }
    if (!currentAddress) {
      return null;
    }
    const firstSubString = currentAddress?.substring(0, 8);
    const lastSubString = currentAddress?.substring(
      currentAddress.length - 8,
      currentAddress.length
    );
    return firstSubString + "********" + lastSubString;
  };

  const handleAccountLogout = async () => {
    if (
      connectedAccount === ConnectorNames.WalletConnect &&
      localStorage.getItem("walletconnect")
    ) {
      localStorage.removeItem("walletconnect");
    }
    localStorage.removeItem("access_token");

    disconnectWallet && disconnectWallet();
    history.push("/");
  };

  const validKYC = userInfo?.totalStaked && userInfo?.totalStaked !== "0";

  const renderProfileHeader = () => {
    return (
      <div className={styles.headPage}>
        <h2 className={styles.title}>My profile</h2>
        {connectedAccount && !onEditProfile && isKYC && (
          <Hidden smDown>
            <Button
              variant="contained"
              className={styles.btnEditProfile}
              onClick={() => onSetEditProfile()}
            >
              <Image width={12} height={12} src="/assets/images/account_v3/icons/icon_edit.svg" alt="" />
              Edit Profile
            </Button>
          </Hidden>
        )}

        {connectedAccount &&
          onEditProfile &&
          kycStatus === KYC_STATUS.APPROVED && (
            <Hidden smDown>
              <div className={styles.footerPage}>
                <Button
                  form="hook-form"
                  type="submit"
                  variant="contained"
                  className={styles.btnUpdateProfile}
                  onClick={() => handleFormSubmit}
                >
                  UPDATE PROFILE
                </Button>
              </div>
            </Hidden>
          )}
      </div>
    );
  };

  const renderWallets = () => {
    return (
      <div className={styles.bodyPageLeft}>
        <div className={styles.titleLeft}>Wallet Addresses</div>
        <div className={styles.contentLeft}>
          Your wallets linked to DegenPad are listed below. <br />
          Click &quot;Edit Profile&quot; button to connect / disconnect the sub-wallets.
        </div>
        {allWallets.map((wallet, index) => {
          return (
            <div key={index} className={styles.walletForm}>
             {wallet?.icon && <Image width={24} height={24} src={wallet?.icon} alt="" />}
              <div className="wallet-address">
                <span>{wallet.title}</span>
                {wallet.key === "MetaMask" ? (
                  <span>{renderWalletAddress(wallet.key)}</span>
                ) : (
                  <span>{renderWalletAddress(wallet.key)}</span>
                )}
              </div>
              {onEditProfile &&
                (wallet.key === "MetaMask" ? (
                  <button
                    style={{ color: "#0066FF" }}
                    onClick={() => handleAccountLogout()}
                  >
                    Disconnect
                  </button>
                ) : (
                  <></>
                ))}
            </div>
          );
        })}
        {ENABLE_SOLANA_POOLS && (
          <SolanaWallet
            onEditProfile={onEditProfile}
            handleDisconnectDialogOpen={handleDisconnectDialogOpen}
            setWalletAddress={setWalletAddress}
            walletAddress={walletAddress}
          />
        )}
      </div>
    );
  };

  const renderInfomation = () => {
    return (
      <div className={styles.mainInfomation}>
        {connectedAccount && !onEditProfile && isKYC && (
          <Hidden smUp>
            <Button
              variant="contained"
              className={styles.btnEditProfile}
              onClick={() => onSetEditProfile()}
            >
              <Image width={12} height={12} src="/assets/images/account_v3/icons/icon_edit.svg" alt="" />
              Edit Profile
            </Button>
          </Hidden>
        )}

        {connectedAccount &&
          onEditProfile &&
          kycStatus === KYC_STATUS.APPROVED && (
            <Hidden smUp>
              <div className={styles.footerPage}>
                <Button
                  form="hook-form"
                  type="submit"
                  variant="contained"
                  className={styles.btnUpdateProfile}
                  onClick={() => handleFormSubmit}
                >
                  Update Profile
                </Button>
              </div>
            </Hidden>
          )}
        <div className={styles.titleLeft}>Account Information</div>

        <div className={styles.inputGroup}>
          <span className="title">KYC Status</span>
          {connectedAccount && (
            <div className="flex">
              {isLoadingKYC ? (
                <span>Loading...</span>
              ) : (
                <div>
                  {kycStatus === KYC_STATUS.APPROVED ? (
                    <span className="verified">Verified</span>
                  ) : (
                    <>
                      <span className="unverified">
                        Unverified
                        {validKYC && (
                          <button onClick={() => handleKYC()}>KYC NOW</button>
                        )}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {connectedAccount &&
          !isLoadingKYC &&
          kycStatus !== KYC_STATUS.APPROVED &&
          !validKYC && (
            <span className={common.nnn1424h}>
              You must stake to achieve DegenPad Tier before KYC.
            </span>
          )}
        {connectedAccount && kycStatus === KYC_STATUS.APPROVED && (
          <form id="hook-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className={styles.inputGroup}>
              <span className="title">Twitter ID</span>
              {connectedAccount && (
                <div className="accountContent">
                  {onEditProfile ? (
                    <div className={styles.groupInput}>
                      <TextField
                        className={styles.inputNewValue}
                        defaultValue={twitter}
                        placeholder="Enter Twitter ID. EX: DegenPad"
                        {...register("twitter", {
                          // required: true,
                          maxLength: {
                            value: 60,
                            message: "max 60 characters",
                          },
                        })}
                      />
                      <span className={styles.errorInput}>
                        {errors?.twitter && errors.twitter.type !== "required"
                          ? String(errors.twitter.message) 
                          : renderErrorRequired(errors, "twitter")}
                      </span>
                    </div>
                  ) : (
                    <span className={styles.nameSocial}>{twitter ?? "-"}</span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <span className="title">Telegram ID</span>
              {connectedAccount && (
                <div className="accountContent">
                  {onEditProfile ? (
                    <div className={styles.groupInput}>
                      <TextField
                        className={styles.inputNewValue}
                        defaultValue={telegram}
                        placeholder="Enter telegram ID. EX: DegenPad"
                        {...register("telegram", {
                          // required: true,
                          maxLength: {
                            value: 60,
                            message: "max 60 characters",
                          },
                        })}
                      
                      />
                      <span className={styles.errorInput}>
                        {errors.telegram && errors.telegram.type !== "required"
                          ? String(errors.telegram.message)
                          : renderErrorRequired(errors, "telegram")}
                      </span>
                    </div>
                  ) : (
                    <span>{telegram ?? "-"}</span>
                  )}
                </div>
              )}
            </div>
          </form>
        )}

        <div className={styles.inputGroup} style={{ marginBottom: 5 }}>
          <span></span>
          {connectedAccount && (
            <>
              <span style={{ color: "red", display: "inline-block" }}>
                {kycStatus === KYC_STATUS.RESUBMIT &&
                  "Please send information to info@chaingpt.org to resubmit KYC."}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderGettingStarted = () => {
    return (
      <>
        <div className={styles.title}>GETTING STARTED</div>
        <div className={styles.footerUnderTitle}>
          Here are 3 steps for you to start on DegenPad.
        </div>
        <div className={styles.startSteps}>
          {startedSteps.map((step) => {
            return (
              <div
                key={step.id}
                data-role="step"
                style={{ position: "relative" }}
              >
                {((step.id === 1 && Number(userTier) > 0) ||
                  (step.id === 2 && kycStatus === KYC_STATUS.APPROVED)) && (
                  <div className="completedOverlay">
                    <div className="completedOverlay__content">
                      <Image width={24} height={24} src="/assets/images/icons/success.svg" alt="" />
                      <span>COMPLETED</span>
                    </div>
                    <div>{step.completedText}</div>
                  </div>
                )}

                {step?.img && <Image width={48} height={48} src={step?.img} alt="" />}
                <div className="idStep">STEP {step.id}</div>
                <div className="titleStep">{step.title}</div>
                <div className="contentStep">{step.content}</div>
                <div className="actionStep">
                  {step.id !== 1 ? (
                    <a href={step.url} target="_blank" rel="noreferrer">
                      {step.actionTitle}
                    </a>
                  ) : (
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        if (step.id === 1) {
                          window.location.href = step.url;
                        } else if (step.id === 2) {
                          gTagEvent({
                            action: "kyc_started",
                            params: {
                              wallet_address: connectedAccount || "",
                            },
                          });
                          window.location.href = step.url;
                        }
                      }}
                    >
                      {step.actionTitle}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      {renderProfileHeader()}

      <div className={styles.bodyPage}>
        {renderWallets()}
        {renderInfomation()}
      </div>

      <div className={styles.lineBottom} />

      {renderGettingStarted()}

      <ModalVerifyEmail
        setOpenModalVerifyEmail={setOpenModalVerifyEmail}
        email={email}
        setEmail={setEmail}
        open={openModalVerifyEmail}
        setEmailVeryfied={setEmailVeryfied}
      />

      <SolanaWalletDisconnect
        opened={disconnectDialog}
        handleClose={() => {
          setDisconnectDialog(false);
        }}
        setWalletAddress={setWalletAddress}
      />
    </div>
  );
};

export default AccountInformation;
