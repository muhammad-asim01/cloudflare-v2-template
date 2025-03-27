import { TextField } from "@mui/material";
import styles from "@/styles/tonConnectWalletStepper.module.scss"
import Image from "next/image";

export const TextInput = ({
  placeholder,
  value,
  setState,
  name,
  icon,
  symbol,
  label,
}: any) => {
  return (
    <div className={styles.inputGroup}>
      <span className="title">
        {label} <span className={styles.asterik}>*</span>
      </span>
      <div className="accountContent">
        <div className={styles.groupInput}>
          <TextField
            className={styles.inputNewValue}
            placeholder={placeholder}
            name={name}
            onChange={(e) => setState(e.target.value)}
            value={value}
          />
          <div className={styles.tokenImages}>
            {icon && <Image width={16} height={16} src={icon} alt="" />}
            <span>{symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TextInputWithoutIcon = ({
    placeholder,
    value,
    setState,
    name,
    label,
    disabled
  }: any) => {
    return (
      <div className={styles.inputGroup}>
        <span className="title" style={{color: '#0066FF'}}>
          {label} <span className={styles.asterik}>*</span>
        </span>
        <div className="accountContent">
          <div className={styles.groupInput}>
            <TextField
              className={styles.inputNewValue}
              placeholder={placeholder}
              name={name}
              onChange={(e) => setState(e.target.value)}
              value={value}
              disabled = {disabled}
            />
          </div>
        </div>
      </div>
    );
  };