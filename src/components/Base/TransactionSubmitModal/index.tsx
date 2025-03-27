import React, { useState, useEffect } from "react";
import {
  styled,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import { ClipLoader } from "react-spinners";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import {
  ETH_CHAIN_ID,
  BSC_CHAIN_ID,
  POLYGON_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  OKX_CHAIN_ID,
  OKXSCAN_URL,
  ZKSYNC_CHAIN_ID,
  ZKSYNCSCAN_URL,
  DAO_CHAIN_ID,
  BASE_CHAIN_ID,
  BASESCAN_URL,
  LINEA_CHAIN_ID,
  LINEASCAN_URL,
  BLAST_CHAIN_ID,
  BLASTSCAN_URL,
  BERA_CHAIN_ID,
  BERA_SCAN_URL,
  SONIC_CHAIN_ID,
} from "../../../constants/network";

import classes from "@/styles/transactionSubmitModal.module.scss";
import commonStyles from "@/styles/commonstyle.module.scss";
import Image from "next/image";

const ETHERSCAN_URL = process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL || "";
const BCSSCAN_URL = process.env.NEXT_PUBLIC_BSCSCAN_BASE_URL || "";
const POLSCAN_URL = process.env.NEXT_PUBLIC_POLSCAN_BASE_URL || "";
const AVAXSCAN_URL = process.env.NEXT_PUBLIC_AVALANCHESCAN_BASE_URL || "";
const ARBISCAN_URL = process.env.NEXT_PUBLIC_ARBITRUMSCAN_BASE_URL || "";
const DAOSCAN_URL = process.env.NEXT_PUBLIC_BASESCAN_DAO_URL || "";
const SONICSCAN_URL = process.env.NEXT_PUBLIC_SONICSCAN_BASE_URL || "";


interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass: string;
  networkAvailable?: string;
}


const CustomDialogTitle = styled(DialogTitle)<DialogTitleProps>(
  ({ customClass, theme }) => ({
    color: "white",
    "&.MuiDialogTitle-root": {
      margin: 0,
      background: "#f5f5f5",
    },
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
    [`&.${customClass}`]: {},
  })
);

const CustomDialogContent = styled(DialogContent)(() => ({
  padding: 0,
  color: "#1e1e1e",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const TransactionSubmitModal: React.FC<any> = (props: any) => {
  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;
  const { opened, handleClose, transactionHash, additionalText } = props;

  const [explorerUrl, setExplorerUrl] = useState<string>(ETHERSCAN_URL);
  const [explorerName, setExplorerName] = useState<string>("Etherscan");

  useEffect(() => {
    switch (appChainID) {
      case BSC_CHAIN_ID:
        setExplorerUrl(BCSSCAN_URL);
        setExplorerName("Bscscan");
        break;
      case POLYGON_CHAIN_ID:
        setExplorerUrl(POLSCAN_URL);
        setExplorerName("Polygonscan");
        break;
      case AVALANCHE_CHAIN_ID:
        setExplorerUrl(AVAXSCAN_URL);
        setExplorerName("Avaxscan");
        break;
      case ARBITRUM_CHAIN_ID:
        setExplorerUrl(ARBISCAN_URL);
        setExplorerName("Arbiscan");
        break;
      case BASE_CHAIN_ID:
        setExplorerUrl(BASESCAN_URL);
        setExplorerName("Basescan");
        break;
      case DAO_CHAIN_ID:
        setExplorerUrl(DAOSCAN_URL);
        setExplorerName("Daoscan");
        break;
      case OKX_CHAIN_ID:
        setExplorerUrl(OKXSCAN_URL);
        setExplorerName("xlayerscan");
        break;
      case ZKSYNC_CHAIN_ID:
        setExplorerUrl(ZKSYNCSCAN_URL);
        setExplorerName("zkSyncscan");
        break;
      case LINEA_CHAIN_ID:
        setExplorerUrl(LINEASCAN_URL);
        setExplorerName("lineascan");
        break;
      case BLAST_CHAIN_ID:
        setExplorerUrl(BLASTSCAN_URL);
        setExplorerName("blastscan");
        break;
      case BERA_CHAIN_ID:
        setExplorerUrl(BERA_SCAN_URL);
        setExplorerName("Berachain Explorer");
        break;
      case SONIC_CHAIN_ID:
        setExplorerUrl(SONICSCAN_URL);
        setExplorerName("Sonicscan");
        break;
      case ETH_CHAIN_ID:
      default:
        setExplorerUrl(ETHERSCAN_URL);
        setExplorerName("Etherscan");
        break;
    }
  }, [appChainID]);

  return (
    <Dialog open={opened} onClose={handleClose} className={classes.dialog}>
      <div>
        {transactionHash ? (
          <Image width={24} height={25}
            src="/assets/images/icons/checked.svg"
            alt=""
            className={classes.iconSuccess}
          />
        ) : (
          <ClipLoader color={"#0066ff"} />
        )}
      </div>
      <CustomDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        customClass={classes.dialogTitle}
      >
        Transaction {transactionHash ? "Submitted" : "Submitting"}
      </CustomDialogTitle>
      <CustomDialogContent>
        {transactionHash && (
          <>
            <a
              href={`${explorerUrl}/tx/${transactionHash}`}
              className={classes.dialogButton}
              target="_blank"
              rel="noreferrer nofollow"
            >
              View on {`${explorerName}`}
              <Image width={24} height={25} src="/assets/images/icons/open.svg" alt="" />
            </a>
            {additionalText && (
              <p className={commonStyles.nnn1216h}>{additionalText}</p>
            )}
          </>
        )}
      </CustomDialogContent>
    </Dialog>
  );
};

export default TransactionSubmitModal;