import React from "react";
import { BookingFormState, useBooking } from "../hooks/useBooking";
import ServiceItem from "../model/ServiceItem";
import DatePicker from "react-datepicker";
import { addDays, setHours, setMinutes, isSameDay } from "date-fns";
import useBookedSlots from "../hooks/useBookedSlots.ts";


export interface BookingFormProps {
    services: ServiceItem[];
    onSubmit: (data: BookingFormState) => void;
}

export default function BookingForm({ services, onSubmit }: BookingFormProps) {
    const { formData, handleChange, handleDateChange, setService } = useBooking();
    const { slots } = useBookedSlots(formData.serviceId);


    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.serviceId || !formData.date) {
            alert("Please select a service and appointment date/time.");
            return;
        }
        onSubmit(formData);
    };

    function excludeTimesForDay(d: Date) {
        return slots
            .filter(slot => isSameDay(slot, d))
            .map(slot   => slot);
    }

    return (
        <form onSubmit={handleFormSubmit} className="booking-form card">
            <h3 className="booking-form__title">Book an Appointment</h3>

            <div className="booking-form__services">
                {services.map((service) => (
                    <div
                        key={service.uuid}
                        className={`service-card ${
                            formData.serviceId === service.uuid ? "service-card--selected" : ""
                        }`}
                        onClick={() => setService(service.uuid)}
                    >
                        <h4 className="service-card__name">{service.name}</h4>
                        <div className="service-card__price">{service.price.toFixed(2)} RON</div>
                    </div>
                ))}
            </div>

            <div className="booking-form__field">
                <label className="form-label">Appointment Date &amp; Time</label>
                <DatePicker
                    className="form-control"
                    selected={formData.date}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="yyyy-MM-dd HH:mm"
                    minDate={addDays(new Date(), 1)}
                    minTime={setHours(setMinutes(new Date(),0), 8)}
                    maxTime={setHours(setMinutes(new Date(),0),18)}
                    excludeTimes={formData.date ? excludeTimesForDay(formData.date) : []}
                />
            </div>

            <div className="booking-form__field">
                <label className="form-label">Discount Code (Optional)</label>
                <input
                    type="text"
                    className="form-control"
                    name="discountCode"
                    value={formData.discountCode ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="booking-form__actions">
                <button type="submit" className="btn btn-primary">
                    Go to Payment
                </button>
            </div>
        </form>
    );
}
