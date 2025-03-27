import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { alertFailure, alertSuccess } from '../../store/actions/alert';
import { ConnectorNames, connectorNames } from '../../constants/connectors';
import { walletActions } from '../constants/wallet';
import { alertActions } from '../constants/alert';
import { BaseRequest } from '../../request/Request';
import { getWeb3Instance } from '../../services/web3';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

interface UserState {
  user: any | null;
  investor: any | null;
  loading: boolean;
  error: string | null;
  profileLoading: boolean;
  profileError: string | null;
  profileUpdateLoading: boolean;
  profileUpdateError: string | null;
  connectWalletLoading: boolean;
  connectWalletError: string | null;
}

const initialState: UserState = {
  user: null,
  investor: null,
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
  profileUpdateLoading: false,
  profileUpdateError: null,
  connectWalletLoading: false,
  connectWalletError: null,
};

type UserRegisterProps = {
  email: string;
  address: string;
  library: Web3Provider;
};

type UserProfileProps = {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  avatar: string;
};

const MESSAGE_INVESTOR_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE || '';

export const getMessageParams = () => {
  const msgSignature = MESSAGE_INVESTOR_SIGNATURE;

  return [
    {
      type: 'string',
      name: 'Message',
      value: msgSignature,
    },
  ];
};

export const getParamsWithConnector = (connectedAccount: string) => ({
  [ConnectorNames.BSC]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_INVESTOR_SIGNATURE],
  },
  [ConnectorNames.WalletConnect]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_INVESTOR_SIGNATURE],
  },
  [ConnectorNames.MetaMask]: {
    method: 'eth_signTypedData',
    params: [getMessageParams(), connectedAccount],
  },
});

export const getCurrentAccount = async () => {
  const web3Instance = getWeb3Instance();
  const accounts = await web3Instance?.eth.getAccounts();

  if (accounts && accounts.length !== 0) {
    return accounts[0];
  }

  return undefined;
};

export const logout = createAsyncThunk('user/logout', async (isInvestor: boolean = false) => {
  isInvestor ? localStorage.removeItem('investor_access_token') : localStorage.removeItem('access_token');
  return isInvestor;
});

export const resetUserState = createAsyncThunk('user/resetUserState', async (isInvestor: boolean = false) => {
  return isInvestor;
});

export const clearUserProfileUpdate = createAsyncThunk('user/clearUserProfileUpdate', async () => {
  return;
});

export const login = createAsyncThunk(
  'user/login',
  async ({ connectedAccount, library }: { connectedAccount: string; library: Web3Provider }, { getState, dispatch, rejectWithValue }) => {
    try {
      const baseRequest = new BaseRequest();
      const connector = (getState() as any).connector.data;
      const paramsWithConnector = getParamsWithConnector(connectedAccount)[connector as connectorNames];

      if (connectedAccount && library && paramsWithConnector) {
        const provider = library.provider;
        if (connector !== ConnectorNames.WalletConnect) {
          return new Promise((resolve, reject) => {
            (provider as any).sendAsync(
              {
                method: paramsWithConnector.method,
                params: paramsWithConnector.params,
              },
              async function (err: Error, result: any) {
                if (err || result.error) {
                  const errMsg = err.message || (err as any).error || result.error.message;
                  console.log('login', errMsg);
                  reject(errMsg);
                } else {
                  try {
                    const response = await baseRequest.post(`/user/login`, {
                      signature: result.result,
                      wallet_address: connectedAccount,
                    });

                    const resObj = await response.json();

                    if (resObj.status && resObj.status === 200 && resObj.data) {
                      const { token, user } = resObj.data;

                      localStorage.setItem('investor_access_token', token.token);

                      dispatch({ type: walletActions.WALLET_CONNECT_LAYER2_SUCCESS });

                      resolve(user);
                    } else {
                      if (resObj.status === 404) {
                        dispatch(alertFailure(resObj.message));
                      } else {
                        dispatch(alertFailure(resObj.message));
                      }
                      reject('');
                    }
                  } catch (apiError) {
                    console.log('login api error', apiError);
                    reject('');
                  }
                }
              }
            );
          });
        } else {
          var rawMessage = MESSAGE_INVESTOR_SIGNATURE;
          var rawMessageLength = new Blob([rawMessage]).size;
          var message = ethers.utils.toUtf8Bytes('\x19Ethereum Signed Message:\n' + rawMessageLength + rawMessage);
          var messageHash = ethers.utils.keccak256(message);
          var params = [connectedAccount, messageHash];
          await (library as any).provider.enable();
          await (library as any).provider.wc.signMessage(params);
          return null;
        }
      } else {
        return rejectWithValue('Invalid parameters');
      }
    } catch (error: any) {
      console.log('login', error);
      dispatch(alertFailure(error.message));
      return rejectWithValue('');
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async ({ email, address: connectedAccount, library }: UserRegisterProps, { getState, dispatch, rejectWithValue }) => {
    try {
      const baseRequest = new BaseRequest();

      const connector = (getState() as any).connector.data;
      const paramsWithConnector = getParamsWithConnector(connectedAccount)[connector as connectorNames];

      if (connectedAccount && library && paramsWithConnector) {
        const provider = library.provider;
        return new Promise((resolve, reject) => {
          provider &&
            (provider as any).sendAsync(
              {
                method: paramsWithConnector.method,
                params: paramsWithConnector.params,
              },
              async function (err: Error, result: any) {
                if (err || result.error) {
                  const errMsg = err.message || (err as any).error || result.error.message;
                  reject(errMsg);
                  return;
                }

                try {
                  const response = await baseRequest.post(`/user/register/`, {
                    email,
                    wallet_address: connectedAccount,
                    signature: result.result,
                  });

                  const resObj = await response.json();

                  if (resObj.status && resObj.status === 200) {
                    if (resObj.data) {
                      const { token, user } = resObj.data;

                      localStorage.setItem('investor_access_token', token.token);

                      dispatch({
                        type: walletActions.WALLET_CONNECT_LAYER2_SUCCESS,
                      });

                      dispatch({
                        type: alertActions.SUCCESS_MESSAGE,
                        payload: 'Register Account Successful',
                      });

                      resolve(user);
                    } else {
                      dispatch({
                        type: alertActions.SUCCESS_MESSAGE,
                        payload: resObj.message,
                      });
                      resolve(resObj.message);
                    }
                  } else {
                    dispatch(alertFailure(resObj.message));
                    reject('');
                  }
                } catch (apiError) {
                  console.log('register api error', apiError);
                  reject('');
                }
              }
            );
        });
      } else {
        return rejectWithValue('Invalid parameters');
      }
    } catch (error: any) {
      console.log('register', error);
      dispatch(alertFailure(error.message));
      return rejectWithValue('');
    }
  }
);

export const connectWallet = createAsyncThunk('user/connectWallet', async (_, { dispatch, rejectWithValue }) => {
  try {const windowObj = window as any;
    const { ethereum } = windowObj;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const loginUser = accounts.length ? accounts[0] : '';

    if (loginUser) {
      return loginUser;
    } else {
      dispatch(logout(false));
      return rejectWithValue('No account found');
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getUserDetail = createAsyncThunk('user/getUserDetail', async (_, { dispatch, rejectWithValue }) => {
  try {
    const baseRequest = new BaseRequest();

    const response = await baseRequest.get('/user/profile');
    const resObj = await response.json();

    if (resObj.status && resObj.status === 200) {
      return resObj.data.user;
    } else {
      return rejectWithValue(resObj.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updatedUser: UserProfileProps, { dispatch, rejectWithValue }) => {
    try {
      const baseRequest = new BaseRequest();
      const ethAddress = await getCurrentAccount();

      if (ethAddress) {
        const windowObj = window as any;
        const { ethereum } = windowObj;
        const { avatar } = updatedUser;

        return new Promise((resolve, reject) => {
          ethereum.sendAsync(
            {
              method: 'eth_signTypedData',
              params: [getMessageParams(), ethAddress],
              from: ethAddress,
            },
            async function (err: Error, result: any) {
              if (err || result.error) {
                const errMsg = err.message || result.error.message;
                reject(errMsg);
              } else {
                try {
                  const response = await baseRequest.post(`/user/update-profile`, {
                    avatar,
                    signature: result.result,
                  });

                  const resObj = await response.json();

                  if (resObj.status && resObj.status === 200 && resObj.data) {
                    const { user } = resObj.data;

                    dispatch(alertSuccess('Update profile successful!'));

                    resolve(user);
                  } else {
                    reject(resObj.message);
                  }
                } catch (apiError) {
                  reject((apiError as any).message || 'Update failed');
                }
              }
            }
          );
        });
      } else {
        return rejectWithValue('No account found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinPool = createAsyncThunk(
  'user/joinPool',
  async (
    { connectedAccount, library, poolId }: { connectedAccount: string; library: Web3Provider; poolId?: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const baseRequest = new BaseRequest();
      const connector = (getState() as any).connector.data;
      const paramsWithConnector = getParamsWithConnector(connectedAccount)[connector as connectorNames];

      if (connectedAccount && library && paramsWithConnector) {
        const provider = library.provider;
        if (connector !== ConnectorNames.WalletConnect) {
          return new Promise((resolve, reject) => {
            (provider as any).sendAsync(
              {
                method: paramsWithConnector.method,
                params: paramsWithConnector.params,
              },
              async function (err: Error, result: any) {
                if (err || result.error) {
                  const errMsg = err.message || (err as any).error || result.error.message;
                  console.log('joinPool', errMsg);
                  reject(errMsg);
                } else {
                  try {
                    const response = await baseRequest.post(`/user/login`, {
                      signature: result.result,
                      wallet_address: connectedAccount,
                    });

                    const resObj = await response.json();

                    if (resObj.status && resObj.status === 200 && resObj.data) {
                      const { token, user } = resObj.data;

                      localStorage.setItem('investor_access_token', token.token);

                      dispatch({ type: walletActions.WALLET_CONNECT_LAYER2_SUCCESS });

                      resolve(user);
                    } else {
                      if (resObj.status === 404) {
                        dispatch(alertFailure(resObj.message));
                      } else {
                        dispatch(alertFailure(resObj.message));
                      }
                      reject('');
                    }
                  } catch (apiError) {
                    console.log('joinPool api error', apiError);
                    reject('');
                  }
                }
              }
            );
          });
        } else {
          var rawMessage = MESSAGE_INVESTOR_SIGNATURE;
          var rawMessageLength = new Blob([rawMessage]).size;
          var message = ethers.utils.toUtf8Bytes('\x19Ethereum Signed Message:\n' + rawMessageLength + rawMessage);
          var messageHash = ethers.utils.keccak256(message);
          var params = [connectedAccount, messageHash];
          await (library as any).provider.enable();
          await (library as any).provider.wc.signMessage(params);
          return null;
        }
      } else {
        return rejectWithValue('Invalid parameters');
      }
    } catch (error: any) {
      console.log('joinPool', error);
      dispatch(alertFailure(error.message));
      return rejectWithValue('');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state, action) => {
        state.investor = action.payload ? null : state.investor;
        state.user = !action.payload ? null : state.user;
      })
      .addCase(resetUserState.fulfilled, (state, action) => {
        if (action.payload) {
          state.investor = null;
        } else {
          state.user = null;
        }
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.investor = action.payload;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.investor = action.payload;
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(connectWallet.pending, (state) => {
        state.connectWalletLoading = true;
        state.connectWalletError = null;
      })
      .addCase(connectWallet.fulfilled, (state, action: PayloadAction<any>) => {
        state.connectWalletLoading = false;
        state.user = action.payload;
      })
      .addCase(connectWallet.rejected, (state, action: any) => {
        state.connectWalletLoading = false;
        state.connectWalletError = action.payload;
      })
      .addCase(getUserDetail.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getUserDetail.fulfilled, (state, action: PayloadAction<any>) => {
        state.profileLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetail.rejected, (state, action: any) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.profileUpdateLoading = true;
        state.profileUpdateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.profileUpdateLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action: any) => {
        state.profileUpdateLoading = false;
        state.profileUpdateError = action.payload;
      })
      .addCase(joinPool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinPool.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.investor = action.payload;
      })
      .addCase(joinPool.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const userConnectSlicer = userSlice.reducer;
export const userRegisterSlicer = userSlice.reducer;
export const investorSlicer = userSlice.reducer;
export const investorRegisterSlicer = userSlice.reducer;
export const userProfileSlicer = userSlice.reducer;
export const userProfileUpdateSlicer = userSlice.reducer;
export default userSlice.reducer;