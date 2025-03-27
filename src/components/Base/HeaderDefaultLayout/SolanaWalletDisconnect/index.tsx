import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles"; // Fix import for `styled`
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useAuth from "../../../../hooks/useAuth";
import { getPhantomWalletBalance } from "../../../../context/Solana/utils";
import { FormatWalletAddress } from "../../../../utils/solana";
import { solanaDisconnectWallet } from "@/store/slices/solanaWalletSlice";
import Link from "next/link";
import stylesDialog from '@/styles/commonmodal.module.scss';
import Image from "next/image";

// Define the props for CustomDialogTitle
export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass?: string;
}

// Styled component for DialogTitle
const CustomDialogTitle = ({ children, onClose, customClass, ...other }: DialogTitleProps) => {
  return (
    <DialogTitle
      className={`${customClass}`}
      {...other}
      style={{ color: "white", padding: 0 }}
    >
      <Typography variant="h6">{children}</Typography>
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

// Styled DialogContent
const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  color: "#757575",
}));

// Component Props
export interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
  currentWallet?: any;
  setWalletAddress?: any;
}

const SolanaWalletDisconnect: React.FC<ComponentProps> = ({ opened, handleClose, setWalletAddress }) => {
  const dispatch = useDispatch();
  const [balance, setBalance] = useState<number>(0);
  const { connectedAccount } = useAuth();

  useEffect(() => {
    const getSolanaBalance = async () => {
      try {
        if (window?.solana?.publicKey && connectedAccount) {
          const lamportBalance = await getPhantomWalletBalance(connectedAccount);
          setBalance(lamportBalance || 0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    if (window?.solana?.publicKey && connectedAccount) {
      getSolanaBalance();
    }
  }, [connectedAccount]);

  return (
    <Dialog open={opened} onClose={handleClose} className={stylesDialog.dialog}>
      <CustomDialogTitle 
        id="customized-dialog-title"
        onClose={handleClose}
        customClass={stylesDialog.dialogTitle}
      >
        <span>
          Account&nbsp;&nbsp;
          <Link prefetch href="/account">
            <Image width={24} height={24} src="/assets/images/icons/open.svg" alt="" />
          </Link>
        </span>
      </CustomDialogTitle>
      <CustomDialogContent className={stylesDialog.dialogContent}>
        <div className={stylesDialog.mainDialog}>
          <Image width={24} height={24}
            src="/assets/images/solana/phantom.png"
            alt="phantom"
            className={stylesDialog.walletNameIcon}
          />
          <span className={stylesDialog.walletAddress}>
            {FormatWalletAddress(window?.solana?.publicKey as any, 4)}
          </span>
          <div
            className={stylesDialog.disconnectButton}
            onClick={async () => {
              if (window.solana && window.solana.isPhantom) {
                await window.solana.disconnect();
                dispatch(solanaDisconnectWallet());
              }
              setWalletAddress && setWalletAddress("");
              handleClose();
            }}
          >
            <Image width={24} height={24}
              src="/assets/images/disconnect.svg"
              className={stylesDialog.disconnectIcon}
              alt=""
            />
            <span>Disconnect</span>
          </div>
        </div>
        <div className={stylesDialog.accountDetails}>
          <div className={stylesDialog.accountDetailBlock}>
            <span className={stylesDialog.accountDetailBlockLabel}>Balance</span>
            <p className={stylesDialog.accountDetailBlockText}>{balance || 0} Sol</p>
          </div>

          <div className={stylesDialog.accountDetailBlock}>
            <span className={stylesDialog.accountDetailBlockLabel}>Network</span>
            <p className={stylesDialog.accountDetailBlockText}>
              <Image width={24} height={24}
                src="/assets/images/solanaWallet.svg"
                alt=""
                className={stylesDialog.netWorkIcon}
              />
              Sol
            </p>
          </div>

          <div className={stylesDialog.accountDetailBlock}>
            <span className={stylesDialog.accountDetailBlockLabel}>Wallet</span>
            <p className={stylesDialog.accountDetailBlockText}>Phantom Wallet</p>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default SolanaWalletDisconnect;
