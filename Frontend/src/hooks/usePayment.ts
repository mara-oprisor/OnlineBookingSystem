import { useState, useEffect } from 'react';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import axios from 'axios';
import BookingDisplay from '../model/BookingDisplay';
import {PAYMENT_ENDPOINT} from "../constants/api.ts";

export interface UsePaymentResult {
    clientSecret: string;
    loading: boolean;
    error: string | null;
    pay: () => Promise<'succeeded' | 'error'>;
}

function usePayment(booking: BookingDisplay, stripe: Stripe | null, elements: StripeElements | null): UsePaymentResult {
    const [clientSecret, setClientSecret] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let canceled = false;
        setLoading(true);
        axios
            .post(PAYMENT_ENDPOINT, booking)
            .then(r => {
                if (!canceled) setClientSecret(r.data.clientSecret);
            })
            .catch(err => {
                console.error(err);
                if (!canceled) setError('Unable to initialize payment.');
            })
            .finally(() => {
                if (!canceled) setLoading(false);
            });

        return () => {
            canceled = true;
        };
    }, [booking]);

    async function pay(): Promise<'succeeded' | 'error'> {
        if (!stripe || !elements) {
            setError('Stripe has not loaded yet.');
            return 'error';
        }
        const card = elements.getElement('card');
        if (!card) {
            setError('Card element not found.');
            return 'error';
        }

        setLoading(true);
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card },
        });
        setLoading(false);

        if (stripeError) {
            setError(stripeError.message ?? 'Payment failed');
            return 'error';
        }
        return paymentIntent?.status === 'succeeded' ? 'succeeded' : 'error';
    }

    return { clientSecret, loading, error, pay };
}

export default usePayment;
