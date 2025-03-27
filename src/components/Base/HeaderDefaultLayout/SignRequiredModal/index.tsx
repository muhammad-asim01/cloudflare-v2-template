import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import styles from '@/styles/signrequiremodal.module.scss'
import Image from "next/image";

export interface ComponentProps {
  opened: boolean;
}

const SignRequiredModal: React.FC<ComponentProps> = (props) => {
  // const styles = useStyles();
  const { opened } = props;

  return
  return (
    <Dialog open={opened} className={styles.dialog} maxWidth="xs">
      <Image src="/assets/images/icons/warning3.svg"
      width={48}
      height={48}
      alt="" />
      <DialogTitle
        id="customized-dialog-title"
        className={styles.dialogTitle}
      >
        <Typography variant="h6">Signature Required</Typography>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        Please sign on your wallet to confirm.
      </DialogContent>
    </Dialog>
  );
};

export default SignRequiredModal;