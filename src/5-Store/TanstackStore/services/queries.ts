import { useQuery } from "@tanstack/react-query";
import { getAllDonations, getAllFilms, getAllUsers, getFilmContent } from "./api";

export function useGetAllFilms() {
    return useQuery({
        queryKey: ["films"],
        queryFn: getAllFilms,
       
    });
}

export function useGetFilm(id: String) {
    return useQuery({
        queryKey: ["film", id],
        queryFn: () => getFilmContent(id),
       
    });
}

export function useGetDonations() {
    return useQuery({
        queryKey: ["donations"],
        queryFn: () => getAllDonations(),
       
    });
}

export function useGetUsers() {
    return useQuery(
        {
            queryKey: ["users"],
            queryFn: () => getAllUsers()
        }
    )
}

