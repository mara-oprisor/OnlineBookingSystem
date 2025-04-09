import React from "react";
import DiscountCode from "../model/DiscountCode";
import DiscountCodeService from "../service/DiscountCodeService";
import DiscountCodeCreate from "../model/DiscountCodeCreate.ts";

export interface UseDiscountCodeActionProps {
    setData: React.Dispatch<React.SetStateAction<DiscountCode[]>>;
    setSelectedDiscount: React.Dispatch<React.SetStateAction<DiscountCode | null>>;
    selectedDiscount: DiscountCode | null;
}

function useDiscountCodeCRUD({ setData, setSelectedDiscount, selectedDiscount }: UseDiscountCodeActionProps) {
    const discountCodeService = DiscountCodeService();

    function parseErrorMessage(errorMessage: string): string {
        try {
            const errors = JSON.parse(errorMessage);
            return Object.values(errors).join("\n");
        } catch {
            return errorMessage;
        }
    }

    async function handleAddDiscountCode(discount: DiscountCodeCreate): Promise<void> {
        try {
            const addedDiscount = await discountCodeService.addDiscountCode(discount);
            setData(prevData => [...prevData, addedDiscount]);
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error adding discount code:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to add discount code:\n${detailedMessage}`);
            throw error;
        }
    }

    async function handleUpdateDiscountCode(discount: DiscountCode): Promise<void> {
        if (!selectedDiscount) return;
        try {
            const updatedDiscount = await discountCodeService.updateDiscountCode(discount);
            setData(prevData =>
                prevData.map(d => d.uuid === selectedDiscount.uuid ? updatedDiscount : d)
            );
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error updating discount code:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to update discount code:\n${detailedMessage}`);
            throw error;
        }
    }

    async function handleDeleteDiscountCode(): Promise<void> {
        if (!selectedDiscount) return;
        try {
            await discountCodeService.deleteDiscountCode(selectedDiscount.uuid);
            setData(prevData =>
                prevData.filter(d => d.uuid !== selectedDiscount.uuid)
            );
            setSelectedDiscount(null);
        } catch (error: unknown) {
            console.error("Error deleting discount code!", error);
            alert("Failed to delete discount code!");
        }
    }

    return { handleAddDiscountCode, handleUpdateDiscountCode, handleDeleteDiscountCode };
}

export default useDiscountCodeCRUD;
