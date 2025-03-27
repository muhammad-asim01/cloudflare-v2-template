import {
  Dialog,
  DialogActions, DialogTitle
} from "@mui/material";
import { ETHERSCAN_BASE_URL } from "@/constants";
import { BSC_CHAIN_ID } from "@/constants/network";

const closeIcon = "/assets/images/icons/close.svg";

import commonStyles from '@/styles/commonstyle.module.scss'
import styles from '@/styles/staking.module.scss'
import Image from "next/image";
const ModalTransaction = (props: any) => {
  const { transactionHashes, setTransactionHashes, open } = props;

  const handleClose = () => {
    let array = [...transactionHashes];
    array.shift();
    setTransactionHashes(array);
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + " " + styles.modalTransaction}
    >
      <div className="modal-content">
        <Image width={24} height={24}
          src="/assets/images/icons/checked.svg"
          alt=""
          className={styles.iconSuccess}
        />
        <DialogTitle
          id="alert-dialog-slide-title"
          className="modal-content__head"
        >
            <Image width={20} height={20}
                  alt="close icon"  src={closeIcon} className="btn-close" onClick={handleClose} />
          <span className="title">Transaction Submitted</span>
        </DialogTitle>
        <DialogActions className="modal-content__foot">
          <a
            href={`${ETHERSCAN_BASE_URL[BSC_CHAIN_ID]}/tx/${transactionHashes[0].tnx}`}
            target="_blank"
            className={styles.dialogButton}
            rel="noreferrer"
          >
            View on BscScan
            <Image width={24} height={24} src="/assets/images/icons/open.svg" alt="" />
          </a>
        </DialogActions>
        {transactionHashes[0].isApprove && (
          <p className={styles.notice}>
            * Please be patient and no need to approve again, you can check the
            transaction status on the explorer page.
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default ModalTransaction;
