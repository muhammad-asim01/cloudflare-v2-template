import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MessageState = {
  data: string | null;
};

const initialState: MessageState = {
  data: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    pushMessage: (state, action: PayloadAction<string>) => {
      state.data = action.payload;
    },
  },
});

export const { pushMessage } = messageSlice.actions;
export default messageSlice.reducer;
