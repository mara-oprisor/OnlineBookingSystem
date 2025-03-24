package com.mara.backend.repository;

import com.mara.backend.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, UUID> {
    Optional<ServiceItem> findServiceItemByName(String name);
}

