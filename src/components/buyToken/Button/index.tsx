import React from "react";
import styles from "@/styles/buytokenbutton.module.scss";
import { BeatLoader } from 'react-spinners';

type ButtonPropsType = {
  backgroundColor?: string;
  text: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
  color?: string;
  style?: any;
};

const Button: React.FC<ButtonPropsType> = (props: ButtonPropsType) => {
  const {
    style,
    backgroundColor = "transparent",
    color = '#1e1e1e',
    text = "",
    disabled = false,
    onClick,
    loading = false,
  } = props;
  const customStyle = {
    ...style,
    backgroundColor,
    color
  };

  return (
    <button
      style={customStyle}
      className={styles.button}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <BeatLoader color={"#0066ff"} size={8} /> : `${text}`}
    </button>
  );
};

export default Button;
