package com.mara.backend.model.dto;

import com.mara.backend.model.Booking;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookingDisplayDTO {
    private UUID bookingId;
    private UUID clientId;
    private String serviceName;
    private String salonName;
    private LocalDateTime dateTime;
    private Double finalPrice;

    public static BookingDisplayDTO bookingToDTO(Booking booking) {
        BookingDisplayDTO bookingDisplayDTO = new BookingDisplayDTO();

        bookingDisplayDTO.setBookingId(booking.getUuid());
        bookingDisplayDTO.setClientId(booking.getClient().getId());
        bookingDisplayDTO.setServiceName(booking.getServiceItem().getName());
        bookingDisplayDTO.setSalonName(booking.getServiceItem().getSalon().getName());
        bookingDisplayDTO.setDateTime(booking.getDateTime());
        bookingDisplayDTO.setFinalPrice(booking.getFinalPrice());

        return bookingDisplayDTO;
    }
}
