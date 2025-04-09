import { BOOKING_ENDPOINT } from "../constants/api";
import BookingCreate from "../model/BookingCreate";
import BookingDisplay from "../model/BookingDisplay";

function BookingService() {
    async function createBooking(booking: BookingCreate): Promise<BookingDisplay> {
        const response = await fetch(BOOKING_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        return response.json();
    }

    return { createBooking };
}

export default BookingService;
