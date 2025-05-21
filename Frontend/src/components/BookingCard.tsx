import BookingDisplay from "../model/BookingDisplay.ts";
import { format } from "date-fns";

interface BookingCardProps {
    booking: BookingDisplay;
    isUpcoming: boolean;
}

function BookingCard({ booking, isUpcoming }: BookingCardProps) {
    const dt = new Date(booking.dateTime);

    return (
        <div
            className={`card mb-3 shadow-sm ${
                isUpcoming ? 'border-primary' : 'border-secondary'
            }`}
            style={{ width: '100%' }}
        >
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-1">
                        {format(dt, 'MMMM do, yyyy')}
                        <br />
                        <small className="text-muted">
                            at {format(dt, 'hh:mm a')}
                        </small>
                    </h5>
                    <p className="card-text mb-1">
                        <strong>Service:</strong> {booking.serviceId}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Price:</strong> {booking.finalPrice.toFixed(2)} RON
                    </p>
                </div>
                <div className="btn-group">
                    {isUpcoming ? (
                        <>
                            <button
                                className="btn btn-outline-primary"
                                //onClick={() => onReschedule?.(booking.bookingId)}
                            >
                                See Invoice
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                //onClick={() => onCancel?.(booking.bookingId)}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn btn-outline-success"
                                //onClick={() => onRebook?.(booking.bookingId)}
                            >
                                See Invoice
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookingCard;