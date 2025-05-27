import BookingDisplay from "../model/BookingDisplay.ts";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import usePayment from "../hooks/usePayment.ts";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import BookingService from "../service/BookingService.tsx";


interface PaymentFormProps {
    booking: BookingDisplay;
    onSuccess: () => void;
    onError: () => void;
    onCancel: () => void;
}

function PaymentForm({booking, onSuccess, onError, onCancel}: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { loading, error, pay } = usePayment(booking, stripe, elements);
    const [internalError, setInternalError] = useState<string | null>(null);
    const { t } = useTranslation();


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

    async function handleCancelPayment() {
        try {
            await BookingService().deleteBooking(booking.bookingId);
            alert(t("paymentForm.cancelSuccess"));
            onCancel();
        } catch {
            alert(t("paymentForm.cancelError"));
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
            <div className="d-flex">
                <button
                    className="btn btn-primary me-2"
                    type="submit"
                    disabled={loading || !stripe}
                >
                    {loading
                        ? t("paymentForm.processing")
                        : t("paymentForm.pay", {
                            amount: booking.finalPrice.toFixed(2),
                        })}
                </button>

                <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={handleCancelPayment}
                    disabled={loading}
                >
                    {t("paymentForm.cancelPayment")}
                </button>
            </div>
        </form>
    );
}

export default PaymentForm;
