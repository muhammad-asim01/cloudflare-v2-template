import { configActions } from '../constants/config'

export const configSuccess = (data: any)  => {
  return {
    type: configActions.CONFIG_SUCCESS,
    payload: data
  }
}