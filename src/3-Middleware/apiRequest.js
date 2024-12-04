import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
//http://localhost:4500/api
export const BaseUrl = "https://api.nyatimotionpictures.com/api";
const queryClient = new QueryClient();
const apiRequest = axios.create({
    baseURL: "https://api.nyatimotionpictures.com/api",
    withCredentials: true,
});

apiRequest.interceptors.request.use((config)=> {
    const user = JSON.parse(localStorage.getItem("user"));
    
    const token = user !== null && user.token ? user.token : null;

    if (token){
        config.headers.authorization = `Bearer ${token}`;
       config.headers["Content-Type"] = "application/json";
    }
    config.headers["Content-Type"] = "application/json";
    return config;
})

apiRequest.interceptors.response.use((response)=> response, (error)=>{
    if(error.response?.status === 401){
        //token expiration
      
        queryClient.clear()
       localStorage.clear();
       window.location.href = '/login';
    }
    return Promise.reject(error);
})
export default apiRequest;