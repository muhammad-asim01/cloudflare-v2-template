import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import styles from '@/styles/staking.module.scss'

import stakingStyles from '@/styles/staking-pool-modal.module.scss'

const closeIcon = "/assets/images/icons/close.svg";
import commonStyles from '@/styles/commonstyle.module.scss'
import Image from "next/image";


const ModalStake = (props: any) => {

  const { open, onConfirm, onClose, text } = props;

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
          <div style={{ textAlign: "center" }}>{text}</div>
        </DialogContent>
        <DialogActions
          className="modal-content__foot"
          style={{ border: "none" }}
        >
          <button
            className={`${stakingStyles.btn} ${styles.btnYes}`}
            onClick={onConfirm}
          >
            Yes, Sure
          </button>

          <button
            className={`${stakingStyles.btn} ${styles.btnCancel}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </DialogActions>
        {/* {transactionHashes[0].isApprove && <p className={styles.notice}>Please be patient and no need to approve again, you can check the transaction status on Etherscan.</p>} */}
      </div>
    </Dialog>
  );
};

export default ModalStake;
