// lib/api.ts
import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
