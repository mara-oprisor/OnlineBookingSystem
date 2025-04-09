import { useState } from "react";
import ServiceItem from "../model/ServiceItem";

export interface UseServiceItemModalProps {
    selectedItem: ServiceItem | null;
}

function useServiceItemModal({ selectedItem }: UseServiceItemModalProps) {
    const [isModalServiceItemOpen, setIsModalServiceItemOpen] = useState<boolean>(false);
    const [isUpdateModeServiceItem, setIsUpdateModeServiceItem] = useState<boolean>(false);
    const [newItem, setNewItem] = useState<ServiceItem>({
        uuid: "",
        name: "",
        description: "",
        price: 0,
        salonName: ""
    });

    function openModalServiceItem(update: boolean = false): void {
        setIsModalServiceItemOpen(true);
        setIsUpdateModeServiceItem(update);
        if (update && selectedItem) {
            setNewItem({ ...selectedItem });
        } else {
            setNewItem({
                uuid: "",
                name: "",
                description: "",
                price: 0,
                salonName: ""
            });
        }
    }

    function closeModalServiceItem(): void {
        setIsModalServiceItemOpen(false);
        setNewItem({
            uuid: "",
            name: "",
            description: "",
            price: 0,
            salonName: ""
        });
        setIsUpdateModeServiceItem(false);
    }

    return {
        isModalServiceItemOpen,
        isUpdateModeServiceItem,
        newItem,
        openModalServiceItem,
        closeModalServiceItem,
        setNewItem
    };
}

export default useServiceItemModal;
