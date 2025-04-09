import { useState } from "react";
import Salon from "../model/Salon";

interface UseSalonModalProps {
    selectedSalon: Salon | null;
}

function useSalonModal({ selectedSalon }: UseSalonModalProps) {
    const [isModalSalonOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateModeSalon, setIsUpdateMode] = useState<boolean>(false);
    const [newSalon, setNewSalon] = useState<Salon>({
        uuid: "",
        name: "",
        phoneNumber: "",
    });

    function openModalSalon(update: boolean = false): void {
        setIsModalOpen(true);
        setIsUpdateMode(update);
        if (update && selectedSalon) {
            setNewSalon({ ...selectedSalon });
        } else {
            setNewSalon({
                uuid: "",
                name: "",
                phoneNumber: "",
            });
        }
    }

    function closeModalSalon(): void {
        setIsModalOpen(false);
        setNewSalon({
            uuid: "",
            name: "",
            phoneNumber: "",
        });
        setIsUpdateMode(false);
    }

    return {
        isModalSalonOpen,
        isUpdateModeSalon,
        newSalon,
        openModalSalon,
        closeModalSalon,
        setNewSalon,
    };
}

export default useSalonModal;