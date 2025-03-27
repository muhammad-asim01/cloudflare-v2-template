'use client'
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  SOLANA_STEPS,
  StepperAccount,
  StepperButton,
  StepperDropdownHeading,
  StepperHeading,
  StepperImage,
  StepperProgress,
  StepperSecondaryHeading,
} from "./utils";
import Button from "../Button";
import { isMobile } from "react-device-detect";
import { LinearProgress } from "@mui/material";
import { trimMiddlePartAddress } from "@/utils/accountAddress";
import { FormatWalletAddress } from "@/utils/solana";
import { APP_NETWORKS_SUPPORT } from "@/constants/network";
import { useTypedSelector } from "@/hooks/useTypedSelector";
const BnbIcon = "/assets/images/BNB.png";
import styles from '@/styles/tonConnectWalletStepper.module.scss'
import Image from "next/image";


export default function ConnectWalletStepper({
  claimToken,
  refundToken,
  handleConnectWalletOpen,
  handleSolanaConnectWalletOpen,
  setCurrentStep,
  currentStep,
  connectWalletLoading
}: any) {
  const { connectedAccount } = useAuth();
  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;

  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [hasButton, setHasButton] = useState(false);
  const [hasProgressBar, setHasProgressBar] = useState(false);
  const [hasSecondaryHeading, setHasSecondaryHeading] = useState(false);
  const [hasDropDown, setHasDropDown] = useState(false);
  const [dropdownHeader, setDropdownHeader] = useState("");
  const [dropdownItem1Header, setDropdownItem1Header] = useState("");
  const [dropdownItem2Header, setDropdownItem2Header] = useState("");
  const [isDropdown1WithIcon, setIsDropdown1WithIcon] = useState(false);
  const [isDropdown2WithIcon, setIsDropdown2WithIcon] = useState(false);
  const [account1, setAccount1] = useState(StepperAccount.METAMASK);
  const [account2, setAccount2] = useState(StepperAccount.METAMASK);

  useEffect(() => {
    switch (currentStep) {
      case SOLANA_STEPS.CONNECT_METAMASK:
        setButtonDisabled(connectWalletLoading);
        return;

      case SOLANA_STEPS.CONNECT_PHANTOM:
        setButtonDisabled(connectWalletLoading);
        return;

      default:
        setButtonDisabled(false);
        return;
    }
  }, [
    currentStep,
    connectWalletLoading,
    refundToken,
    claimToken,
  ]);

  useEffect(() => {
    switch (currentStep) {
      case SOLANA_STEPS.CONNECT_METAMASK:
        setButtonLoading(connectWalletLoading);
        return;

      case SOLANA_STEPS.CONNECT_PHANTOM:
        setButtonLoading(connectWalletLoading);
        return;

      default:
        setButtonLoading(false);
    }
  }, [currentStep, connectWalletLoading]);

  useEffect(() => {
    switch (currentStep) {
      case SOLANA_STEPS.CONNECT_METAMASK:
        setDropdownItem1Header(StepperDropdownHeading.solanaWallet);
        return;

      case SOLANA_STEPS.METAMASK_SUCCESS:
        setDropdownItem1Header(StepperDropdownHeading.solanaWallet);
        return;

      case SOLANA_STEPS.CONNECT_PHANTOM:
        setDropdownItem1Header("");
        return;

      case SOLANA_STEPS.PHANTOM_SUCCESS:
        setDropdownItem1Header("");
        return;
    }
  }, [currentStep]);

  useEffect(() => {
    switch (currentStep) {
      case SOLANA_STEPS.CONNECT_METAMASK:
        setAccount1(StepperAccount.NONE);
        setAccount2(StepperAccount.NONE);
        return;

      case SOLANA_STEPS.METAMASK_SUCCESS:
        setAccount1(StepperAccount.METAMASK);
        setAccount2(StepperAccount.NONE);
        return;

      case SOLANA_STEPS.CONNECT_PHANTOM:
        setAccount1(StepperAccount.METAMASK);
        setAccount2(StepperAccount.NONE);
        return;

      case SOLANA_STEPS.PHANTOM_SUCCESS:
        setAccount1(StepperAccount.METAMASK);
        setAccount2(StepperAccount.PHANTOM);
        return;
    }
  }, [currentStep]);

  useEffect(() => {
    switch (currentStep) {
      case SOLANA_STEPS.CONNECT_METAMASK:
        setIsDropdown1WithIcon(false);
        setIsDropdown2WithIcon(false);
        return;

      case SOLANA_STEPS.METAMASK_SUCCESS:
        setIsDropdown1WithIcon(false);
        setIsDropdown2WithIcon(false);
        return;

      case SOLANA_STEPS.CONNECT_PHANTOM:
        setIsDropdown1WithIcon(true);
        setIsDropdown2WithIcon(false);
        return;

      case SOLANA_STEPS.PHANTOM_SUCCESS:
        setIsDropdown1WithIcon(true);
        setIsDropdown2WithIcon(false);
        return;
    }
  }, [currentStep]);

  useEffect(() => {
    switch (currentStep) {
      case SOLANA_STEPS.CONNECT_METAMASK:
        setDropdownHeader(StepperDropdownHeading.mainWallet);
        return;

      case SOLANA_STEPS.METAMASK_SUCCESS:
        setDropdownHeader(StepperDropdownHeading.mainWallet);
        return;

      case SOLANA_STEPS.CONNECT_PHANTOM:
        setDropdownHeader(StepperDropdownHeading.solanaWallet);
        return;

      case SOLANA_STEPS.PHANTOM_SUCCESS:
        setDropdownHeader(StepperDropdownHeading.solanaWallet);
        return;
    }
  }, [currentStep]);

  useEffect(() => {
    setHasButton(currentStep !== SOLANA_STEPS.COMPLETED);
  }, [currentStep]);

  useEffect(() => {
    setHasProgressBar(currentStep !== SOLANA_STEPS.START);
  }, [currentStep]);

  useEffect(() => {
    setHasDropDown(
      currentStep !== SOLANA_STEPS.START &&
        currentStep !== SOLANA_STEPS.COMPLETED
    );
  }, [currentStep]);

  useEffect(() => {
    setHasSecondaryHeading(
      currentStep === SOLANA_STEPS.COMPLETED ||
        currentStep === SOLANA_STEPS.METAMASK_SUCCESS ||
        currentStep === SOLANA_STEPS.PHANTOM_SUCCESS
    );
  }, [currentStep]);

  const [chainLogo, setChainLogo] = useState<String>(BnbIcon);

  useEffect(() => {
    const networkInfo = APP_NETWORKS_SUPPORT[Number(appChainID)];
    if (!networkInfo) {
      return;
    }

    setChainLogo(networkInfo.icon || BnbIcon);
  }, [appChainID]);

  useEffect(() => {
    if (!connectedAccount && !window?.solana?.publicKey) {
      setCurrentStep(SOLANA_STEPS.START);
    }
    if (!connectedAccount && window?.solana?.publicKey) {
      setCurrentStep(SOLANA_STEPS.START);
    } else if (
      connectedAccount &&
      !window?.solana?.publicKey
    ) {
      setCurrentStep(SOLANA_STEPS.CONNECT_PHANTOM);
    } else if (connectedAccount && !window?.solana?.publicKey) {
      setCurrentStep(SOLANA_STEPS.METAMASK_SUCCESS);
    } else if (connectedAccount && window?.solana?.publicKey) {
      setCurrentStep(SOLANA_STEPS.COMPLETED);
    } else if (connectedAccount && window?.solana?.publicKey) {
      setCurrentStep(SOLANA_STEPS.COMPLETED);
    } else if (!connectedAccount && window?.solana?.publicKey) {
      setCurrentStep(SOLANA_STEPS.START);
    } else {
      setCurrentStep(SOLANA_STEPS.START);
    }
  }, [connectedAccount, window?.solana?.publicKey]);

  return (
    <div className={styles.stepperContainer}>
      {currentStep !== SOLANA_STEPS.COMPLETED && (
        <p className={styles.stepperHeading}>{StepperHeading[currentStep]}</p>
      )}
      {currentStep === SOLANA_STEPS.COMPLETED && (
        <div className={styles.closeIcon}>
          <p className={styles.stepperHeading}>{StepperHeading[currentStep]}</p>
          <Image
          width={23}
          height={23}
            className={styles.iconToken}
            src={"/assets/images/solana/icons/close.svg"}
            alt="CGPT Connect wallet"
            onClick={() => setCurrentStep(SOLANA_STEPS.NONE)}
          />
        </div>
      )}
      {hasProgressBar && (
        <div className={styles.progressBar}>
          <ProgressBar
            value={
              StepperProgress &&
              StepperProgress[currentStep] &&
              StepperProgress[currentStep][0] &&
              StepperProgress[currentStep][0]
            }
          />
          <ProgressBar
            value={
              StepperProgress &&
              StepperProgress[currentStep] &&
              StepperProgress[currentStep][1] &&
              StepperProgress[currentStep][1]
            }
          />
        </div>
      )}
      {hasDropDown && (
        <Dropdown
          dropdownHeader={dropdownHeader}
          connectedAccount={connectedAccount}
          publicKey={window?.solana?.publicKey}
          chainLogo={chainLogo}
          isDropdown1WithIcon={isDropdown1WithIcon}
          isDropdown2WithIcon={isDropdown2WithIcon}
          dropdownItem1Header={dropdownItem1Header}
          dropdownItem2Header={dropdownItem2Header}
          account1={account1}
          account2={account2}
        />
      )}
      {hasSecondaryHeading && (
        <p className={styles.stepperHeading}>
          {StepperSecondaryHeading[currentStep]}
        </p>
      )}
      {hasImage && (
        <div className={styles.stepperImage}>
          <Image
            className={styles.iconToken}
            src={StepperImage[currentStep]}
            width={164}
            height={164}
            alt="CGPT Connect wallet"
          />
        </div>
      )}
      {hasButton && (
        <Button
          text={StepperButton[currentStep] || ""}
          color={"white"}
          style={{
            width: "100%",
            height: 36,
            background: "transparent",
            border: "1px solid #0066FF",
            borderRadius: 2,
            color: "white",
            font: "normal normal 500 14px/20px Violet Sans",
            padding: 8,
            margin: isMobile ? "7px auto" : "unset",
            marginTop: "15px",
          }}
          loading={buttonLoading}
          disabled={buttonDisabled}
          onClick={async () => {
            if (currentStep === SOLANA_STEPS.START) {
              setCurrentStep(SOLANA_STEPS.CONNECT_METAMASK);
            } else if (currentStep === SOLANA_STEPS.CONNECT_METAMASK) {
              handleConnectWalletOpen();
            } else if (currentStep === SOLANA_STEPS.METAMASK_SUCCESS) {
              setCurrentStep(SOLANA_STEPS.CONNECT_PHANTOM);
            } else if (currentStep === SOLANA_STEPS.CONNECT_PHANTOM) {
              handleSolanaConnectWalletOpen();
            } else if (currentStep === SOLANA_STEPS.PHANTOM_SUCCESS) {
              setCurrentStep(SOLANA_STEPS.CONNECT_ACCOUNTS);
            }
          }}
        />
      )}
      {hasButton && (
        <Button
          text={"Tutorial"}
          color={"white"}
          style={{
            width: "100%",
            height: 36,
            background: "transparent",
            border: "1px solid #0066FF",
            borderRadius: 2,
            color: "white",
            font: "normal normal 500 14px/20px Violet Sans",
            padding: 8,
            margin: isMobile ? "7px auto" : "unset",
            marginTop: "15px",
          }}
          onClick={async () => {
            window.open(
              "https://docs.chaingpt.org/the-ecosystem/chaingpt-pad/solana-ido-participation-guide",
              "_blank",
              "noopener,noreferrer"
            );
          }}
        />
      )}
    </div>
  );
}

export const ProgressBar = ({ value }: any) => {
  return (
    <LinearProgress
      variant="determinate"
      value={value === 1 ? 100 : 0}
      style={{ width: "32%", color: value === 1 ? "#B073FF" : "#212126" }}
    />
  );
};

export const Dropdown = ({
  dropdownHeader,
  isDropdown1WithIcon,
  isDropdown2WithIcon,
  account1,
  account2,
  connectedAccount,
  publicKey,
  dropdownItem1Header,
  dropdownItem2Header,
  chainLogo,
}: any) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <div className={styles.stepperDropdown}>
      <div className={styles.dropdownHeaderContainer}>
        <div className={styles.dropdownHeader}>
          <Image width={24} height={23} src={`/assets/images/solana/icons/not-connected.svg`} alt="" />
          <p className={styles.connectIntro1}>{dropdownHeader}</p>
        </div>
        <div
          className={styles.dropdownIcon}
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          <Image width={23} height={24}
            src={`/assets/images/solana/icons/${
              openDropdown ? "arrow-up" : "arrow-down"
            }.svg`}
            alt=""
          />
        </div>
      </div>

      {openDropdown && (
        <>
          {isDropdown1WithIcon ? (
            <DropdownItemWithIcon
              account={account1}
              connectedAccount={connectedAccount}
              publicKey={publicKey}
              chainLogo={chainLogo}
            />
          ) : (
            <DropdownItem text={dropdownItem1Header} />
          )}
        </>
      )}
    </div>
  );
};

export const DropdownItemWithIcon = ({
  chainLogo,
  connectedAccount,
  account,
  publicKey,
}: any) => {
  return (
    <div className={styles.dropdownItemContainer}>
      <Image height={23} width={23} src={`/assets/images/solana/icons/connected-account.svg`} alt="" />
      <div className={styles.dropdownItem}>
        <Image
          src={`${
            account === StepperAccount.METAMASK
              ? chainLogo
              : "/assets/images/solanaWalletImg.svg"
          }`}
          alt=""
          width={16}
          height={16}
        />
        <p className={styles.dropdownText}>
          {account === StepperAccount.METAMASK
            ? connectedAccount && trimMiddlePartAddress(connectedAccount as any)
            : publicKey && FormatWalletAddress(publicKey as any, 6)}
        </p>
      </div>
    </div>
  );
};

export const DropdownItem = ({ text }: any) => {
  return (
    <div className={styles.dropdownItemContainer}>
      <Image width={23} height={23} src={`/assets/images/solana/icons/not-connected.svg`} alt="" />
      <p className={styles.connectIntro1}>{text}</p>
    </div>
  );
};
