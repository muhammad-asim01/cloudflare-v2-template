import React, { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { CircularProgress } from '@mui/material';
import styles from "@/styles/confirmDialog.module.scss";


type ConfirmDialogType = {
  title: string;
  children: ReactNode,
  open: boolean;
  confirmLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  btnLoading?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogType> = (props: ConfirmDialogType) => {
  const { title, children, open, onConfirm, onCancel, confirmLoading, btnLoading = false } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      className={styles.dialog}
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {children}
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button className={styles.dialogButton} disabled={confirmLoading} onClick={onConfirm} color="primary">
          Submit
          {
            btnLoading && confirmLoading && <CircularProgress size={25} style={{ marginLeft: 10 }} /> 
          }
        </Button>
        <Button disabled={confirmLoading} className={`${styles.dialogButton} ${styles.dialogButtonCancel}`} onClick={onCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
 
export default ConfirmDialog;
