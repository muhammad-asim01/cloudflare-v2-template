'use client'

import { useState, useEffect } from 'react';
import styles from "@/styles/modalVerifyEmail.module.scss";
import useWalletSignature from '@/hooks/useWalletSignature';
import commonStyles from '@/styles/commonstyle.module.scss'
import axios from 'axios';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { getConfigAuthHeader } from '@/utils/configHeader';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'react-toastify';
import Image from 'next/image';

const closeIcon = '/assets/images/icons/close.svg';
const REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ModalVerifyEmail = (props: any) => {

  const { address: connectedAccount } = useAppKitAccount();
  const { signature, signMessage, setSignature } = useWalletSignature();
  const [inputEmail, setInputEmail] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [disableVerify, setDisableVerify] = useState(true);

  const {
    setOpenModalVerifyEmail,
    email,
    setEmail,
    setEmailVeryfied,
    open
  } = props;

  useEffect(() => {
    setInputEmail(email);
  }, [email])

  useEffect(() => {
    if(signature != '') {
      const data = {
        email: inputEmail,
        signature: signature,
        wallet_address: connectedAccount || ''
      }
      // const options = {
      //   headers: {
      //     msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE
      //   }
      // }

      const authConfig = getConfigAuthHeader(connectedAccount)
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/register-email`, data, authConfig)
      .then(res => {
        if(res.data.status == 200) {
          toast.success(res.data.message);
          window.location.reload();
          setEmail(inputEmail)
          setOpenModalVerifyEmail(false);
          setEmailVeryfied(1);
        } else if(res.data.status == 400) {
          toast.error(res.data.message);
        }
      }).catch(() => {
        toast.error('Email register failure, please try again later');
      })
      setSignature('');
    }
  }, [signature])

  useEffect(() => {
    if(!REGEX.test(inputEmail) || inputEmail == '') setDisableVerify(true);
    else setDisableVerify(false);
  }, [inputEmail])

  const handleVerifyEmail = async () => {
    if(inputEmail != '' && REGEX.test(inputEmail) == false || inputEmail == '') {
      setInvalidEmail(true);
      return;
    }
    setInvalidEmail(false);
    await signMessage();
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={() => setOpenModalVerifyEmail(false)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + ' ' + styles.modalVerifyEmail}
    >
      <div className="modal-content">
        <DialogTitle id="alert-dialog-slide-title" className="modal-content__head">
          <Image width={20} height={20} src={closeIcon} alt="" className="btn-close" onClick={() => setOpenModalVerifyEmail(false)}/>
          <span className="title">Verify Email</span>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className="subtitle">
            <span>Email</span>
          </div>
          <div className="input-group">
            <input
              type="text"
              value={inputEmail}
              onChange={e => setInputEmail(e.target.value)}
              placeholder="Please enter email"
              maxLength={190}
            />
          </div>
          {invalidEmail && <span style={{color: '#D01F36'}}>Invalid Email</span>}
        </DialogContent>
        <DialogActions className="modal-content__foot">
          <button
            className={"btn-approve" + ((disableVerify) ? ' disabled': '')}
            onClick={() => handleVerifyEmail()}
            disabled={disableVerify}
          >Verify</button>
          <button
            className="btn-cancel"
            onClick={() => setOpenModalVerifyEmail(false)}
          >Cancel</button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalVerifyEmail;
