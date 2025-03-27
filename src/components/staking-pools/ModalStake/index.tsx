'use client'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BigNumber from "bignumber.js";
import { useEffect, useMemo, useState } from "react";
import poolStyles from '@/styles/staking-pool-modal.module.scss'

import { formatDecimal } from "@/utils";

const closeIcon = "/assets/images/icons/close.svg";
const DEFAULT_TOKEN_DECIMALS = 18; // CGPT decimals

import commonStyles from '@/styles/commonstyle.module.scss'
import styles from '@/styles/staking.module.scss'
import Image from "next/image";


const ModalStake = (props: any) => {

  const {
    open,
    onConfirm,
    onClose,
    amount,
    setAmount,
    tokenDetails,
    stakingAmount,
    min,
    max,
    tokenBalance,
    wrongChain,
    tokenAllowance,
    handleApprove,
  } = props;

  const [progress, setProgress] = useState("0");
  useEffect(() => {
    setProgress(((Number(amount) / Number(tokenBalance)) * 100).toFixed(0));
  }, [amount, tokenBalance, setProgress]);

  const needApprove = useMemo(() => {
    return new BigNumber(tokenAllowance).lt(amount);
  }, [tokenAllowance, amount]);

  const tokenDecimal = useMemo(
    () => tokenDetails?.decimals || DEFAULT_TOKEN_DECIMALS,
    [tokenDetails?.decimals]
  );

  const handleChangeStakeAmount = (event: any) => {
    let newAmount = formatDecimal(new BigNumber(event.target.value), tokenDecimal);
    let maxAmount =
      !Number(max) || new BigNumber(tokenBalance).lt(max) ? tokenBalance : max;
    setAmount(new BigNumber(newAmount).gt(maxAmount) ? maxAmount : newAmount);
  };

  const onChangeStakeAmount = (percent: number) => {
    let tokenAmount = new BigNumber(tokenBalance).multipliedBy(percent);
    let newAmount =
      !max ||
      new BigNumber(tokenAmount).lt(new BigNumber(max)) ||
      new BigNumber(max).eq(0)
        ? tokenAmount + ""
        : max;
    setAmount(formatDecimal(newAmount, tokenDecimal));
  };

  const alreadyStake = stakingAmount && Number(stakingAmount) > 0;

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
          <div className="title">Stake</div>
        </DialogTitle>
        <DialogContent className={poolStyles.modalBody}>
          <div className="token-type">
            <div className="token-type-title">Token</div>
            <div className="token-detail">
              <div>{tokenDetails?.symbol}</div>
            </div>
          </div>
          {alreadyStake && (
            <div className="token-type">
              <div className="token-type-title">Staking</div>
              <div className="token-detail">{stakingAmount}</div>
            </div>
          )}
          {min && Number(min) > 0 && (
            <div className="token-type">
              <div className="token-type-title">Min Stake</div>
              <div className="token-detail">{min}</div>
            </div>
          )}
          <div className="subtitle">
            {alreadyStake ? "Additional stake amount" : "Stake Amount"}
          </div>
          <div className="input-group">
            <input
              value={amount}
              onChange={handleChangeStakeAmount}
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
              onClick={() => onChangeStakeAmount(0.25)}
              className={poolStyles.btnSelectPercent}
            >
              25%
            </button>
            <button
              onClick={() => onChangeStakeAmount(0.5)}
              className={poolStyles.btnSelectPercent}
            >
              50%
            </button>
            <button
              onClick={() => onChangeStakeAmount(0.75)}
              className={poolStyles.btnSelectPercent}
            >
              75%
            </button>
            <button
              onClick={() => onChangeStakeAmount(1)}
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
                <Image width={23} height={23}
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
        </DialogContent>

        <DialogActions className={poolStyles.modalFooter}>
          {needApprove ? (
            <button
              className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnStakeModal}`}
              onClick={() => handleApprove()}
              disabled={wrongChain}
              style={{color: "#1e1e1e"}}
            >
              Approve
            </button>
          ) : (
            <button
              className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnStakeModal}`}
              onClick={onConfirm}
              disabled={isNaN(amount)}
              style={{color: "#1e1e1e"}}
            >
              Stake
            </button>
          )}
          <button
            className={`${poolStyles.btn} ${poolStyles.btnModal} ${poolStyles.btnGetPkfModal}`}
            onClick={() =>
              window.open(
                `https://www.chaingpt.org/#buy`
              )
            }
          >
            Get CGPT
          </button>
        </DialogActions>
        {/* {transactionHashes[0].isApprove && <p className={styles.notice}>Please be patient and no need to approve again, you can check the transaction status on Etherscan.</p>} */}
      </div>
    </Dialog>
  );
};

export default ModalStake;
