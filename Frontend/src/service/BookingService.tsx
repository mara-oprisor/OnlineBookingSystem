import { BOOKING_ENDPOINT } from "../constants/api";
import BookingCreate from "../model/BookingCreate";
import BookingDisplay from "../model/BookingDisplay";
import axios from "axios";

function BookingService() {
    async function createBooking(booking: BookingCreate): Promise<BookingDisplay> {
        try {
            const response = await axios.post<BookingDisplay>(BOOKING_ENDPOINT, booking, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error: unknown) {
            let errorData: string;

            if (axios.isAxiosError(error)) {
                errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            } else if (error instanceof Error) {
                errorData = error.message;
            } else {
                errorData = "An unknown error occurred.";
            }

            throw new Error(errorData);
        }
    }

    return { createBooking };
}

export default BookingService;
