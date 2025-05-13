import {SALON_ENDPOINT, SALONS_ENDPOINT} from "../constants/api.ts";
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

    return {
        getSalons,
        addSalon,
        updateSalon,
        deleteSalon
    };
}

export default SalonService;
