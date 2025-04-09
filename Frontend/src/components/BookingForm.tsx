import React from "react";
import { useBooking, BookingFormData } from "../hooks/useBooking";
import User from "../model/User";
import ServiceItem from "../model/ServiceItem";

export interface BookingFormProps {
    clients: User[];
    services: ServiceItem[];
    onSubmit: (data: BookingFormData) => void;
}

export function BookingForm({ clients, services, onSubmit }: BookingFormProps) {
    const { formData, handleChange } = useBooking();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.clientId || !formData.serviceId || !formData.dateTime) {
            alert("Please select a client, service, and appointment date/time.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit} className="booking-form">
            <div className="mb-3">
                <label className="form-label">Select Client</label>
                <select
                    className="form-select"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select a Client --</option>
                    {clients.map((client) => (
                        <option key={client.uuid} value={client.uuid}>
                            {client.username}
                        </option>
                    ))}
                </select>
            </div>
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
            <div className="mb-3">
                <label className="form-label">Appointment Date &amp; Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    required
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
