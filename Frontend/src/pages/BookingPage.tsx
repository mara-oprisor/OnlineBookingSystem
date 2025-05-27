import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BookingForm from "../components/BookingForm";
import {BookingFormState} from "../hooks/useBooking.ts";
import BookingService from "../service/BookingService";
import BookingDisplay from "../model/BookingDisplay";
import useAvailableServices from "../hooks/useAvailableServices";
import LogoutButton from "../components/LogoutButton";
import {Button, Spinner} from "react-bootstrap";
import BookingCreate from "../model/BookingCreate.ts";
import {format} from "date-fns";
import {useTranslation} from "react-i18next";

function BookingPage() {
    const {salonId} = useParams<{ salonId: string }>();
    const navigate = useNavigate();
    const bookingService = BookingService();
    const { t } = useTranslation();

    const {availableServices, loadingServices, error: serviceError} =
        useAvailableServices(salonId || "");

    const [finalBooking, setFinalBooking] = useState<BookingDisplay | null>(
        null
    );

    async function handleBookingSubmit(data: BookingFormState) {
        const localDateTime = format(
            data.date!,
            "yyyy-MM-dd'T'HH:mm:ss"
        );

        const payload: BookingCreate = {
            clientId: sessionStorage.getItem("uuid")!,
            serviceId: data.serviceId!,
            dateTime: localDateTime,
            discountCode: data.discountCode?.trim() || null,
        };

        try {
            const booking = await bookingService.createBooking(payload);
            setFinalBooking(booking);
            navigate("/payment", { state: { booking } });
        } catch (err: unknown) {
            console.error(err);
            alert(t("bookingPage.errorSubmit", { message: (err as Error).message }));
        }
    }

    if (loadingServices) {
        return <Spinner animation="border" className="m-5"/>;
    }
    if (serviceError) {
        return <p className="text-danger m-5">{t("bookingPage.errorLoadServices")}</p>;
    }

    return (
        <>
        <div className="d-flex justify-content-between align-items-center p-3">
            <Button variant="link" onClick={() => navigate(-1)}>
                {t("bookingPage.btnBack")}
            </Button>
            <LogoutButton/>
        </div>


        <BookingForm
            services={availableServices}
            onSubmit={handleBookingSubmit}
        />

        {finalBooking && (
            <div className="mt-3 text-center">
                <h4>
                    {t("bookingPage.finalPrice", { amount: finalBooking.finalPrice.toFixed(2) })}
                </h4>
            </div>
        )}
        </>);
}

export default BookingPage;
