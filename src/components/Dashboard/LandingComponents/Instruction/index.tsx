import React from "react";
import styles from "@/styles/instructions.module.scss";
import Slider from "react-slick";
import {isMobile} from "react-device-detect";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import Image from "next/image";
const nextIcon = "/assets/images/icons/next.svg";


const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

const Instruction = () => {
    const configData : any = useSelector((store : any) => store?.config?.data);
    if (isMobile) {
        return (
          <div className={styles.cardContainer}>
            <Slider {...settings}>
              {configData?.data?.registerSection?.map(
                    (instruction: any, index: any) => {
                      return (
                        <div
                          className={styles.instructionContainer}
                          key={index}
                        >
                          <div className={styles.instructionContent}>
                            <Image
                            alt=""
                            width={24} height={24}
                              className="instruction-img"
                              src={instruction.img_url}
                            />
                            <div className={styles.instructionText}>
                              <h1>{instruction.title}</h1>
                              <p>{instruction.description}</p>
                            </div>
                            <a href={instruction?.learn_more_url} className={styles.btn} target="_blank">
                              {instruction.button_name}
                              <Image alt="" width={24} height={24}
                                style={{ marginLeft: 8, height: 12 }}
                                src={nextIcon}
                              />
                            </a>
                          </div>
                        </div>
                      );
                    }
                  )}
            </Slider>
          </div>
        );
    }
    return (
      <div
        className={styles.cardContainer}
        style={{ flexDirection: "unset", alignItems: "unset" }}
      >
        {configData?.data?.registerSection?.map(
              (instruction: any, index: any) => {
                return (
                  <div className={styles.instructionContainer} key={index}>
                    <div className={styles.instructionContent}>
                      <Image width={24} height={24} src={instruction.img_url} alt=""/>
                      <div className={styles.instructionText}>
                        <h1>{instruction.title}</h1>
                        <p>{instruction.description}</p>
                      </div>
                      <a
                        href={instruction.learn_more_url}
                        className={styles.btn}
                        target="_blank"
                      >
                        {instruction.button_name}
                        <Image
                        width={24} height={23}
                        alt=""
                          style={{ marginLeft: 8, height: 12 }}
                          src={nextIcon}
                        />
                      </a>
                    </div>
                  </div>
                );
              }
            )}
      </div>
    );
}

export default Instruction;
