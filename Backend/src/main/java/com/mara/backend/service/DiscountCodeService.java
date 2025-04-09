package com.mara.backend.service;

import com.mara.backend.model.DiscountCode;
import com.mara.backend.model.dto.DiscountCodeCreateDTO;
import com.mara.backend.model.dto.DiscountCodeDisplayDTO;
import com.mara.backend.repository.DiscountCodeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class DiscountCodeService {
    private DiscountCodeRepository discountCodeRepository;

    public List<DiscountCodeDisplayDTO> getAllDiscountCodes() {
        List<DiscountCode> discountCodes = discountCodeRepository.findAll();
        List<DiscountCodeDisplayDTO> discountDTOs = new ArrayList<>();

        for(DiscountCode discountCode: discountCodes) {
            discountDTOs.add(DiscountCodeDisplayDTO.discountToDTO(discountCode));
        }

        return discountDTOs;
    }

    public DiscountCodeDisplayDTO createDiscountCode(DiscountCodeCreateDTO createDTO) {
        StringBuilder sb = new StringBuilder(createDTO.getCode());
        if(createDTO.getDiscount() < 10) {
            sb.append(0);
            sb.append(createDTO.getDiscount());
        } else {
            sb.append(createDTO.getDiscount());
        }

        DiscountCode discountCode = new DiscountCode();
        discountCode.setCode(sb.toString());
        discountCode.setExpirationDate(LocalDateTime.parse(createDTO.getDateTime()));

        return DiscountCodeDisplayDTO.discountToDTO(discountCodeRepository.save(discountCode));
    }

    public DiscountCodeDisplayDTO editDiscountCode(UUID uuid, DiscountCodeDisplayDTO createDTO) {
        DiscountCode discountCode = discountCodeRepository.findById(uuid).orElseThrow(
                () -> new IllegalStateException("There is no discount code with uuid " + uuid)
        );

        discountCode.setExpirationDate(createDTO.getExpirationDate());

        return DiscountCodeDisplayDTO.discountToDTO(discountCodeRepository.save(discountCode));
    }

    public void deleteDiscountCode(UUID uuid) {
        discountCodeRepository.deleteById(uuid);
    }
}
