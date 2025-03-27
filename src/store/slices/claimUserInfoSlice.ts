import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClaimUserInfoState {
  data: any;
}

const initialState: ClaimUserInfoState = {
  data: {},
};

const claimUserInfoSlice = createSlice({
  name: "claimUserInfo",
  initialState,
  reducers: {
    updateUserClaimInfo: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { updateUserClaimInfo } = claimUserInfoSlice.actions;
export default claimUserInfoSlice.reducer;
