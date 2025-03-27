import React from "react";
import styles from "@/styles/loadingTable.module.scss";

const LoadingTable = () => {
  return (
      <div className={styles.loadingContainer}>
        <div className='spinner-loading'>
        </div>
          <span>Loading</span>
      </div>
  )
};

export default LoadingTable;
