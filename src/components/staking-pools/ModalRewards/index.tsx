import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import commonStyles from '@/styles/commonstyle.module.scss'


const closeIcon = "/assets/images/icons/close.svg";
const rewardIcon = "/assets/images/icon-reward.svg";
import styles from '@/styles/staking.module.scss'
import stakingStyles from '@/styles/staking-pool-modal.module.scss'
import Image from "next/image";



const ModalRewards = (props: any) => {

  const { open, onConfirm, onClose, lockDuration } = props;

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + " " + styles.modalRewards}
    >
      <div className="modal-content">
        <DialogTitle
          id="alert-dialog-slide-title"
          className="modal-content__head"
        >
          <Image width={20} height={20}
        alt="close icon" src={closeIcon} onClick={onClose} className="btn-close" />
          <Image width={23} height={23} src={rewardIcon} alt="" className="icon-reward" />
          <div className="title">Stake Reward</div>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <p>
            You are about to add the earned reward back into your principal
            balance, which then brings you even more interest.
          </p>
          <p style={{ marginTop: "5px" }}>
            {lockDuration
              ? `This action also extends your locking duration for another ${lockDuration}`
              : ""}
            .
          </p>
          <p style={{ marginTop: "20px" }}>Confirm stake your reward?</p>
        </DialogContent>
        <DialogActions className="modal-content__foot">
          <button
            className={`${stakingStyles.btn} ${styles.btnConfirm}`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalRewards;
