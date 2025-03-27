import { debounce } from "lodash";
import configureStore from "../store/configureStore";
import { tokenActions } from "../store/constants/token";
import { tokensRefreshing } from "@/store/slices/tokenSilce";

export const refreshToken = debounce(async () => {
  try {
    // const dispatchToken = () => {
    //   return {
    //     type: tokenActions.TOKENS_REFRESHING,
    //   };
    // };
    configureStore().store.dispatch(tokensRefreshing())
    ;
  } catch (error: any) {
    console.log("ERROR refreshToken: ", error);
  }
}, 1000);
