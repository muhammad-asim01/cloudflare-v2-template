import * as web3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import axios from "../../services/axios";
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, TOKEN_PROGRAM_ID } from "./constants";

export function get_connection() {
  return new web3.Connection(web3.clusterApiUrl("devnet"));
}

interface PoolMetadata {
  closeTime: string;
  index: number;
  openTime: string;
  owner: string;
  signer: string;
  tokenAccount: string;
  tokenMint: string;
  tokenSold: string;
  totalRefunded: string;
  totalUnclaimed: string;
}

interface TokenInfo {
  address: string;
  amount: number;
  delegatedAmount: string;
  mint: string;
  owner: string;
}

interface UserByCurrency {
  investedAmountOf: string;
  userPurchasedByCurrency: number;
  userRefundTokenCurrency: string;
  userRefundTokenCurrencyAmount: string;
  userRefundTokenIsClaimed: boolean;
}

export const isTimeError = (errorMessage: string) => {
  const regex = new RegExp(
    `^Transaction was not confirmed in 30\\.00 seconds\\. It is unknown if it succeeded or failed\\. Check signature ([1-9A-HJ-NP-Za-km-z]{88}) using the Solana Explorer or CLI tools\\.$`
  );
  const resp: any = regex.exec(errorMessage);
  if (resp === null) {
    return {
      isTimeoutError: false,
      sig: "",
    };
  } else {
    return {
      isTimeoutError: true,
      sig: resp[1],
    };
  }
};

export const SendSolanaTransaction = async (
  tx: anchor.web3.Transaction,
  address: string,
  signers?: anchor.web3.Signer[],
  confirmOptions?: anchor.web3.ConfirmOptions
) => {
  try {
    if (signers !== undefined) {
      tx.sign(...signers);
    }
    const sig = await window.solana.signAndSendTransaction(tx, confirmOptions);
    const body = {
      sig: sig.signature,
      block_hash: tx.recentBlockhash,
    };
    let response: any = null;
    const initialDelay = 8000;
    const retryInterval = 2000; 
  
    await new Promise(resolve => setTimeout(resolve, initialDelay));
  
    while (true) {
      try {
        response = await axios.post(`/user/solana/check-signature-status`, body, {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem(`access_token:${address}`),
          },
        });
        if(response?.message) {
          throw new Error(response?.message);
        }
        if (response?.data?.data === "finalized" || response?.data?.data === "failed") {
          break;
        }
      } catch (error : any) {
        if (error.response && error.response.status === 524) {
          console.log("🚀 ~ 524 timeout error, retrying...");
        }
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }

    const data = response?.data?.data;
    if (data === "finalized") {
      return sig;
    } else if (data === "failed") {
      throw new Error("Transaction Failed");
    } else {
      throw new Error("Unexpected response data");
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getPhantomWalletBalance = async (address: any) => {
  try {
    if (window?.solana?.publicKey) {
      const response = await axios.get(
        `/user/get-user-balance/${window?.solana?.publicKey}`,
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem(`access_token:${address}`),
          },
        }
      );
      const data = response.data.data;
      return data || 0;
    }
  } catch (error) {
  console.log("🚀 ~ getPhantomWalletBalance ~ error:", error)
  }
};

export const getTokenInfo = async (
  address: string | undefined | null,
  account: string | undefined | null
) => {
  if (address && account) {
    try {
      const response = await axios.get(
        `/user/solana-token-account/${account}`,
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem(`access_token:${address}`),
          },
        }
      );
      const data: TokenInfo = response.data.data;
      return data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return {
        address: "",
        amount: 0,
        delegatedAmount: "0",
        mint: "",
        owner: "",
      };
    }
  } else {
    return {
      address: "",
      amount: 0,
      delegatedAmount: "0",
      mint: "",
      owner: "",
    };
  }
};

export const getPoolMetadata = async (
  address: string | undefined | null,
  id: number
) => {
  if (address) {
    try {
      const response = await axios.get(`/user/get-pool-metadata/${id}`, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem(`access_token:${address}`),
        },
      });
      const data: PoolMetadata = response.data.data;
      return data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return {
        closeTime: "",
        index: 0,
        openTime: "",
        owner: "",
        signer: "",
        tokenAccount: "",
        tokenMint: "",
        tokenSold: "0",
        totalRefunded: "0",
        totalUnclaimed: "0",
      };
    }
  } else {
    return {
      closeTime: "",
      index: 0,
      openTime: "",
      owner: "",
      signer: "",
      tokenAccount: "",
      tokenMint: "",
      tokenSold: "0",
      totalRefunded: "0",
      totalUnclaimed: "0",
    };
  }
};

export const getOfferedCurrency = async (
  address: string | undefined | null,
  id: number
) => {
  if (address) {
    await axios.get(`/user/get-offered-currency/${id}`, {
      headers: {
        Authorization:
          "Bearer " + localStorage.getItem(`access_token:${address}`),
      },
    });
  }
};

export const getuserPurchased = async (
  address: string | undefined | null,
  id: number,
  solanaWallet: any
) => {
  if (address && id && solanaWallet) {
    try {
      const response = await axios.get(`/user/get-user-purchased/${id}/${solanaWallet}`, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem(`access_token:${address}`),
        },
      });
      const data: { amount: string } = response.data.data || { amount: "0" };
      return data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return { amount: "0" };
    }
  } else {
    return { amount: "0" };
  }
};

export const getuserClaimed = async (
  address: string | undefined | null,
  id: number,
  solanaWallet: any
) => {
  if (address && id && solanaWallet) {
    try {
      const response = await axios.get(`/user/get-user-claimed/${id}/${solanaWallet}`, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem(`access_token:${address}`),
        },
      });
      const data: { amount: string } = response.data.data || { amount: "0" };
      return data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return { amount: "0" };
    }
  } else {
    return { amount: "0" };
  }
};

export const getuserByCurrency = async (
  address: string | undefined | null,
  id: number,
  solanaWallet: any
) => {
  if (address && solanaWallet) {
    try {
      const response = await axios.get(`/user/get-user-by-currency/${id}/${solanaWallet}`, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem(`access_token:${address}`),
        },
      });
      const data: UserByCurrency = response.data.data;
      return data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return {
        investedAmountOf: "",
        userPurchasedByCurrency: 0,
        userRefundTokenCurrency: "",
        userRefundTokenCurrencyAmount: "0",
        userRefundTokenIsClaimed: false,
      };
    }
  } else {
    return {
      investedAmountOf: "",
      userPurchasedByCurrency: 0,
      userRefundTokenCurrency: "",
      userRefundTokenCurrencyAmount: "0",
      userRefundTokenIsClaimed: false,
    };
  }
};

export const convertToTransaction = async (obj: any) => {
  const transaction = new web3.Transaction();
  transaction.feePayer = new web3.PublicKey(obj.feePayer);
  for (let i = 0; i < obj.instructions.length; i++) {
    obj.instructions[i] = new web3.TransactionInstruction({
      keys: obj.instructions[i].keys.map((key: any) => ({
        ...key,
        pubkey: new web3.PublicKey(key.pubkey),
      })),
      programId: new web3.PublicKey(obj.instructions[i].programId),
      data: Buffer.from(obj.instructions[i].data),
    });
  }
  transaction.add(...obj.instructions);
  transaction.recentBlockhash = obj.recentBlockhash;
  // transaction.signers = obj.signers.map(signer => new PublicKey(signer)
  return transaction;
};


export const deriveTokenAccount = (
  owner: string,
  mint: string
) => {
  const OWNER = new web3.PublicKey(owner);
  const MINT = new web3.PublicKey(mint);

  if (!SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID || !TOKEN_PROGRAM_ID) {
    throw new Error("SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID or TOKEN_PROGRAM_ID is not defined");
  }

  const [address] = web3.PublicKey.findProgramAddressSync(
    [OWNER.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), MINT.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );

  return address;
};