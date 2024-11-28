import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFilm, postFilmContent, updateFilmContent } from "./api.ts";
import { CreateNewFilmRequest, UpdateFilmRequest } from "../../types/film.ts";
/** create film mutation */
export function useCreateFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewFilmRequest) => postFilmContent(data),
    onSettled: async (_, error) => {
      if (error) {
        console.log("error", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["films"] });
      }
    },
  });
}

/** update film mutation */
export function useUpdateFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFilmRequest) => updateFilmContent(data),
    onSettled: async (_, error) => {
      if (error) {
        console.log("error", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["film"] });
      }
    },
  });
}

/** delete film mutation */
export function useDeleteFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: String) => deleteFilm(data),
    onSuccess: (data, variables, context) => {
      console.log("run first");
    },
    onError: () => {
      console.log("run first");
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log("error", error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["films"] });
      }
    },
  });
}
