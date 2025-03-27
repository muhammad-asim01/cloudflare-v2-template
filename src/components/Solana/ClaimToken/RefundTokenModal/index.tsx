'use client'

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import styles from '@/styles/refundTokenModal.module.scss'

import useSolanaRefundToken from "../../hooks/useSolanarefundToken";
import SolanaTransactionSubmitModal from "@/components/Base/SolanaTransactionSubmitModal";
import Image from "next/image";
const refundIcon = "/assets/images/refund_token.svg";

const closeIcon = "/assets/images/icons/close.svg";

const RefundTokenModal = (props: any) => {
  const [openRefundModal, setOpenTransactionSubmitModal] =
    useState<boolean>(false);

  const {
    handleClose,
    opened,
    poolAddress,
    poolId,
    setLoadingRefund,
    setRefundTokenSuccess,
    purchasableCurrency
  } = props;

  const {
    refundToken,
    transactionHashRefundToken,
    refundTokenSuccess,
    loadingRefund,
    refundError,
  } = useSolanaRefundToken(poolId, poolAddress, purchasableCurrency);

  const handleRefundToken = async () => {
    handleClose();
    setOpenTransactionSubmitModal(true);
    await refundToken();
  };

  const handleCloseRefundModal = () => {
    handleClose();
    setLoadingRefund(false);
  };

  useEffect(() => {
    if (refundError) {
      setOpenTransactionSubmitModal(false);
      handleCloseRefundModal();
    }
    if (refundTokenSuccess) {
      setLoadingRefund(false);
      setRefundTokenSuccess(true);
    }
  }, [refundError, loadingRefund, refundTokenSuccess]);

  return (
    <>
      <Dialog open={opened} className={styles.refundDialog} maxWidth="xs">
        <Image
        width={20} height={20}
        alt="close icon"
          
          src={closeIcon}
          className={styles.btnClose}
          onClick={handleCloseRefundModal}
        />
        <Image width={23} height={23} src={refundIcon} className={styles.iconRefund} alt="" />
        <div className={styles.titleRefund}>
          <span>Refund Request</span>
        </div>
        <div className={styles.contentRefund}>
          <span>
            Once you confirm the refund request, you will not be able to
            repurchase your allocation.
          </span>
          <br />
          <b>Are you sure you want to refund?</b>
        </div>
        <div className={styles.groupButton}>
          <button
            className={styles.btnConfirm + " btn"}
            onClick={handleRefundToken}
          >
            Yes, sure
          </button>
          <button
            className={styles.btnCancel + " btn"}
            onClick={handleCloseRefundModal}
          >
            Cancel
          </button>
        </div>
      </Dialog>
      <SolanaTransactionSubmitModal
        opened={openRefundModal}
        handleClose={() => {
          setOpenTransactionSubmitModal(false);
        }}
        transactionHash={transactionHashRefundToken}
      />
    </>
  );
};

export default RefundTokenModal;
