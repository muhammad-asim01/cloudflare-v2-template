import React from 'react';
import { BeatLoader } from "react-spinners";

type ButtonPropsType = {
  backgroundColor?: string;
  text: string;
  href?: string;
  content?: any;
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean,
  style?: any,
}
import styles from '@/styles/button.module.scss'

const Button: React.FC<ButtonPropsType> = (props: ButtonPropsType) => {
  const { style, backgroundColor = 'transparent', text = '', content = null, disabled = false, onClick, loading = false } = props;
  const customStyle = {
    ...style,
    backgroundColor,
  };

  return (
    <button style={customStyle} className={styles.button} disabled={disabled || loading} onClick={onClick}>
      {
        loading ? <BeatLoader color={'white'} size={8} /> : (`${text}` || content)
      }
    </button>
  )
}

export default Button;
