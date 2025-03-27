import React from "react";
import styles from "@/styles/staking.module.scss";
import StakingLanding from "../StakingLanding";
import Image from "next/image";
const nextIcon = "/assets/images/icons/next.svg";

const Staking = () => {
  return (
    <div className={styles.cardContainer}>
      <span className={styles.cardTitle}>Staking Pools</span>
      <span className={styles.cardSubTitle}>
        Earn yield, boost your multiplier, and unlock access to higher tiers by
        staking in the $CGPT pools.
      </span>

      <StakingLanding />
      <div className={styles.btnGradient}>
        <a href="/staking-pools">
          <div className={styles.btnContent}>
            Stake now
            <Image
            width={24}
            height={24}
              style={{ marginLeft: 5, height: 12, marginTop: 5 }}
              src={nextIcon}
              alt=""
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Staking;
