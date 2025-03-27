'use client';

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { TIERS } from "../../../constants";
import { trimMiddlePartAddress } from "../../../utils/accountAddress";
import styles from '@/styles/modalWhitelistCancel.module.scss';
import Link from "next/link";
import Image from "next/image";

interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass: string;
}

interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
  poolDetails?: any;
  connectedAccount?: string;
  showKyc?: boolean;
  showMinTier?: boolean;
  showSocialTask?: boolean;
}

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, customClass, onClose, ...other } = props;

  return (
    <DialogTitle className={`${customClass}`} {...other}>
      <Typography variant="h5" style={{ color: "white", paddingBottom: 0 }}>
        {children}
      </Typography>
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "black",
            backgroundColor: "#D9D9D9",
            padding: 0.5,
            '&:hover': { backgroundColor: "#D9D9D9" }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </DialogTitle>
  );
};

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(1),
  color: "#FFFFFF",
  margin: "0 !important",
  display: "flex",
  justifyContent: "center",
}));

const WhitelistNotificationModal: React.FC<ComponentProps> = ({
  opened,
  handleClose,
  poolDetails,
  connectedAccount,
  showKyc,
  showMinTier,
  showSocialTask
}) => {
  return (
    <Dialog open={opened} fullWidth maxWidth="xs" className={styles.socialDialog}>
      <CustomDialogTitle id="customized-dialog-title" onClose={handleClose} customClass={styles.dialogTitle}>
        <div className={styles.titleDetail}>
          <Image width={24} height={24} src="/assets/images/tokens.svg" alt="" />
          <span style={{ color: '#0066FF' }}>
            {showMinTier ? "Tier Required" : showKyc ? "KYC required" : ""}
          </span>
        </div>
      </CustomDialogTitle>
      <CustomDialogContent>
        {showMinTier && (
          <div className={styles.errroTier}>
            <span>
              You haven&apos;t achieved min tier ({TIERS[poolDetails?.minTier]?.name || ""}) to register for Interest yet. To upgrade your Tier, please click&nbsp;
              <Link prefetch href="/staking-pools" style={{ color: "#6398FF", textDecoration: "underline" }}>here</Link>.
            </span>
          </div>
        )}
        {showKyc && (
          <div className={styles.alertVerifyEmail}>
            <span>
              The connected wallet address ({trimMiddlePartAddress(connectedAccount || "")}) is unverified.&nbsp;
              <a href="https://verify-with.blockpass.org/?clientId=degenpad_30b1f&serviceName=DegenPad&env=prod" target="_blank" rel="noreferrer nofollow">Please submit KYC now</a>
              &nbsp;or switch to a verified address.
            </span>
          </div>
        )}
        {showSocialTask && (
          <div className={styles.alertVerifyEmail}>
            <p style={{ color: "#1e1e1e" }}>
              Please sign the message to register.
              {poolDetails?.socialRequirement?.gleam_link && (
                <>
                  <br />
                  To increase your chances of winning guaranteed allocation, please complete social tasks on
                  <a href={poolDetails.socialRequirement.gleam_link} target="_blank" rel="noreferrer"> the following link</a>.
                </>
              )}
            </p>
          </div>
        )}
      </CustomDialogContent>
    </Dialog>
  );
};

export default WhitelistNotificationModal;
