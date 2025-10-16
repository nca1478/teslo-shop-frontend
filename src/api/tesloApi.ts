import axios from "axios";

const tesloApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor que agrega automáticamente el token JWT a las peticiones
tesloApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { tesloApi };
