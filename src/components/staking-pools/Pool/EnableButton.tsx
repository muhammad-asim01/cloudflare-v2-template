'use client'

import React, { useContext } from "react";
import { AppContext } from "@/AppContext";
import Button from '../Button';


const WalletIcon = () => {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.973635 11.7988H13.9522C14.4893 11.7988 14.9258 11.3623 14.9258 10.8252V8.62803H10.267C9.91809 8.62803 9.57732 8.55989 9.25764 8.42356C8.94933 8.29375 8.67184 8.10551 8.43492 7.86861C8.198 7.63169 8.00977 7.35419 7.87995 7.04587C7.74527 6.72619 7.67549 6.38542 7.67549 6.03654V5.76229C7.67549 5.41341 7.74364 5.07264 7.87995 4.75296C8.00977 4.44464 8.19802 4.16716 8.43492 3.93024C8.67186 3.69332 8.94933 3.50509 9.25764 3.37527C9.57732 3.24058 9.91809 3.1708 10.267 3.1708H14.9258V0.973635C14.9258 0.436513 14.4893 0 13.9522 0H0.973635C0.436513 0 0 0.436513 0 0.973635V10.8252C0 11.3623 0.436513 11.7988 0.973635 11.7988Z" fill="white"/>
      <path d="M15.9999 4.87451C15.9999 4.47045 15.6737 4.14429 15.2696 4.14429H14.9256H10.2668C9.37264 4.14429 8.64893 4.86802 8.64893 5.76214V6.03638C8.64893 6.93051 9.37266 7.65422 10.2668 7.65422H14.9256H15.2696C15.6737 7.65422 15.9999 7.32806 15.9999 6.924V4.87451ZM10.5313 6.7585C10.0558 6.7585 9.67124 6.37393 9.67124 5.89845C9.67124 5.42299 10.0558 5.03841 10.5313 5.03841C11.0067 5.03841 11.3913 5.42299 11.3913 5.89845C11.3913 6.37393 11.0067 6.7585 10.5313 6.7585Z" fill="white"/>
    </svg>
  )
}

const ConnectButton = (props: any) => {

  const {
    openConnectWallet,
    setOpenConnectWallet,
    connectWalletLoading,
  } = useContext(AppContext);

  return (
    <Button
      text="Enable"
      backgroundColor="#3232DC"
      onClick={()=> {!openConnectWallet && !connectWalletLoading && setOpenConnectWallet && setOpenConnectWallet(true)}}
      style={{
        color: '#FFFFFF',
        height: '28px',
        width: 'auto',
        margin: 'auto 0px 10px 0px',
        borderRadius: '36px',
        display: 'flex',
        alignItems: 'center'
      }}
    />
  )
}

export default ConnectButton;