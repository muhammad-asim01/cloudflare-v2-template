import React from "react";
import styles from "@/styles/mainDefaultLayout.module.scss";

const Content: React.FC<any> = (props: any) => {

  return (
    <div className={styles.mainLayout + ` dashboard`}>{props.children}</div>
  );
};

export default Content;
