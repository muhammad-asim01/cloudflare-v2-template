"use client";

import { exchanges, ExchangeTypes } from "@/constants/exchanges";
import React from "react";
import styles from "@/styles/welcome.module.scss";
import common from '@/styles/commonstyle.module.scss'

import { Fade } from "react-awesome-reveal";
import { isMobile } from "react-device-detect";

import {  useSelector } from "react-redux";
import Image from "next/image";
import CustomImage from "@/components/Base/Image";

const Welcome = () => {
  const configData: any = useSelector((store: any) => store?.config?.data);
  const attachments = configData?.attachments || [];

  if (isMobile) {
    return (
      <>
        <div className={styles.container + " " + styles.animation}>
          <Image
          width={32} height={32}
            className="bg-mobile-xs"
            src={
              attachments.find(
                (item: any) =>
                  item.pivot.attachment_purpose === "landing_background_mobile"
              )?.file_url
            }
            alt=""
          />
          <Image
        width={32} height={32}
            className="bg-mobile-sm"
            src={
              attachments.find(
                (item: any) =>
                  item.pivot.attachment_purpose === "landing_backgroundSM"
              )?.file_url
            }
            alt=""
          />
          {/* <div className="cover">
              <CoverPage />
            </div> */}
          <div className="main-content">
            <div className="title">
              <Fade direction="left">
                <h1 className={common.nnb4856i}>
                  <p
                    style={{
                      font: "normal normal 400 14px/24px   Violet Sans",
                      color: "#757575",
                    }}
                  >
                    DegenPad
                  </p>
                  {"\n"}
                  <span className="gradient-underline">
                    <span className="gradient-underline-text">
                      {configData?.landing_title}
                    </span>
                  </span>
                  <br />

                  <span className="gradient-underline-text1">
                    {configData?.landing_title1}
                  </span>
                </h1>
              </Fade>
            </div>
            <Fade direction="left">
              <div className={`${common.nnn1424h} description`}>
                {configData?.landing_description}
              </div>
            </Fade>
          </div>
          <div className={styles.idoBtnMobile}>
            <a className={styles.btnGradient} href={"/pools"}>
              <span>IDO Pools</span>
            </a>
          </div>
        </div>
        <div className={styles.flexContainer}>
          <div>
            <div className={styles.quickLink}>
              <div className={styles.quickLinkItem}>
                <a className={styles.btnGray} href={"/staking-pools"}>
                  <p>
                    <Image alt=""
                      width={16}
                      height={16}
                      src={
                        attachments.find(
                          (item: any) =>
                            item.pivot.attachment_purpose === "staking_icon"
                        )?.file_url
                      }
                    />
                    <span>Stake $CGPT</span>
                  </p>
                </a>
              </div>
              <div className={styles.quickLinkItem}>
                <a
                  className={styles.btnGray}
                  href={"https://t.me/DegenPadNews"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>
                    <Image alt=""
                      width={16}
                      height={16}
                      src={
                        attachments.find(
                          (item: any) =>
                            item.pivot.attachment_purpose === "notified_icon"
                        )?.file_url
                      }
                    />
                    <span>Get Notified</span>
                  </p>
                </a>
              </div>
            </div>
            {/* <div className={styles.aboutMobile}>
              <div className="about-row">
                <div className="about-item">
                  <span className="data-number">
                    {statistic?.number_project || "TBA"}
                  </span>
                  <span className="data-name">IDO PROJECTS</span>
                </div>
                <div className="about-item">
                  <span className="data-number">
                    {statistic?.fund_raised || "TBA"}
                  </span>
                  <span className="data-name">Free Giveaways</span>
                </div>
              </div>
              <div className="about-row">
                <div className="about-item">
                  <span className="data-number">
                    {statistic?.avg_roi || "TBA"}
                  </span>
                  <span className="data-name">ATH AVG ROI</span>
                </div>
                <div className="about-item">
                  <span className="data-number">
                    {Number(statistic?.c_supply_locked)?.toFixed(1) + "%" || "9%"}
                  </span>
                  <span className="data-name">C-SUPPLY LOCKED</span>
                </div>
              </div>
            </div> */}

            <Fade big>
              <div className={styles.supportedExchanges}>
                {/*<p>Supported exchanges to buy $cgpt</p>*/}
                <div className={common.exchanges}>
                  {exchanges.map((item: ExchangeTypes) => (
                    <a
                      key={item.logo}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer nofollow"
                      className={`${common.exchangeItem}`}
                    >
                      <Image 
                      width={23} height={23} src={item.logo} alt="" />
                      <div className="exchange-stick-line"></div>
                    </a>
                  ))}
                </div>
              </div>
            </Fade>
          </div>
          <div className={styles.copyRight}>
            <Image width={20} height={20} className="powered-by" src="/assets/images/powered-by.svg" alt="" style={{marginTop: '-160px'}} />
            <Image width={20} height={20} src="/assets/images/landing/arrowdown.svg" alt="" />
          </div>
        </div>
      </>
    );
  }
  return (
    <div className={styles.container + " " + styles.animation}>
     
       <CustomImage
              className="landing background"
              src={
                attachments.find(
                  (item: any) =>
                    item.pivot.attachment_purpose === "landing_background"
                )?.file_url
              }
              alt="landing background"
              unoptimized={false}
              width={400}
              height={250}
              defaultImage={
                "/assets/images/defaultImages/image-placeholder.png"
              }
            />
      <>
        {/* <div className="cover">
            <CoverPage />
          </div> */}
        <div className="main-content">
          <div className="title">
            <Fade direction="left">
              <h1 className={common.nnb4856i}>
                <p
                  style={{
                    font: "normal normal 400 14px/24px   Violet Sans",
                    color: "#757575",
                  }}
                >
                  DegenPad
                </p>
                {"\n"}
                <span className="gradient-underline">
                  <span className="gradient-underline-text">
                    {configData?.landing_title}
                  </span>
                </span>
                <br />
                <span className="gradient-underline-text1">
                  {configData?.landing_title1}
                </span>
              </h1>
            </Fade>
          </div>
          <Fade direction="left">
            <div className={`${common.nnn1424h} ${styles.description}`}>
              {configData?.landing_description}
            </div>
            <div className={styles.quickLink}>
              <div className={styles.quickLinkItem}>
                <a className={styles.btnGradient} href={"/pools"}>
                  <span>IDO Pools</span>
                </a>
              </div>
              <div className={styles.quickLinkItem}>
                <a className={styles.btnGray} href={"/staking-pools"}>
                  <p>
                 
                          <CustomImage
              className="landing background"
              src={
                attachments.find(
                  (item: any) =>
                    item.pivot.attachment_purpose === "staking_icon"
                )?.file_url
              }
              alt="landing background"
              unoptimized={false}
              width={20}
              height={20}
              defaultImage={
                "/assets/images/defaultImages/image-placeholder.png"
              }
            />
                    <span>Stake $CGPT</span>
                  </p>
                </a>
              </div>
              <div className={styles.quickLinkItem}>
                <a
                  className={styles.btnGray}
                  href={"https://t.me/DegenPadNews"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>
                  <CustomImage
              className="landing background"
              src={
                attachments.find(
                  (item: any) =>
                    item.pivot.attachment_purpose === "notified_icon"
                )?.file_url
              }
              alt="landing background"
              unoptimized={false}
              width={20}
              height={20}
              defaultImage={
                "/assets/images/defaultImages/image-placeholder.png"
              }
            />
                 
                    <span>Get Notified</span>
                  </p>
                </a>
              </div>
            </div>
            {/* <div className={styles.about}>
              <div className="about-item">
                <span className="data-number">
                  {statistic?.number_project || "TBA"}
                </span>
                <span className="data-name">IDO PROJECTS</span>
              </div>
              <div className="about-item">
                <span className="data-number">
                  {statistic?.fund_raised || "TBA"}
                </span>
                <span className="data-name">FREE Giveaways</span>
              </div>
              <div className="about-item">
                <span className="data-number">
                  {statistic?.avg_roi || "TBA"}
                </span>
                <span className="data-name">ATH AVG ROI</span>
              </div>
              <div className="about-item">
                <span className="data-number">
                  {Number(statistic?.c_supply_locked)?.toFixed(1) + "%" || "9%"}
                </span>
                <span className="data-name">C-SUPPLY LOCKED</span>
              </div>
            </div> */}
          </Fade>

          <Fade big>
            <div className={styles.supportedExchanges}>
              {/*<p>Supported exchanges to buy $cgpt</p>*/}
              <div className={common.exchanges}>
                {exchanges.map((item: ExchangeTypes) => (
                  <a
                    key={item.logo}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer nofollow"
                    className={`${common.exchangeItem}`}
                  >
                    <Image alt="" 
                    height={40} width={70} src={item.logo} />
                    <div className="exchange-stick-line"></div>
                  </a>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </>
      <div
        className={"copyRight"}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image width={20} height={20} src="/assets/images/powered-by.svg" alt="" style={{
          cursor:'default'
        }} />


<CustomImage
                         width={32} height={32}
                         alt=""
                           onClick={() => {
                             const footer = document.getElementById("launchpad");
                             if (footer) {
                               const offset = 80; // Offset of 10 pixels
                               const elementPosition = footer.getBoundingClientRect().top + window.pageYOffset;
                               console.log(elementPosition)
                               const offsetPosition = elementPosition - offset;
                           
                               window.scrollTo({
                                 top: offsetPosition,
                                 behavior: "smooth",
                               });
                             }
                           }}
                           src={
                             attachments.find(
                               (item: any) => item.pivot.attachment_purpose === "poweredBy_logo"
                             )?.file_url || "/assets/images/icons/staking.svg"
                           }
                       
                        onError={(event: any) => {
                          event.target.src = "/assets/images/icons/staking.svg";
                        }}
                        defaultImage={
                            "/assets/images/defaultImages/image-placeholder.png"
                        }
                      />
        <span>{configData?.powered_by}</span>
      </div>
    </div>
  );
};

export default Welcome;
