import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BSC_CHAIN_ID } from "../../constants/network";

export enum NetworkUpdateType {
  Wallet = "Wallet",
  App = "App",
  Connector = "Connector",
}

interface AppNetworkState {
  data: {
    appChainID: string | undefined;
    walletChainID: string | undefined;
    currentConnector: string | undefined;
  };
  loading: boolean;
  error: string | null;
}

interface ConnectorState {
  data: string | undefined;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AppNetworkState = {
  data: {
    appChainID: BSC_CHAIN_ID,
    walletChainID: undefined,
    currentConnector: undefined,
  },
  loading: false,
  error: null,
};

const connectorInitialState: ConnectorState = {
  data: undefined,
  loading: false,
  error: null,
};

// Async Thunk for Setting App Network
export const settingAppNetwork = createAsyncThunk<
  { appChainID?: string; walletChainID?: string },
  { networkType: string; updatedVal: string | undefined },
  { state: { appNetwork: AppNetworkState } }
>("appNetwork/settingAppNetwork", async ({ networkType, updatedVal }, { getState, rejectWithValue }) => {
  try {
    const { appChainID, walletChainID } = getState().appNetwork.data;

    if (!(networkType in NetworkUpdateType)) {
      throw new Error("Wrong update network type!");
    }

    return {
      appChainID: networkType === NetworkUpdateType.App ? updatedVal : appChainID,
      walletChainID: networkType === NetworkUpdateType.Wallet ? updatedVal : walletChainID,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk for Setting Connector
export const settingCurrentConnector = createAsyncThunk<string | undefined, string | undefined>(
  "connector/settingCurrentConnector",
  async (connectorName, { rejectWithValue }) => {
    try {
      return connectorName;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// App Network Slice
const appNetworkSlice = createSlice({
  name: "appNetwork",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(settingAppNetwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(settingAppNetwork.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(settingAppNetwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Connector Slice
const connectorSlice = createSlice({
  name: "connector",
  initialState: connectorInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(settingCurrentConnector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(settingCurrentConnector.fulfilled, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(settingCurrentConnector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export Reducers
export const appNetworkSlicer = appNetworkSlice.reducer;
export const connectorSlicer = connectorSlice.reducer;
