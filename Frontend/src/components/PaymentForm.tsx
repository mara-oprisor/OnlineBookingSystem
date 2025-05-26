import BookingDisplay from "../model/BookingDisplay.ts";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import usePayment from "../hooks/usePayment.ts";
import React, {useState} from "react";


interface PaymentFormProps {
    booking: BookingDisplay;
    onSuccess: () => void;
    onError: () => void;
}

function PaymentForm({booking, onSuccess, onError}: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { loading, error, pay } = usePayment(booking, stripe, elements);
    const [internalError, setInternalError] = useState<string | null>(null);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = await pay();
        if (result === 'succeeded') {
            onSuccess();
        } else {
            setInternalError(error);
            onError();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            {(error || internalError) && (
                <div className="alert alert-danger">{error || internalError}</div>
            )}
            <div className="mb-3">
                <CardElement options={{ hidePostalCode: true }} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading || !stripe}>
                {loading ? 'Processing…' : `Pay ${booking.finalPrice.toFixed(2)} RON`}
            </button>
        </form>
    );
}

export default PaymentForm;
