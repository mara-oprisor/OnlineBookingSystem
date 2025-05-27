import BookingDisplay from '../model/BookingDisplay';
import { format } from 'date-fns';
import useDownloadInvoice from '../hooks/useDownloadInvoice';
import {useTranslation} from "react-i18next";

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
    const { t } = useTranslation();

    const handleCancel = () => {
        if (!onCancel) return;
        if (window.confirm(t('bookingCard.areYouSureCancel'))) {
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
                        <strong>{ t('bookingCard.service') }:</strong> {booking.serviceName}
                    </p>
                    <p className="card-text mb-1">
                        <strong>{ t('bookingCard.salon') }:</strong> {booking.salonName}
                    </p>
                    <p className="card-text mb-0">
                        <strong>{ t('bookingCard.price') }:</strong> {booking.finalPrice.toFixed(2)} RON
                    </p>
                </div>
                <div className="btn-group">
                    {isUpcoming ? (
                        <>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => downloadInvoice(booking.bookingId)}
                            >
                                { t('bookingCard.seeInvoice') }
                            </button>
                            <button className="btn btn-outline-danger" onClick={handleCancel}>
                                { t('bookingCard.cancel') }
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-outline-success"
                            onClick={() => downloadInvoice(booking.bookingId)}
                        >
                            { t('bookingCard.seeInvoice') }
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
