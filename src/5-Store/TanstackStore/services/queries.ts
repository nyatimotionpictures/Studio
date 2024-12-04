import { useQuery } from "@tanstack/react-query";
import { getAdminUser, getAllDonations, getAllFilms, getAllPurchases, getAllUsers, getFilmContent } from "./api";

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

export function useGetPurchases() {
    return useQuery({
        queryKey: ["purchases"],
        queryFn: () => getAllPurchases(),
       
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

export function useGetAdminUser(id: String) {
    return useQuery(
        {
            queryKey: ["admin", id],
            queryFn: () => getAdminUser(id)
        }
    )
}

