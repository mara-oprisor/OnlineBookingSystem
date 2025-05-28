package com.mara.backend.service;

import com.mara.backend.repository.BookingRepository;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@AllArgsConstructor
public class BookingReminderService {
    private final BookingRepository bookingRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @Scheduled(cron = "0 */5 * * * *")
    public void pushUpcomingReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in24h = now.plusHours(24);

        bookingRepository
                .findByDateTimeBetween(now, in24h)
                .forEach(b -> {
                    String clientTopic = "/topic/reminders/" + b.getClient().getId();
                    String when = b.getDateTime()
                            .format(DateTimeFormatter.ofPattern("MMM d, yyyy 'at' hh:mm a"));
                    String message = String.format(
                            "Reminder: %s - %s",
                            b.getServiceItem().getName(),
                            when
                    );
                    messagingTemplate.convertAndSend(clientTopic, message);
                });
    }
}
