/** @format */

import axios from "axios";
export class API {
  private static instance: API;

  private static baseURL = `${process.env.NEXT_PUBLIC_API_URL!}/api`;

  static getInstance() {
    if (!API.instance) {
      API.instance = new API();
    }

    return API.instance;
  }

  public static async retrieve<T>(url: string, pk: string) {
    const res = await axios.get<T>(url.concat(pk), {
      baseURL: API.baseURL,
    });
    return res.data;
  }

  public static async get<T>(url: string, query?: object) {
    const res = await axios.get<T>(url, {
      baseURL: API.baseURL,
      params: query,
    });
    return res.data;
  }

  public static async post<T>(url: string, body: any) {
    const res = await axios.post<T>(url, body, {
      baseURL: API.baseURL,
    });

    return res.data;
  }

  public static async put<T>(url: string, body: any) {
    const res = await axios.put<T>(url, body, {
      baseURL: API.baseURL,
    });

    return res.data;
  }

  public static async delete<T>(url: string, pk: string) {
    const res = await axios.delete<T>(url, {
      baseURL: API.baseURL,
      params: {
        id: pk,
      },
    });
    return res.data;
  }
}
