import React from "react";
import styles from "@/styles/404.module.scss";
import { useRouter } from "next/router";

export default function PageNotFound({title, description, url, buttonLink}: any) {
  const router = useRouter();
  const openNewTab = (url: any) => {
    if(url === "/") {
        router.push("/")
        return;
    }
    window.open(url, "_blank");
  };
  return (
    <>
      <div className={styles.services_regions_wrap}>
        <div className={styles.cardContainer}>
          <div className={styles.servicesregions}>
            <h3 className={styles.h3}>{title}</h3>
            <p className={styles.p}>
              {description}
            </p>
            <button
              className={styles.btnPrimary}
              onClick={() => openNewTab(url)}
            >
              {buttonLink}
              <div className={styles.cut}></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
