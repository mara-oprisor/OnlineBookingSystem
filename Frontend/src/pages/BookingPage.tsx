import { useState } from "react";
import { useParams } from "react-router-dom";
import { BookingForm } from "../components/BookingForm";
import BookingService from "../service/BookingService";
import BookingDisplay from "../model/BookingDisplay";
import useAvailableServices from "../hooks/useAvailableServices";
import useClients from "../hooks/useClients";
import {BookingFormData} from "../hooks/useBooking.ts";

function BookingPage() {
    const { salonId } = useParams<{ salonId: string }>();
    const effectiveSalonId = salonId || "";
    const { availableServices, loadingServices, error: serviceError } = useAvailableServices(effectiveSalonId);
    const { clients, loading: loadingClients, error: clientError } = useClients();
    const [finalBooking, setFinalBooking] = useState<BookingDisplay | null>(null);
    const bookingService = BookingService();

    async function handleBookingSubmit(data: BookingFormData) {
        const payload = {
            ...data,
            discountCode:
                data.discountCode == null || data.discountCode.trim() === ""
                    ? null
                    : data.discountCode.trim(),
        };

        try {
            const booking: BookingDisplay = await bookingService.createBooking(payload);
            setFinalBooking(booking);
            alert(`Booking confirmed! Final Price: $${booking.finalPrice.toFixed(2)}`);
        } catch (error: unknown) {
            let errorMessage = "Booking submission failed.";
            if (error instanceof Error) {
                try {
                    const parsed = JSON.parse(error.message);
                    if (parsed?.error) {
                        errorMessage = parsed.error;
                    } else {
                        errorMessage = error.message;
                    }
                } catch {
                    errorMessage = error.message;
                }
            }
            console.error("Booking submission failed:", error);
            alert(`Booking submission failed: ${errorMessage}`);
        }
    }

    if (loadingServices || loadingClients) {
        return <p>Loading...</p>;
    }
    if (serviceError || clientError) {
        return <p className="error-text">Error loading data.</p>;
    }

    return (
        <div className="container mt-4">
            <h2>Book an Appointment</h2>
            <BookingForm
                clients={clients}
                services={availableServices}
                onSubmit={handleBookingSubmit}
            />
            {finalBooking && (
                <div className="mt-3">
                    <h4>Final Price: ${finalBooking.finalPrice.toFixed(2)}</h4>
                </div>
            )}
        </div>
    );
}

export default BookingPage;
