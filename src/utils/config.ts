import { BaseRequest } from "../request/Request";

export const getFlag = async () => {
  const baseRequest = new BaseRequest();
  const url = "/public/flags";
  const response = (await baseRequest.get(url)) as any;
  return await response.json();
};
