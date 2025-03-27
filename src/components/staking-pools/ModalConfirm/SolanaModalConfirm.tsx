'use client'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import useAuth from "@/hooks/useAuth";
import stakingStyles from '@/styles/staking-pool-modal.module.scss'

import { FormatStringWalletAddress } from "@/utils/solana";
import { useCallback, useEffect, useState } from "react";
import axios from "@/services/axios";
import { BeatLoader } from "react-spinners";
import commonStyles from '@/styles/commonstyle.module.scss'


const closeIcon = "/assets/images/icons/close.svg";
import styles from '@/styles/staking.module.scss'
import Image from "next/image";

const SolanaConfirmModal = (props: any) => {

  const { connectedAccount } = useAuth();

  const { open, onConfirm, onClose, newSolanaAddress, loading } = props;

  const [oldSolanaAddress, setOldSolanaAddress] = useState("");

  const getSolanaAddress = useCallback(async () => {
    if (connectedAccount && localStorage.getItem(`access_token:${connectedAccount}`)) {
      const response = await axios.get("user/get-solana-address", {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem(`access_token:${connectedAccount}`),
        },
      });
      setOldSolanaAddress(response?.data?.data?.solana_address || "");
    }
  }, [connectedAccount]);

  useEffect(() => {
    getSolanaAddress();
  }, [getSolanaAddress]);

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + " " + styles.modalConfirm}
    >
      <div className="modal-content">
        <DialogTitle
          id="alert-dialog-slide-title"
          className="modal-content__head"
        >
          <Image width={20} height={20}
        alt="close icon" src={closeIcon} onClick={onClose} className="btn-close" />
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div style={{ textAlign: "center" }}>
            {oldSolanaAddress === "" ? (
              <p>
                Your new Solana wallet address (
                {FormatStringWalletAddress(newSolanaAddress, 7)}) will be linked
                to your profile. Are you sure you want to proceed with this change?
              </p>
            ) : (
              <p>
                Your new Solana wallet address (
                {FormatStringWalletAddress(newSolanaAddress, 7)}) will be linked
                to your profile, replacing the previous address (
                {FormatStringWalletAddress(oldSolanaAddress, 7)}
                ). Are you sure you want to proceed with this change?
              </p>
            )}
          </div>
        </DialogContent>
        <DialogActions
          className="modal-content__foot"
          style={{ border: "none" }}
        >
          <button
            className={`${stakingStyles.btn} ${styles.btnYes}`}
            onClick={onConfirm}
          >
            {loading ? <BeatLoader color={"white"} size={10} /> : "Yes, Sure"}
          </button>

          <button
            className={`${stakingStyles.btn} ${styles.btnCancel}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default SolanaConfirmModal;
