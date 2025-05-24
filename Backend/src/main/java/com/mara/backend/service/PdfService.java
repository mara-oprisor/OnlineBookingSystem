package com.mara.backend.service;

import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.Booking;
import com.mara.backend.model.Invoice;
import com.mara.backend.repository.BookingRepository;
import com.mara.backend.repository.ServiceItemRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Locale;
import java.util.UUID;


@Service
@AllArgsConstructor
public class PdfService {
    private final BookingRepository bookingRepository;

    private final TemplateEngine tplEngine;

    private Invoice createInvoice(UUID bookingUUID) throws NotExistentException {
        Booking booking = bookingRepository.findById(bookingUUID).orElseThrow(
                () -> new NotExistentException("Booking with uuid " + bookingUUID + " does not exist!")
        );

        Invoice invoice = new Invoice();
        invoice.setBookingId(bookingUUID);
        invoice.setServiceName(booking.getServiceItem().getName());
        invoice.setSalon(booking.getServiceItem().getSalon().getName());
        invoice.setClientUsername(booking.getClient().getUsername());
        invoice.setClientEmail(booking.getClient().getEmail());
        invoice.setDate(booking.getDateTime());
        invoice.setFinalPrice(booking.getFinalPrice());

        return invoice;
    }

    public byte[] invoiceToPdf(UUID uuid) throws IOException, NotExistentException {
        Invoice invoice = createInvoice(uuid);

        Context ctx = new Context(Locale.getDefault());
        ctx.setVariable("invoice", invoice);
        String html = tplEngine.process("pdf_template", ctx);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.toStream(out);
            builder.withHtmlContent(html, "/");
            builder.run();
            return out.toByteArray();
        }
    }
}
