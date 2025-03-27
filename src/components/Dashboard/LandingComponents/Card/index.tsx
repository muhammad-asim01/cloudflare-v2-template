
type LadingCardProps = {
  cardInfo: any
}
import common from '@/styles/commonstyle.module.scss'
import styles from '@/styles/card.module.scss'

export const LandingCard = (props: LadingCardProps) => {

  const {
    cardInfo,
  } = props

  return (
    <div className={styles.cardContainer}>
      <div
        className={styles.cardImage}
        style={{
          backgroundImage: `url(${cardInfo.img_url})`,
        }}
      ></div>
      <div className={styles.mainContent}>
        <span className={"card__title " + common.nnb2228i}>
          {cardInfo.title}
        </span>
        <p className={"card__description " + common.nnn1624h}>
          {cardInfo.description}{" "}
          {/* {cardInfo.learn_more_url &&
            <a href={cardInfo.learn_more_url} target="_blank">
              Learn More
            </a>} */}
        </p>
      </div>
    </div>
  );
};
