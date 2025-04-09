import { useState } from "react";
import DiscountCode from "../model/DiscountCode";

export interface UseDiscountCodeModalProps {
    selectedDiscount: DiscountCode | null;
}

function useDiscountCodeModal({ selectedDiscount }: UseDiscountCodeModalProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
    const [newDiscount, setNewDiscount] = useState<DiscountCode>({
        uuid: "",
        discountCode: "",
        expirationDate: ""
    });

    function openModal(update: boolean = false): void {
        setIsModalOpen(true);
        setIsUpdateMode(update);
        if (update && selectedDiscount) {
            setNewDiscount({ ...selectedDiscount });
        } else {
            setNewDiscount({
                uuid: "",
                discountCode: "",
                expirationDate: ""
            });
        }
    }

    function closeModal(): void {
        setIsModalOpen(false);
        setNewDiscount({
            uuid: "",
            discountCode: "",
            expirationDate: ""
        });
        setIsUpdateMode(false);
    }

    return {
        isModalOpen,
        isUpdateMode,
        newDiscount,
        openModal,
        closeModal,
        setNewDiscount
    };
}

export default useDiscountCodeModal;
