import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { AppContext } from "../../../../AppContext";
import { appNetworkType, APP_NETWORKS } from "../../../../constants/network";
import ConnectWalletBox from "../ConnectWalletBox";
import styleDialog from '@/styles/commonmodal.module.scss';
import Image from "next/image";

// Styled Components (Updated for MUI v5)
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  paddingTop: 0,
  borderRadius: 50,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
  backgroundColor: "transparent",
  color: "white",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: "black",
  backgroundColor: "#d9d9d9",
  padding: 4,
  "&:hover": {
    backgroundColor: "#D4D4D4",
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
}

const AppNetworkSwitch: React.FC<ComponentProps> = (props: ComponentProps) => {
  const { opened, handleClose } = props;
  const { appNetworkLoading } = useContext(AppContext);

  return (
    <Dialog open={opened} onClose={handleClose} className={styleDialog.dialog}>
      <StyledDialogTitle id="customized-dialog-title">
        <Typography variant="h6">Switch Network</Typography>
        <CloseButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </CloseButton>
      </StyledDialogTitle>

      <StyledDialogContent className={styleDialog.dialogContent}>
        {Object.keys(APP_NETWORKS).map((key: string) => {
          const network = APP_NETWORKS[key as appNetworkType];
          return (
            <ConnectWalletBox
              key={key}
              appNetwork={network}
              handleClose={handleClose}
              isAppNetwork
              forceEnable
              isSwitchNetwork
            />
          );
        })}
        {appNetworkLoading && (
          <div className={styleDialog.loadingIcon}>
            <Image width={20} height={20} src="/assets/images/loading.png" alt="Loading" />
          </div>
        )}
      </StyledDialogContent>
    </Dialog>
  );
};

export default AppNetworkSwitch;
