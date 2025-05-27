import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import {useLocation, useNavigate} from 'react-router-dom';
import BookingService from "../service/BookingService.tsx";
import {useTranslation} from "react-i18next";


function BookingPaymentPage() {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!state?.booking) {
        navigate("/salons");
        return null;
    }
    const booking = state.booking;

    function handleSuccess() {
        alert(t("bookingPayment.successAlert"));
        navigate('/my_bookings');
    }

    async function handleError() {
        try {
            await BookingService().deleteBooking(booking.bookingId);
            alert(t("bookingPayment.failedCancel"));
        } catch (deleteErr) {
            console.error('Failed to delete booking:', deleteErr);
            alert(t("bookingPayment.failedManual"));
        }
        navigate('/my_bookings');
    }

    return (
        <div className="container my-5">
            <h2 className="mb-4">Complete Your Payment</h2>
            <Elements stripe={stripePromise}>
                <PaymentForm
                    booking={booking}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    onCancel={() => navigate('/my_bookings')}
                />
            </Elements>
        </div>
    );
}

export default BookingPaymentPage;