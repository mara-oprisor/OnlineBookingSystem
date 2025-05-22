import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import {useLocation, useNavigate} from 'react-router-dom';
import BookingService from "../service/BookingService.tsx";


function BookingPaymentPage() {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state?.booking) {
        navigate("/salons");
        return null;
    }
    const booking = state.booking;

    function handleSuccess() {
        alert('Payment successful!');
        navigate('/my_bookings');
    }

    async function handleError() {
        try {
            await BookingService().deleteBooking(booking.bookingId);
            alert('Payment failed — your booking has been canceled.');
        } catch (deleteErr) {
            console.error('Failed to delete booking:', deleteErr);
            alert('Payment failed and we couldn’t cancel your booking automatically. Please contact support.');
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
                />
            </Elements>
        </div>
    );
}

export default BookingPaymentPage;