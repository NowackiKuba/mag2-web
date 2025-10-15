import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.BACKEND_PROD_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
