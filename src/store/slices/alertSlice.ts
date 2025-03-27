import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  type: "",
  message: ""
};

// Create slice
const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    alertSuccess: (state, action) => {
        console.log('action', action)
      state.type = "success";
      state.message = action.payload;
    },
    alertWarning: (state, action) => {
      state.type = "warning";
      state.message = action.payload;
    },
    alertFailure: (state, action) => {
      state.type = "error";
      state.message = action.payload;
    },
    clearAlert: (state) => {
      state.type = "";
      state.message = "";
    }
  }
});

// Export actions
export const { alertSuccess, alertWarning, alertFailure, clearAlert } = alertSlice.actions;

// Export reducer
export const alertSlicer = alertSlice.reducer;
