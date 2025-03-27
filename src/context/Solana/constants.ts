import { PublicKey } from "@solana/web3.js";

const safePublicKey = (key: any) => {
    try {
      if (!key) throw new Error("Empty key");
      return new PublicKey(key);
    } catch (error : any) {
      console.error(`Invalid public key: ${key} - ${error.message}`);
      return null;
    }
  };

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = safePublicKey(
  process.env.NEXT_PUBLIC_SOLANA_LIB_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID || ""
);
const BLANK_ADDRESS = safePublicKey(
  process.env.NEXT_PUBLIC_SOLANA_LIB_BLANK_ADDRESS || ""
);
const PROGRAM_ID = safePublicKey(
  process.env.NEXT_PUBLIC_SOLANA_LIB_PROGRAM_ID || ""
);
const TOKEN_PROGRAM_ID = safePublicKey(
  process.env.NEXT_PUBLIC_SOLANA_LIB_TOKEN_PROGRAM_ID || ""
);
export {
  TOKEN_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  BLANK_ADDRESS,
  PROGRAM_ID,
};
