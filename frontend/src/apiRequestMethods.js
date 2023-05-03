import axios from "axios";
export const BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = 'https://meowchat-backend-production.up.railway.app/api';
export const publicRequest = axios.create({
    baseURL: BASE_URL,
    withCredentials:true
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    withCredentials:true
});