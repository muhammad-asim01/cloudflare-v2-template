import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WalletState = {
  walletName: string;
};

const initialState: WalletState = {
  walletName: "",
};

const walletNameSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addWalletName: (state, action: PayloadAction<string>) => {
      state.walletName = action.payload;
    },
    removeWalletName: (state) => {
      state.walletName = "";
    },
  },
});

export const { addWalletName, removeWalletName } = walletNameSlice.actions;
export default walletNameSlice.reducer;
