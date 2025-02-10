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
  filmId: any
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
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
};

/** mutation: update film content : working as expected */
export const updateEpisodeContent = async (
  filmContent: UpdateFilmRequest
): Promise<CreateNewFilmResponse> => {
  try {
    let { id, ...rest } = filmContent;
    //console.log("rest", rest)
    const response = await apiRequest.put<CreateNewFilmResponse>(
      `/v1/studio/episode/${id}`,
      rest
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
};

/** mutation: upload film poster : not yet used */
export const uploadPosterContent = async (filmContent: any) => {
  try {
  
    /** convert to formdata */
   
    const user = JSON.parse(localStorage.getItem("user"));
    
     const token = user !== null && user?.token ? user.token : null;
  
    const response = await apiRequest.post(`/v1/studio/posterupload/${filmContent.filmId}`, filmContent, {
     headers: {
          "Content-Type": "multipart/form-data",
        },
    });

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



interface CreateNewSeasonRequest {
     id  :      String;
     title  :   String;
     season  :  number;
     filmId  :  String;

}
/** create new season : used as expected */
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

/** mutation: delete season : working as expected */
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

   /** mutation: delete episode :  */
export const deleteEpisode = async (
  episodeId: String
): Promise<filmDeleteResponse> => {
  try {
    const response = await apiRequest.delete<filmDeleteResponse>(
      `/v1/studio/episode/${episodeId}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

   /** mutation: update season : works as expected */
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

   /** muation: create new episode: works as expected */
   export const createNewEpisode = async (
     episodeContent: any
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

   /** mutation: get all donations: works as expected */
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

      /** mutation: get all subscriptions: works as expected */
      export const getAllPurchases = async () => {
        try {
          const response = await apiRequest.get(
            "/v1/studio/purchasehistory"
          );
      
          return response.data;
        } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>;
          throw axiosError.response?.data ?? { message: "An unknown error occurred" };
        }
      };

   


      /** mutation: get all users: works as expected */
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

        /** get User: Not yet used */
        export const getAdminUser = async (id: String) => {
          try {
            const response = await apiRequest.get(
              `/v1/admin/auth/me/"${id}`
            );
        
            return response.data;
          } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            throw axiosError.response?.data ?? { message: "An unknown error occurred" };
          }
        };

        /** change password: not yet used */
        export const changePassword = async (
          passworddetails : any
        ) => {
          try {
             let   {
            adminId,
           ...rest
          } = passworddetails 
            const response = await apiRequest.put(
              `/v1/admin/auth/password/${adminId}`, rest
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
      `/v1/studio/films/${filmId}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** delete poster by film id :  used */
export const deletePoster = async (
  posterId: String
) => {
  try {
    const response = await apiRequest.delete(
      `/v1/studio/poster/${posterId}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** delete video by film id : used */
export const deleteVideo = async (
  videoId: String
) => {
  try {
    const response = await apiRequest.delete(
      `/v1/studio/video/${videoId}`
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** delete video by film id : used */
export const deleteAllVideos = async (
  videoIds:any
) => {
  try {
    const response = await apiRequest.delete(
      `/v1/studio/videos`, {
        data: videoIds
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data ?? { message: "An unknown error occurred" };
  }
};

/** Categories */
/** mutation: create new category */
export const createNewCategory = async (
  categoryContent: any
) => {
  try {
    const response = await apiRequest.post(
      "/v1/studio/newcategory",
      categoryContent
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
};

/** get all categories */
export const getAllCategories = async () => {
  try {
    const response = await apiRequest.get(
      "/v1/studio/categories"
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
}

/** get one category */
export const getSingleCategory = async (categoryId: String) => {
  try {
    const response = await apiRequest.get(
      "/v1/studio/category/" + categoryId
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
}

/** mutation: update category */
export const updateCategory = async (
  categoryContent: any
) => {
  try {
    let { id, ...rest } = categoryContent;
    const response = await apiRequest.put(
      `/v1/studio/category/update/${id}`,
      rest
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
};


/** mutation: connect film to category */
export const addFilmToCategory = async (
  categoryContent: any
) => {
  try {
    let { id, ...rest } = categoryContent;
    const response = await apiRequest.put(
      `/v1/studio/category/addfilm/${id}`,
      rest
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
};

/** mutation: remove film from category */
export const removeFilmonCategory = async (
  categoryContent: any
) => {
  try {
    let { id, ...rest } = categoryContent;
    const response = await apiRequest.put(
      `/v1/studio/category/remove/${id}`,
      rest
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
};


/** mutation: delete category */
export const deleteCategory = async (
  categoryId: String
) => {
  try {
    const response = await apiRequest.delete(
      `/v1/studio/category/${categoryId}`
    );

    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
};

/** create a price */
export const createPrice = async (pricedata: any) => {
  try {
    let { id, ...rest } = pricedata
    const response = await apiRequest.post(`/v1/studio/pricing`, rest);
    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
}

/** create a price */
export const updatePrice = async (pricedata: any) => {
  try {
    let { id, ...rest } = pricedata
    const response = await apiRequest.put(`/v1/studio/pricing/${id}`, rest);
    return response.data;
  } catch (error) {
    if (error?.response) {
      throw {message: `Error ${error.response.status}: ${error.response.statusText}`}
     
    } else if (error.request) {
      throw {message: "No response from server. Please check your network connection."}
      
    } else {
      throw {message: `Request failed: ${error.message}`}
     
    }
  }
}

/** get all categories */
// export const getAllCategories = async () => {
//   try {
//     const response = await apiRequest.get<GetAllCategories[]>(
//       `/v1/studio/categories`
//     );

//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError<ErrorResponse>;
//     throw axiosError.response?.data ?? { message: "An unknown error occurred" };
//   }
// };
