'use client'
import React from "react";
import styles from "@/styles/servicesRegion.module.scss";
import { useRouter } from "next/navigation";


export default function NotFound({ description, url, buttonLink }: any) {
  const router = useRouter();
  const openNewTab = (url: any) => {
    if (url === "/") {
      router.push("/");
      return;
    }
    window.open(url, "_blank");
  };
  return (
    <>
      <div className={styles.degenpad404}>
        {/* <h3 className={styles.h3}>{title}</h3> */}
        <div className={styles.errortext}>
          <p>{description}</p>
          <button className={styles.backtohome} onClick={() => openNewTab(url)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.15271 6.54352C4.05493 6.44492 4 6.31122 4 6.17181C4 6.03239 4.05493 5.89869 4.15271 5.80009L7.10326 2.82585C7.15138 2.77564 7.20893 2.73558 7.27256 2.70803C7.3362 2.68047 7.40464 2.66597 7.47389 2.66536C7.54315 2.66476 7.61183 2.67806 7.67593 2.7045C7.74003 2.73093 7.79826 2.76997 7.84723 2.81934C7.89621 2.8687 7.93494 2.9274 7.96116 2.99202C7.98739 3.05663 8.00058 3.12586 7.99998 3.19568C7.99938 3.26549 7.98499 3.33448 7.95766 3.39862C7.93032 3.46277 7.89059 3.52078 7.84077 3.56928L5.25897 6.17181L7.84077 8.77433C7.93578 8.87349 7.98835 9.0063 7.98716 9.14415C7.98597 9.282 7.93112 9.41387 7.83442 9.51135C7.73771 9.60883 7.60689 9.66413 7.47014 9.66533C7.33338 9.66652 7.20163 9.61353 7.10326 9.51776L4.15271 6.54352Z"
                fill="#1E1E1E"
              />
            </svg>
            {buttonLink}
          </button>
        </div>
      </div>
    </>
  );
}
