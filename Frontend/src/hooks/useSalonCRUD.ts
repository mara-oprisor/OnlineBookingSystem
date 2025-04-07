import React from "react";
import Salon from "../model/Salon";
import SalonService from "../service/SalonService.tsx";

interface UseSalonActionProps {
    setData: React.Dispatch<React.SetStateAction<Salon[]>>;
    setSelectedSalon: React.Dispatch<React.SetStateAction<Salon | null>>;
    selectedSalon: Salon | null;
}

function useSalonCRUD({ setData, setSelectedSalon, selectedSalon }: UseSalonActionProps) {
    const salonService = SalonService();

    function parseErrorMessage(errorMessage: string): string {
        try {
            const errors = JSON.parse(errorMessage);
            return Object.values(errors).join("\n");
        } catch {
            return errorMessage;
        }
    }

    async function handleAddSalon(salon: Salon): Promise<void> {
        try {
            const addedSalon = await salonService.addSalon(salon);
            setData((prevData) => [...prevData, addedSalon]);
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error adding the salon:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to add salon:\n${detailedMessage}`);
        }
    }

    async function handleUpdateSalon(salon: Salon): Promise<void> {
        if (!selectedSalon) return;
        try {
            await salonService.updateSalon(salon);
            setData((prevData) =>
                prevData.map((s) => (s.uuid === selectedSalon.uuid ? salon : s))
            );
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error updating the salon:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to update salon:\n${detailedMessage}`);
        }
    }

    async function handleDeleteSalon(): Promise<void> {
        if (!selectedSalon) return;
        try {
            await salonService.deleteSalon(selectedSalon.uuid);
            setData((prevData) => prevData.filter((s) => s.uuid !== selectedSalon.uuid));
            setSelectedSalon(null);
        } catch (error: unknown) {
            console.error("Error deleting the salon!", error);
            alert("Failed to delete the salon!");
        }
    }

    return { handleAddSalon, handleUpdateSalon, handleDeleteSalon };
}

export default useSalonCRUD;
