import React, { useEffect, useState } from "react";
const coverImage = "images/landing/halloween.png";
const cover768 = "images/landing/halloween768.png";
const cover604 = "images/landing/halloween604.png";
const cover300 = "images/landing/halloween300.png";
const crossBtn = "images/landing/cross-btn.svg";
import styles from '@/styles/card.module.scss'
import Image from "next/image";

const CoverPage = () => {
  const [showBanner, setToggleBanner] = useState<any>(true);

  const toggleBanner = () => {
    setToggleBanner(false);
  };

  return (
    <>
      {showBanner ? (
        <a href={"https://www.degenpad.com/buy-token/11"} target="_blank">
          <div className={styles.coverContainer}>
            <Image width={20} height={20} className="cover-md" src={cover768} alt="" />
            <Image width={20} height={20} className="cover-sm" src={cover604} alt="" />
            <Image width={20} height={20} className="cover-xsm" src={cover300} alt="" />
            <Image width={20} height={20} className="cover-lg" src={coverImage} alt="" />
            <Image width={20} height={20} className="cover-xlg" src={coverImage} alt="" />
            <button className="participate">participate</button>
        
          </div>
        </a>
      ) : (
        <></>
      )}
    </>
  );
};
export default CoverPage;
