import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ConfigState = {
  data: any | null;
  loading: boolean;
  error: string | null;
};

const initialState: ConfigState = {
  data: null,
  loading: false,
  error: null,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    configLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchConfigData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      state.loading = false;
    },
    configFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { configLoading, fetchConfigData, configFailure } = configSlice.actions;
export const landingConfigSlicer = configSlice.reducer;