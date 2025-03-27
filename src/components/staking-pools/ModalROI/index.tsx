import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { isMobile } from "react-device-detect";
import Button from "../Button";

const closeIcon = "/assets/images/icons/close.svg";
import commonStyles from '@/styles/commonstyle.module.scss'
import styles from '@/styles/staking.module.scss'
import Image from "next/image";

const ModalStake = (props: any) => {

  const {
    open,
    onClose,
    linear,
    apr,
    rewardTokenPrice,
    rewardToken,
    acceptedToken,
  } = props;

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + " " + styles.modalStake}
    >
      <div className="modal-content">
        <DialogTitle
          id="alert-dialog-slide-title"
          className="modal-content__head"
        >
          <Image width={20} height={20}
        alt="close icon"  src={closeIcon}  onClick={onClose} className="btn-close" />
          <div className="title">ROI</div>
        </DialogTitle>

        <DialogContent className="modal-content__body">
          <div className={styles.grid}>
            <div>Timeframe</div>
            <div>ROI</div>
            <div>
              {rewardToken?.symbol || "CGPT"}
              {isMobile ? `/` : "per"} $1K
            </div>
          </div>

          <div className={styles.grid}>
            <div>1 day</div>
            <div>{(apr / 365).toFixed(2)}%</div>
            <div>{((apr * 10) / (rewardTokenPrice * 365)).toFixed(2)}</div>
          </div>
          <div className={styles.grid}>
            <div>7 day</div>
            <div>{((apr / 365) * 7).toFixed(2)}%</div>
            <div>
              {(((apr * 10) / (rewardTokenPrice * 365)) * 7).toFixed(2)}
            </div>
          </div>
          <div className={styles.grid}>
            <div>30 days</div>
            <div>{((apr / 365) * 30).toFixed(2)}%</div>
            <div>
              {(((apr * 10) / (rewardTokenPrice * 365)) * 30).toFixed(2)}
            </div>
          </div>
          <div className={styles.grid}>
            <div>365 days (APR)</div>
            <div>{apr.toFixed(2)}%</div>
            <div>{((apr * 10) / rewardTokenPrice).toFixed(2)}</div>
          </div>

          {!linear && (
            <ul className={styles.roiDescription}>
              <li>Calculated based on current rates.</li>
              <li style={{ marginTop: "10px" }}>
                All figures are estimates provided for your convenience only,
                and by no means represent guaranteed returns.
              </li>
            </ul>
          )}
        </DialogContent>
        <DialogActions className="modal-content__foot">
          <Button
            text={`Get ${acceptedToken?.symbol || "CGPT"}`}
            onClick={() =>
              window.open(
                `https://www.chaingpt.org/#buy`
              )
            }
            backgroundColor="#D01F36"
            style={{
              height: 40,
              width: 200,
              color: "#fff",
              border: "none",
              margin: "0 auto",
              borderRadius: 6,
              padding: 0,
              font: "normal normal bold 14px/20px   Violet Sans",
            }}
          />
        </DialogActions>
        {/* {transactionHashes[0].isApprove && <p className={styles.notice}>Please be patient and no need to approve again, you can check the transaction status on Etherscan.</p>} */}
      </div>
    </Dialog>
  );
};

export default ModalStake;
