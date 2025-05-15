interface BookingCreate {
    clientId: string;
    serviceId: string;
    dateTime: string;
    discountCode: string | null;
}

export default BookingCreate;
