import NavBarClient from '../components/NavBarClient';
import BookingCard from '../components/BookingCard';
import useMyBooking from '../hooks/useMyBooking';
import BookingService from '../service/BookingService';
import {useTranslation} from "react-i18next";

export default function MyBookingsPage() {
    const { upcomingBookings, pastBookings, loading, error } = useMyBooking();
    const bookingService = BookingService();
    const { t } = useTranslation();

    const handleCancel = async (bookingId: string) => {
        try {
            await bookingService.deleteBooking(bookingId);
            window.location.reload();
        } catch (e) {
            alert(t("myBookings.cancelError"));
            console.error(e);
        }
    };

    if (loading) return <p className="text-center mt-5">{t("myBookings.loading")}</p>;
    if (error) return <p className="text-danger text-center mt-5">{error}</p>;

    return (
        <>
            <NavBarClient />

            <div className="container my-5">
                <h2 className="mb-4 text-center">{t("myBookings.title")}</h2>

                {upcomingBookings.length > 0 && (
                    <>
                        <h4 className="text-primary">{t("myBookings.upcoming")}</h4>
                        {upcomingBookings.map(b => (
                            <BookingCard
                                key={b.bookingId}
                                booking={b}
                                isUpcoming
                                onCancel={handleCancel}
                            />
                        ))}
                    </>
                )}

                {pastBookings.length > 0 && (
                    <>
                        <h4 className="mt-5 text-secondary">{t("myBookings.past")}</h4>
                        {pastBookings.map(b => (
                            <BookingCard
                                key={b.bookingId}
                                booking={b}
                                isUpcoming={false}
                            />
                        ))}
                    </>
                )}

                {upcomingBookings.length === 0 && pastBookings.length === 0 && (
                    <p className="text-center">{t("myBookings.none")}</p>
                )}
            </div>
        </>
    );
}
