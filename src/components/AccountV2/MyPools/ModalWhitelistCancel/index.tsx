import styles from "@/styles/modalWhitelistCancel.module.scss";
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import Image from "next/image";

const ModalWhitelistCancel = (props: any) => {
  const {poolCancel, openModalCancel, onCloseModalCancel, onCancelPool} = props;

  return (
    <Dialog
      open={openModalCancel}
      keepMounted
      className={styles.modalWhitelistCancel}
      onClose={() => onCloseModalCancel()}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className={styles.headModalWhitelistCancel}>
        {styles?.iconModal && <Image width={24} height={24} className={styles?.iconModal} src="/assets/images/account_v3/icons/icon_whitelist_cancel.svg" alt="" />}
        <div className={styles.titleModal}>Whitelist Cancel</div>
        <Button className={styles.btnColseModal} variant="contained" onClick={() => onCloseModalCancel()} aria-label="close">
          <Image width={24} height={24} src="/assets/images/account_v3/icons/icon_close_modal.svg" alt="" />
        </Button>
      </DialogTitle>
      <DialogContent className={styles.comtentModalWhitelistCancel}>
        Are you sure to cancel your {poolCancel?.title} whitelist application? You cannot re-apply after you cancel.
      </DialogContent>
      <DialogActions className={styles.footerModalWhitelistCancel}>
        <Button variant="contained"  onClick={() => onCancelPool(poolCancel)}>Yes,Sure</Button>
        <Button variant="contained" onClick={() => onCloseModalCancel()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalWhitelistCancel;
