import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import commonStyles from "@/styles/commonstyle.module.scss";

import styles from "@/styles/staking.module.scss";

const closeIcon = "/assets/images/icons/close.svg";
import poolStyles from "@/styles/staking-pool-modal.module.scss";
import Image from "next/image";
import CustomImage from "@/components/Base/Image";

const ModalSwitch = (props: any) => {
  const {
    open,
    onConfirm,
    onClose,
    loading,
    targetSwitchPoolId,
    handleSelectSwitchPool,
    livePools,
  } = props;

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + " " + styles.modalStake}
    >
      <div className={`${poolStyles.modalContent} ${styles.modalSwitch}`}>
        <DialogTitle
          id="alert-dialog-slide-title"
          className={poolStyles.modalHeader}
        >
          <Image
            width={20}
            height={20}
            alt="close icon"
            src={closeIcon}
            onClick={onClose}
            className="btn-close"
          />
          <Image
            width={20}
            height={20}
            src="/assets/images/icon-switch-green.svg"
            alt=""
          />
          <div className="title">Switch Pool</div>
        </DialogTitle>
        <DialogContent className={poolStyles.modalBody}>
          <div className={styles.textContent}>
            <p>The current staking pool has ended.</p>
            <p>
              Please select one of the live pools below if you wish to keep
              staking.
            </p>
            <p>
              Your $cgpt amount and rewards will remains the same for the newly
              chosen pools.
            </p>
          </div>
          <div className={styles.listPools}>
            {livePools.map((pool: any) => (
              <div
                key={pool?.id}
                className={`${styles.poolDetail} ${
                  targetSwitchPoolId === +pool?.pool_id
                    ? styles.poolSeleted
                    : ""
                }`}
                onClick={() => handleSelectSwitchPool(Number(pool?.pool_id))}
              >
                {targetSwitchPoolId === +pool?.pool_id && (
                  <Image
                    width={24}
                    height={24}
                    src="/assets/images/icons/checked.svg"
                    alt=""
                    className="pool-selected-icon"
                  />
                )}
                <CustomImage
                  width={24}
                  height={24}
                  src={pool?.logo}
                  className="pool-logo"
                  alt=""
                  onError={(event: any) => {
                    event.target.src =
                      "/assets/images/defaultImages/image-placeholder.png";
                  }}
                  defaultImage={
                    "/assets/images/defaultImages/image-placeholder.png"
                  }
                />

                <div className={commonStyles.flexCol} style={{ flex: 1 }}>
                  <div className="pool-label">{pool?.title}</div>
                  <div className="pool-text">
                    {pool?.point_rate > 0 ? (
                      <span>With IDO</span>
                    ) : (
                      <span className={commonStyles.colorGray}>
                        Without IDO
                      </span>
                    )}
                  </div>
                </div>
                <div className={commonStyles.flexCol}>
                  <div className="pool-text">APR</div>
                  <div className="pool-label">{pool?.APR || 0}%</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>

        <DialogActions
          className={poolStyles.modalFooter + " " + styles.modalSwitchFooter}
        >
          <button
            className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnCancelModal}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnSwitchModal}`}
            onClick={onConfirm}
            disabled={!targetSwitchPoolId || loading}
          >
            Switch
            {loading && (
              <CircularProgress size={20} style={{ marginLeft: 10 }} />
            )}
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalSwitch;
