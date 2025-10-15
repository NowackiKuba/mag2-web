import axios from 'axios';

export const api = axios.create({
  baseURL: `mag20-be-production.up.railway.app/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
