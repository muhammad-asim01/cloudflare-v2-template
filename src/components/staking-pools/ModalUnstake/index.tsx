'use client'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BigNumber from "bignumber.js";
import { BigNumber as BigNumberEth, utils } from "ethers";
import { useEffect, useState } from "react";
import styles from '@/styles/staking.module.scss'
import poolStyles from '@/styles/staking-pool-modal.module.scss'


const closeIcon = "/assets/images/icons/close.svg";
const warningIcon = "/assets/images/warning-red.svg";
const ONE_DAY_IN_SECONDS = 86400;

import commonStyles from '@/styles/commonstyle.module.scss'
import Image from "next/image";

const ModalStake = (props: any) => {

  const {
    open,
    onConfirm,
    onClose,
    amount,
    setAmount,
    pendingReward,
    delayDuration,
    tokenDetails,
    stakingAmount,
    tokenBalance,
  } = props;

  const [progress, setProgress] = useState("0");
  useEffect(() => {
    if (Number(utils.formatEther(stakingAmount || "0")) <= 0) {
      return;
    }
    setProgress(
      (
        (Number(amount) / Number(utils.formatEther(stakingAmount))) *
        100
      ).toFixed(0)
    );
  }, [amount, stakingAmount, setProgress]);

  const handleChangeUnstakeAmount = (event: any) => {
    let newAmount = event.target.value;
    let maxAmount = utils.formatEther(stakingAmount);
    setAmount(new BigNumber(newAmount).gt(maxAmount) ? maxAmount : newAmount);
  };

  const onSelectPercent = (percent: number) => {
    let newAmount = Number(utils.formatEther(stakingAmount)) * percent + "";
    setAmount(newAmount);
  };

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
                  alt="close icon"  src={closeIcon}  onClick={onClose} className="btn-close" />
          <div className="title">Unstake</div>
        </DialogTitle>
        <DialogContent className={poolStyles.modalBody}>
          <div className={styles.warning}>
            <Image width={24} height={24} src={warningIcon} alt="" />
            {Number(delayDuration) > 0 ? (
              <span>
                YOU ARE UNSTAKING CGPT. Once you unstake, the unstaked CGPT will
                not be calculated CGPTs and you can only claim tokens after the
                withdrawal delay time.
                <br />
                If you ONLY want to CLAIM THE STAKING REWARD (without losing
                your CGPTs), please close this popup {`>`} Click on the "Claim
                Reward" button in the "Earned" area.{" "}
              </span>
            ) : (
              <span>
                YOU ARE UNSTAKING CGPT. Once you unstake, the unstaked CGPT will
                not be calculated CGPTs. <br /> If you ONLY want to CLAIM THE
                STAKING REWARD (without losing your CGPTs), please close this
                popup {`>`} Click on the "Claim Reward" button in the "Earned"
                area.
              </span>
            )}
          </div>

          <div className="token-type">
            <div className="token-type-title">Token</div>
            <div className="token-detail">
              <div>{tokenDetails?.symbol}</div>
            </div>
          </div>
          <div className="token-type">
            <div className="token-type-title">Staking</div>
            <div className="token-detail">
              <div>
                {!BigNumberEth.from(stakingAmount || "0").eq(
                  BigNumberEth.from("0")
                ) && Number(utils.formatEther(stakingAmount)).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="token-type">
            <div className="token-type-title">Current Profit</div>
            <div className="token-detail">
              <div>
                {!BigNumberEth.from(pendingReward || "0").eq(
                  BigNumberEth.from("0")
                ) && Number(utils.formatEther(pendingReward)).toFixed(2)}
              </div>
            </div>
          </div>
          {Number(delayDuration) > 0 && (
            <div className="token-type">
              <div className="token-type-title">Withdrawal delay time</div>
              <div className="token-detail">
                <div>
                  {" "}
                  {(Number(delayDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days
                </div>
              </div>
            </div>
          )}
          <div className="subtitle">Unstake Amount</div>
          <div className="input-group">
            <input
              value={amount}
              onChange={handleChangeUnstakeAmount}
              type="number"
              min="0"
            />
            <span>{tokenDetails?.symbol}</span>
          </div>

          <div className="token-balance">
            (Balance: {new BigNumber(tokenBalance).toFixed(2)})
          </div>

          <div className={poolStyles.groupButtonPercent}>
            <button
              onClick={() => onSelectPercent(0.25)}
              className={poolStyles.btnSelectPercent}
            >
              25%
            </button>
            <button
              onClick={() => onSelectPercent(0.5)}
              className={poolStyles.btnSelectPercent}
            >
              50%
            </button>
            <button
              onClick={() => onSelectPercent(0.75)}
              className={poolStyles.btnSelectPercent}
            >
              75%
            </button>
            <button
              onClick={() => onSelectPercent(1)}
              className={poolStyles.btnSelectPercent}
            >
              100%
            </button>
          </div>

          <div
            className={`${poolStyles.progressArea} ${poolStyles.modalProgress}`}
          >
            <div className={poolStyles.progress}>
              <span
                className={`${poolStyles.currentProgress} ${
                  parseFloat(progress) > 0 ? "" : "inactive"
                }`}
                style={{
                  width: `${
                    parseFloat(progress) > 99
                      ? 100
                      : Math.round(parseFloat(progress))
                  }%`,
                }}
              >
                <Image width={24} height={24}
                  className={`icon-fire ${poolStyles.iconCurrentProgress}`}
                  src="/assets/images/icon_fire_inprogress.png"
                  alt=""
                />
              </span>
            </div>
            <div className={poolStyles.currentPercentage}>
              ({Number(progress).toFixed(0)}%)
            </div>
          </div>

          {/* {Number(delayDuration) > 0 && (
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                margin: "20px 0",
              }}
            >
              <li>
                There is an Withdrawal delay time before you can{" "}
                <strong>Withdraw</strong> your Staked tokens. Following that
                Withdrawal delay time you will be able to withdraw.
              </li>
              <li style={{ marginTop: "10px" }}>
                Staking Rewards will stop being earned for the amount you
                unstake as soon as you click "<strong>Unstake</strong>" and
                initiate the Unstaking process
              </li>
            </ul>
          )} */}
        </DialogContent>
        <DialogActions className={poolStyles.modalFooterSingleBtn}>
          <button
            className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnStakeModal}`}
            onClick={onConfirm}
            disabled={isNaN(amount) || Number(amount) <= 0}
            style={{color: '#0066FF'}}
          >
            Unstake
          </button>
        </DialogActions>
        {/* {transactionHashes[0].isApprove && <p className={styles.notice}>Please be patient and no need to approve again, you can check the transaction status on Etherscan.</p>} */}
      </div>
    </Dialog>
  );
};

export default ModalStake;
