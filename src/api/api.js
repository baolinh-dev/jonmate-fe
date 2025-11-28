// Use the browser-specific axios bundle to avoid pulling node core modules (https/http)
// which cause webpack <-> browser polyfill issues.
import axios from "axios/dist/browser/axios.cjs";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // gửi cookie HttpOnly tự động
});

export default api;
