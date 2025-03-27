import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent"; // Changed MuiDialogContent to DialogContent

import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../../../AppContext";
import {
  connectorsSupportByNetwork,
  SUPPORTED_WALLETS,
} from "../../../../constants/connectors";
import {
  appNetworkType,
  APP_NETWORKS,
  APP_NETWORKS_NAME,
  BSC_CHAIN_ID,
  ETH_CHAIN_ID,
  POLYGON_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  BERA_CHAIN_ID,
} from "../../../../constants/network";
import ConnectWalletBox from "../ConnectWalletBox";
import { HeaderContext, HeaderContextType } from "../context/HeaderContext";
import Link from "next/link";
import styleDialog from "@/styles/commonmodal.module.scss";
import useResponsive from "@/hooks/useResponsive";
import Image from "next/image";

export interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
  width?: any;
}

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  // Changed DialogContent to CustomDialogContent and styled(DialogContent)
  padding: theme.spacing(2),
  color: "#999999",
}));

const ConnectWalletModal: React.FC<ComponentProps> = (
  props: ComponentProps
) => {
  const { isMobile } = useResponsive();

  const { opened, handleClose } = props;
  const { walletName, handleProviderChosen, connectWalletLoading } =
    useContext(AppContext);
  const { setAgreedTerms, agreedTerms } =
    useContext<HeaderContextType>(HeaderContext);
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const connectorsByNetwork = (() => {
    switch (appChainID) {
      case BSC_CHAIN_ID:
        return connectorsSupportByNetwork[APP_NETWORKS_NAME.BSC];

      case POLYGON_CHAIN_ID:
        return connectorsSupportByNetwork[APP_NETWORKS_NAME.POLYGON];

      case AVALANCHE_CHAIN_ID:
        return connectorsSupportByNetwork[APP_NETWORKS_NAME.AVALANCHE];

      case ARBITRUM_CHAIN_ID:
        return connectorsSupportByNetwork[APP_NETWORKS_NAME.ARBITRUM];

      case BERA_CHAIN_ID:
        return connectorsSupportByNetwork[APP_NETWORKS_NAME.BERA];

      case ETH_CHAIN_ID:
      default:
        return SUPPORTED_WALLETS;
    }
  })();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target && setAgreedTerms(event.target.checked);
  };

  return (
    <Dialog open={opened} onClose={handleClose} className={styleDialog.dialog}>
      {/* <CustomDialogTitle // Changed DialogTitle to CustomDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        customClass={styleDialog.dialogTitle}
      >
        Connect Wallet
      </CustomDialogTitle> */}
      <CustomDialogContent>
        {" "}
        {/* Changed DialogContent to CustomDialogContent */}
        <div
          className={`${styleDialog.dialogContentBlock} ${styleDialog.dialogPrivacy}`}
        >
          <Checkbox
            checked={agreedTerms}
            onChange={handleChange}
            inputProps={{ "aria-label": "secondary checkbox" }}
            className={styleDialog.dialogCheckbox}
            icon={
              <Image
                alt="unchecked"
                width={20}
                height={20}
                src="/assets/images/icons/uncheck.svg"
              />
            }
            checkedIcon={
              <Image
                alt="checked"
                width={20}
                height={20}
                src="/assets/images/icons/checked-box-form.svg"
              />
            }
          />
          <span className={styleDialog.dialogPrivacyText}>
            I read and accept the
            <Link
              prefetch
              className={styleDialog.dialogPrivacyHighlight}
              href="/terms"
              target="_blank"
            >
              {" "}
              Terms of Service
            </Link>{" "}
            and&nbsp;
            <Link
              prefetch
              className={styleDialog.dialogPrivacyHighlight}
              href="/privacy"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
        <Typography gutterBottom className={styleDialog.dialogContentTypo}>
          Choose Network
        </Typography>
        <div
          className={`${styleDialog.dialogContentBlock} ${styleDialog.dialogNetworks}`}
        >
          {Object.keys(APP_NETWORKS).map((key: string) => {
            const network = APP_NETWORKS[key as appNetworkType];
            return (
              <ConnectWalletBox key={key} appNetwork={network} isAppNetwork />
            );
          })}
        </div>
        <Typography gutterBottom className={styleDialog.dialogContentTypo}>
          Choose Wallet
        </Typography>
        <div className={` ${styleDialog.dialogNetworks}`}>
          {Object.keys(connectorsByNetwork).map((key: string) => {
            const network = connectorsByNetwork[key];

            const showConnectorInMobile =
              isMobile && isMobile ? network.mobile : true;
            return (
              showConnectorInMobile && (
                <ConnectWalletBox
                  key={key}
                  wallet={network}
                  isAppNetwork={false}
                  handleProviderChosen={handleProviderChosen as any}
                  connectWalletLoading={connectWalletLoading}
                  walletName={walletName}
                />
              )
            );
          })}
        </div>
      </CustomDialogContent>{" "}
      {/* Changed DialogContent to CustomDialogContent */}
    </Dialog>
  );
};

export default ConnectWalletModal;
