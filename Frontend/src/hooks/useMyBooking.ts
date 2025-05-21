import {useEffect, useState} from "react";
import BookingDisplay from "../model/BookingDisplay.ts";
import BookingService from "../service/BookingService.tsx";

function useMyBooking() {
    const [upcomingBookings, setUpcomingBookings] = useState<BookingDisplay[]>([]);
    const [pastBookings, setPastBookings] = useState<BookingDisplay[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);

            try {
                const all = await BookingService().getBookingsForClient();
                const now = new Date();
                setUpcomingBookings(all.filter(b => new Date(b.dateTime) > now));
                setPastBookings(all.filter(b => new Date(b.dateTime) <= now));
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to load bookings";
                console.error("Failed to load bookings", e);
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return { upcomingBookings, pastBookings, loading, error };

}

export default useMyBooking;