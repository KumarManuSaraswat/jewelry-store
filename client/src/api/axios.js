import axios from "axios";
import { getUserInfo } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? ""
    : import.meta.env.VITE_API_URL ||
      "https://orniva-jewelry-store.onrender.com",
  timeout: 45000,
});

api.interceptors.request.use((config) => {
  const userInfo = getUserInfo();

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

export default api;
