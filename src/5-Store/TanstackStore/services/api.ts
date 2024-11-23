//register
//login
import { AxiosError } from "axios";
import apiRequest from "../../../3-Middleware/apiRequest"
import { AdminLoginRequest, AdminLoginResponse, AdminLogoutRequest, AdminLogoutResponse, AdminRegisterRequest, AdminRegisterResponse } from "../../types/auth"
import { ErrorResponse } from "../../types/generals";
import { CreateNewFilmRequest, CreateNewFilmResponse } from "../../types/film";

/** Admin Registration */
export const postAdminRegister = async (adminData: AdminRegisterRequest): Promise<AdminRegisterResponse> => {
    try {
       const response = await apiRequest.post<AdminRegisterResponse>(
         "/v1/admin/auth/register",
         adminData
       );
        //console.log("response", response.data);
        return response.data
    
   } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        
        throw axiosError.response?.data ?? { message: "An unknown error occurred" };
   }
}

/** Admin Login */
export const postAuthLogin = async (adminLoginData: AdminLoginRequest): Promise<AdminLoginResponse> => {
     try {
          const response = await apiRequest.post<AdminLoginResponse>("/v1/admin/auth/login", adminLoginData);
          console.log("response", response.data);
          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          console.log("error", )
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};
     }

}

/** Admin Logout */
export const postAuthLogout = async (adminId:AdminLogoutRequest): Promise<AdminLogoutResponse> => {
     try {
          const response = await apiRequest.post<AdminLogoutResponse>(`/v1/admin/auth/logout/${adminId}`);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}

/** Film Title Creation */
export const postFilmContent = async (filmContent: CreateNewFilmRequest ): Promise<CreateNewFilmResponse> => {
     try {
          const response = await apiRequest.post<CreateNewFilmResponse>("/v1/film/create", filmContent);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}