import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ClipLoader } from "react-spinners";
import classes from "@/styles/solanaTransactionModal.module.scss";
import commonStyles from "@/styles/commonstyle.module.scss";
import Image from "next/image";

interface CustomDialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass: string;
}

const CustomDialogTitle = ({ children, onClose, customClass }: CustomDialogTitleProps) => {
  return (
    <DialogTitle className={`${classes.dialogTitle} ${customClass}`}>
      <Typography variant="h6" sx={{ color: "white" }}>{children}</Typography>
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "black",
            backgroundColor: "#D9d9d9",
            padding: 0.5,
            "&:hover": { backgroundColor: "#D9d9d9" },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

const CustomDialogContent = styled(DialogContent)({
  padding: 0,
  color: "#1e1e1e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

interface TransactionSubmitModalProps {
  opened: boolean;
  handleClose: () => void;
  transactionHash?: string | undefined;
  additionalText?: string;
}

const TransactionSubmitModal: React.FC<TransactionSubmitModalProps> = ({
  opened,
  handleClose,
  transactionHash,
  additionalText,
}) => {
  return (
    <Dialog open={opened} onClose={handleClose} className={classes.dialog}>
      <div>
        {transactionHash ? (
          <Image
            width={24}
            height={24}
            src="/assets/images/icons/checked.svg"
            alt="Transaction success"
            className={classes.iconSuccess}
          />
        ) : (
          <ClipLoader color={"#0066ff"} />
        )}
      </div>
      <CustomDialogTitle id="customized-dialog-title" onClose={handleClose} customClass={classes.dialogTitle}>
        Transaction {transactionHash ? "Submitted" : "Submitting"}
      </CustomDialogTitle>
      <CustomDialogContent>
        {transactionHash && (
          <>
            <a
              href={`https://explorer.solana.com/tx/${transactionHash}?cluster=mainnet`}
              className={classes.dialogButton}
              target="_blank"
              rel="noreferrer nofollow"
            >
              View on Sol Explorer
              <Image width={23} height={24} src="/assets/images/icons/open.svg" alt="Open Explorer" />
            </a>
            {additionalText && <p className={commonStyles.nnn1216h}>{additionalText}</p>}
          </>
        )}
      </CustomDialogContent>
    </Dialog>
  );
};

export default TransactionSubmitModal;
