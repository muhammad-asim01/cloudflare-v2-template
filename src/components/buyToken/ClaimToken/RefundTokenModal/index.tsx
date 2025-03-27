'use client'

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import styles from '@/styles/refundTokenModal.module.scss'
import useRefundToken from "../../hooks/useRefundToken";
import TransactionSubmitModal from "@/components/Base/TransactionSubmitModal";
import { getChainIDByName } from "@/utils";
import {
  NetworkUpdateType,
  settingAppNetwork,
} from "@/store/slices/appNetworkSlice";
import { requestSupportNetwork } from "@/utils/setupNetwork";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useSwitchChain } from "wagmi";
import Image from "next/image";
const refundIcon = "/assets/images/refund_token.svg";

const closeIcon = "/assets/images/icons/close.svg";

const RefundTokenModal = (props: any) => {
  const dispatch = useDispatch();
  const { switchChainAsync } = useSwitchChain();
  const { appChainID } = useTypedSelector((state) => state.appNetwork).data;
  const [openRefundModal, setOpenTransactionSubmitModal] =
    useState<boolean>(false);

  const {
    handleClose,
    opened,
    poolAddress,
    poolId,
    poolDetails,
    setLoadingRefund,
    setRefundTokenSuccess,
  } = props;

  const {
    refundToken,
    transactionHashRefundToken,
    refundTokenSuccess,
    loadingRefund,
    refundError,
  } = useRefundToken(poolAddress, poolId);

  const handleRefundToken = async () => {
    handleClose();
    setOpenTransactionSubmitModal(true);
    const chainId = getChainIDByName(poolDetails?.networkAvailable);
    if (chainId !== appChainID) {
      const chainId: any = getChainIDByName(poolDetails?.networkAvailable);
      await switchChainAsync({ chainId: Number(chainId) });

      dispatch(settingAppNetwork({networkType:NetworkUpdateType.App, updatedVal:chainId}));
    }
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
        <Image width={20} height={20}
        alt="close icon"
          src={closeIcon}
          className={styles.btnClose}
          onClick={handleCloseRefundModal}
        />
        <Image width={24} height={24} src={refundIcon} className={styles.iconRefund} alt="" />
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
      <TransactionSubmitModal
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
