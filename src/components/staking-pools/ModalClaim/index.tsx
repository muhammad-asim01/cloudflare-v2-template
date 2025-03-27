import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { BigNumber, utils } from "ethers";
import poolStyles from '@/styles/staking-pool-modal.module.scss'

import commonStyles from '@/styles/commonstyle.module.scss'
import styles from '@/styles/staking.module.scss'
import Image from "next/image";



const closeIcon = "/assets/images/icons/close.svg";

const ModalClaim = (props: any) => {

  const { open, onConfirm, onClose, pendingReward, tokenDetails } = props;

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + " " + styles.modalStake}
    >
      <div className="modal-content">
        <DialogTitle
          id="alert-dialog-slide-title"
          className="modal-content__head"
        >
          <Image width={20} height={20}
        alt="close icon" src={closeIcon}  onClick={onClose} className="btn-close" />
          <div className="title">Claim</div>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className="token-type">
            <div className="token-type-title">Token</div>
            <div className="token-detail">
              <div>{tokenDetails?.symbol}</div>
            </div>
          </div>
          <div className="token-type">
            <div className="token-type-title">Current Profit</div>
            <div className="token-detail">
              <div>
                {!BigNumber.from(pendingReward || "0").eq(
                  BigNumber.from("0")
                ) && Number(utils.formatEther(pendingReward)).toFixed(1)}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className={styles.modalFooter}>
          <button
            className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnClaimModal}`}
            onClick={onConfirm}
          >
            Claim
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalClaim;
