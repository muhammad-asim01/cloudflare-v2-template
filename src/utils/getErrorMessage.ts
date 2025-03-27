import { TRANSACTION_ERROR_MESSAGE } from "../constants/alert";

export const getErrorMessage = (err: any) => {
  // Init regex inside a function to reset regex (reset lastIndex)
  const REGEX_GET_MESSAGE = /execution reverted:([^"]*)/gm;
  if (err.message?.includes("execution reverted:")) {
    const match = REGEX_GET_MESSAGE.exec(err.message);
    return match ? match[1] : TRANSACTION_ERROR_MESSAGE;
  }
  if (err.message?.includes("User denied")) {
    return err.message;
  }
  return TRANSACTION_ERROR_MESSAGE;
};
