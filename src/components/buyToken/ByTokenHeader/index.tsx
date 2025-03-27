'use client'

import { FC } from "react";
import styles from '@/styles/buyTokenHeader.module.scss'
import Head from "next/head";
import Image from "next/image";

const poolImage = "/assets/images/pool_circle.svg";

type Props = {
  poolDetailsMapping: any;
  poolDetails: any;
};

const HeaderByToken: FC<Props> = ({ poolDetailsMapping, poolDetails }) => {


  // var minTierDisplay = navHeader[0]?.minTier?.display;
  const minTierDisplay = poolDetailsMapping?.minTier?.display;
  const method = poolDetailsMapping?.method?.display;
  const {
    telegram_link,
    twitter_link,
    medium_link,
    discord_link,
    facebook_link,
    youtube_link,
  } = poolDetails?.socialNetworkSetting || {};

  return (
    <>
      <Head>
        <meta
          name="title"
          content={`${poolDetails?.title} | on DegenPad`}
        />
        <meta
          property="og:title"
          content={`${poolDetails?.title} | on DegenPad`}
        />
        <meta name="image" content={poolDetails?.token_images} />
        <meta name="description" content={poolDetails?.shortDescription} />
        <meta property="og:image" content={poolDetails?.token_images} />
        <meta
          property="og:description"
          content={poolDetails?.shortDescription}
        />
      </Head>
      <div id="buyTokenHeader" className={styles.buyTokenHeader}>
        <div className={styles.tokenImg}>
          <Image
          width={50} height={50}
            className={styles.iconToken}
            src={poolDetails?.banner || poolImage}
            alt=""
          />
        </div>
        <div className={styles.headerWrap}>
          <div className={styles.introText}>
            <span className={styles.title}>{poolDetails?.title}</span>
            {poolDetails?.shortDescription ? (
              <>
                <div className={styles.introDescr + " two-lines-limit"}>
                  <p>{poolDetails?.shortDescription}</p>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          {/* <span className="token-symbol">
            {poolDetails?.tokenDetails.symbol}
          </span> */}
          <div className={styles.poolHeaderInfo}>
            <div className={styles.flexRow}>
              {method != "TBA" && (
                <div className={styles.labelStatus + " " + styles.upperText}>
                  {method ?? "PUBLIC"}
                </div>
              )}
              <div className={styles.labelStatus}>
                {minTierDisplay}
                &nbsp;
                {minTierDisplay !== "No tier & KYC required" &&
                minTierDisplay !== "No tier required"
                  ? "at Min Tier"
                  : ""}
              </div>
            </div>
            <div className={styles.socialIcons}>
              {poolDetails?.website && (
                <a
                  target="_blank"
                  href={poolDetails?.website}
                  className={styles.itemSocsial}
                  rel="noreferrer nofollow"
                >
                  <Image width={24} height={24} src="/assets/images/socials/website.svg" alt="" />
                </a>
              )}
              {telegram_link && (
                <a
                  target="_blank"
                  href={telegram_link}
                  className={styles.itemSocsial}
                  rel="noreferrer nofollow"
                >
                  <Image width={24} height={24} src="/assets/images/socials/telegram.svg" alt="" />
                </a>
              )}
              {twitter_link && (
                <a
                  target="_blank"
                  href={twitter_link}
                  className={styles.itemSocsial}
                  rel="noreferrer nofollow"
                >
                  <Image width={24} height={24} src="/assets/images/socials/twitter.svg" alt="" />
                </a>
              )}
              {medium_link && (
                <a
                  target="_blank"
                  href={medium_link}
                  className={styles.itemSocsial}
                  rel="noreferrer nofollow"
                >
                  <Image width={24} height={24} src="/assets/images/socials/m.svg" alt="" />
                </a>
              )}
              {discord_link && (
                <a
                  target="_blank"
                  href={discord_link}
                  className={styles.itemSocsial}
                  rel="noreferrer nofollow"
                >
                  <Image width={24} height={24} src="/assets/images/socials/discord.svg" alt="" />
                </a>
              )}
              {facebook_link && (
                <a
                  target="_blank"
                  href={facebook_link}
                  className={styles.itemSocsial}
                  rel="noreferrer nofollow"
                >
                  <Image width={24} height={24} src="/assets/images/socials/facebook.svg" alt="" />
                </a>
              )}
              {youtube_link && (
                <a
                  target="_blank"
                  href={youtube_link}
                  className={styles.itemSocsial}
                  rel="noreferrer nofollow"
                >
                  <Image width={24} height={24} src="/assets/images/socials/youtube.svg" alt="" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderByToken;
