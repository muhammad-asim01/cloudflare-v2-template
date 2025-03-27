import React from "react";
import styles from "@/styles/applyToLaunch.module.scss";
import { useSelector } from "react-redux";
import Image from "next/image";

const ApplyToLaunch: React.FC<any> = () => {

  const configData: any = useSelector((store: any) => store?.config?.data);
  return (
    <div className={styles.getAlert}>
      <div className={styles.contentGetAlert}>
        <div className={styles.leftContent}>
          <h2 className={styles.titleGetAlert}>
            {configData?.googleFormSection?.title}
          </h2>
          <button
            className={styles.btn}
            onClick={() => {
              window.location.href =
                "https://docs.google.com/forms/d/e/1FAIpQLSdOkjFqRtZ0Iz6nRFQiFbp1RESvCgBRkYqXRTum60QYIJV5Mw/viewform";
            }}
          >
            {configData?.googleFormSection?.button_title}
          </button>
        </div>
        <div className={styles.rightContent}>
          <Image
         width={32} height={32}
            src="/assets/images/apply-to-launch.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default ApplyToLaunch;
