package com.mara.backend.service;

import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.logic.PriceHandler;
import com.mara.backend.model.*;
import com.mara.backend.model.dto.BookingCreateDTO;
import com.mara.backend.model.dto.BookingDisplayDTO;
import com.mara.backend.model.dto.PricingDTO;
import com.mara.backend.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final LoyaltyPointService loyaltyPointService;
    private final PriceHandler priceHandler;

    public List<BookingDisplayDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        List<BookingDisplayDTO> bookingsDTO = new ArrayList<>();
        for (Booking booking : bookings) {
            bookingsDTO.add(BookingDisplayDTO.bookingToDTO(booking));
        }
        return bookingsDTO;
    }

    public List<BookingDisplayDTO> getAllBookingsForClient(UUID uuid) {
        return bookingRepository.findByClient_Id(uuid).stream()
                .map(BookingDisplayDTO::bookingToDTO)
                .collect(Collectors.toList());
    }

    public BookingDisplayDTO createBooking(BookingCreateDTO bookingCreateDTO) throws NotExistentException {
        Client client = getClientFromDTO(bookingCreateDTO);
        ServiceItem serviceItem = getServiceItemFromDTO(bookingCreateDTO);

        PricingDTO pricingDTO = new PricingDTO(serviceItem.getPrice(), bookingCreateDTO.getDiscountCode(), client);

        double finalPrice = priceHandler.findFinalPrice(pricingDTO);

        Booking booking = createAndSaveBooking(client, serviceItem, bookingCreateDTO.getDateTime(), finalPrice);
        awardLoyaltyPointsIfEligible(client, finalPrice);

        return BookingDisplayDTO.bookingToDTO(booking);
    }

    private Client getClientFromDTO(BookingCreateDTO dto) throws NotExistentException {
        User user = userRepository.findById(dto.getClientId()).orElseThrow(
                () -> new NotExistentException("User with uuid " + dto.getClientId() + " was not found!")
        );

        if (!(user instanceof Client client)) {
            throw new IllegalStateException("User with uuid " + dto.getClientId() + " is not a client!");
        }

        return client;
    }

    private ServiceItem getServiceItemFromDTO(BookingCreateDTO dto) throws NotExistentException {
        return serviceItemRepository.findById(dto.getServiceId()).orElseThrow(
                () -> new NotExistentException("Service with uuid " + dto.getServiceId() + " was not found!")
        );
    }

    private Booking createAndSaveBooking(Client client, ServiceItem serviceItem, LocalDateTime dateTime, double finalPrice) {
        Booking booking = new Booking();
        booking.setClient(client);
        booking.setServiceItem(serviceItem);
        booking.setDateTime(dateTime);
        booking.setFinalPrice(finalPrice);

        return bookingRepository.save(booking);
    }

    private void awardLoyaltyPointsIfEligible(Client client, double finalPrice) {
        int pointsEarned = (int) (finalPrice / 20);
        if (pointsEarned > 0) {
            LoyaltyPoint loyaltyPoint = new LoyaltyPoint();
            loyaltyPoint.setClient(client);
            loyaltyPoint.setPoints(pointsEarned);
            loyaltyPointService.addLoyaltyPoint(loyaltyPoint);
        }
    }

    public BookingDisplayDTO editBooking(UUID bookingId, LocalDateTime newDate) throws NotExistentException {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(
                () -> new NotExistentException("Booking with uuid " + bookingId + " does not exist!")
        );
        booking.setDateTime(newDate);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingDisplayDTO.bookingToDTO(updatedBooking);
    }

    public void deleteBooking(UUID bookingId) throws NotExistentException {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(
                () -> new NotExistentException("Booking with uuid " + bookingId + " does not exist!")
        );

        int loyaltyPoints = (int) (booking.getFinalPrice() / 20);
        LoyaltyPoint loyaltyPoint = new LoyaltyPoint();
        loyaltyPoint.setClient(booking.getClient());
        loyaltyPoint.setPoints(-loyaltyPoints);

        bookingRepository.deleteById(bookingId);
        loyaltyPointService.addLoyaltyPoint(loyaltyPoint);
    }
}
