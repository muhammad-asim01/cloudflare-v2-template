import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SolanaWalletState {
  isConnected: boolean;
  walletAddress: string;
}

const initialState: SolanaWalletState = {
  isConnected: false,
  walletAddress: "",
};

const solanaWalletSlice = createSlice({
  name: "solanaWallet",
  initialState,
  reducers: {
    solanaConnectWallet(state) {
      state.isConnected = true;
    },
    solanaDisconnectWallet(state) {
      state.isConnected = false;
      state.walletAddress = "";
    },
    solanaSetWalletAddress(state, action: PayloadAction<string>) {
      state.walletAddress = action.payload;
    },
    solanaLogout(state) {
      state.isConnected = false;
      state.walletAddress = "";
    },
  },
});

export const {
  solanaConnectWallet,
  solanaDisconnectWallet,
  solanaSetWalletAddress,
  solanaLogout,
} = solanaWalletSlice.actions;

export default solanaWalletSlice.reducer;
