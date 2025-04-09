import React from "react";
import ServiceItem from "../model/ServiceItem";
import ServiceItemService from "../service/ServiceItemService";

export interface UseServiceItemActionProps {
    setData: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
    setSelectedItem: React.Dispatch<React.SetStateAction<ServiceItem | null>>;
    selectedItem: ServiceItem | null;
}

function useServiceItemCRUD({ setData, setSelectedItem, selectedItem }: UseServiceItemActionProps) {
    const serviceItemService = ServiceItemService();

    function parseErrorMessage(errorMessage: string): string {
        try {
            const errors = JSON.parse(errorMessage);
            return Object.values(errors).join("\n");
        } catch {
            return errorMessage;
        }
    }

    async function handleAddServiceItem(item: ServiceItem): Promise<void> {
        try {
            const addedItem = await serviceItemService.addService(item);
            setData(prev => [...prev, addedItem]);
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error adding service item:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to add service item:\n${detailedMessage}`);
            throw error;
        }
    }

    async function handleUpdateServiceItem(item: ServiceItem): Promise<void> {
        if (!selectedItem) return;
        try {
            const updatedItem = await serviceItemService.updateService(item);
            setData(prev => prev.map(i => (i.uuid === selectedItem.uuid ? updatedItem : i)));
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error updating service item:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to update service item:\n${detailedMessage}`);
            throw error;
        }
    }

    async function handleDeleteServiceItem(): Promise<void> {
        if (!selectedItem) return;
        try {
            await serviceItemService.deleteService(selectedItem.uuid);
            setData(prev => prev.filter(i => i.uuid !== selectedItem.uuid));
            setSelectedItem(null);
        } catch (error: unknown) {
            console.error("Error deleting service item:", error);
            alert("Failed to delete service item");
        }
    }

    return { handleAddServiceItem, handleUpdateServiceItem, handleDeleteServiceItem };
}

export default useServiceItemCRUD;
