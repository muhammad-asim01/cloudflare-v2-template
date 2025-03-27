import styles from "@/styles/modalTransaction.module.scss";
import commonStyles from '@/styles/commonstyle.module.scss'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Image from "next/image";

const closeIcon = "/assets/images/icons/close.svg";

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
        <DialogTitle
          id="alert-dialog-slide-title"
          className="modal-content__head"
        >
          <Image alt="" width={20} height={20} src={closeIcon} className="btn-close" onClick={handleClose} />
          <span className="title">Transaction Submitted</span>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className="subtitle">
            <span>TXn Hash</span>
          </div>
          <div className="input-group">
            <input type="text" value={transactionHashes[0].tnx} disabled />
          </div>
        </DialogContent>
        <DialogActions className="modal-content__foot">
          <a
            href={`https://etherscan.io/tx/${transactionHashes[0].tnx}`}
            target="_blank"
            className={commonStyles.nnb1418d}
            rel="noreferrer nofollow"
          >
            View on Etherscan
          </a>
        </DialogActions>
        {transactionHashes[0].isApprove && (
          <p className={styles.notice}>
            Please be patient and no need to approve again, you can check the
            transaction status on the explorer page.
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default ModalTransaction;
