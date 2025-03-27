import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { campaignActions } from '../constants/campaign';
import { BaseRequest } from '../../request/Request';
const queryString = require('query-string');

export const getCampaigns = (currentPage: number = 1, query: string = '', startTime: string, finishTime: string, filter: boolean = false) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    const baseRequest = new BaseRequest();
    const loginUser = getState().user.data.wallet_address;

    dispatch({ type: campaignActions.CAMPAIGNS_REQUEST });

    let url = `/campaigns`; //page=${currentPage}&title=${query}&start_time=${startTime}&finish_time=${finishTime}
    const queryParams = {
      page: currentPage,
      title: query,
      start_time: startTime,
      finish_time: finishTime,
      registed_by: null,
    };
    if (filter) {
      queryParams.registed_by = loginUser;
    }
    url += '?' + queryString.stringify(queryParams);

    try {
      const response = await baseRequest.get(url) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { total, page, lastPage, data } = resObject.data;

        dispatch({
          type: campaignActions.CAMPAIGNS_SUCCESS,
          payload: {
            total,
            page,
            lastPage,
            data
          }
        })
      }
    } catch (err: any) {
      dispatch({
        type: campaignActions.CAMPAIGNS_FAIL,
        payload: err.message
      })
    }
  }
}


export const getCampaignDetailHttp = (transactionHash: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const baseRequest = new BaseRequest();

    dispatch({ type: campaignActions.CAMPAIGN_DETAIL_HTTP_REQUEST });

    let url = `/campaigns/${transactionHash}`;

    try {
      const response = await baseRequest.get(url) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { is_pause: isProcessing } = resObject.data;

        dispatch({
          type: campaignActions.CAMPAIGN_DETAIL_HTTP_SUCCESS,
          payload: {
            isProcessing,
            ...resObject.data
          }
        })
      }
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_DETAIL_HTTP_FAIL,
        payload: false
      })
    }
  }
}
