import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  IconButton,
  Typography,
  Link,
  Box,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {useEffect, useState } from "react";

import axios from "axios";
import { setCookie } from "../../../../utils";
import { styled } from "@mui/material/styles";
import Image from "next/image";

const disclaimer = "/images/icons/disclaimer-warning.svg";

// Styled Dialog Title
const DialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  background: "#020616",
  paddingTop: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "white",
}));

const CloseButton = styled(IconButton)({
  position: "absolute",
  right: 12,
  top: 12,
  color: "#09090e",
  backgroundColor: "#D4D4D4",
  padding: 4,
  "&:hover": {
    backgroundColor: "#D4D4D4",
  },
});

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  color: "#999999",
}));

interface ComponentProps {
  opened: boolean;
  handleClose: () => void;
  handleDisclaimerAccept?: () => void;
}

const ConnectWalletModal: React.FC<ComponentProps> = ({
  opened,
  handleClose,
  handleDisclaimerAccept,
}) => {

  const [termsData, setTermsData] = useState<{ id?: string; content?: string }>(
    {}
  );
  const [disclaimerContent, setDisclaimerContent] = useState<string>("");



  const wrapNumbersWithSpan = (html: string) => {
    const regex = /(\d{2}\.)/g;
    if (html) {
      return regex.test(html)
        ? html.replace(regex, "<span>$1</span>")
        : `<strong>${html}</strong>`;
    }
    return html;
  };

  const getTermsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/landing-page-json`
      );
      setTermsData(response?.data?.data?.TermsAndConditions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTermsData();
  }, []);

  useEffect(() => {
    if (termsData?.content) {
      setDisclaimerContent(wrapNumbersWithSpan(JSON.parse(termsData.content)));
    }
  }, [termsData]);

  const handleAccept = () => {
    handleDisclaimerAccept?.();
    setCookie("terms_status", "1", 365);
    setCookie("disclaimer_id", termsData?.id || "", 365);
    handleClose();
  };

  const handleDecline = () => {
    setCookie("terms_status", "0", 365);
    handleClose();
  };

  return (
    <Dialog open={opened} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Image width={88} height={88} src={disclaimer} alt="disclaimer" />
          <Typography variant="h6" ml={2}>
            Disclaimer
          </Typography>
        </Box>
        <CloseButton onClick={handleClose}>
          <CloseIcon />
        </CloseButton>
      </DialogTitle>

      <DialogContent>
        <Box p={2}>
          <Box dangerouslySetInnerHTML={{ __html: disclaimerContent }} />
        </Box>

        <Box mt={3} px={2}>
          <Typography variant="body2">
            Please ensure you have read and understood our{" "}
            <Link href="/privacy" target="_blank">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" target="_blank">
              Terms of Service
            </Link>{" "}
            before proceeding.
          </Typography>
        </Box>

        <Box mt={3} px={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleAccept}>
            Proceed
          </Button>
          <Button variant="outlined" color="error" onClick={handleDecline}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletModal;
