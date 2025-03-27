import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ConnectorNames } from '../../constants/connectors';

export enum WalletConnectionState {
  READY = "readyForConnection",
  CONNECTED = "connected"
}

export enum TwoFactors {
  Layer1 = "Layer1",
  Layer2 = "Layer2"
}

type connectorNames = Extract<ConnectorNames, ConnectorNames.WalletConnect | ConnectorNames.BSC | ConnectorNames.MetaMask>;

type WalletState = {
  entities: { [key: string]: WalletType };
  loading: boolean;
  error: string;
  twoFactor: TwoFactors | undefined;
  walletConnect: boolean;
  walletAddress ?:string
};

const wallets = {
  [ConnectorNames.WalletConnect]: {
    title: "WalletConnect",
    typeId: "WalletConnect"
  },
  [ConnectorNames.BSC]: {
    title: "Binance Chain Wallet",
    typeId: "injected-binance"
  },
  [ConnectorNames.MetaMask]: {
    title: "Web3",
    typeId: "metamask"
  }
};

export type WalletType = {
  addresses: string[];
  balances: { [key: string]: string };
  connectionState: WalletConnectionState;
  title: string;
  typeId: string;
};

const walletInitialState = Object.keys(wallets).reduce<Record<string, WalletType>>((acc, key) => {
  const wallet = wallets[key as connectorNames];

  const walletsInfo = {
    ...acc,
    [key]: {
      ...wallet,
      balances: {},
      connectionState: WalletConnectionState.READY,
      addresses: []
    }
  };

  return walletsInfo;
}, {});

const initialState: WalletState = {
  entities: walletInitialState,
  loading: false,
  error: '',
  twoFactor: undefined,
  walletConnect: false
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    allWalletsInitLoading: (state) => {
      state.loading = true;
    },
    allWalletsInitSuccess: (state) => {
      state.loading = false;
      state.entities = walletInitialState;
    },
    allWalletsInitError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    connectWalletSuccess: (state, action: PayloadAction<{ entity: string; addresses: string[]; balances: { [key: string]: string } }>) => {
      const { balances, addresses, entity } = action.payload;
      state.entities[entity] = {
        ...state.entities[entity],
        balances,
        addresses,
        connectionState: WalletConnectionState.CONNECTED
      };
      state.twoFactor = TwoFactors.Layer1;
      state.walletConnect = true;
    },
    updateWalletBalance: (state, action: PayloadAction<{ entity: string; addresses: string[]; balances: { [key: string]: string } }>) => {
      const { balances, addresses, entity } = action.payload;
      state.entities[entity] = {
        ...state.entities[entity],
        balances,
        addresses,
        connectionState: WalletConnectionState.CONNECTED
      };
    },
    connectWalletSuccessWithoutLayer2: (state) => {
      state.walletConnect = false;
      state.twoFactor = TwoFactors.Layer1;
    },
    connectWalletLayer2Success: (state) => {
      state.twoFactor = TwoFactors.Layer2;
      state.walletConnect = false;
    },
    disconnectWalletSuccess: (state) => {
      return initialState;
    },
    storeWalletAddress: (state,action: PayloadAction<string>)=>{
      console.log('called',action)
      state.walletAddress =action.payload
    }
  },
});

export const {
  allWalletsInitLoading,
  allWalletsInitSuccess,
  allWalletsInitError,
  connectWalletSuccess,
  updateWalletBalance,
  connectWalletSuccessWithoutLayer2,
  connectWalletLayer2Success,
  disconnectWalletSuccess,
  storeWalletAddress
} = walletSlice.actions;

export const disconnectWallet = createAsyncThunk(
  'wallet/disconnectWallet',
  async (_, { dispatch }) => {
    dispatch(disconnectWalletSuccess());
  }
);

export const disconnectWalletLayer2 = createAsyncThunk(
  'wallet/disconnectWalletLayer2',
  async (_, { dispatch }) => {
    dispatch(connectWalletSuccessWithoutLayer2());
  }
);

export const walletReducer = walletSlice.reducer;