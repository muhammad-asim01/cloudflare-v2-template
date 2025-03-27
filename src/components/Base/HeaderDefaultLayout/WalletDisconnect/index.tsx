import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../../../AppContext";
import { ConnectorNames } from "../../../../constants/connectors";
import { APP_NETWORKS_SUPPORT } from "../../../../constants/network";
import { trimMiddlePartAddress } from "../../../../utils/accountAddress";
import { gTagEvent } from "../../../../services/gtag";
import { getAppNetworkName } from "../../../../utils/network/getAppNetworkName";
import Link from "next/link";
import Image from "next/image";
import styleDialog from '@/styles/commonmodal.module.scss';

interface Wallet {
  title: string;
  typeId: string;
  addresses: string[];
  balances: Record<string, number>;
}

interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
  currentWallet?: Wallet | null;
}

const CustomDialogTitle = styled(DialogTitle)(() => ({
  color: "white",
  padding: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  color: "#757575",
}));

const WalletDisconnect: React.FC<ComponentProps> = ({ opened, handleClose, currentWallet }) => {
  const { logout: disconnectWallet } = useContext(AppContext);
  const appChainID = useSelector((state: any) => state.appNetwork.data.appChainID);

  const walletName = currentWallet?.title || "";
  const address = currentWallet?.addresses[0] || "";
  const balance = address ? currentWallet?.balances[address] || 0 : 0;
  const networkInfo = APP_NETWORKS_SUPPORT[appChainID] || {};
  const walletIconPath = currentWallet ? `/assets/images/${currentWallet.typeId}.svg` : "";

  const handleAccountLogout = async () => {
    gTagEvent({
      action: "disconnect_wallet",
      params: {
        wallet_address: address,
        connect_wallet_dApp: 'pad',
        wallet_provider: currentWallet?.typeId || "",
        network: getAppNetworkName(appChainID)?.toUpperCase() || ""
      }
    });
    if (
      walletName === ConnectorNames.WalletConnect &&
      localStorage.getItem("walletconnect")
    ) {
      localStorage.removeItem("walletconnect");
    }
    handleClose();
    disconnectWallet?.();
  };

  return (
    <Dialog open={opened} onClose={handleClose} className={styleDialog.dialog}>
      <CustomDialogTitle>
        <span>
          Account&nbsp;&nbsp;
          <Link prefetch href="/account">
            <Image width={24} height={24} src="/assets/images/icons/open.svg" alt="Open Account" />
          </Link>
        </span>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </CustomDialogTitle>
      <CustomDialogContent className={styleDialog.dialogContent}>
        <div className={styleDialog.mainDialog}>
          {walletIconPath && (
            <Image width={24} height={24} src={walletIconPath} alt={walletName} className={styleDialog.walletNameIcon} />
          )}
          <span className={styleDialog.walletAddress}>{trimMiddlePartAddress(address, 6)}</span>
          <div className={styleDialog.disconnectButton} onClick={handleAccountLogout}>
            <Image width={24} height={24} src="/assets/images/disconnect.svg" alt="Disconnect" className={styleDialog.disconnectIcon} />
            <span>Disconnect</span>
          </div>
        </div>
        <div className={styleDialog.accountDetails}>
          <div className={styleDialog.accountDetailBlock}>
            <span className={styleDialog.accountDetailBlockLabel}>Balance</span>
            <p className={styleDialog.accountDetailBlockText}>{balance} {networkInfo.currency}</p>
          </div>
          <div className={styleDialog.accountDetailBlock}>
            <span className={styleDialog.accountDetailBlockLabel}>Network</span>
            <p className={styleDialog.accountDetailBlockText}>
              {networkInfo?.icon && (
                <Image width={24} height={24} src={networkInfo.icon} alt="Network Icon" className={styleDialog.netWorkIcon} />
              )}
              {networkInfo.networkName}
            </p>
          </div>
          <div className={styleDialog.accountDetailBlock}>
            <span className={styleDialog.accountDetailBlockLabel}>Wallet</span>
            <p className={styleDialog.accountDetailBlockText}>{walletName}</p>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default WalletDisconnect;