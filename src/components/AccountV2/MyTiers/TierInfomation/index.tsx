import styles from '@/styles/tierInformation.module.scss'

const Tiers = (props: any) => {
  const { title, action } = props;

  return (
    <div className={styles.tierInfomation}>
      <div className={styles.conversionRate}>
        {/* <h3 className={styles.title}>Conversion Rate</h3> */}

        <button className={styles.buttonStake} onClick={() => action()}>
          {title}
        </button>
      </div>
    </div>
  );
};

export default Tiers;
