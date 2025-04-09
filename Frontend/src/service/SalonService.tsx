import {ADD_SALON_ENDPOINT, DELETE_SALON_ENDPOINT, EDIT_SALON_ENDPOINT, SALON_ENDPOINT} from "../constants/api.ts";
import Salon from "../model/Salon.ts";

function SalonService() {

    async function getSalons(): Promise<Salon[]> {
        const response = await fetch(SALON_ENDPOINT);

        if(!response.ok) {
            throw new Error("Failed to fetch the salons from the database!");
        }

        return response.json();
    }

    async function addSalon(salon: Omit<Salon, 'uuid'>): Promise<Salon>{
        const response = await fetch(ADD_SALON_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(salon)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    }

    async function updateSalon(salon: Salon): Promise<Salon> {
        const response = await fetch(`${EDIT_SALON_ENDPOINT}/${salon.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(salon)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    }

    async function deleteSalon(id: string): Promise<void> {
        const response = await fetch(`${DELETE_SALON_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
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