package com.mara.backend.service;

import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.logic.PriceHandler;
import com.mara.backend.model.*;
import com.mara.backend.model.dto.BookingCreateDTO;
import com.mara.backend.model.dto.BookingDisplayDTO;
import com.mara.backend.model.dto.PricingDTO;
import com.mara.backend.repository.BookingRepository;
import com.mara.backend.repository.DiscountCodeRepository;
import com.mara.backend.repository.ServiceItemRepository;
import com.mara.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BookingServiceTest {
    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ServiceItemRepository serviceItemRepository;
    @Mock
    private DiscountCodeRepository discountCodeRepository;
    @Mock
    private LoyaltyPointService loyaltyPointService;
    @Mock
    private PriceHandler priceHandler;
    @InjectMocks
    private BookingService bookingService;


    private Client client;
    private ServiceItem serviceItem;
    private UUID clientId;
    private UUID serviceItemId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        clientId = UUID.randomUUID();
        client = new Client();
        client.setId(clientId);
        client.setUsername("client1");
        client.setEmail("client1@example.com");
        client.setPassword("password123");

        serviceItemId = UUID.randomUUID();
        serviceItem = new ServiceItem();
        serviceItem.setUuid(serviceItemId);
        serviceItem.setName("Service A");
        serviceItem.setPrice(100);
        serviceItem.setDescription("Standard service");
        serviceItem.setSalon(new Salon());

        when(userRepository.findById(clientId)).thenReturn(Optional.of(client));
        when(serviceItemRepository.findById(serviceItemId)).thenReturn(Optional.of(serviceItem));
    }

    @Test
    public void testGetAllBookings() {
        Booking booking1 = new Booking();
        booking1.setUuid(UUID.randomUUID());
        booking1.setClient(client);
        booking1.setServiceItem(serviceItem);
        booking1.setDateTime(LocalDateTime.of(2025, 1, 1, 10, 0));
        booking1.setFinalPrice(100.0);

        Booking booking2 = new Booking();
        booking2.setUuid(UUID.randomUUID());
        booking2.setClient(client);
        booking2.setServiceItem(serviceItem);
        booking2.setDateTime(LocalDateTime.of(2023, 1, 2, 12, 0));
        booking2.setFinalPrice(100.0);

        List<Booking> bookings = Arrays.asList(booking1, booking2);
        List<BookingDisplayDTO> bookingsDTO = new ArrayList<>();
        for(Booking booking: bookings) {
            bookingsDTO.add(BookingDisplayDTO.bookingToDTO(booking));
        }


        when(bookingRepository.findAll()).thenReturn(bookings);
        List<BookingDisplayDTO> result = bookingService.getAllBookings();


        assertEquals(2, result.size(), "Should return 2 bookings.");
        assertEquals(bookingsDTO, result);
        verify(bookingRepository, times(1)).findAll();
    }

    @Test
    void testCreateBookingWithoutDiscount() throws NotExistentException {
        BookingCreateDTO dto = new BookingCreateDTO();
        dto.setClientId(clientId);
        dto.setServiceId(serviceItemId);
        dto.setDiscountCode(null);
        dto.setDateTime(LocalDateTime.now().plusDays(1));

        double expectedFinalPrice = 100;

        Booking dummyBooking = new Booking();
        dummyBooking.setUuid(UUID.randomUUID());
        dummyBooking.setClient(client);
        dummyBooking.setServiceItem(serviceItem);
        dummyBooking.setDateTime(dto.getDateTime());
        dummyBooking.setFinalPrice(expectedFinalPrice);


        when(bookingRepository.save(any(Booking.class))).thenReturn(dummyBooking);
        BookingDisplayDTO result = bookingService.createBooking(dto);


        assertEquals(expectedFinalPrice, result.getFinalPrice());
        assertEquals(dummyBooking.getUuid(), result.getBookingId());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }


    @Test
    void testCreateBooking() throws NotExistentException {
        BookingCreateDTO dto = new BookingCreateDTO();
        dto.setClientId(clientId);
        dto.setServiceId(serviceItemId);
        dto.setDiscountCode("DISC10");
        dto.setDateTime(LocalDateTime.now().plusDays(1));

        DiscountCode discountCode = new DiscountCode();
        discountCode.setCode("DISC10");
        discountCode.setExpirationDate(LocalDateTime.now().plusDays(5));
        double expectedFinalPrice = 90.0;

        Booking dummyBooking = new Booking();
        dummyBooking.setUuid(UUID.randomUUID());
        dummyBooking.setClient(client);
        dummyBooking.setServiceItem(serviceItem);
        dummyBooking.setDateTime(dto.getDateTime());
        dummyBooking.setFinalPrice(expectedFinalPrice);


        when(priceHandler.findFinalPrice(any(PricingDTO.class))).thenReturn(90.0);
        when(bookingRepository.save(any(Booking.class))).thenReturn(dummyBooking);
        doNothing().when(loyaltyPointService).addLoyaltyPoint(any());
        BookingDisplayDTO result = bookingService.createBooking(dto);


        assertEquals(expectedFinalPrice, result.getFinalPrice());
        verify(loyaltyPointService, times(1)).addLoyaltyPoint(any());
    }

    @Test
    void testCreateBookingAwardsLoyaltyPoints() throws NotExistentException {
        BookingCreateDTO dto = new BookingCreateDTO();
        dto.setClientId(clientId);
        dto.setServiceId(serviceItemId);
        dto.setDiscountCode(null);
        dto.setDateTime(LocalDateTime.now().plusDays(1));

        Booking dummyBooking = new Booking();
        dummyBooking.setUuid(UUID.randomUUID());
        dummyBooking.setClient(client);
        dummyBooking.setServiceItem(serviceItem);
        dummyBooking.setDateTime(dto.getDateTime());
        dummyBooking.setFinalPrice(100.0);

        int expectedPoints = 5;


        when(priceHandler.findFinalPrice(any(PricingDTO.class))).thenReturn(100.0);
        when(bookingRepository.save(any(Booking.class))).thenReturn(dummyBooking);
        ArgumentCaptor<LoyaltyPoint> captor = ArgumentCaptor.forClass(LoyaltyPoint.class);
        doNothing().when(loyaltyPointService).addLoyaltyPoint(captor.capture());
        bookingService.createBooking(dto);


        LoyaltyPoint capturedPoint = captor.getValue();
        assertEquals(expectedPoints, capturedPoint.getPoints());
        assertEquals(client, capturedPoint.getClient());
    }

    @Test
    public void testEditBooking() throws NotExistentException {
        LocalDateTime newDate = LocalDateTime.of(2025, 2, 1, 15, 0);

        Booking booking1 = new Booking();
        booking1.setUuid(UUID.randomUUID());
        booking1.setClient(client);
        booking1.setServiceItem(serviceItem);
        booking1.setDateTime(LocalDateTime.of(2025, 1, 1, 10, 0));
        booking1.setFinalPrice(100.0);

        when(bookingRepository.findById(booking1.getUuid())).thenReturn(Optional.of(booking1));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking1);
        BookingDisplayDTO result = bookingService.editBooking(booking1.getUuid(), newDate);


        assertEquals(newDate, result.getDateTime());
        verify(bookingRepository, times(1)).findById(booking1.getUuid());
        verify(bookingRepository, times(1)).save(booking1);
    }

    @Test
    public void testDeleteBooking() throws NotExistentException {
        UUID uuid = UUID.randomUUID();


        when(bookingRepository.existsById(uuid)).thenReturn(true);
        bookingService.deleteBooking(uuid);


        verify(bookingRepository, times(1)).deleteById(uuid);
    }
}
