import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent"; // Changed MuiDialogContent to DialogContent
import DialogTitle from "@mui/material/DialogTitle"; // Changed MuiDialogTitle to DialogTitle
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close"; // Changed @mui/icons-material/Close to @mui/icons-material/Close
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { HeaderContext, HeaderContextType } from "../context/HeaderContext";
import useAuth from "../../../../hooks/useAuth";
import useWalletSignature from "../../../../hooks/useWalletSignature";
import { PublicKey } from "@solana/web3.js";
import axios from "../../../../services/axios";
import {
  solanaConnectWallet,
  solanaSetWalletAddress,
} from "@/store/slices/solanaWalletSlice";
import SolanaConnectWalletBox from "../SolanaConnectWalletBox";
import Link from "next/link";
import styleDialog from "@/styles/commonmodal.module.scss";
import useResponsive from "@/hooks/useResponsive";
import { toast } from "react-toastify";
import Image from "next/image";

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass: string;
}

export interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
  width: any;
  getSolanaWallet?: any;
}

const CustomDialogTitle: React.FC<DialogTitleProps> = ({
  children,
  customClass = "",
  onClose,
  ...other
}) => {
  return (
    <DialogTitle
      component="div"
      className={customClass}
      {...other}
      style={{ color: "white" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h6">{children}</Typography>
        {onClose && (
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </div>
    </DialogTitle>
  );
};

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  color: "#999999",
}));

const SolanaConnectWalletModal: React.FC<ComponentProps> = (
  props: ComponentProps
) => {
  const { isMobile } = useResponsive();

  const { opened, handleClose, getSolanaWallet } = props;
  const { signature, signMessage, setSignature } = useWalletSignature();
  const { connectedAccount } = useAuth();
  const { walletName, connectWalletLoading } = useContext(AppContext);
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

  const pointerStyle = {
    cursor: `${agreedTerms ? "pointer" : "initial"}`,
  };

  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const dispatch = useDispatch();
  console.log(showConfirmModal);

  const getSolanaAddress = useCallback(async () => {
    if (
      connectedAccount &&
      localStorage.getItem(`access_token:${connectedAccount}`)
    ) {
      const response = await axios.get("user/get-solana-address", {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem(`access_token:${connectedAccount}`),
        },
      });
      return response?.data?.data?.solana_address || "";
    }
  }, [connectedAccount]);

  const updateSolanaWallet = useCallback(async () => {
    const config = {
      headers: {
        msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
        Authorization:
          "Bearer " + localStorage.getItem(`access_token:${connectedAccount}`),
      },
    };
    if (signature && publicKey && connectedAccount) {
      try {
        const response = await axios.post(
          "user/link-solana-address",
          {
            signature: signature,
            wallet_address: connectedAccount,
            solana_address: publicKey,
          },
          config as any
        );
        const { status, message } = response.data;
        if (status === 400) {
          toast.error(
            "Cannnot Change Solana Address as user has already registered in this pool"
          );
        }
        if (status === 200) {
          toast.success(message);
          if (getSolanaWallet) {
            getSolanaWallet();
          }
        }
        setSignature("");
        setLoading(false);
        setShowConfirmModal(false);
      } catch (error) {
        console.log("🚀 ~ updateSolanaWal ~ error:", error);
        toast.error("An Unexpected Error occurred");
        setSignature("");
        setLoading(false);
        setShowConfirmModal(true);
      }
    }
  }, [connectedAccount, signature, publicKey, setSignature, getSolanaWallet]);

  const getSigner = useCallback(async () => {
    setSignature("");
    const solanaAddress = await getSolanaAddress();
    if (solanaAddress && solanaAddress !== publicKey?.toBase58()) {
      await signMessage();
    } else {
      if (!solanaAddress) {
        await signMessage();
      }
      setLoading(false);
    }
  }, [publicKey, getSolanaAddress, setSignature, signMessage]);

  useEffect(() => {
    if (signature && publicKey && connectedAccount) {
      updateSolanaWallet();
    }
  }, [signature, publicKey, connectedAccount, updateSolanaWallet]);

  useEffect(() => {
    const getConfirmation = async () => {
      const solanaAddress = await getSolanaAddress();
      if (
        (solanaAddress &&
          publicKey &&
          solanaAddress !== publicKey?.toBase58() &&
          solanaAddress !== "Token expired") ||
        solanaAddress === ""
      ) {
        setShowConfirmModal(true);
        handleClose();
      } else {
        setLoading(false);
        setShowConfirmModal(false);
        handleClose();
      }
    };

    if (window?.solana?.isConnected && publicKey) {
      getConfirmation();
    }
  }, [publicKey, getSigner, getSolanaAddress, handleClose]);

  useEffect(() => {
    if (window?.solana) {
      window.solana.on("disconnect", () => {
        setPublicKey(null);
        handleClose();
      });
    }

    return () => {
      if (window?.solana) {
        window.solana.off("accountChanged", () => {});
      }
    };
  }, [handleClose]);

  return (
    <Dialog open={opened} onClose={handleClose} className={styleDialog.dialog}>
      <CustomDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        customClass={styleDialog.dialogTitle}
      >
        Connect Wallet
      </CustomDialogTitle>
      <CustomDialogContent>
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
              <SolanaConnectWalletBox
                key={key}
                appNetwork={network}
                isAppNetwork
              />
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
                <SolanaConnectWalletBox
                  key={key}
                  wallet={network}
                  isAppNetwork={false}
                  // handleProviderChosen={handleProviderChosen}
                  connectWalletLoading={connectWalletLoading}
                  walletName={walletName}
                />
              )
            );
          })}
        </div>
        <Typography gutterBottom className={styleDialog.dialogContentTypo}>
          Connect wallet for SOL network
        </Typography>
        {window.solana && window.solana.isPhantom ? (
          <div className={` ${styleDialog.dialogNetworks}`}>
            <div
              className={`${styleDialog.walletBox} ${styleDialog.activeNetwork}`}
              style={pointerStyle}
              onClick={async () => {
                if (agreedTerms && connectedAccount) {
                  setLoading(true);
                  try {
                    const response = await window.solana.connect();
                    if (response.publicKey) {
                      setPublicKey(response?.publicKey);
                      dispatch(solanaConnectWallet());
                      dispatch(
                        solanaSetWalletAddress(response?.publicKey?.toString())
                      );
                    }
                  } catch (error: any) {
                    setLoading(false);
                    toast.error(error?.message);
                  }
                } else {
                  if (!connectedAccount && agreedTerms) {
                    toast.error("Please Connect Metamask Wallet First");
                  }
                }
              }}
            >
              <div className={styleDialog.walletBoxIconWrap}>
                {loading && agreedTerms ? (
                  <Image
                    width={24}
                    height={24}
                    alt=""
                    className={styleDialog.loadingAnimation}
                    src="/assets/images/loading-v3.svg"
                  />
                ) : (
                  <Image
                    width={24}
                    height={24}
                    style={{ borderRadius: "24px" }}
                    src={`${
                      agreedTerms
                        ? "/assets/images/solana/phantom.png"
                        : "/assets/images/solana/disabled.svg"
                    }`}
                    alt=""
                  />
                )}
              </div>
              <p className={styleDialog.walletBoxText}>Phantom Wallet</p>
            </div>
          </div>
        ) : (
          <p>No wallet found. Please download a supported Solana wallet</p>
        )}
      </CustomDialogContent>
    </Dialog>
  );
};

export default SolanaConnectWalletModal;
