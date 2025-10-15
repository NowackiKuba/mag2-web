import axios from 'axios';

const envBaseUrl = import.meta.env.VITE_API_URL as string | undefined;

// In production, VITE_API_URL must be an absolute URL including protocol
// Example: https://mag20-be-production.up.railway.app/api/v1

export const api = axios.create({
  baseURL: envBaseUrl ?? 'https://mag20-be-production.up.railway.app/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
