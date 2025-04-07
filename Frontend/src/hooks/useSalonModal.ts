import { useState } from "react";
import Salon from "../model/Salon";

interface UseSalonModalProps {
    selectedSalon: Salon | null;
}

function useSalonModal({ selectedSalon }: UseSalonModalProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
    const [newSalon, setNewSalon] = useState<Salon>({
        uuid: "",
        name: "",
        phoneNumber: "",
    });

    function openModal(update: boolean = false): void {
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

    function closeModal(): void {
        setIsModalOpen(false);
        setNewSalon({
            uuid: "",
            name: "",
            phoneNumber: "",
        });
        setIsUpdateMode(false);
    }

    return {
        isModalOpen,
        isUpdateMode,
        newSalon,
        openModal,
        closeModal,
        setNewSalon,
    };
}

export default useSalonModal;