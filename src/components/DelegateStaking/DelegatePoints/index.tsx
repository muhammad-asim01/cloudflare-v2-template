import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import poolStyles from "@/styles/delegateStaking.module.scss";
import styles from "@/styles/delegateModal.module.scss";
import useAuth from "../../../hooks/useAuth";
import { BeatLoader } from "react-spinners";
import { isValidAddress } from "../../../services/web3";

const delegatePasteIcon = "/assets/images/account_v3/icons/delegate-Paste.svg";
const closeIcon = "/assets/images/icons/close.svg";
import commonStyles from '@/styles/commonstyle.module.scss'
import { toast } from "react-toastify";
import Image from "next/image";


const DelegatePointsModal = (props: any) => {
  const { connectedAccount } = useAuth();

  const {
    open,
    onConfirm,
    onClose,
    setPoints,
    setWalletAddress,
    points,
    walletAddress,
    loading,
    delegatePoints,
  } = props;

  const [calculateDelegate, setCalculateDelegate] = useState<number>(
    delegatePoints || 0
  );

  const containsSpecialCharacters = (value: string) =>
    /[^a-zA-Z0-9]/.test(value);

  const handleWalletAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWalletAddress(event.target.value);
  };

  const handlePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputPoints = parseFloat(event.target.value) || 0;

    if (inputPoints < 0) {
      toast.error("Points cannot be negative.");
      return;
    }

    setPoints(inputPoints);

    setCalculateDelegate(Math.max(0, delegatePoints - inputPoints));
  };

  const handlePasteText = useCallback(() => {
    navigator.clipboard
      .readText()
      .then((text) => setWalletAddress(text))
      .catch((err) => console.error("Failed to read clipboard contents:", err));
  }, [setWalletAddress]);

  // Reset state values when modal opens
  useEffect(() => {
    if (open) {
      setPoints(0);
      setCalculateDelegate(delegatePoints);
    }
  }, [open, delegatePoints, setPoints]);

  // Form validation before submission
  const validateAndSubmit = () => {
    if (!connectedAccount) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!walletAddress) {
      toast.error("Please enter a wallet address");
      return;
    }
    if (walletAddress === connectedAccount) {
      toast.error(
        "You cannot delegate staking points to your own wallet address."
      );
      return;
    }
    if (containsSpecialCharacters(walletAddress)) {
      toast.error(
        "The wallet address contains invalid characters. Only alphanumeric characters are allowed."
      );
      return;
    }
    if (!isValidAddress(walletAddress)) {
      toast.error(
          "The wallet address entered is not valid. Please enter a valid Ethereum address."
        );
      return;
    }
    if (!points || points <= 0) {
      toast.error("Please enter a valid number of points.");
      return;
    }

    onConfirm();
  };

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="delegate-points-title"
      aria-describedby="delegate-points-description"
      className={`${commonStyles.modal} ${styles.modalStake}`}
    >
      <div className={poolStyles.modalContent}>
        <DialogTitle
          id="delegate-points-title"
          className={poolStyles.modalHeader}
        >
          <Image
          width={20} height={20}
        alt="close icon"
            src={closeIcon}
            
            onClick={onClose}
            className="btn-close cursor-pointer"
          />
          <div className="title">Delegate Points</div>
        </DialogTitle>

        {/* Modal Body */}
        <DialogContent className={poolStyles.modalBody}>
          {/* Wallet Address Input */}
          <div className="subtitle">Wallet Address</div>
          <div className="input-group">
            <input
              value={walletAddress}
              onChange={handleWalletAddressChange}
              type="text"
            />
            <Image
            width={23}
            height={23}
              onClick={handlePasteText}
              src={delegatePasteIcon}
              alt="Paste"
              style={{ cursor: "pointer", marginInline: "2px" }}
            />
          </div>

          {/* Points Input */}
          <div style={{ marginTop: "20px" }} className="subtitle">
            Points
          </div>
          <div className="input-group">
            <input
              value={points}
              onChange={handlePointsChange}
              type="number"
              min="0"
              max={delegatePoints}
            />
            <span style={{ opacity: 0.4 }}>{calculateDelegate}</span>
          </div>

          {/* Warning Message */}
          <div style={{ paddingTop: "15px" }}>
            <p style={{ marginBottom: "0px" }}>
              <b>Please Note:</b> Delegated points cannot be removed or
              retrieved when a user has participated in any active pool.
            </p>
          </div>
        </DialogContent>

        {/* Modal Actions */}
        <DialogActions className={poolStyles.modalFooter}>
          <button
            className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnStakeModal}`}
            onClick={onClose}
            disabled={loading}
            style={{ color: "#1e1e1e" }}
          >
            {loading ? <BeatLoader color={"#0066FF"} size={8} /> : "Cancel"}
          </button>
          <button
            className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnGetPkfModal}`}
            onClick={validateAndSubmit}
            disabled={loading}
          >
            {loading ? <BeatLoader color={"white"} size={8} /> : "Submit"}
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default DelegatePointsModal;
