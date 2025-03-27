import * as types from '@/store/constants/userBalance';

export const setUserBalance = (userBalance : any) => ({
  type: types.SET_USER_BALANCE,
  payload: userBalance,
});