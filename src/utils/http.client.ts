/**
 * @description 独立封装 axios 请求工具
 * @author darcrand
 */

"use client";
import axios, { AxiosResponse } from "axios";
import Qs from "qs";

export const http = axios.create({
  paramsSerializer: function (params) {
    return Qs.stringify(params, { arrayFormat: "brackets" });
  },
});

http.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("token");
  if (authToken) {
    config.headers["Authorization"] = authToken;
  }

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
