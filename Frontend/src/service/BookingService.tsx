import {BOOKING_ENDPOINT, BOOKINGS_ENDPOINT} from "../constants/api";
import BookingCreate from "../model/BookingCreate";
import BookingDisplay from "../model/BookingDisplay";
import axios from "axios";

function BookingService() {
    async function getBookingsForClient(): Promise<BookingDisplay[]> {
        try {
            const uuid = sessionStorage.getItem("uuid");
            const response = await axios.get<BookingDisplay[]>(`${BOOKINGS_ENDPOINT}/${uuid}`);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to fetch the bookings from the database!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function getBookedSlots(uuid: string): Promise<BookingDisplay[]> {
        try{
            const response = await axios.get<BookingDisplay[]>(`${BOOKINGS_ENDPOINT}/slots/${uuid}`);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to fetch the bookings from the database!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

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

    async function deleteBooking(uuid: string): Promise<void> {
        try {
            await axios.delete(`${BOOKING_ENDPOINT}/${uuid}`);
        } catch {
            throw new Error("Failed to delete the booking!");
        }
    }

    return { getBookingsForClient, getBookedSlots, createBooking, deleteBooking };
}

export default BookingService;
