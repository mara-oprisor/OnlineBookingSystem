import useMyBooking from "../hooks/useMyBooking.ts";
import BookingCard from "../components/BookingCard.tsx";
import NavBarClient from "../components/NavBarClient.tsx";

function MyBookingsPage() {
    const { upcomingBookings, pastBookings, loading, error } = useMyBooking();

    if (loading) return <p className="text-center mt-5">Loading your bookings…</p>;
    if (error)   return <p className="text-danger text-center mt-5">{error}</p>;

    return (
        <>
            <NavBarClient />

            <div className="my-bookings-page">
                <h2 className="mb-4 text-center">My Bookings</h2>

                {upcomingBookings.length > 0 && (
                    <>
                        <h4 className="text-primary">Upcoming</h4>
                        {upcomingBookings.map(b => (
                            <BookingCard
                                key={b.bookingId}
                                booking={b}
                                isUpcoming
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

export default MyBookingsPage;