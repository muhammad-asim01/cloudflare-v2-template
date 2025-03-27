import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { campaignActions } from '../constants/campaign';
import { AnyAction } from 'redux';

// Campaigns Slice
interface CampaignsState {
  data: any[];
  loading: boolean;
  failure: string;
}

const initialCampaignsState: CampaignsState = {
  data: [],
  loading: false,
  failure: '',
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: initialCampaignsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGNS_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGNS_SUCCESS, (state, action: PayloadAction<any[]>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(campaignActions.CAMPAIGNS_FAIL, (state, action: PayloadAction<string>) => {
        state.data = [];
        state.failure = action.payload;
        state.loading = false;
      });
  },
});



// Campaign Create Slice
interface CampaignCreateState {
  loading: boolean;
  failure: string;
}

const initialCampaignCreateState: CampaignCreateState = {
  loading: false,
  failure: '',
};

const campaignCreateSlice = createSlice({
  name: 'campaignCreate',
  initialState: initialCampaignCreateState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.MY_CAMPAIGN_CREATE_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.MY_CAMPAIGN_CREATE_SUCCESS, (state) => {
        state.loading = false;
        state.failure = '';
      })
      .addCase(campaignActions.MY_CAMPAIGN_CREATE_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Status Toggle Slice
interface CampaignStatusToggleState {
  loading: boolean;
  failure: string;
}

const initialCampaignStatusToggleState: CampaignStatusToggleState = {
  loading: false,
  failure: '',
};

const campaignStatusToggleSlice = createSlice({
  name: 'campaignStatusToggle',
  initialState: initialCampaignStatusToggleState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_STATUS_TOGGLE_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_STATUS_TOGGLE_SUCCESS, (state) => {
        state.loading = false;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_STATUS_TOGGLE_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Refund Tokens Slice
interface CampaignRefundTokensState {
  loading: boolean;
  failure: string;
}

const initialCampaignRefundTokensState: CampaignRefundTokensState = {
  loading: false,
  failure: '',
};

const campaignRefundTokensSlice = createSlice({
  name: 'campaignRefundTokens',
  initialState: initialCampaignRefundTokensState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_TOKENS_REFUND_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_TOKENS_REFUND_SUCCESS, (state) => {
        state.loading = false;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_TOKENS_REFUND_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Edit Slice
interface CampaignEditState {
  loading: boolean;
  failure: string;
}

const initialCampaignEditState: CampaignEditState = {
  loading: false,
  failure: '',
};

const campaignEditSlice = createSlice({
  name: 'campaignEdit',
  initialState: initialCampaignEditState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_EDIT_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_EDIT_SUCCESS, (state) => {
        state.loading = false;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_EDIT_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Detail Slice
interface CampaignDetailState {
  loading: boolean;
  failure: string;
  data: any | null;
}

const initialCampaignDetailState: CampaignDetailState = {
  loading: false,
  failure: '',
  data: null,
};

const campaignDetailSlice = createSlice({
  name: 'campaignDetail',
  initialState: initialCampaignDetailState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_DETAIL_REQUEST, (state) => {
        state.data = null;
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_DETAIL_SUCCESS, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        state.loading = false;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_DETAIL_FAIL, (state, action: PayloadAction<string>) => {
        state.data = null;
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign ICO Register Slice
interface CampaignICORegisterState {
  loading: boolean;
  failure: string;
}

const initialCampaignICORegisterState: CampaignICORegisterState = {
  loading: false,
  failure: '',
};

const campaignICORegisterSlice = createSlice({
  name: 'campaignICORegister',
  initialState: initialCampaignICORegisterState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_REGISTER_ICO_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_REGISTER_ICO_SUCCESS, (state) => {
        state.loading = false;
      })
      .addCase(campaignActions.CAMPAIGN_REGISTER_ICO_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Affiliate Create Slice
interface CampaignAffiliateCreateState {
  loading: boolean;
  failure: string;
}

const initialCampaignAffiliateCreateState: CampaignAffiliateCreateState = {
  loading: false,
  failure: '',
};

const campaignAffiliateCreateSlice = createSlice({
  name: 'campaignAffiliateCreate',
  initialState: initialCampaignAffiliateCreateState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_AFFILIATE_CREATE_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_AFFILIATE_CREATE_SUCCESS, (state) => {
        state.loading = false;
      })
      .addCase(campaignActions.CAMPAIGN_AFFILIATE_CREATE_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign ERC20 Rate Set Slice
interface CampaignErc20RateSetState {
  loading: boolean;
  failure: string;
}

const initialCampaignErc20RateSetState: CampaignErc20RateSetState = {
  loading: false,
  failure: '',
};

const campaignErc20RateSetSlice = createSlice({
  name: 'campaignErc20RateSet',
  initialState: initialCampaignErc20RateSetState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_ERC20_RATE_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_ERC20_RATE_SUCCESS, (state) => {
        state.loading = false;
      })
      .addCase(campaignActions.CAMPAIGN_ERC20_RATE_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Latest Slice
interface CampaignLatestState {
  loading: boolean;
  data: any | null;
  failure: string;
}

const initialCampaignLatestState: CampaignLatestState = {
  loading: false,
  data: null,
  failure: '',
};

const campaignLatestSlice = createSlice({
  name: 'campaignLatest',
  initialState: initialCampaignLatestState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_LATEST_GET_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
        state.data = null;
      })
      .addCase(campaignActions.CAMPAIGN_LATEST_GET_SUCCESS, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(campaignActions.CAMPAIGN_ERC20_RATE_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Latest Active Slice
interface CampaignLatestActiveState {
  loading: boolean;
  data: any | null;
  failure: string;
}

const initialCampaignLatestActiveState: CampaignLatestActiveState = {
  loading: false,
  data: null,
  failure: '',
};

const campaignLatestActiveSlice = createSlice({
  name: 'campaignLatestActive',
  initialState: initialCampaignLatestActiveState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_LATEST_ACTIVE_GET_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
        state.data = null;
      })
      .addCase(campaignActions.CAMPAIGN_LATEST_ACTIVE_GET_SUCCESS, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(campaignActions.CAMPAIGN_ERC20_RATE_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});


// Campaign Processing Slice
interface CampaignProcessingState {
  loading: boolean;
  data: any | null;
  failure: string;
}

const initialCampaignProcessingState: CampaignProcessingState = {
  loading: false,
  data: null,
  failure: '',
};

const campaignProcessingSlice = createSlice({
  name: 'campaignProcessing',
  initialState: initialCampaignProcessingState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaignActions.CAMPAIGN_DETAIL_HTTP_REQUEST, (state) => {
        state.loading = true;
        state.failure = '';
      })
      .addCase(campaignActions.CAMPAIGN_DETAIL_HTTP_SUCCESS, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(campaignActions.CAMPAIGN_DETAIL_HTTP_FAIL, (state, action: PayloadAction<string>) => {
        state.failure = action.payload;
        state.loading = false;
      });
  },
});

export const campaignsSlicer = campaignsSlice.reducer;
export const campaignCreateSlicer = campaignCreateSlice.reducer;
export const campaignStatusToggleSlicer = campaignStatusToggleSlice.reducer;
export const campaignRefundTokensSlicer = campaignRefundTokensSlice.reducer;
export const campaignDetailSlicer = campaignDetailSlice.reducer;
export const campaignICORegisterSlicer = campaignICORegisterSlice.reducer;
export const campaignAffiliateCreateSlicer = campaignAffiliateCreateSlice.reducer;
export const campaignErc20RateSetSlicer = campaignErc20RateSetSlice.reducer;
export const campaignLatestSlicer = campaignLatestSlice.reducer;
export const campaignLatestActiveSlicer = campaignLatestActiveSlice.reducer;
export const campaignProcessingSlicer = campaignProcessingSlice.reducer;
export const campaignEditSlicer = campaignEditSlice.reducer;