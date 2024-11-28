import { useQuery } from "@tanstack/react-query";
import { getAllFilms, getFilmContent } from "./api";

export function useGetAllFilms() {
    return useQuery({
        queryKey: ["films"],
        queryFn: getAllFilms,
       
    });
}

export function useGetFilm(id: String) {
    return useQuery({
        queryKey: ["film"],
        queryFn: () => getFilmContent(id),
       
    });
}


