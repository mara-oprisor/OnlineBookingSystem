package com.mara.backend.controller;

import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.dto.DiscountCodeCreateDTO;
import com.mara.backend.model.dto.DiscountCodeDisplayDTO;
import com.mara.backend.service.DiscountCodeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin
public class DiscountCodeController {
    private DiscountCodeService discountCodeService;

    @GetMapping("/discounts")
    public List<DiscountCodeDisplayDTO> getAllDiscounts() {
        return discountCodeService.getAllDiscountCodes();
    }

    @PostMapping("/discount")
    public DiscountCodeDisplayDTO addDiscountCode(@Valid @RequestBody DiscountCodeCreateDTO createDTO) {
        return discountCodeService.createDiscountCode(createDTO);
    }

    @PutMapping("/discount/{uuid}")
    public DiscountCodeDisplayDTO editDiscountCode(@PathVariable UUID uuid, @Valid @RequestBody DiscountCodeDisplayDTO createDTO) throws NotExistentException {
        return discountCodeService.editDiscountCode(uuid, createDTO);
    }

    @DeleteMapping("/discount/{uuid}")
    public void deleteDiscountCode(@PathVariable UUID uuid) {
        discountCodeService.deleteDiscountCode(uuid);
    }
}
