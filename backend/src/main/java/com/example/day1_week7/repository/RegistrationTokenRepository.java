package com.example.day1_week7.repository;

import com.example.day1_week7.entities.RegistrationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RegistrationTokenRepository extends JpaRepository<RegistrationToken, UUID> {

	Optional<RegistrationToken> findByValueAndIsUsedFalse(String value);

}
