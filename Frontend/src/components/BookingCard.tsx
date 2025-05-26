import BookingDisplay from '../model/BookingDisplay';
import { format } from 'date-fns';
import useDownloadInvoice from '../hooks/useDownloadInvoice';

interface BookingCardProps {
    booking: BookingDisplay;
    isUpcoming: boolean;
    onCancel?: (id: string) => void;
}

export default function BookingCard({
                                        booking,
                                        isUpcoming,
                                        onCancel,
                                    }: BookingCardProps) {
    const dt = new Date(booking.dateTime);
    const { downloadInvoice } = useDownloadInvoice();

    const handleCancel = () => {
        if (!onCancel) return;
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            onCancel(booking.bookingId);
        }
    };

    return (
        <div
            className={`card mb-3 shadow-sm ${
                isUpcoming ? 'border-primary' : 'border-secondary'
            }`}
            style={{ width: '900px' }}
        >
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-1">
                        {format(dt, 'MMMM do, yyyy')}
                        <br />
                        <small className="text-muted">at {format(dt, 'hh:mm a')}</small>
                    </h5>
                    <p className="card-text mb-1">
                        <strong>Salon:</strong> {booking.salonName}
                    </p>
                    <p className="card-text mb-1">
                        <strong>Service:</strong> {booking.serviceName}
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
                                onClick={() => downloadInvoice(booking.bookingId)}
                            >
                                See Invoice
                            </button>
                            <button className="btn btn-outline-danger" onClick={handleCancel}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-outline-success"
                            onClick={() => downloadInvoice(booking.bookingId)}
                        >
                            See Invoice
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
