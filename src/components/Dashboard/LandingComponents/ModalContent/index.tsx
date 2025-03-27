import commonStyles from '@/styles/commonstyle.module.scss'

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const iconClose = "images/icons/close.svg";
const background = "images/landing/bg-modal.svg";
import styles from '@/styles/modalcontent.module.scss'
import Image from 'next/image';

const ModalContent = (props: any) => {
  const { setShowModal, open } = props;

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => setShowModal(false)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + " " + styles.ModalContent}
    >
      <div className="modal-content">
        <Image alt='' width={24} height={24} src={background} className="bg" />
        <Image alt='' width={24} height={24} src={iconClose} onClick={() => setShowModal(false)} className="btn-close" />
        <DialogTitle id="alert-dialog-slide-title" className="modal-content__head">
          <h2 className="title">The first IDO will start in the first half of May</h2>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className="subtitle">
            <span>Subscribe DegenPad Telegram for the latest updates.</span>
          </div>
        </DialogContent>
        <DialogActions className="modal-content__foot">
          <button
            className={"btn-approve"}
            onClick={() => {
              window.open("https://t.me/DegenPadNews", "_blank");
            }}
          >
            Subscribe
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalContent;
