import React, { useState } from "react";
import BookingCreate from "../model/BookingCreate";

export type BookingFormData = BookingCreate

export function useBooking() {
    const [formData, setFormData] = useState<BookingFormData>({
        clientId: "",
        serviceId: "",
        dateTime: "",
        discountCode: "",
        finalPrice: null,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    return { formData, setFormData, handleChange };
}

export default useBooking;
