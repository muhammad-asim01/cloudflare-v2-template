import { logout } from '@/store/slices/userSlice';
import configureStore from '../store/configureStore';
import { getConnectedAddress } from '../utils/getConnectedAddress';
const MESSAGE_INVESTOR_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE || "";


export class BaseRequest {
  static async getInstance() {
    return new this();
  }

  getSignatureMessage() {
    const msgSignature = MESSAGE_INVESTOR_SIGNATURE;
    return msgSignature;
  }

  getHeader(isInvestor: boolean = false, url?: any) {
    const walletAddress = getConnectedAddress();
    const token = !isInvestor
      ? localStorage.getItem(`access_token:${walletAddress}`)
      : localStorage.getItem('investor_access_token');

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      ...(url !== "/user/login" && {msgSignature: this.getSignatureMessage()}),
    }
  }

  buildUrl(url: string) {
    // remove both leading and trailing a slash
    url = url.replace(/^\/+|\/+$/g, '')
    return `${this.getUrlPrefix()}/${url}`
  }

  getUrlPrefix() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    return BASE_URL;
  }

  async post(url: string, data: object, isInvestor: boolean = false) {
    let resObj: Response;

    try {
      return fetch(this.buildUrl(url), {
        method: "POST",
        headers: this.getHeader(isInvestor, url),
        body: JSON.stringify(data)
      })
      .then(response => {
        resObj = response.clone();
        return response.json();
      })
      .then(data => {
        if (data.status && data.status === 401) {
          if (data.message === 'Token Expired') {
            configureStore().store.dispatch(logout(isInvestor) as any);
          }
        }

        return resObj;
      });
    } catch (e) {
      throw e;
    }
  }

  async postImage(url: string, data: FormData ) {
    try {
      return (fetch(this.buildUrl(url), {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        body: data
      }));
    } catch (e) {
      throw e;
    }
  }

  async put(url: string, data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "PUT",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async patch(url: string, data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "PATH",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      })).catch((e: any) => console.log('patch', e.message));
    } catch (e) {
      throw e;
    }
  }

  async get(url: string) {
    let resObj: Response;

    try {
      return fetch(this.buildUrl(url), {
        method: "GET",
        headers: this.getHeader(),
      })
      .then(response => {
        resObj = response.clone();
        return response.json();
      })
      .then(data => {
        if (data.status && data.status === 401 && data.message === 'Sorry, the token expired.') {
          // configureStore().store.dispatch(logout(isInvestor));
          // refreshToken();
        }

        return resObj;
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(url: string,  data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "DELETE",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async _responseHandler(response = {}) {
    return response;
  }
}
