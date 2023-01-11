import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api`;
const ROOT = JSON.parse(localStorage.getItem("persist:root"));
const USER_FROM_LS = ROOT ? ROOT.user : null;
const CURRENT_USER_FROM_LS = USER_FROM_LS
  ? JSON.parse(USER_FROM_LS).currentUser
  : null;
const TOKEN = CURRENT_USER_FROM_LS ? CURRENT_USER_FROM_LS.accessToken : null;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
