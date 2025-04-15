import axios from 'axios';

console.log("Interceptor module loaded");

axios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        console.log("Interceptor triggered, token:", token);
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log("Authorization header set:", config.headers['Authorization']);
        }
        return config;
    },
    (error) => {
        console.error("Interceptor error", error);
        return Promise.reject(error);
    }
);
