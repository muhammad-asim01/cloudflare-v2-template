import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userData: any | null;
  accessToken: string | null;
}

const initialState: UserState = {
  userData: null,
  accessToken: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
  },
});

export const { setUserData, setAccessToken } = userDataSlice.actions;

export default userDataSlice.reducer;
