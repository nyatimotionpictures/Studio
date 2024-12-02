//register
//login
import { AxiosError } from "axios";
import apiRequest from "../../../3-Middleware/apiRequest";
import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminLogoutRequest,
  AdminLogoutResponse,
  AdminRegisterRequest,
  AdminRegisterResponse,
} from "../../types/auth";
import { ErrorResponse } from "../../types/generals";
import {
  CreateNewFilmRequest,
  CreateNewFilmResponse,
  filmDeleteResponse,
  GetAllFilms,
  GetFilmRequest,
  GetSingleFilmResponse,
  UpdateFilmRequest,
} from "../../types/film";
{
  /** /studio */
}
// // GET Routes
// router.get('/films', getFilms);
// router.get('/films/:filmId', getFilm);
// router.get('/users', getUsers);
// router.get('/donations', verifyToken, getDonations);
// // POST Routes
// router.post('/newfilm', verifyToken, validateData(filmSchema), createFilm);
// router.post(
//     '/newseason/:filmId',
//     verifyToken,
//     validateData(seasonSchema),
//     createSeason
// );
// router.post(
//     '/newepisode/:seasonId',
//     verifyToken,
//     validateData(episodeSchema),
//     createEpisode
// );
// // PUT Routes
// router.put('/films/:filmId', verifyToken, validateData(filmSchema), updateFilm);
// router.put(
//     '/season/:seasonId',
//     verifyToken,
//     validateData(seasonSchema),
//     updateSeason
// );
// router.put(
//     '/episode/:episodeId',
//     verifyToken,
//     validateData(episodeSchema),
//     updateEpisode
// );

// // DELETE Routes
// router.delete('/films/:filmId', verifyToken, deleteFilm);
// router.delete('/season/:seasonId', verifyToken, deleteSeason);
// router.delete('/episode/:episodeId', verifyToken, deleteEpisode);
/** Authorization */
/** mutation: Admin Registration : working as expected */
export const postAdminRegister = async (
  adminData: AdminRegisterRequest
): Promise<AdminRegisterResponse> => {
  try {
    const response = await apiRequest.post<AdminRegisterResponse>(
      "/v1/admin/auth/register",
      adminData
    );
    //console.log("response", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** mutation: Admin Login : working as expected */
export const postAuthLogin = async (
  adminLoginData: AdminLoginRequest
): Promise<AdminLoginResponse> => {
  try {
    const response = await apiRequest.post<AdminLoginResponse>(
      "/v1/admin/auth/login",
      adminLoginData
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.log("error");
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** mutation: Admin Logout : working as expected */
export const postAuthLogout = async (
  adminId: AdminLogoutRequest
): Promise<AdminLogoutResponse> => {
  try {
    const response = await apiRequest.post<AdminLogoutResponse>(
      `/v1/admin/auth/logout/${adminId}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** Films */

/** mutation: Film Title Creation : working as expected */
export const postFilmContent = async (
  filmContent: CreateNewFilmRequest
): Promise<CreateNewFilmResponse> => {
  try {
    const response = await apiRequest.post<CreateNewFilmResponse>(
      "/v1/studio/newfilm",
      filmContent
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** query: Get Single Film : working as expected */
export const getFilmContent = async (
  filmId: String
): Promise<GetSingleFilmResponse> => {
  try {
    const response = await apiRequest.get<GetSingleFilmResponse>(
      `/v1/studio/films/${filmId}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** query: Get All Films : working as expected */

export const getAllFilms = async () => {
  try {
    const response = await apiRequest.get<GetAllFilms[]>(`/v1/studio/films`);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** mutation: update film content : working as expected */
export const updateFilmContent = async (
  filmContent: UpdateFilmRequest
): Promise<CreateNewFilmResponse> => {
  try {
    let { id, ...rest } = filmContent;
    //console.log("rest", rest)
    const response = await apiRequest.put<CreateNewFilmResponse>(
      `/v1/studio/films/${id}`,
      rest
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** mutation: upload film poster : not yet used */
export const uploadPosterContent = async (filmContent: {
  id: string;
  poster: File;
  isCover: string;
}): Promise<{
  message: string;
  poster: any;
}> => {
  try {
    let { id, ...rest } = filmContent;
    /** convert to formdata */
    let formData = new FormData();
    formData.append("poster", rest.poster);
    formData.append("isCover", rest.isCover);
    const response = await apiRequest.post<{
      message: string;
      poster: any;
    }>(`/v1/film/poster/${id}`, formData);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

interface FilmPoster {
  id: string;
  type: string;
  url: String;
  isCover: boolean;
  isBackdrop: boolean;
}

/** get posters by film id : not yet used */
export const getPostersByFilmId = async (id: string): Promise<FilmPoster[]> => {
  try {
    const response = await apiRequest.get<FilmPoster[]>(
      `/v1/film/poster/${id}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

interface CreateNewSeasonRequest {
     id  :      String;
     title  :   String;
     season  :  number;
     filmId  :  String;

}
/** create new season : not yet used */
export const createNewSeason = async (
  seasonContent: CreateNewSeasonRequest
): Promise<{ message: string, season: any }> => {
  try {
     let {filmId,...rest} = seasonContent;
    const response = await apiRequest.post<{ message: string, season: any }>(
      `/v1/studio/newseason/${filmId}`,
      rest
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** mutation: delete season */
export const deleteSeason = async (
     seasonId: String
   ): Promise<filmDeleteResponse> => {
     try {
       const response = await apiRequest.delete<filmDeleteResponse>(
         `/v1/studio/season/${seasonId}`
       );
   
       return response.data;
     } catch (error) {
       const axiosError = error as AxiosError<ErrorResponse>;
       throw axiosError.response?.data ?? { message: "An unknown error occurred" };
     }
   };

   /** mutation: update season */
   export const updateSeason = async (
     seasonContent: CreateNewSeasonRequest
   ): Promise<{ message: string, season: any }> => {
     try {
          let {id,filmId,...rest} = seasonContent;
       const response = await apiRequest.put<{ message: string, season: any }>(
         `/v1/studio/season/${id}`,
         rest
       );
   
       return response.data;
     } catch (error) {
       const axiosError = error as AxiosError<ErrorResponse>;
       throw axiosError.response?.data ?? { message: "An unknown error occurred" };
     }
   };

   /** muation: create new episode */
   export const createNewEpisode = async (
     episodeContent: CreateNewFilmRequest
   ): Promise<{ message: string, episode: any }> => {
     try {
          let {seasonId,...rest} = episodeContent;
       const response = await apiRequest.post<{ message: string, episode: any }>(
         `/v1/studio/newepisode/${seasonId}`,
         rest
       );
   
       return response.data;
     } catch (error) {
       const axiosError = error as AxiosError<ErrorResponse>;
       throw axiosError.response?.data ?? { message: "An unknown error occurred" };
     }
   };

   /** mutation: get all donations */
   export const getAllDonations = async () => {
     try {
       const response = await apiRequest.get(
         "/v1/studio/donations"
       );
   
       return response.data;
     } catch (error) {
       const axiosError = error as AxiosError<ErrorResponse>;
       throw axiosError.response?.data ?? { message: "An unknown error occurred" };
     }
   };


      /** mutation: get all users */
      export const getAllUsers = async () => {
          try {
            const response = await apiRequest.get(
              "/v1/studio/users"
            );
        
            return response.data;
          } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            throw axiosError.response?.data ?? { message: "An unknown error occurred" };
          }
        };

        /** get User */
        export const getAdminUser = async (id: String) => {
          try {
            const response = await apiRequest.get(
              `/v1/studio/users/${id}`
            );
        
            return response.data;
          } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            throw axiosError.response?.data ?? { message: "An unknown error occurred" };
          }
        };

/** mutation: upload film video */
export const uploadVideoContent = async (
  filmContent: CreateNewFilmRequest
): Promise<CreateNewFilmResponse> => {
  try {
    const response = await apiRequest.post<CreateNewFilmResponse>(
      "/v1/film/create",
      filmContent
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** mutation: delete film */
export const deleteFilm = async (
  filmId: String
): Promise<filmDeleteResponse> => {
  try {
    const response = await apiRequest.delete<filmDeleteResponse>(
      `/v1/film/delete/${filmId}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};
