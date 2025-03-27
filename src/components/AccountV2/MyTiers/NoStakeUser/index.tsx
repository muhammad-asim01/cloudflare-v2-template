import styles from '@/styles/noStakeUser.module.scss'
import { useSelector } from "react-redux";
import Link from "next/link";


export const LearnMoreTier = () => {

  const configData : any = useSelector((store : any) => store?.config);
  return (
    <div className={styles.boxQuestions}>
      <div className={styles.subTitle}>
        Learn more about how to acheive DegenPad Tier here:
      </div>
      <ul className={styles.listQuestions}>
        {configData?.data?.data?.myTiers?.Tier.map((child: any, i: any) => {
              return (
                <li key={i} className={styles.itemQuestions}>
                  <a href={child?.title_url} target="_blank" rel="noreferrer">
                    <span data-role="dot">&bull;</span>
                    <span data-role="title">{child?.title}</span>
                  </a>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

const NoStakeUser = (props: any) => {

  return (
    <div className={styles.noStakeComponent}>
      {props.isOverview ? (
        <div className={styles.title}>
          You currently have
          <span> 0 </span>
          DegenPad Points.
        </div>
      ) : (
        <div className={styles.title}>
          You currently have
          <span> 0 </span>
          points earned. You must stake to earn Reputation points.
        </div>
      )}
      <Link
      prefetch
      href={`/staking-pools`} className={styles.buttonStakeNow}>
        Stake Now
      </Link>
      {/* <LearnMoreTier /> */}
    </div>
  );
};

export default NoStakeUser;
