interface BookingCreate {
    clientId: string;
    serviceId: string;
    dateTime: string;
    discountCode: string | null;
    finalPrice: number | null;
}

export default BookingCreate;
