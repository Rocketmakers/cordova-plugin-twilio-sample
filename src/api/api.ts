import axios, { AxiosRequestConfig, Method } from "axios";
import { ApiClient, IFetcher } from "./clientApi";
import { AuthTokenStore } from './tokenStore';

export type DataStatus = "loading" | "loaded" | "error";

export interface IData<T> {
  status?: DataStatus;
  data?: T;
  error?: any;
}

const fetcher: IFetcher = {
  async request<T>(url: string, method: Method, contentType: string, body?: any): Promise<T> {
    const headers: any = {};

    let token = AuthTokenStore.get();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let config: AxiosRequestConfig = { baseURL: APP_CONFIG.apiBaseUrl, method, url, headers, data: body };

    const response = await axios(config);
    const { data, status, statusText } = response;

    if (400 <= status && status < 600) {
      if (status < 500) {
        throw new Error(`${status} ${statusText} error`);
      } else {
        throw new Error(`${status} ${statusText} error`);
      }
    }

    // TODO: return something like this
    // const r = { data, status, response };

    return data;
  },

  buildQueryString(query?: any): string {
    return Object.keys(query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
      .join("&");
  }
};

export const api = new ApiClient(fetcher);
