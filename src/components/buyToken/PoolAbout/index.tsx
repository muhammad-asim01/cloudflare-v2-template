import React from 'react';
import styles from '@/styles/poolAbout.module.scss'

type PoolAboutProps = {
  website: string | undefined,
  exchangeRate: string | undefined | number
  description: string | undefined
}   

const PoolAbout: React.FC<PoolAboutProps> = ({ description }: PoolAboutProps) => {

  return (
    <div className={styles.PoolAbout}>
      <p className={styles.PoolAboutDesc}>
        {description}
      </p>
    </div>
  )
}

export default PoolAbout;
