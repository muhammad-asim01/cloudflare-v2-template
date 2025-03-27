import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { alertActions } from '../constants/alert';
import { BaseRequest } from '../../request/Request';
import erc20ABI from '../../abi/Erc20.json';
import { getContractInstance, getETHBalance, SmartContractMethod } from '../../services/web3';

interface TokenDetail {
  token_address?: string;
  wallet_address?: string;
  balance: string;
  symbol_name: string;
  id: number;
  [key: string]: any;
}

interface TokensState {
  data: TokenDetail[];
  loading: boolean;
  failure: string;
  refreshing: boolean;
  expired: boolean;
}

const initialTokensState: TokensState = {
  data: [],
  loading: false,
  failure: '',
  refreshing: false,
  expired: false,
};

interface CreateTokenState {
  loading: boolean;
  failure: string;
}

const initialCreateTokenState: CreateTokenState = {
  loading: false,
  failure: '',
};

export const getTokensByUser = createAsyncThunk(
  'token/getTokensByUser',
  async (_, { getState, dispatch }) => {
    const state: any = getState();
    const loginUser = state.user.data.wallet_address;
    const connector = state.connector.data;
    const appChainID = state.appNetwork.data.appChainID;

    if (loginUser) {
      try {
        const baseRequest = new BaseRequest();
        const response = await baseRequest.get(`/asset-tokens/${loginUser}`);
        const resObject = await response.json();

        if (resObject.status === 200) {
          let { data: tokensDetail } = resObject;

          for (let i = 0; i < tokensDetail.length; i++) {
            const { token_address, wallet_address } = tokensDetail[i];
            const erc20Contract = getContractInstance(erc20ABI, token_address, connector, appChainID, SmartContractMethod.Read);
            const balance = await erc20Contract?.methods
              .balanceOf(wallet_address)
              .call();

            tokensDetail[i] = {
              ...tokensDetail[i],
              balance: new BigNumber(Number(balance))
                .dividedBy(Math.pow(10, 18))
                .toFixed(),
            };
          }

          const ethBalance = await getETHBalance(loginUser);

          tokensDetail = [
            {
              balance: new BigNumber(ethBalance).toFixed(),
              symbol_name: 'ETH',
              id: tokensDetail[tokensDetail.length - 1]?.id + 1 || 1,
            },
            ...tokensDetail,
          ];

          return tokensDetail;
        } else {
          throw new Error('Failed to fetch tokens.');
        }
      } catch (err: any) {
        throw err;
      }
    } else {
      throw new Error('User not logged in.');
    }
  }
);

export const addTokenByUser = createAsyncThunk(
  'token/addTokenByUser',
  async (
    tokenCreate: { tokenSymbol: string; tokenAddress: string; walletAddress: string },
    { dispatch }
  ) => {
    const baseRequest = new BaseRequest();

    try {
      const { tokenSymbol, tokenAddress, walletAddress } = tokenCreate;

      const response = await baseRequest.post(`/asset-tokens`, {
        symbol_name: tokenSymbol,
        token: tokenAddress,
        wallet_address: walletAddress,
      });

      const resObject = await response.json();

      if (resObject.status === 200) {
        dispatch({
          type: alertActions.SUCCESS_MESSAGE,
          payload: 'Add Token Successful!',
        });

        dispatch(getTokensByUser());
        return;
      } else if (resObject.status === 400) {
        throw new Error(resObject.message);
      } else {
        throw new Error('Failed to add token.');
      }
    } catch (err: any) {
      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message,
      });
      throw err;
    }
  }
);

const getTokensSlice = createSlice({
  name: 'getTokens',
  initialState: initialTokensState,
  reducers: {
    tokensExpired: (state) => {
      state.data = [];
      state.loading = false;
      state.failure = '';
      state.expired = true;
    },
    tokensRefreshing: (state) => {
      state.data = [];
      state.loading = false;
      state.failure = '';
      state.refreshing = true;
    },
    tokenRefreshSuccess: (state) => {
      state.data = [];
      state.loading = false;
      state.failure = '';
      state.refreshing = false;
    },
    tokenRefreshFail: (state) => {
      state.data = [];
      state.loading = false;
      state.failure = '';
      state.refreshing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTokensByUser.pending, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(getTokensByUser.fulfilled, (state, action: PayloadAction<TokenDetail[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTokensByUser.rejected, (state, action) => {
        state.loading = false;
        state.failure = action.error.message || 'Failed to fetch tokens';
      })
      .addCase(addTokenByUser.pending, (state) => {
        // no state change here, handled by createTokenReducer
      })
      .addCase(addTokenByUser.fulfilled, (state) => {
        // no state change here, handled by createTokenReducer
      })
      .addCase(addTokenByUser.rejected, (state, action) => {
        // no state change here, handled by createTokenReducer
      });
  },
});

const createTokenSlice = createSlice({
  name: 'createToken',
  initialState: initialCreateTokenState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTokenByUser.pending, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(addTokenByUser.fulfilled, (state) => {
        state.loading = false;
        state.failure = '';
      })
      .addCase(addTokenByUser.rejected, (state, action) => {
        state.loading = false;
        state.failure = action.error.message || 'Failed to add token';
      });
  },
});

export const {
  tokensExpired,
  tokensRefreshing,
  tokenRefreshSuccess,
  tokenRefreshFail,
} = getTokensSlice.actions;

export const tokenSlicer = getTokensSlice.reducer;
export const createTokenSlicer = createTokenSlice.reducer;