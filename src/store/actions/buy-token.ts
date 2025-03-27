import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';

import {buyTokenActions} from '../constants/buy-token';
import { BaseRequest } from '../../request/Request';
import {logout} from "./user";
import {apiRoute} from "../../utils";

export const isCampaignPurchasable = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: buyTokenActions.BUY_TOKEN_AVAILABLE_LOADING
      })
      const baseRequest = new BaseRequest();
      const response = await baseRequest.post(apiRoute('/jwt/verify'), {}, true) as any;
      const resObj = await response.json();

      if (resObj?.status === 200 && resObj?.data) {
        if (resObj?.data?.msgCode === 'TOKEN_IS_VALID') {
          dispatch({
            type: buyTokenActions.BUY_TOKEN_AVAILABLE_SUCCESS,
            payload: true
          })
        } else {
          dispatch({
            type: buyTokenActions.BUY_TOKEN_AVAILABLE_SUCCESS,
            payload: false
          })
        }
      } else {
        if (resObj?.status === 401) {
          dispatch(logout(true));
        } else {
          dispatch({
            type: buyTokenActions.BUY_TOKEN_AVAILABLE_SUCCESS,
            payload: false
          });
        }
      }
    } catch (err: any) {
      dispatch({
        type: buyTokenActions.BUY_TOKEN_AVAILABLE_FAILURE,
        payload: err.message,
      });
    }
  }
}
