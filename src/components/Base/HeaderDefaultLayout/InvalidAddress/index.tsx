import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import stylesD from "@/styles/commonmodal.module.scss";
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
  solanaAddress?: string;
}

const CustomDialogTitle = styled(DialogTitle)<DialogTitleProps>(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  paddingTop: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  "& .closeButton": {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "black",
    backgroundColor: "#4B4B4B",
    padding: 4,
    "&:hover": {
      backgroundColor: "#D4D4D4",
    },
  },
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  color: "#AEAEAE",
}));

const WalletDisconnect: React.FC<ComponentProps> = ({ opened, handleClose, solanaAddress }) => {
  return (
    <Dialog open={opened} onClose={handleClose} className={stylesD.dialog}>
      <CustomDialogTitle id="customized-dialog-title" onClose={handleClose} customClass={stylesD.dialogTitle}>
        <span>
          Error&nbsp;&nbsp;
          <Image width={20} height={20} src="/assets/images/red-warning.svg" alt="Warning" />
        </span>
        <IconButton className="closeButton" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </CustomDialogTitle>
      <CustomDialogContent className={stylesD.dialogContent}>
        <div className={stylesD.accountDetails}>
          <div className={stylesD.accountDetailBlock}>
            <p className={stylesD.accountDetailBlockText}>
              Solana Wallet Already Connected {solanaAddress ? `${solanaAddress.substring(0, 6)}***${solanaAddress.slice(-7)}` : ""}
            </p>
            <p className={stylesD.accountDetailBlockText} style={{ marginTop: 10 }}>
              You&apos;ve already connected a Solana wallet to MetaMask. Please use this wallet for interactions.
            </p>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default WalletDisconnect;
