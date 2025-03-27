import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserBalanceState {
  userBalance: any | null;
}

const initialState: UserBalanceState = {
  userBalance: null,
};

const userBalanceSlice = createSlice({
  name: "userBalance",
  initialState,
  reducers: {
    setUserBalance(state, action: PayloadAction<any>) {
      state.userBalance = action.payload;
    },
  },
});

export const { setUserBalance } = userBalanceSlice.actions;

export default userBalanceSlice.reducer;
