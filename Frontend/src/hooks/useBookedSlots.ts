import { useState, useEffect } from "react";
import BookingService from "../service/BookingService";
import { parseISO } from "date-fns";

function useBookedSlots(serviceId: string | null) {
    const [slots, setSlots]     = useState<Date[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string| null>(null);

    useEffect(() => {
        if (!serviceId) {
            setSlots([]);
            return;
        }

        setLoading(true);
        setError(null);

        BookingService()
            .getBookedSlots(serviceId)
            .then(bookings => {
                const dates = bookings
                    .map(b => parseISO(b.dateTime))
                    .filter(d => !isNaN(d.getTime()));
                setSlots(dates);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load booked slots");
            })
            .finally(() => setLoading(false));
    }, [serviceId]);

    return { slots, loading, error };
}

export default useBookedSlots;
