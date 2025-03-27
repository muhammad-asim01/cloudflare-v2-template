import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import { BeatLoader } from "react-spinners";
  import commonStyles from '@/styles/commonstyle.module.scss'

  import poolStyles from '@/styles/delegateStaking.module.scss'
  import styles from '@/styles/delegateModal.module.scss'
import Image from "next/image";
  
  const closeIcon = "/assets/images/icons/close.svg";
  
  const ModalRevoke = (props: any) => {

  
    const { open, onConfirm, onClose, loading } = props;
  
    return (
      <Dialog
        open={open}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={commonStyles.modal + " " + styles.modalStake}
      >
        <div className={poolStyles.modalContent}>
          <DialogTitle
            id="alert-dialog-slide-title"
            className={poolStyles.modalHeader}
          >
            <Image width={20} height={20}
        alt="close icon" src={closeIcon} onClick={onClose} className="btn-close" />
            <div className="title">Schedule Revoke</div>
          </DialogTitle>
          <DialogContent className={poolStyles.modalBody}>
          <p className="text-white px-3">
            You have participated in a live pool. You cannot revoke your points
            at this moment, but you can schedule a revoke, and your points will be revoked once the active pool ends.
          </p>
          </DialogContent>
  
          <DialogActions className={poolStyles.modalFooter}>
            <button
              className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnStakeModal}`}
              onClick={onConfirm}
              style={{ color: "#1e1e1e" }}
            >
              {loading ? <BeatLoader size={8} color="white" /> : "Schedule"}
            </button>
            <button
              className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnGetPkfModal}`}
              onClick={onClose}
            >
              {loading ? <BeatLoader size={8} color="white" /> : "Cancel"}
            </button>
          </DialogActions>
        </div>
      </Dialog>
    );
  };
  
  export default ModalRevoke;
  