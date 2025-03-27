import {claimUserInfoActions} from "../constants/claim-user-info";

export const updateUserClaimInfo = (data: any)  => {
  return {
    type: claimUserInfoActions.UPDATE_CLAIM_USER_INFO,
    payload: data,
  }
}
