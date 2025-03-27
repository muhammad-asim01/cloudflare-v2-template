'use client';

import React, { useState } from 'react';
import { Theme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import styles from '@/styles/whitelistNotificationModal.module.scss';
import Button from '../Button';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';

// ✅ Use `makeStyles` instead of `createStyles`
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    background: '#020616',
    paddingTop: 0,
    textAlign: 'center',
    position: 'relative', // Ensures positioning for close button
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'black',
    backgroundColor: '#D9d9d9',
    padding: 4,
    '&:hover': {
      backgroundColor: '#D9d9d9',
    },
  },
  svgIcon: {
    fontSize: '1rem', // Fixed the incorrect font size
  },
}));

interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass?: string;
  networkAvailable?: string;
}

interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
  handleOk: () => void;
  textWhitelist: string;
}

// ✅ Correct `styled(DialogTitle)` syntax
const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, customClass } = props;
  const classes = useStyles();

  return (
    <DialogTitle className={`${classes.root} ${customClass || ''}`}>
      <Typography variant="h6" style={{ color: 'white' }}>
        {children}
      </Typography>
      {onClose && (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

// ✅ Correct `styled(DialogContent)`
const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  color: '#999999',
}));

const WhitelistCountryModal: React.FC<ComponentProps> = (props) => {
  const { handleClose, opened, handleOk, textWhitelist } = props;
  const [openSubmitModal, setOpenSubmitModal] = useState(opened);

  const handleModalClose = () => {
    setOpenSubmitModal(false);
    if (handleClose) handleClose();
  };

  return (
    <Dialog open={openSubmitModal} className={styles.dialog} sx={{ minWidth: 500 }}>
      <CustomDialogTitle id="customized-dialog-title" onClose={handleModalClose} customClass={styles.dialogTitle}>
        Interest Application Form
      </CustomDialogTitle>
      <CustomDialogContent>
        <div
          style={{
            color: 'white',
            marginBottom: 41,
            textAlign: 'left',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: textWhitelist }} />
        </div>
        <Button
          text="OK"
          backgroundColor="#D01F36"
          onClick={handleOk}
          style={{
            minWidth: 125,
            padding: '15px 20px',
          }}
        />
        <Button
          text="Cancel"
          backgroundColor="#3232dc"
          onClick={handleModalClose}
          style={{
            minWidth: 125,
            padding: '15px 20px',
            marginLeft: '10px',
          }}
        />
      </CustomDialogContent>
    </Dialog>
  );
};

export default WhitelistCountryModal;
