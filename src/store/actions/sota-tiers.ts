import {sotaTiersActions} from '../constants/sota-tiers';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {convertFromWei} from '../../services/web3';
import { BaseRequest } from '../../request/Request';
import axios from "../../services/axios";

import { getTokenStakeAPIInfo } from "../../utils/campaign";
import { getConfigHeader } from '../../utils/configHeader';

export const resetTiers = () => {
  return {
    type: sotaTiersActions.USER_TIER_RESET
  }
}

export const getTiers = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
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
        return;
      }

      let result = resObj.data;

      result = result.filter((e: any) => e != '0')
      result = result.map((e: any) => {
        return parseFloat(convertFromWei(e))
      })

      dispatch({
        type: sotaTiersActions.TIERS_SUCCESS,
        payload: result,
      });

    } catch (err) {
      console.log('getTiers', err)
      dispatch({
        type: sotaTiersActions.TIERS_FAILURE,
        payload: err
      });
    }
  }
};

export const getUserTier = (address: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
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

    } catch (err) {
      console.log('getUserTier', err)
      dispatch({
        type: sotaTiersActions.USER_TIER_FAILURE,
        payload: err
      });
    }
  }
};

export const getUserInfo = (address: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
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

    } catch (err) {
      console.log('getUserInfo', err)
      dispatch({
        type: sotaTiersActions.USER_INFO_FAILURE,
        payload: err
      });
    }
  }
};

export const getRates = (tokens: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: sotaTiersActions.RATES_LOADING });
    try {
      let data = [] as any;
      for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        data.push({rate: token.rate, symbol: token.symbol, name: token.name});
      }
      const result = {
        data: data
      }

      dispatch({
        type: sotaTiersActions.RATES_SUCCESS,
        payload: result,
      });

    } catch (err) {
      console.log('getRates', err)
      dispatch({
        type: sotaTiersActions.RATES_FAILURE,
        payload: err
      });
    }
  }
};
