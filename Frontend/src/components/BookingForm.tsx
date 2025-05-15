import React from "react";
import {BookingFormState, useBooking} from "../hooks/useBooking";
import ServiceItem from "../model/ServiceItem";
import DatePicker from "react-datepicker";
import {addDays, setHours, setMinutes} from "date-fns";

export interface BookingFormProps {
    services: ServiceItem[];
    onSubmit: (data: BookingFormState) => void;
}

export function BookingForm({ services, onSubmit }: BookingFormProps) {
    const { formData, handleChange, handleDateChange } = useBooking();

    const now = new Date();
    const minDate = addDays(now, 1);
    const minTime = setHours(setMinutes(new Date(), 0), 8);
    const maxTime = setHours(setMinutes(new Date(), 0), 18);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.serviceId || !formData.date) {
            alert("Please select a service and appointment date/time.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit} className="booking-form">
            <div className="mb-3">
                <label className="form-label">Select Service</label>
                <select
                    className="form-select"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select a Service --</option>
                    {services.map((service) => (
                        <option key={service.uuid} value={service.uuid}>
                            {service.name} (${service.price})
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-md-6">
                <label className="form-label">Appointment Date &amp; Time</label>
                <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="yyyy-MM-dd HH:mm"
                    className="form-control"
                    placeholderText="Choose date & time"
                    minDate={minDate}
                    minTime={minTime}
                    maxTime={maxTime}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Discount Code (Optional)</label>
                <input
                    type="text"
                    className="form-control"
                    name="discountCode"
                    value={formData.discountCode ?? ""}
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Submit Booking
            </button>
        </form>
    );
}

export default BookingForm;
