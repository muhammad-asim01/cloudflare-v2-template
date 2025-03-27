// userActions.js
import * as types from '@/store/constants/userData';

export const setUserData = (userData : any) => ({
  type: types.SET_USER_DATA,
  payload: userData,
});

export const setAccessToken = (accessToken : any) => ({
  type: types.SET_ACCESS_TOKEN,
  payload: accessToken,
});
