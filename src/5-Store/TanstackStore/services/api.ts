//register
//login
import { AxiosError } from "axios";
import apiRequest from "../../../3-Middleware/apiRequest"
import { AdminLoginRequest, AdminLoginResponse, AdminLogoutRequest, AdminLogoutResponse, AdminRegisterRequest, AdminRegisterResponse } from "../../types/auth"
import { ErrorResponse } from "../../types/generals";
import { CreateNewFilmRequest, CreateNewFilmResponse, filmDeleteResponse, GetAllFilms, GetFilmRequest, GetSingleFilmResponse, UpdateFilmRequest } from "../../types/film";

/** Authorization */
/** mutation: Admin Registration */
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

/** mutation: Admin Login */
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

/** mutation: Admin Logout */
export const postAuthLogout = async (adminId:AdminLogoutRequest): Promise<AdminLogoutResponse> => {
     try {
          const response = await apiRequest.post<AdminLogoutResponse>(`/v1/admin/auth/logout/${adminId}`);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}

/** Films */

/** mutation: Film Title Creation */
export const postFilmContent = async (filmContent: CreateNewFilmRequest ): Promise<CreateNewFilmResponse> => {
     try {
          const response = await apiRequest.post<CreateNewFilmResponse>("/v1/film/create", filmContent);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}



/** query: Get Single Film */
export const getFilmContent = async (filmId: String): Promise<GetSingleFilmResponse> => {
     try {
       const response = await apiRequest.get<GetSingleFilmResponse>(`/v1/film/${filmId}`) 
       
       return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"}; 
     }
}

/** query: Get All Films */

export const getAllFilms = async () => {
     try {
       const response = await apiRequest.get<GetAllFilms[]>(`/v1/film/all`) 
       
       return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"}; 
     }
}


/** mutation: update film content */
export const updateFilmContent = async (filmContent: UpdateFilmRequest ): Promise<CreateNewFilmResponse> => {
     try {
          const response = await apiRequest.put<CreateNewFilmResponse>(`/v1/film/update/${filmContent.id}`, filmContent);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}

/** mutation: upload film poster */
export const uploadPosterContent = async (filmContent: CreateNewFilmRequest ): Promise<CreateNewFilmResponse> => {
     try {
          const response = await apiRequest.post<CreateNewFilmResponse>("/v1/film/create", filmContent);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}


/** mutation: upload film video */
export const uploadVideoContent = async (filmContent: CreateNewFilmRequest ): Promise<CreateNewFilmResponse> => {
     try {
          const response = await apiRequest.post<CreateNewFilmResponse>("/v1/film/create", filmContent);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}


/** mutation: delete film */
export const deleteFilm = async (filmId: String ): Promise<filmDeleteResponse> => {
     try {
          const response = await apiRequest.delete<filmDeleteResponse>(`/v1/film/delete/${filmId}`);

          return response.data;
     } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>
          throw axiosError.response?.data ?? {message: "An unknown error occurred"};  
     }
}



