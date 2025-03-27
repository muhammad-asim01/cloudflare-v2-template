import React from "react";
import styles from "@/styles/staking.module.scss";
import { LandingCard } from "../Card";
import { Fade } from "react-awesome-reveal";
import { isMobile } from "react-device-detect";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const Features = () => {
  const configData: any = useSelector((store: any) => store?.config?.data);
  if (isMobile) {
    return (
      <div className={styles.cardContainer}>
        <span className={styles.cardTitle}>DegenPad Features</span>
        <div className={styles.sliderContainer}>
          <Slider {...settings}>
            {configData?.featureSection?.map(
              (cardInfo: any, index: any) => {
                return <LandingCard key={index} cardInfo={cardInfo} />;
              }
            )}
          </Slider>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.cardContainer}>
      <span className={styles.cardTitle}>DegenPad Features</span>
      <div className="main-content">
        <Fade>
          {configData?.featureSection?.map(
            (cardInfo: any, index: any) => {
              return <LandingCard key={index} cardInfo={cardInfo} />;
            }
          )}
        </Fade>
      </div>
    </div>
  );
};

export default Features;
