import {FAVORITE_SALON_ENDPOINT, SALON_ENDPOINT, SALONS_ENDPOINT} from "../constants/api.ts";
import Salon from "../model/Salon.ts";
import axios from "axios";

function SalonService() {

    async function getSalons(): Promise<Salon[]> {
        try {
            const response = await axios.get<Salon[]>(SALONS_ENDPOINT);
            return response.data;
        } catch  {
            throw new Error("Failed to fetch the salons from the database!");
        }
    }

    async function addSalon(salon: Omit<Salon, 'uuid'>): Promise<Salon> {
        try {
            const response = await axios.post<Salon>(SALON_ENDPOINT, salon, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error: unknown) {
            let errorData: string;

            if (axios.isAxiosError(error)) {
                errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            } else if (error instanceof Error) {
                errorData = error.message;
            } else {
                errorData = "An unknown error occurred.";
            }

            throw new Error(errorData);
        }
    }

    async function updateSalon(salon: Salon): Promise<Salon> {
        try {
            const response = await axios.put<Salon>(`${SALON_ENDPOINT}/${salon.uuid}`, salon, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error: unknown) {
            let errorData: string;

            if (axios.isAxiosError(error)) {
                errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            } else if (error instanceof Error) {
                errorData = error.message;
            } else {
                errorData = "An unknown error occurred.";
            }

            throw new Error(errorData);
        }
    }

    async function deleteSalon(id: string): Promise<void> {
        try {
            await axios.delete(`${SALON_ENDPOINT}/${id}`);
        } catch  {
            throw new Error("Failed to delete the salon!");
        }
    }

    async function addFavorite(clientId: string, salonId: string): Promise<Salon> {
        try {
            const response = await axios.post<Salon>(`${FAVORITE_SALON_ENDPOINT}/${clientId}/${salonId}`, null, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                throw new Error(JSON.stringify(err.response.data));
            }
            throw new Error((err as Error).message);
        }
    }

    async function removeFavorite(clientId: string, salonId: string): Promise<Salon> {
        try {
            const response = await axios.delete<Salon>(`${FAVORITE_SALON_ENDPOINT}/${clientId}/${salonId}`);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                throw new Error(JSON.stringify(err.response.data));
            }
            throw new Error((err as Error).message);
        }
    }

    async function getFavoriteSalonsForUser(clientId: string) : Promise<Salon[]> {
        try {
            const response = await axios.get(`${FAVORITE_SALON_ENDPOINT}/${clientId}`);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                throw new Error(JSON.stringify(err.response.data));
            }
            throw new Error((err as Error).message);
        }
    }

    return {
        getSalons,
        addSalon,
        updateSalon,
        deleteSalon,
        addFavorite,
        removeFavorite,
        getFavoriteSalonsForUser
    };
}

export default SalonService;
