package com.mara.backend.service;

import com.mara.backend.config.exception.NotExistentException;
import com.mara.backend.model.DiscountCode;
import com.mara.backend.model.dto.DiscountCodeCreateDTO;
import com.mara.backend.model.dto.DiscountCodeDisplayDTO;
import com.mara.backend.repository.DiscountCodeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.mara.backend.model.dto.DiscountCodeDisplayDTO.discountToDTO;

@Service
@AllArgsConstructor
public class DiscountCodeService {
    private final DiscountCodeRepository discountCodeRepository;

    public List<DiscountCodeDisplayDTO> getAllDiscountCodes() {
        return discountCodeRepository.findAll().stream()
                .map(DiscountCodeDisplayDTO::discountToDTO)
                .collect(Collectors.toList());
    }

    public Optional<DiscountCodeDisplayDTO> getDiscountCodeIfValid (String code) {
        Optional<DiscountCode> discountCode = discountCodeRepository.findByCode(code);

        if(discountCode.isPresent()) {
            if(discountCode.get().getExpirationDate().isAfter(LocalDateTime.now())) {
                return Optional.of(DiscountCodeDisplayDTO.discountToDTO(discountCode.get()));
            }
        }

        return Optional.empty();
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

        return discountToDTO(discountCodeRepository.save(discountCode));
    }

    public DiscountCodeDisplayDTO editDiscountCode(UUID uuid, DiscountCodeDisplayDTO createDTO) throws NotExistentException {
        DiscountCode discountCode = discountCodeRepository.findById(uuid).orElseThrow(
                () -> new NotExistentException("There is no discount code with uuid " + uuid)
        );

        discountCode.setExpirationDate(createDTO.getExpirationDate());

        return discountToDTO(discountCodeRepository.save(discountCode));
    }

    public void deleteDiscountCode(UUID uuid) {
        discountCodeRepository.deleteById(uuid);
    }
}
