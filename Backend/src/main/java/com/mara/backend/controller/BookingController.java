package com.mara.backend.controller;

import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.dto.BookingCreateDTO;
import com.mara.backend.model.dto.BookingDisplayDTO;
import com.mara.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@AllArgsConstructor
public class BookingController {
    private BookingService bookingService;

    @GetMapping("/common/bookings")
    public List<BookingDisplayDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping("/common/booking")
    public BookingDisplayDTO createBooking(@RequestBody BookingCreateDTO bookingCreateDTO) throws NotExistentException {
        return bookingService.createBooking(bookingCreateDTO);
    }

    @PutMapping("/common/booking/{uuid}")
    public BookingDisplayDTO editBooking(@PathVariable UUID uuid, @Valid @RequestBody String dateTime) throws NotExistentException {
        LocalDateTime parsedDateTime = LocalDateTime.parse(dateTime);
        return bookingService.editBooking(uuid, parsedDateTime);
    }

    @DeleteMapping("/common/booking/{uuid}")
    public void deleteBooking(@PathVariable UUID uuid) {
        bookingService.deleteBooking(uuid);
    }
}
