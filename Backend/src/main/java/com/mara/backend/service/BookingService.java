package com.mara.backend.service;

import com.mara.backend.logic.DiscountCodePricingStrategy;
import com.mara.backend.logic.LoyaltyDiscountStrategy;
import com.mara.backend.logic.PriceCalculator;
import com.mara.backend.logic.RegularPricingStrategy;
import com.mara.backend.model.*;
import com.mara.backend.model.dto.BookingCreateDTO;
import com.mara.backend.model.dto.BookingDisplayDTO;
import com.mara.backend.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final DiscountCodeRepository discountCodeRepository;
    private final LoyaltyPointService loyaltyPointService;

    public List<BookingDisplayDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        List<BookingDisplayDTO> bookingsDTO = new ArrayList<>();
        for (Booking booking : bookings) {
            bookingsDTO.add(BookingDisplayDTO.bookingToDTO(booking));
        }
        return bookingsDTO;
    }

    public BookingDisplayDTO createBooking(BookingCreateDTO bookingCreateDTO) {
        Client client = getClientFromDTO(bookingCreateDTO);
        ServiceItem serviceItem = getServiceItemFromDTO(bookingCreateDTO);
        PriceCalculator priceCalculator = determinePricingStrategy(bookingCreateDTO, client);
        double finalPrice = priceCalculator.computeFinalPrice(serviceItem, client);

        Booking booking = createAndSaveBooking(client, serviceItem, bookingCreateDTO.getDateTime(), finalPrice);
        awardLoyaltyPointsIfEligible(client, finalPrice);

        return BookingDisplayDTO.bookingToDTO(booking);
    }

    private Client getClientFromDTO(BookingCreateDTO dto) {
        User user = userRepository.findById(dto.getClientId()).orElseThrow(
                () -> new IllegalStateException("User with uuid " + dto.getClientId() + " was not found!")
        );

        if (!(user instanceof Client client)) {
            throw new IllegalStateException("User with uuid " + dto.getClientId() + " is not a client!");
        }

        return client;
    }

    private ServiceItem getServiceItemFromDTO(BookingCreateDTO dto) {
        return serviceItemRepository.findById(dto.getServiceId()).orElseThrow(
                () -> new IllegalStateException("Service with uuid " + dto.getServiceId() + " was not found!")
        );
    }

    private PriceCalculator determinePricingStrategy(BookingCreateDTO dto, Client client) {
        PriceCalculator priceCalculator = new PriceCalculator();

        if (dto.getDiscountCode() != null) {
            DiscountCode discountCode = discountCodeRepository.findByCode(dto.getDiscountCode()).orElseThrow(
                    () -> new IllegalStateException("There is no discount code with this name!")
            );

            if (discountCode.getExpirationDate().isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("Discount code is expired!");
            }

            int discountPercentage = extractPercentageFromCode(discountCode.getCode());
            priceCalculator.setStrategy(new DiscountCodePricingStrategy(discountPercentage));
        } else if (loyaltyPointService.getAllPointsForUser(client.getId()) > 100) {
            priceCalculator.setStrategy(new LoyaltyDiscountStrategy());
        } else {
            priceCalculator.setStrategy(new RegularPricingStrategy());
        }

        return priceCalculator;
    }

    private int extractPercentageFromCode(String code) {
        String lastDigits = code.substring(code.length() - 2);
        return Integer.parseInt(lastDigits);
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

    public BookingDisplayDTO editBooking(UUID bookingId, LocalDateTime newDate) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(
                () -> new IllegalStateException("Booking with uuid " + bookingId + " does not exist!")
        );
        booking.setDateTime(newDate);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingDisplayDTO.bookingToDTO(updatedBooking);
    }

    public void deleteBooking(UUID bookingId) {
        bookingRepository.deleteById(bookingId);
    }
}
