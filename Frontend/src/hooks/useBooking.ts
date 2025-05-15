import React, { useState } from "react";

export interface BookingFormState {
    serviceId: string;
    date: Date | null;
    discountCode: string;
    finalPrice: number | null;
}

export function useBooking() {
    const [formData, setFormData] = useState<BookingFormState>({
        serviceId: "",
        date: null,
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

    function handleDateChange(date: Date | null) {
        setFormData((prev) => ({
            ...prev,
            date,
        }));
    }

    return { formData, handleChange, handleDateChange };
}

export default useBooking;
