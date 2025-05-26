import NavBarClient from '../components/NavBarClient';
import BookingCard from '../components/BookingCard';
import useMyBooking from '../hooks/useMyBooking';
import BookingService from '../service/BookingService';

export default function MyBookingsPage() {
    const { upcomingBookings, pastBookings, loading, error } = useMyBooking();
    const bookingService = BookingService();

    const handleCancel = async (bookingId: string) => {
        try {
            await bookingService.deleteBooking(bookingId);
            window.location.reload();
        } catch (e) {
            alert('Failed to cancel booking.');
            console.error(e);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading your bookings…</p>;
    if (error) return <p className="text-danger text-center mt-5">{error}</p>;

    return (
        <>
            <NavBarClient />

            <div className="container my-5">
                <h2 className="mb-4 text-center">My Bookings</h2>

                {upcomingBookings.length > 0 && (
                    <>
                        <h4 className="text-primary">Upcoming</h4>
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
                        <h4 className="mt-5 text-secondary">Past</h4>
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
                    <p className="text-center">You have no bookings yet.</p>
                )}
            </div>
        </>
    );
}
