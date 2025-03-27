"use client";

import { TIER_LEVELS } from "@/constants";
import useFetch from "@/hooks/useFetch";
import { apiRoute } from "@/utils";
import { BaseRequest } from "@/request/Request";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import WhiteListGuideText from "./WhiteListGuideText";
import Button from "@mui/material/Button";
import styles from "@/styles/whitelistNotificationModal.module.scss";
export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass: string;
  networkAvailable?: string;
}

export interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
}
const CustomDialogTitle = styled(DialogTitle)<DialogTitleProps>(
  ({ theme }: { theme: any }) => ({
    margin: 0,
    padding: theme.spacing(2),
    background: "#38383F", 
    paddingTop: 0,
    textAlign: "center",
    color: "white",
    paddingInline: "24px",
    "& .MuiIconButton-root": {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: "black",
      backgroundColor: "#D9d9d9",
      padding: 4,
      "&:hover": {
        backgroundColor: "#D9d9d9",
      },
    },
    "& .MuiSvgIcon-root": {
      fontSize: 5,
    }
  })
);

const CustomDialogContent = styled(DialogContent)(
  ({ theme }: { theme: any }) => ({
    padding: theme.spacing(1),
    color: "#FFFFFF",
    paddingLeft: 40,
    paddingRight: 40,
  })
);

const CustomDialogActions = styled(DialogActions)(
  ({ theme }: { theme: any }) => ({
    padding: theme.spacing(1),
    justifyContent: "center",
    marginTop: theme.spacing(5),
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      "& > :not(:first-child)": {
        marginLeft: 0,
        marginTop: theme.spacing(1),
      },
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column-reverse",
      "& button": {
        width: "100% !important",
        maxWidth: "100% !important",
        "&:last-child": {
          margin: "0 0 12px 0 !important",
        },
      },
    },
  })
);

const ApplyWhitelistModal: React.FC<any> = (props: any) => {
  const {
    poolDetails,
    connectedAccount,
    alreadyJoinPool,
    joinPoolSuccess,
    joinPool,
    handleClose,
    whitelistSubmission,
    currentUserTierLevel,
    dataUser,
  } = props;

  const [loading, setLoading] = useState(false);
  const [rejectedSubmission, setRejectedSubmission] = useState(undefined);

  const [inputTwitter, setInputTwitter] = useState("");
  const [inputTelegram, setInputTelegram] = useState("");
  const [inputTweet, setInputTweet] = useState("");

  const [invalidTweet, setInvalidTweet] = useState(false);
  const [invalidTwitter, setInvalidTwitter] = useState(false);
  const [invalidTelegram, setInvalidTelegram] = useState(false);

  const [inputSolanaAddress, setInputSolanaAddress] = useState("");
  const [userSolanaAddress, setUserSolanaAddress] = useState<string>(
    dataUser?.user?.solana_address
  );

  const urlRetweet = poolDetails?.socialRequirement?.self_retweet_post;

  const { data: previousWhitelistSubmission } = useFetch<any>(
    poolDetails && connectedAccount
      ? `/user/whitelist-apply/previous`
      : undefined
  );

  useEffect(() => {
    if (!alreadyJoinPool && !joinPoolSuccess) {
      if (previousWhitelistSubmission) {
        setInputTwitter(previousWhitelistSubmission?.user_twitter);
        setInputTelegram(previousWhitelistSubmission?.user_telegram);
      }
      return;
    }

    if (whitelistSubmission) {
      setInputTwitter(whitelistSubmission?.user_twitter);
      setInputTelegram(whitelistSubmission?.user_telegram);
      return;
    }
  }, [
    alreadyJoinPool,
    joinPoolSuccess,
    whitelistSubmission,
    previousWhitelistSubmission,
  ]);

  const verifyAndSubmit = async () => {
    if (!connectedAccount) {
      return;
    }
    let requiredTweet =
      !inputTweet && urlRetweet && currentUserTierLevel < TIER_LEVELS.GOLD;
    setInvalidTweet(requiredTweet);
    setInvalidTwitter(!inputTwitter);
    setInvalidTelegram(!inputTelegram);

    if (!inputTwitter || !inputTelegram || requiredTweet) {
      return;
    }

    await handleApply();
  };

  const handleApply = async () => {
    const baseRequest = new BaseRequest();
    setLoading(true);
    setRejectedSubmission(undefined);

    let solanaAddress = userSolanaAddress ?? inputSolanaAddress;

    const response = (await baseRequest.post(
      apiRoute(`/whitelist-apply/${poolDetails.id}`),
      {
        wallet_address: connectedAccount,
        user_twitter: inputTwitter,
        user_telegram: inputTelegram,
        airdrop_address: solanaAddress,
      }
    )) as any;
    const resObj = await response.json();
    setLoading(false);

    if (resObj.status && resObj.status === 200) {
      handleClose();
      joinPool(solanaAddress);
    } else {
      toast.error(resObj.message);
      setRejectedSubmission(resObj.data);
    }
  };

  return (
    <Dialog open className={styles.socialDialog}>
      <CustomDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        customClass={styles.dialogTitle}
      >
        Welcome to {poolDetails?.title} on DegenPad
      </CustomDialogTitle>

      <CustomDialogContent>
        <div>{!whitelistSubmission && <WhiteListGuideText />}</div>

        <div className="socialForm">
          <div className="row">
            <div className="input-group">
              <div className="label">
                Your Twitter ID <span className={styles.textPurple}>*</span>{" "}
              </div>
              <input
                type="text"
                disabled={alreadyJoinPool || joinPoolSuccess}
                value={inputTwitter}
                onChange={(e) => setInputTwitter(e.target.value)}
                placeholder="@username"
                maxLength={60}
              />
              {invalidTwitter && (
                <div className={"label" + " " + styles.textRed}>
                  Social account is required
                </div>
              )}
            </div>
            <div className="input-group">
              <div className="label">
                Your Telegram ID <span className={styles.textPurple}>*</span>{" "}
              </div>
              <input
                type="text"
                disabled={alreadyJoinPool || joinPoolSuccess}
                value={inputTelegram}
                onChange={(e) => setInputTelegram(e.target.value)}
                placeholder="@username"
                maxLength={60}
              />
              {invalidTelegram && (
                <div className={"label" + " " + styles.textRed}>
                  Social account is required
                </div>
              )}
            </div>
          </div>
        </div>
      </CustomDialogContent>

      {!alreadyJoinPool && !joinPoolSuccess && (
        <CustomDialogActions> 
          <Button
            onClick={handleClose}
            style={{
              minWidth: 200,
              maxWidth: 200,
              height: 40,
              border: "1px solid rgba(239, 239,239, 229, 0.3)",
              padding: "10px 0",
              borderRadius: "2px",
              font: "normal normal 500 14px/20px  Violet Sans",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={verifyAndSubmit}
            disabled={loading}
            color={"primary"}
            style={{
              minWidth: 200,
              maxWidth: 200,
              height: 40,
              padding: "10px 0",
              borderRadius: "2px",
              marginLeft: 8,
              font: "normal normal 500 14px/20px  Violet Sans",
            }}
          >
            Submit
          </Button>
        </CustomDialogActions>
      )}
    </Dialog>
  );
};

export default ApplyWhitelistModal;
