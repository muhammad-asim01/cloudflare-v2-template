// sotaTiersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { convertFromWei } from '../../services/web3';
import { BaseRequest } from '../../request/Request';
import axios from "../../services/axios";
import { getTokenStakeAPIInfo } from "../../utils/campaign";
import { getConfigHeader } from '../../utils/configHeader';
import { sotaTiersActions } from '../constants/sota-tiers';

// Define state types
interface StateType {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: StateType = {
  data: {},
  loading: false,
  error: null
};

// Create async thunks
export const getTiers = createAsyncThunk(
  'sotaTiers/getTiers',
  async (_, { dispatch }) => {
    dispatch({ type: sotaTiersActions.TIERS_LOADING });
    try {
      const baseRequest = new BaseRequest();
      const response = await baseRequest.get(`/get-tiers`) as any;
      const resObj = await response.json();

      if (!resObj.status || resObj.status !== 200 || !resObj.data) {
        dispatch({
          type: sotaTiersActions.TIERS_FAILURE,
          payload: new Error("Invalid tiers payload")
        });
        return null;
      }

      let result = resObj.data;

      result = result.filter((e: any) => e != '0')
      result = result.map((e: any) => {
        return parseFloat(convertFromWei(e))
      });

      dispatch({
        type: sotaTiersActions.TIERS_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      console.log('getTiers', err);
      dispatch({
        type: sotaTiersActions.TIERS_FAILURE,
        payload: err
      });
      throw err;
    }
  }
);

export const getUserTier = createAsyncThunk(
  'sotaTiers/getUserTier',
  async (address: string, { dispatch }) => {
    dispatch({ type: sotaTiersActions.USER_TIER_LOADING });
    try {
      let userTier = 0;
      let configHeader = getConfigHeader(address);
      const response = await axios.get(`/user/tier-info`, configHeader) as any;

      if (response?.status && response.status === 200 && response.data) {
        userTier = response?.data?.data?.tier || 0;
      }

      dispatch({
        type: sotaTiersActions.USER_TIER_SUCCESS,
        payload: userTier,
      });

      return userTier;
    } catch (err) {
      console.log('getUserTier', err);
      dispatch({
        type: sotaTiersActions.USER_TIER_FAILURE,
        payload: err
      });
      throw err;
    }
  }
);

export const getUserInfo = createAsyncThunk(
  'sotaTiers/getUserInfo',
  async (address: string, { dispatch }) => {
    dispatch({ type: sotaTiersActions.USER_INFO_LOADING });
    try {
      const {
        tokenStakes,
        userTier
      } = await getTokenStakeAPIInfo(address);

      dispatch({
        type: sotaTiersActions.USER_TIER_SUCCESS,
        payload: userTier,
      });

      dispatch({
        type: sotaTiersActions.USER_INFO_SUCCESS,
        payload: tokenStakes,
      });

      return { tokenStakes, userTier };
    } catch (err) {
      console.log('getUserInfo', err);
      dispatch({
        type: sotaTiersActions.USER_INFO_FAILURE,
        payload: err
      });
      throw err;
    }
  }
);

export const getRates = createAsyncThunk(
  'sotaTiers/getRates',
  async (tokens: any[], { dispatch }) => {
    dispatch({ type: sotaTiersActions.RATES_LOADING });
    try {
      let data = [] as any;
      for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        data.push({rate: token.rate, symbol: token.symbol, name: token.name});
      }
      const result = {
        data: data
      };

      dispatch({
        type: sotaTiersActions.RATES_SUCCESS,
        payload: result,
      });

      return result;
    } catch (err) {
      console.log('getRates', err);
      dispatch({
        type: sotaTiersActions.RATES_FAILURE,
        payload: err
      });
      throw err;
    }
  }
);

// Create slices
const tiersSlice = createSlice({
  name: 'getTiers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.TIERS_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.TIERS_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.TIERS_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

const userTierSlice = createSlice({
  name: 'getUserTier',
  initialState,
  reducers: {
    resetTiers: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.USER_TIER_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.USER_TIER_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.USER_TIER_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.USER_TIER_RESET, (state) => {
        state.data = {};
        state.loading = false;
        state.error = null;
      });
  }
});

const userInfoSlice = createSlice({
  name: 'getUserInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.USER_INFO_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.USER_INFO_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.USER_INFO_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.DEPOSIT_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.DEPOSIT_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.DEPOSIT_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.WITHDRAW_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.WITHDRAW_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.WITHDRAW_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

const withdrawFeeSlice = createSlice({
  name: 'withdrawFee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.WITHDRAW_FEE_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.WITHDRAW_FEE_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.WITHDRAW_FEE_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

const withdrawPercentSlice = createSlice({
  name: 'withdrawPercent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.WITHDRAW_PERCENT_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.WITHDRAW_PERCENT_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.WITHDRAW_PERCENT_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

const ratesSlice = createSlice({
  name: 'rates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sotaTiersActions.RATES_LOADING, (state) => {
        state.loading = true;
      })
      .addCase(sotaTiersActions.RATES_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(sotaTiersActions.RATES_FAILURE, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

// Export actions
export const { resetTiers } = userTierSlice.actions;

// Export reducers
export const getTiersReducer = tiersSlice.reducer;
export const getUserTierReducer = userTierSlice.reducer;
export const getUserInfoReducer = userInfoSlice.reducer;
export const depositReducer = depositSlice.reducer;
export const withdrawReducer = withdrawSlice.reducer;
export const withdrawFeeReducer = withdrawFeeSlice.reducer;
export const withdrawPercentReducer = withdrawPercentSlice.reducer;
export const ratesReducer = ratesSlice.reducer;